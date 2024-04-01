import { Router } from "express";
import { tasksRouter } from "./tasks";

export const domainsRouter = () => {
  const router = Router();

  router.use(tasksRouter());

  return router;
};
