import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { Environment } from "../../../../env/Environment";
import {
  IAccountRepository,
  VerifyPersonStatus,
} from "../../../../repositories/domains/account/IAccountRepository";
import { AService } from "../../../util/IService";

export class LoginService extends AService {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly env: Environment
  ) {
    super();
  }

  async run(request: Request, response: Response) {
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
        console.error("LoginService.run() - Unknown status:", result.status);
        return response.status(500).json({ error: "Unknown error occurred." });
    }

    if (result.person == null) {
      console.error("LoginService.run() - Person is null.");
      return response.status(500).json({ error: "Unknown error occurred." });
    }

    const token = sign({ personId: result.person.id }, this.env.jwtSecret);
    return response.status(200).json({
      token,
      username: result.person.username,
      picture: result.person.picture,
      personId: result.person.id,
    });
  }
}
