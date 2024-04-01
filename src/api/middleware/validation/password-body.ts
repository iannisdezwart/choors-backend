import { Handler } from "express";

export const passwordBodyValidationMiddleware: Handler = (
  request,
  response,
  next
) => {
  const password = request.body.password;

  if (!password) {
    return response
      .status(400)
      .json({ error: "Missing required field 'password'." });
  }

  if (typeof password !== "string") {
    return response
      .status(400)
      .json({ error: "Unexpected type of 'password' field. Expected string." });
  }

  next();
};
