import { Bootstrap } from "./Bootstrap.js";
import { EnvVarEnvironmentProvider } from "./env/EnvVarEnvironmentProvider.js";

const bootstrap = new Bootstrap();
const envProvider = new EnvVarEnvironmentProvider();

bootstrap.init(envProvider).then(() => bootstrap.run());
