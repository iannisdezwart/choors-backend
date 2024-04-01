import { Bootstrap } from "./Bootstrap.js";
import { EnvVarEnvironmentProvider } from "./env/EnvVarEnvironmentProvider.js";

const main = async () => {
  const bootstrap = new Bootstrap();
  const envProvider = new EnvVarEnvironmentProvider();

  await bootstrap.init(envProvider);
  await bootstrap.run();
};

main();
