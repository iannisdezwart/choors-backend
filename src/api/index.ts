import express from "express";
import { AccountRepository } from "../repositories/AccountRepository";
import { TaskRepository } from "../repositories/TaskRepository";
import { accountRouter } from "./domains/account/account-router";

export const buildAndServeApi = (
  taskRepository: TaskRepository,
  accountRepository: AccountRepository
) => {
  const app = express();

  // Register middleware.
  app.use(express.json());

  // Register domain routers.
  app.use(accountRouter(accountRepository));

  // Start API.
  const port = parseInt(process.env.PORT || "3000");
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
