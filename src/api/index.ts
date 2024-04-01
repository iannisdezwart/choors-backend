import express from "express";
import { domainsRouter } from "./domains";

export const buildAndServeApi = () => {
  const app = express();

  app.use(domainsRouter());
};
