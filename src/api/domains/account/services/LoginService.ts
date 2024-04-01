import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import {
  IAccountRepository,
  VerifyPersonStatus,
} from "../../../../repositories/AccountRepository";

export class LoginService {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async login(request: Request, response: Response) {
    const username = request.params.username;
    const password = request.body.password;

    if (!username) {
      return response
        .status(400)
        .send("Missing required path parameter 'username'.");
    }

    if (!password) {
      return response.status(400).send("Missing required field 'password'.");
    }

    if (typeof password !== "string") {
      return response
        .status(400)
        .send("Unexpected type of 'password' field. Expected string.");
    }

    const result = await this.accountRepository.verifyPerson(
      username,
      password
    );

    if (result.status == VerifyPersonStatus.UsernameNotFound) {
      return response.status(404).send("User not found.");
    }

    if (result.status == VerifyPersonStatus.IncorrectPassword) {
      return response.status(401).send("Incorrect password.");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET environment variable is not set.");
      return response.status(500).send("Internal server error.");
    }

    const token = sign({ username }, secret);
    response.status(200).send({ token });
  }
}
