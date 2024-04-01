import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import {
  IAccountRepository,
  VerifyPersonStatus,
} from "../../../../repositories/IAccountRepository";

export class LoginService {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async login(request: Request, response: Response) {
    const { username, password } = request.body;

    const result = await this.accountRepository.verifyPerson(
      username,
      password
    );

    switch (result.status) {
      case VerifyPersonStatus.Success: {
        break;
      }
      case VerifyPersonStatus.IncorrectPassword:
        return response.status(401).json({ error: "Incorrect password" });
      case VerifyPersonStatus.PersonNotFound:
        return response.status(404).json({ error: "User not found." });
      default:
        console.error("Unknown status:", result.status);
        return response.status(500).json({ error: "Unknown error occurred." });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET environment variable is not set.");
      return response.status(500).json({ error: "Unknown error occurred." });
    }

    if (result.person == null) {
      console.error("Person is null.");
      return response.status(500).json({ error: "Unknown error occurred." });
    }

    const token = sign({ person_id: result.person.id }, secret);
    return response.status(200).json({
      token,
      username: result.person.username,
      picture: result.person.picture,
      person_id: result.person.id,
    });
  }
}
