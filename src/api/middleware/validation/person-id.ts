import { Handler } from "express";

export const personIdParamValidationMiddleware: Handler = (
  request,
  response,
  next
) => {
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
};
