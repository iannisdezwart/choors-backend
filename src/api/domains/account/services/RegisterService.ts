import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import {
  IAccountRepository,
  RegisterPersonStatus,
} from "../../../../repositories/IAccountRepository";

export class RegisterService {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async registerPerson(request: Request, response: Response) {
    const { username, password } = request.body;

    if (username.length < 3) {
      return response
        .status(400)
        .send("Username must be at least 3 characters long.");
    }

    if (password.length < 8) {
      return response
        .status(400)
        .send("Password must be at least 8 characters long.");
    }

    const result = await this.accountRepository.registerPerson(
      username,
      password
    );

    switch (result.status) {
      case RegisterPersonStatus.Success:
        break;
      case RegisterPersonStatus.UsernameTaken:
        return response
          .status(409)
          .json({ error: "Username is already taken." });
      case RegisterPersonStatus.UnknownError:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error(
          "RegisterService.registerPerson() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error(
        "RegisterService.registerPerson() - JWT_SECRET environment variable is not set."
      );
      return response.status(500).json({ error: "Unknown error occurred." });
    }

    if (result.person == null) {
      console.error("RegisterService.registerPerson() - Person is null.");
      return response.status(500).json({ error: "Unknown error occurred." });
    }

    const token = sign({ person_id: result.person.id }, secret);
    return response.status(201).json({
      token,
      username: result.person.username,
      picture: result.person.picture,
      person_id: result.person.id,
    });
  }
}
