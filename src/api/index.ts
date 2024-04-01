import express from "express";
import { IAccountRepository } from "../repositories/IAccountRepository";
import { IHouseRepository } from "../repositories/IHouseRepository";
import { IPictureRepository } from "../repositories/IPictureRepository";
import { ITaskRepository } from "../repositories/ITaskRepository";
import { accountRouter } from "./domains/account/account-router";
import { houseRouter } from "./domains/house/house-router";
import { pictureRouter } from "./domains/picture/picture-router";
import { taskRouter } from "./domains/task/task-router";

export const buildAndServeApi = (
  taskRepository: ITaskRepository,
  accountRepository: IAccountRepository,
  pictureRepository: IPictureRepository,
  houseRepository: IHouseRepository
) => {
  const app = express();

  // Register domain routers.
  app.use(taskRouter(taskRepository));
  app.use(accountRouter(accountRepository, pictureRepository));
  app.use(pictureRouter(pictureRepository));
  app.use(houseRouter(houseRepository));

  // Start API.
  const port = parseInt(process.env.PORT || "3000");
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
