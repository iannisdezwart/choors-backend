import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import {
  IAccountRepository,
  RegisterPersonStatus,
} from "../../../../repositories/AccountRepository";

export class RegisterService {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async registerPerson(request: Request, response: Response) {
    const { username, password } = request.body;

    if (!username) {
      return response.status(400).send("Missing required field 'username'.");
    }

    if (typeof username !== "string") {
      return response
        .status(400)
        .send("Unexpected type of 'username' field. Expected string.");
    }

    if (username.length < 3) {
      return response
        .status(400)
        .send("Username must be at least 3 characters long.");
    }

    if (!password) {
      return response.status(400).send("Missing required field 'password'.");
    }

    if (typeof password !== "string") {
      return response
        .status(400)
        .send("Unexpected type of 'password' field. Expected string.");
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

    if (result.status == RegisterPersonStatus.UsernameTaken) {
      return response.status(409).send("Username is already taken.");
    }

    if (result.status == RegisterPersonStatus.UnknownError) {
      return response.status(500).send("Internal server error.");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET environment variable is not set.");
      return response.status(500).send("Internal server error.");
    }

    if (result.person == null) {
      return response.status(500).send("Internal server error.");
    }

    const token = sign({ person_id: result.person.id }, secret);
    return response.status(201).send({ token });
  }
}
