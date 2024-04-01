import { Request, Response } from "express";
import {
  DeleteAccountStatus,
  IAccountRepository,
} from "../../../../repositories/IAccountRepository";

export class DeleteAccountService {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async deleteAccount(request: Request, response: Response) {
    const { username, password } = request.body;

    const result = await this.accountRepository.deleteAccount(
      username,
      password
    );

    switch (result.status) {
      case DeleteAccountStatus.Success:
        return response.status(204).end();
      case DeleteAccountStatus.IncorrectPassword:
        return response.status(401).json({ error: "Incorrect password." });
      case DeleteAccountStatus.PersonNotFound:
        return response.status(404).json({ error: "User not found." });
      case DeleteAccountStatus.UnknownError:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error("Unknown status:", result.status);
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
