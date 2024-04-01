import { Router } from "express";
import { TaskRepository } from "../../../repositories/TaskRepository";
import { ListTasksUsecase } from "./ListTasksUsecase";
import { addTask } from "./add-task";
import { deleteTask } from "./delete-task";
import { getTask } from "./get-task";
import { updateTask } from "./update-task";

export const tasksRouter = (taskRepository: TaskRepository) => {
  const router = Router();
  const listTasksUsecase = new ListTasksUsecase(taskRepository);

  router.get(
    "/v1/tasks/:house_id",
    listTasksUsecase.listTasks.bind(listTasksUsecase)
  );
  router.post("/v1/tasks/:house_id", addTask);
  router.get("/v1/tasks/:house_id/:task_id", getTask);
  router.patch("/v1/tasks/:house_id/:task_id", updateTask);
  router.delete("/v1/tasks/:house_id/:task_id", deleteTask);

  return router;
};
