import { Environment } from "./Environment";

export interface IEnvironmentProvider {
  getEnvironment(): Environment;
}