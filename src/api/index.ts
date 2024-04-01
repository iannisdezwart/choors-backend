import express from "express";
import {
  AccountServices,
  GroupServices,
  HouseServices,
  PersonServices,
  PictureServices,
  ScheduleServices,
  TaskServices,
} from "../Bootstrap";
import { Environment } from "../env/Environment";
import { accountRouter } from "./domains/account/account-router";
import { groupRouter } from "./domains/group/group-router";
import { houseRouter } from "./domains/house/house-router";
import { personRouter } from "./domains/person/person-router";
import { pictureRouter } from "./domains/picture/picture-router";
import { scheduleRouter } from "./domains/schedule/schedule-router";
import { taskRouter } from "./domains/task/task-router";

export const buildAndServeApi = (
  env: Environment,
  accountServices: AccountServices,
  groupServices: GroupServices,
  houseServices: HouseServices,
  personServices: PersonServices,
  pictureServices: PictureServices,
  scheduleServices: ScheduleServices,
  taskServices: TaskServices
) => {
  const app = express();

  // Register domain routers.
  app.use(taskRouter(taskServices, env));
  app.use(accountRouter(accountServices, env));
  app.use(pictureRouter(pictureServices));
  app.use(houseRouter(houseServices, env));
  app.use(groupRouter(groupServices, env));
  app.use(personRouter(personServices, env));
  app.use(scheduleRouter(scheduleServices, env));

  // Start API.
  app.listen(env.apiPort, () => {
    console.log(`Server is running on port ${env.apiPort}`);
  });
};
