import { Handler } from "express";

export const houseIdParamValidationMiddleware: Handler = (
  request,
  response,
  next
) => {
  const { houseId } = request.params;

  if (!houseId) {
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
};
