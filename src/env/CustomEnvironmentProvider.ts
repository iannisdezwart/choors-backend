import { Environment } from "./Environment";
import { IEnvironmentProvider } from "./IEnvironmentProvider";

export class CustomEnvironmentProvider implements IEnvironmentProvider {
  constructor(private env: Environment) {}

  getEnvironment(): Environment {
    return this.env;
  }
}
