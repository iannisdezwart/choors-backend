import { NextFunction, Request, Response } from "express";
import { AMiddleware } from "../../util/AMiddleware.js";

export class HouseIdPathParamValidationMiddleware extends AMiddleware {
  run(request: Request, response: Response, next: NextFunction) {
    const { houseId } = request.params;

    if (houseId == null) {
      return response
        .status(400)
        .json({ error: "Missing required field 'houseId'." });
    }

    if (typeof houseId !== "string") {
      return response.status(400).json({
        error: "Unexpected type of 'houseId' field. Expected string.",
      });
    }

    next();
  }
}
