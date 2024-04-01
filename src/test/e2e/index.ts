import bytes from "bytes";
import { spawn } from "child_process";
import { Bootstrap } from "../../Bootstrap.js";
import { CustomEnvironmentProvider } from "../../env/CustomEnvironmentProvider.js";
import { EndToEndFlow } from "./EndToEndFlow.js";
import { createTasksFlow } from "./flows/create-tasks-flow.js";
import { multiplePersonsFlow } from "./flows/multiple-persons-flow.js";
import { pictureFlow } from "./flows/picture-flow.js";
import { registerFlow } from "./flows/register-flow.js";
import { updateAccountDetailsFlow } from "./flows/update-account-details.js";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const startDb = () =>
  new Promise<void>((resolve) => {
    const child = spawn("docker-compose", [
      "-f",
      "docker-compose-e2e.yml",
      "up",
      "--remove-orphans",
    ]);

    child.stdout.on("data", (data) => {
      if (
        data
          .toString()
          .includes("database system is ready to accept connections")
      ) {
        resolve();
      }
      console.log("db:", data.toString());
    });

    child.stderr.on("data", (data) => {
      console.error("db:", data.toString());
    });

    child.on("error", (error) => {
      console.error("db:", error);
    });

    child.on("exit", (code) => {
      console.log("db: child process exited with code " + code);
    });
  });

const stopDb = (): Promise<void> =>
  new Promise((resolve) => {
    const child = spawn("docker-compose", [
      "-f",
      "docker-compose-e2e.yml",
      "down",
      "--remove-orphans",
    ]);

    child.stdout.on("data", (data) => {
      console.log("db:", data.toString());
    });

    child.stderr.on("data", (data) => {
      console.error("db:", data.toString());
    });

    child.on("error", (error) => {
      console.error("db:", error);
    });

    child.on("exit", (code) => {
      console.log("db: child process exited with code " + code);
      resolve();
    });
  });

const flows: EndToEndFlow[] = [
  registerFlow,
  updateAccountDetailsFlow,
  createTasksFlow,
  pictureFlow,
  multiplePersonsFlow,
];

const runEndToEndTests = async () => {
  console.log("Stopping db if running.");
  await stopDb();
  console.log("Stopped db.");

  console.log("Starting db.");
  await startDb();
  console.log("Started db.");

  const customEnvProvider = new CustomEnvironmentProvider({
    apiPort: 9999,
    dbHost: "localhost",
    dbPort: 5432,
    dbName: "e2e_db",
    dbUser: "postgres",
    dbPassword: "e2e_pwd",
    jwtSecret: "e2e_secret",
    pictureMaxSize: bytes("256kB"),
    pictureStoragePath: "/tmp/pictures",
  });

  await sleep(1000);

  const bootstrap = new Bootstrap();
  await bootstrap.init(customEnvProvider);
  await bootstrap.run();

  console.log("Running tests.");

  for (let i = 0; i < flows.length; i++) {
    console.log(`Running flow ${i} (${flows[i].name}).`);
    const flow = flows[i];
    try {
      await flow.fn();
      console.log(`Flow ${i} (${flow.name}) passed.`);
    } catch (exc) {
      console.error(`Flow ${i} (${flow.name}) failed!!!`, exc);
    }
  }

  await bootstrap.shutdown();
  console.log("Tests complete.");

  process.exit();
};

runEndToEndTests();
