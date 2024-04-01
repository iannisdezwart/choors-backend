import { Request, Response } from "express";

export abstract class AService {
  abstract run(request: Request, response: Response): any;

  createHandler() {
    return this.run.bind(this);
  }
}
