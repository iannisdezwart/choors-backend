import { Request, Response } from "express";

export interface IService {
  run(request: Request, response: Response): any;
}
