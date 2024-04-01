import { compare, hash } from "bcrypt";
import { Pool } from "pg";
import {
  DeleteAccountStatus,
  IAccountRepository,
  RegisterPersonStatus,
  UpdatePasswordStatus,
  UpdatePictureStatus,
  UpdateUsernameStatus,
  VerifyPersonStatus,
} from "./IAccountRepository";

export class AccountRepository implements IAccountRepository {
  constructor(private dbPool: Pool) {}

  async registerPerson(username: string, password: string) {
    const existingUser = await this.dbPool.query(
      "SELECT * FROM person WHERE username = $1",
      [username]
    );

    if (existingUser.rowCount && existingUser.rowCount > 0) {
      return { status: RegisterPersonStatus.UsernameTaken };
    }

    const passwordHash = await hash(password, 10);

    const result = await this.dbPool.query(
      "INSERT INTO person (username, pwd_hash) VALUES ($1, $2) RETURNING id, username, picture",
      [username, passwordHash]
    );

    if (result.rowCount != 1 || result.rows[0] == null) {
      console.error(
        "AccountRepository.registerPerson() - Failed to insert new person.",
        result
      );
      return { status: RegisterPersonStatus.UnknownError };
    }

    const person = result.rows[0];

    return {
      status: RegisterPersonStatus.Success,
      person: {
        id: person.id,
        picture: person.picture,
        username: person.username,
      },
    };
  }

  async verifyPerson(username: string, password: string) {
    const result = await this.dbPool.query(
      "SELECT id, username, pwd_hash, picture FROM person WHERE username = $1 AND active = TRUE",
      [username]
    );

    const person = result.rows[0];

    if (result.rowCount != 1 || person == null) {
      return { status: VerifyPersonStatus.PersonNotFound };
    }

    const passwordCorrect = await compare(password, person.pwd_hash);

    if (!passwordCorrect) {
      return { status: VerifyPersonStatus.IncorrectPassword };
    }

    return {
      status: VerifyPersonStatus.Success,
      person: {
        id: person.id,
        picture: person.picture,
        username: person.username,
      },
    };
  }

  async deleteAccount(username: string, password: string) {
    const result = await this.dbPool.query(
      "SELECT * FROM person WHERE username = $1 AND active = TRUE",
      [username]
    );

    const person = result.rows[0];

    if (result.rowCount != 1 || person == null) {
      return { status: DeleteAccountStatus.PersonNotFound };
    }

    const passwordCorrect = await compare(password, person.pwd_hash);

    if (!passwordCorrect) {
      return { status: DeleteAccountStatus.IncorrectPassword };
    }

    await this.dbPool.query("BEGIN");
    try {
      const deleteResult = await this.dbPool.query(
        `
            UPDATE person
            SET
              active = FALSE,
              username = $2,
              pwd_hash = '',
              picture = NULL
            WHERE username = $1
          `,
        [username, `Deleted User #${person.id}`]
      );

      if (deleteResult.rowCount != 1) {
        await this.dbPool.query("ROLLBACK");
        return { status: DeleteAccountStatus.UnknownError };
      }

      await this.dbPool.query(
        `
            DELETE FROM person_in_house
            WHERE person_id = $1
          `,
        [person.id]
      );

      await this.dbPool.query("COMMIT");
      return { status: DeleteAccountStatus.Success };
    } catch (exc) {
      console.error(
        "AccountRepository.deleteAccount() - Exception deleting account:",
        exc
      );
      await this.dbPool.query("ROLLBACK");
      return { status: DeleteAccountStatus.UnknownError };
    }
  }

  async updateUsername(
    username: string,
    password: string,
    newUsername: string
  ) {
    const existingPersonResult = await this.dbPool.query(
      "SELECT * FROM person WHERE username = $1 AND active = TRUE",
      [username]
    );

    const person = existingPersonResult.rows[0];
    if (existingPersonResult.rowCount != 1 || person == null) {
      return { status: UpdateUsernameStatus.PersonNotFound };
    }

    const passwordCorrect = await compare(password, person.pwd_hash);

    if (!passwordCorrect) {
      return { status: UpdateUsernameStatus.IncorrectPassword };
    }

    const newUsernameTaken = await this.dbPool.query(
      "SELECT * FROM person WHERE username = $1",
      [newUsername]
    );

    if (!newUsernameTaken.rowCount || newUsernameTaken.rowCount > 0) {
      return { status: UpdateUsernameStatus.NewUsernameTaken };
    }

    await this.dbPool.query("BEGIN");
    try {
      const updateResult = await this.dbPool.query(
        `
            UPDATE person
            SET username = $2
            WHERE username = $1
          `,
        [username, newUsername]
      );

      if (updateResult.rowCount != 1) {
        console.log("Failed to update username. No rows.", updateResult);
        await this.dbPool.query("ROLLBACK");
        return { status: UpdateUsernameStatus.UnknownError };
      }

      await this.dbPool.query("COMMIT");
      return { status: UpdateUsernameStatus.Success };
    } catch (exc) {
      console.error(
        "AccountRepository.updateUsername() - Exception updating username:",
        exc
      );
      await this.dbPool.query("ROLLBACK");
      return { status: UpdateUsernameStatus.UnknownError };
    }
  }

  async updatePassword(
    username: string,
    oldPassword: string,
    newPassword: string
  ) {
    const existingPersonResult = await this.dbPool.query(
      "SELECT * FROM person WHERE username = $1 AND active = TRUE",
      [username]
    );

    const person = existingPersonResult.rows[0];
    if (existingPersonResult.rowCount != 1 || person == null) {
      return { status: UpdatePasswordStatus.PersonNotFound };
    }

    const passwordCorrect = await compare(oldPassword, person.pwd_hash);

    if (!passwordCorrect) {
      return { status: UpdatePasswordStatus.IncorrectPassword };
    }

    const newPasswordHash = await hash(newPassword, 10);

    await this.dbPool.query("BEGIN");
    try {
      const updateResult = await this.dbPool.query(
        `
            UPDATE person
            SET pwd_hash = $2
            WHERE username = $1
          `,
        [username, newPasswordHash]
      );

      if (updateResult.rowCount != 1) {
        console.log("Failed to update password. No rows.", updateResult);
        await this.dbPool.query("ROLLBACK");
        return { status: UpdatePasswordStatus.UnknownError };
      }

      await this.dbPool.query("COMMIT");
      return { status: UpdatePasswordStatus.Success };
    } catch (exc) {
      console.error(
        "AccountRepository.updatePassword() - Exception updating password:",
        exc
      );
      await this.dbPool.query("ROLLBACK");
      return { status: UpdatePasswordStatus.UnknownError };
    }
  }

  async updatePicture(personId: string, pictureHandle: string) {
    const existingPersonResult = await this.dbPool.query(
      "SELECT * FROM person WHERE id = $1 AND active = TRUE",
      [personId]
    );

    const person = existingPersonResult.rows[0];
    if (existingPersonResult.rowCount != 1 || person == null) {
      return { status: UpdatePictureStatus.PersonNotFound };
    }

    await this.dbPool.query("BEGIN");
    try {
      const updateResult = await this.dbPool.query(
        `
            UPDATE person
            SET picture = $2
            WHERE id = $1
          `,
        [personId, pictureHandle]
      );

      if (updateResult.rowCount != 1) {
        console.log("Failed to update picture. No rows.", updateResult);
        await this.dbPool.query("ROLLBACK");
        return { status: UpdatePictureStatus.UnknownError };
      }

      await this.dbPool.query("COMMIT");
      return { status: UpdatePictureStatus.Success };
    } catch (exc) {
      console.error(
        "AccountRepository.updatePicture() - Exception updating picture:",
        exc
      );
      await this.dbPool.query("ROLLBACK");
      return { status: UpdatePictureStatus.UnknownError };
    }
  }
}
