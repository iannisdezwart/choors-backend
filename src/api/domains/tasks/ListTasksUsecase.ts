import { Request, Response } from "express";
import { TaskRepository } from "../../../repositories/TaskRepository";

export class ListTasksUsecase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async listTasks(req: Request, res: Response) {}
}
