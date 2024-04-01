import { Handler } from "express";

export const taskIdParamValidationMiddleware: Handler = (
  request,
  response,
  next
) => {
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
};
