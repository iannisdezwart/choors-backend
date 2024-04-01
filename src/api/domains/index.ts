import { Router } from "express";
import { TaskRepository } from "../../repositories/TaskRepository";
import { tasksRouter } from "./tasks";

export const domainsRouter = (taskRepository: TaskRepository) => {
  const router = Router();

  router.use(tasksRouter(taskRepository));

  return router;
};
