import { Bootstrap } from "./Bootstrap";
import { EnvVarEnvironmentProvider } from "./env/EnvVarEnvironmentProvider";

const bootstrap = new Bootstrap();
const envProvider = new EnvVarEnvironmentProvider();

bootstrap.init(envProvider).then(() => bootstrap.run());
