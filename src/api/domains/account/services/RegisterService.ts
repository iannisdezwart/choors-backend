import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Environment } from "../../../../env/Environment.js";
import {
  IAccountRepository,
  RegisterPersonStatus,
} from "../../../../repositories/domains/account/IAccountRepository.js";
import { AService } from "../../../util/AService.js";

export class RegisterService extends AService {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly env: Environment
  ) {
    super();
  }

  async run(request: Request, response: Response) {
    const { username, password } = request.body;

    if (username.length < 3) {
      return response
        .status(400)
        .json({ error: "Username must be at least 3 characters long." });
    }

    if (password.length < 8) {
      return response
        .status(400)
        .json({ error: "Password must be at least 8 characters long." });
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
        console.error("RegisterService.run() - Unknown status:", result.status);
        return response.status(500).json({ error: "Unknown error occurred." });
    }

    if (result.person == null) {
      console.error("RegisterService.run() - Person is null.");
      return response.status(500).json({ error: "Unknown error occurred." });
    }

    const token = jwt.sign({ personId: result.person.id }, this.env.jwtSecret);
    return response.status(201).json({
      token,
      username: result.person.username,
      picture: result.person.picture,
      personId: result.person.id,
    });
  }
}
