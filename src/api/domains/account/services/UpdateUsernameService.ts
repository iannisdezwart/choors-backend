import { Request, Response } from "express";
import {
  IAccountRepository,
  UpdateUsernameStatus,
} from "../../../../repositories/domains/account/IAccountRepository";
import { IService } from "../../../util/IService";

export class UpdateUsernameService implements IService {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async run(request: Request, response: Response) {
    const { username, password, newUsername } = request.body;

    if (!newUsername) {
      return response
        .status(400)
        .json({ error: "Missing required field 'newUsername'." });
    }

    if (typeof newUsername !== "string") {
      return response
        .status(400)
        .json({
          error: "Unexpected type of 'newUsername' field. Expected string.",
        });
    }

    if (newUsername.length < 3) {
      return response
        .status(400)
        .json({ error: "New username must be at least 3 characters long." });
    }

    const result = await this.accountRepository.updateUsername(
      username,
      password,
      newUsername
    );

    switch (result.status) {
      case UpdateUsernameStatus.Success:
        return response.status(204).end();
      case UpdateUsernameStatus.IncorrectPassword:
        return response.status(401).json({ error: "Incorrect password." });
      case UpdateUsernameStatus.PersonNotFound:
        return response.status(404).json({ error: "User not found." });
      case UpdateUsernameStatus.NewUsernameTaken:
        return response
          .status(409)
          .json({ error: "New username is already taken." });
      case UpdateUsernameStatus.UnknownError:
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
