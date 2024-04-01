import { Handler } from "express";
import jwt from "jsonwebtoken";

export const createJwtPersonAuthenticationMiddleware =
  (secret: string): Handler =>
  (request, response, next) => {
    const token = request.headers.authorization;

    if (!token) {
      return response
        .status(401)
        .json({ error: "Missing authorization header." });
    }

    try {
      const payload = jwt.verify(token, secret);

      if (typeof payload == "string") {
        return response.status(401).json({ error: "Invalid token." });
      }

      response.locals.authenticatedPersonId = payload.personId;
      next();
    } catch (error) {
      return response.status(401).json({ error: "Invalid token." });
    }
  };
