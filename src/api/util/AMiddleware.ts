import { NextFunction, Request, Response } from "express";

export abstract class AMiddleware {
  abstract run(request: Request, response: Response, next: NextFunction): any;

  createHandler() {
    return (request: Request, response: Response, next: NextFunction) => {
      this.run(request, response, next);
    };
  }
}
