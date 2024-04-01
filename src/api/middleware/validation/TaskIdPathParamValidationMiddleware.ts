import { NextFunction, Request, Response } from "express";
import { AMiddleware } from "../../util/AMiddleware.js";

export class TaskIdPathParamValidationMiddleware extends AMiddleware {
  run(request: Request, response: Response, next: NextFunction) {
    const { taskId } = request.params;

    if (!taskId) {
      return response
        .status(400)
        .json({ error: "Missing required field 'taskId'." });
    }

    if (typeof taskId !== "string") {
      return response.status(400).json({
        error: "Unexpected type of 'taskId' field. Expected string.",
      });
    }

    next();
  }
}
