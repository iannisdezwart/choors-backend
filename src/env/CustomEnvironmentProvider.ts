import { Environment } from "./Environment.js";
import { IEnvironmentProvider } from "./IEnvironmentProvider.js";

export class CustomEnvironmentProvider implements IEnvironmentProvider {
  constructor(private env: Environment) {}

  getEnvironment(): Environment {
    return this.env;
  }
}
