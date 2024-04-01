import { Handler } from "express";

export const usernameBodyValidationMiddleware: Handler = (
  request,
  response,
  next
) => {
  const username = request.body.username;

  if (!username) {
    return response
      .status(400)
      .json({ error: "Missing required field 'username'." });
  }

  if (typeof username !== "string") {
    return response
      .status(400)
      .json({ error: "Unexpected type of 'username' field. Expected string." });
  }

  next();
};
