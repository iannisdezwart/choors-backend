import { Request, Response } from "express";

export abstract class AService {
  abstract run(request: Request, response: Response): any;

  createHandler() {
    return (request: Request, response: Response) => {
      this.run(request, response);
    };
  }
}
