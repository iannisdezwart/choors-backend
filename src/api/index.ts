import express from "express";
import { TaskRepository } from "../repositories/TaskRepository";
import { domainsRouter } from "./domains";

export const buildAndServeApi = (taskRepository: TaskRepository) => {
  const app = express();

  app.use(domainsRouter(taskRepository));
};
