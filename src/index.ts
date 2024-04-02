import { Bootstrap } from "./Bootstrap.js";
import { EnvVarEnvironmentProvider } from "./env/EnvVarEnvironmentProvider.js";
import { CurrentTimeProvider } from "./utils/time-provider/CurrentTimeProvider.js";

const main = async () => {
  const bootstrap = new Bootstrap();
  const envProvider = new EnvVarEnvironmentProvider();
  const timeProvider = new CurrentTimeProvider();

  await bootstrap.init(envProvider, timeProvider);
  await bootstrap.run();
};

main();
