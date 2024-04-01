import { Request, Response } from "express";
import {
  DeleteAccountStatus,
  IAccountRepository
} from "../../../../repositories/AccountRepository";

export class DeleteAccountService {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async deleteAccount(request: Request, response: Response) {
    const username = request.params.username;
    const password = request.body.password;

    if (!username) {
      return response.status(400).send("Missing required field 'username'.");
    }

    if (typeof username !== "string") {
      return response
        .status(400)
        .send("Unexpected type of 'username' field. Expected string.");
    }

    if (!password) {
      return response.status(400).send("Missing required field 'password'.");
    }

    if (typeof password !== "string") {
      return response
        .status(400)
        .send("Unexpected type of 'password' field. Expected string.");
    }

    const result = await this.accountRepository.deleteAccount(
      username,
      password
    );

    if (result.status == DeleteAccountStatus.UsernameNotFound) {
      return response.status(404).send("User not found.");
    }

    if (result.status == DeleteAccountStatus.IncorrectPassword) {
      return response.status(401).send("Incorrect password.");
    }

    if (result.status == DeleteAccountStatus.UnknownError) {
      return response.status(500).send("Unknown error occurred.");
    }

    response.status(204).send();
  }
}
