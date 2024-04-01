import { NextFunction, Request, Response } from "express";
import { AMiddleware } from "../../util/AMiddleware.js";

export class PasswordBodyFieldValidationMiddleware extends AMiddleware {
  run(request: Request, response: Response, next: NextFunction) {
    const password = request.body.password;

    if (!password) {
      return response
        .status(400)
        .json({ error: "Missing required field 'password'." });
    }

    if (typeof password !== "string") {
      return response.status(400).json({
        error: "Unexpected type of 'password' field. Expected string.",
      });
    }

    next();
  }
}
