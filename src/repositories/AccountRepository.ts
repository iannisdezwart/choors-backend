import { compare, hash } from "bcrypt";
import { Pool } from "pg";

export enum RegisterPersonStatus {
  Success,
  UsernameTaken,
  UnknownError,
}

export type PersonRow = {
  id: number;
  username: string;
};

export type RegisterPersonResult = {
  status: RegisterPersonStatus;
  person?: PersonRow;
};

export enum VerifyPersonStatus {
  Success,
  UsernameNotFound,
  IncorrectPassword,
}

export type VerifyPersonResult = {
  status: VerifyPersonStatus;
  person?: PersonRow;
};

export enum DeleteAccountStatus {
  Success,
  UsernameNotFound,
  IncorrectPassword,
  UnknownError,
}

export type DeleteAccountResult = {
  status: DeleteAccountStatus;
};

export interface IAccountRepository {
  registerPerson(
    username: string,
    password: string
  ): Promise<RegisterPersonResult>;

  verifyPerson(username: string, password: string): Promise<VerifyPersonResult>;

  deleteAccount(
    username: string,
    password: string
  ): Promise<DeleteAccountResult>;
}

export class AccountRepository implements IAccountRepository {
  constructor(private dbPool: Pool) {}

  async registerPerson(
    username: string,
    password: string
  ): Promise<RegisterPersonResult> {
    const existingUser = await this.dbPool.query(
      "SELECT * FROM person WHERE username = $1",
      [username]
    );

    if (existingUser.rowCount && existingUser.rowCount > 0) {
      return { status: RegisterPersonStatus.UsernameTaken };
    }

    const passwordHash = await hash(password, 10);

    const result = await this.dbPool.query(
      "INSERT INTO person (username, pwd_hash) VALUES ($1, $2) RETURNING id, username",
      [username, passwordHash]
    );

    if (result.rowCount != 1 || result.rows[0] == null) {
      console.error("Failed to insert new person.", result);
      return { status: RegisterPersonStatus.UnknownError };
    }

    const person = result.rows[0];

    return {
      status: RegisterPersonStatus.Success,
      person: {
        id: person.id,
        username: person.username,
      },
    };
  }

  async verifyPerson(
    username: string,
    password: string
  ): Promise<VerifyPersonResult> {
    const result = await this.dbPool.query(
      "SELECT id, username, pwd_hash FROM person WHERE username = $1 AND active = TRUE",
      [username]
    );

    if (result.rowCount != 1) {
      return { status: VerifyPersonStatus.UsernameNotFound };
    }

    const person = result.rows[0];
    const passwordCorrect = await compare(password, person.pwd_hash);

    if (!passwordCorrect) {
      return { status: VerifyPersonStatus.IncorrectPassword };
    }

    return {
      status: VerifyPersonStatus.Success,
      person: {
        id: person.id,
        username: person.username,
      },
    };
  }

  async deleteAccount(
    username: string,
    password: string
  ): Promise<DeleteAccountResult> {
    const result = await this.dbPool.query(
      "SELECT * FROM person WHERE username = $1 AND active = TRUE",
      [username]
    );

    if (result.rowCount != 1) {
      return { status: DeleteAccountStatus.UsernameNotFound };
    }

    const person = result.rows[0];
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
              username = 'Deleted User #$2',
              pwd_hash = '',
              picture = NULL
            WHERE username = $1
          `,
        [username, person.id]
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
    } catch {
      await this.dbPool.query("ROLLBACK");
      return { status: DeleteAccountStatus.UnknownError };
    }
  }
}
