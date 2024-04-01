import { Handler } from "express";

export const loggerMiddleware: Handler = (request, response, next) => {
  console.log(
    `${request.method} ${request.path} - ${request.ip} - ${new Date().toISOString()}`
  );
  next();
}