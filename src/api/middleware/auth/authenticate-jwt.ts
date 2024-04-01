import { Handler } from "express";
import { verify } from "jsonwebtoken";

export const jwtPersonAuthenticationMiddleware: Handler = (
  request,
  response,
  next
) => {
  const token = request.headers.authorization;

  if (!token) {
    return response.status(401).send("Missing authorization header.");
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error(
      "jwtPersonAuthenticationMiddleware() - JWT_SECRET environment variable is not set."
    );
    return response.status(500).send("Unknown error occurred.");
  }

  try {
    const payload = verify(token, secret);

    if (typeof payload == "string") {
      return response.status(401).send("Invalid token.");
    }

    response.locals.authenticatedPersonId = payload.person_id;
    next();
  } catch (error) {
    return response.status(401).send("Invalid token.");
  }
};
