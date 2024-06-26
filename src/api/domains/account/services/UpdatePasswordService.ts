import { Request, Response } from "express";
import {
  IAccountRepository,
  UpdatePasswordStatus,
} from "../../../../repositories/domains/account/IAccountRepository.js";
import { AService } from "../../../util/AService.js";

export class UpdatePasswordService extends AService {
  constructor(private readonly accountRepository: IAccountRepository) {
    super();
  }

  async run(request: Request, response: Response) {
    const { username, password, newPassword } = request.body;

    if (newPassword == null) {
      return response
        .status(400)
        .json({ error: "Missing required field 'newPassword'." });
    }

    if (typeof newPassword !== "string") {
      return response.status(400).json({
        error: "Unexpected type of 'newPassword' field. Expected string.",
      });
    }

    if (newPassword.length < 8) {
      return response
        .status(400)
        .json({ error: "New password must be at least 8 characters long." });
    }

    const result = await this.accountRepository.updatePassword(
      username,
      password,
      newPassword
    );

    switch (result.status) {
      case UpdatePasswordStatus.Success:
        return response.status(204).end();
      case UpdatePasswordStatus.IncorrectPassword:
        return response.status(401).json({ error: "Incorrect password." });
      case UpdatePasswordStatus.PersonNotFound:
        return response.status(404).json({ error: "User not found." });
      case UpdatePasswordStatus.UnknownError:
        return response.status(500).json();
      default:
        console.error(
          "UpdatePasswordService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
