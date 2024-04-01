import express from "express";
import { IAccountRepository } from "../repositories/domains/account/IAccountRepository";
import { IGroupRepository } from "../repositories/domains/group/IGroupRepository";
import { IHouseRepository } from "../repositories/domains/house/IHouseRepository";
import { IPersonRepository } from "../repositories/domains/person/IPersonRepository";
import { IPictureRepository } from "../repositories/domains/picture/IPictureRepository";
import { IScheduleRepository } from "../repositories/domains/schedule/IScheduleRepository";
import { ITaskRepository } from "../repositories/domains/task/ITaskRepository";
import { accountRouter } from "./domains/account/account-router";
import { groupRouter } from "./domains/group/group-router";
import { houseRouter } from "./domains/house/house-router";
import { personRouter } from "./domains/person/person-router";
import { pictureRouter } from "./domains/picture/picture-router";
import { scheduleRouter } from "./domains/schedule/schedule-router";
import { taskRouter } from "./domains/task/task-router";

export const buildAndServeApi = (
  taskRepository: ITaskRepository,
  accountRepository: IAccountRepository,
  pictureRepository: IPictureRepository,
  houseRepository: IHouseRepository,
  groupRepository: IGroupRepository,
  personRepository: IPersonRepository,
  scheduleRepository: IScheduleRepository
) => {
  const app = express();

  // Register domain routers.
  app.use(taskRouter(taskRepository));
  app.use(accountRouter(accountRepository, pictureRepository));
  app.use(pictureRouter(pictureRepository));
  app.use(houseRouter(houseRepository));
  app.use(groupRouter(groupRepository));
  app.use(personRouter(personRepository));
  app.use(scheduleRouter(scheduleRepository));

  // Start API.
  const port = parseInt(process.env.PORT || "3000");
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
