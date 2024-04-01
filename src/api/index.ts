import express from "express";
import { IAccountRepository } from "../repositories/IAccountRepository";
import { IHouseRepository } from "../repositories/IHouseRepository";
import { IPictureRepository } from "../repositories/IPictureRepository";
import { TaskRepository } from "../repositories/TaskRepository";
import { accountRouter } from "./domains/account/account-router";
import { houseRouter } from "./domains/house/house-router";
import { pictureRouter } from "./domains/picture/picture-router";

export const buildAndServeApi = (
  taskRepository: TaskRepository,
  accountRepository: IAccountRepository,
  pictureRepository: IPictureRepository,
  houseRepository: IHouseRepository
) => {
  const app = express();

  // Register domain routers.
  app.use(accountRouter(accountRepository, pictureRepository));
  app.use(pictureRouter(pictureRepository));
  app.use(houseRouter(houseRepository));

  // Start API.
  const port = parseInt(process.env.PORT || "3000");
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
