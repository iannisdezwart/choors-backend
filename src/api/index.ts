import express from "express";
import {
  AccountServices,
  GroupServices,
  HouseServices,
  PersonServices,
  PictureServices,
  ScheduleServices,
  TaskServices,
} from "../Bootstrap.js";
import { Environment } from "../env/Environment.js";
import { accountRouter } from "./domains/account/account-router.js";
import { groupRouter } from "./domains/group/group-router.js";
import { houseRouter } from "./domains/house/house-router.js";
import { personRouter } from "./domains/person/person-router.js";
import { pictureRouter } from "./domains/picture/picture-router.js";
import { scheduleRouter } from "./domains/schedule/schedule-router.js";
import { taskRouter } from "./domains/task/task-router.js";

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
