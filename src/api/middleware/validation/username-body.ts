import { Handler } from "express";

export const usernameBodyValidationMiddleware: Handler = (
  request,
  response,
  next
) => {
  const username = request.body.username;

  if (!username) {
    return response.status(400).send("Missing required field 'username'.");
  }

  if (typeof username !== "string") {
    return response
      .status(400)
      .send("Unexpected type of 'username' field. Expected string.");
  }

  next();
};
