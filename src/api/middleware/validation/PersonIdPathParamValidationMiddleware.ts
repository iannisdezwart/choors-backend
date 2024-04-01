import { NextFunction, Request, Response } from "express";
import { AMiddleware } from "../../util/AMiddleware.js";

export class PersonIdPathParamValidationMiddleware extends AMiddleware {
  run(request: Request, response: Response, next: NextFunction) {
    const { personId } = request.params;

    if (!personId) {
      return response
        .status(400)
        .json({ error: "Missing required field 'personId'." });
    }

    if (typeof personId !== "string") {
      return response.status(400).json({
        error: "Unexpected type of 'personId' field. Expected string.",
      });
    }

    next();
  }
}
