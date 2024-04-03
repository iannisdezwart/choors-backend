import { NextFunction, Request, Response } from "express";
import { AMiddleware } from "../../util/AMiddleware.js";

export class UsernameBodyFieldValidationMiddleware extends AMiddleware {
  run(request: Request, response: Response, next: NextFunction) {
    const username = request.body.username;

    if (username == null) {
      return response
        .status(400)
        .json({ error: "Missing required field 'username'." });
    }

    if (typeof username !== "string") {
      return response
        .status(400)
        .json({
          error: "Unexpected type of 'username' field. Expected string.",
        });
    }

    next();
  }
}
