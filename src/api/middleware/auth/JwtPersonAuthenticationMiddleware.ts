import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Environment } from "../../../env/Environment.js";
import { IAccountRepository } from "../../../repositories/domains/account/IAccountRepository.js";
import { AMiddleware } from "../../util/AMiddleware.js";

export class JwtPersonAuthenticationMiddleware extends AMiddleware {
  constructor(
    private accountRepository: IAccountRepository,
    private env: Environment
  ) {
    super();
  }

  run(request: Request, response: Response, next: NextFunction) {
    const auth = request.headers.authorization;

    if (auth == null) {
      return response
        .status(401)
        .json({ error: "Missing authorization header." });
    }

    const parts = auth.split(" ");

    if (parts.length !== 2) {
      return response
        .status(401)
        .json({ error: "Invalid authorization header." });
    }

    const [scheme, token] = parts;

    if (scheme !== "Bearer") {
      return response
        .status(401)
        .json({ error: "Invalid authorization scheme." });
    }

    try {
      const payload = jwt.verify(token, this.env.jwtSecret);

      if (typeof payload == "string") {
        return response.status(401).json({ error: "Invalid token." });
      }

      const personId = payload.personId.toString();

      if (!this.accountRepository.checkPersonExists(personId)) {
        return response.status(401).json({ error: "Invalid token." });
      }

      response.locals.authenticatedPersonId = personId;
      next();
    } catch (error) {
      return response.status(401).json({ error: "Invalid token." });
    }
  }
}
