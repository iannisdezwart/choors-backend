import express from "express";
import {
  AccountServices,
  GroupServices,
  HouseServices,
  Middleware,
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
import { loggerMiddleware } from "./middleware/logging/logger-middleware.js";

export const buildAndServeApi = (
  env: Environment,
  mdw: Middleware,
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
  app.use(loggerMiddleware);
  app.use(taskRouter(taskServices, mdw, env));
  app.use(accountRouter(accountServices, mdw, env));
  app.use(pictureRouter(pictureServices));
  app.use(houseRouter(houseServices, mdw, env));
  app.use(groupRouter(groupServices, mdw, env));
  app.use(personRouter(personServices, mdw, env));
  app.use(scheduleRouter(scheduleServices, mdw, env));
  app.use((_, res) => {
    res.status(404).send({ error: "Not found." });
  });

  // Start API.
  return app.listen(env.apiPort, () => {
    console.log(`Server is running on port ${env.apiPort}`);
  });
};
