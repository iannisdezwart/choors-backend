import { Environment } from "./Environment.js";

export interface IEnvironmentProvider {
  getEnvironment(): Environment;
}