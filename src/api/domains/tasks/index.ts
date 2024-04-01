import { Router } from "express";
import { addTask } from "./add-task";
import { deleteTask } from "./delete-task";
import { getTask } from "./get-task";
import { listTasks } from "./list-tasks";
import { updateTask } from "./update-task";

export const tasksRouter = () => {
  const router = Router();

  router.get("/v1/tasks/:house_id", listTasks);
  router.post("/v1/tasks/:house_id", addTask);
  router.get("/v1/tasks/:house_id/:task_id", getTask);
  router.patch("/v1/tasks/:house_id/:task_id", updateTask);
  router.delete("/v1/tasks/:house_id/:task_id", deleteTask);

  return router;
};
