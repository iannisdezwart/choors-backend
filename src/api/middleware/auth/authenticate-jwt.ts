import { Handler } from "express";
import { verify } from "jsonwebtoken";

export const createJwtPersonAuthenticationMiddleware =
  (secret: string): Handler =>
  (request, response, next) => {
    const token = request.headers.authorization;

    if (!token) {
      return response.status(401).send("Missing authorization header.");
    }

    try {
      const payload = verify(token, secret);

      if (typeof payload == "string") {
        return response.status(401).send("Invalid token.");
      }

      response.locals.authenticatedPersonId = payload.personId;
      next();
    } catch (error) {
      return response.status(401).send("Invalid token.");
    }
  };
