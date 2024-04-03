import bytes from "bytes";
import chalk from "chalk";
import { spawn } from "child_process";
import { Bootstrap } from "../../Bootstrap.js";
import { CustomEnvironmentProvider } from "../../env/CustomEnvironmentProvider.js";
import { CustomTimeProvider } from "../../utils/time-provider/CustomTimeProvider.js";
import { createTasksFlow } from "./flows/create-tasks-flow.js";
import { multiplePersonsFlow } from "./flows/multiple-persons-flow.js";
import { pictureFlow } from "./flows/picture-flow.js";
import { registerFlow } from "./flows/register-flow.js";
import { schedulerFlow } from "./flows/scheduler-flow.js";
import { updateAccountDetailsFlow } from "./flows/update-account-details.js";
import { EndToEndFlow } from "./util/EndToEndFlow.js";

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
  schedulerFlow,
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
    schedulerInterval: 500,
  });

  const customTimeProvider = new CustomTimeProvider(new Date("2024-04-01"));

  await sleep(1000);

  const bootstrap = new Bootstrap();
  await bootstrap.init(customEnvProvider, customTimeProvider);
  await bootstrap.run();

  console.log(chalk.bgBlack(chalk.blueBright("Running tests.")));

  let numPassed = 0;
  let numFailed = 0;

  for (let i = 0; i < flows.length; i++) {
    console.log(
      chalk.bgBlack(chalk.yellow(`Running flow ${i} (${flows[i].name})...`))
    );
    const flow = flows[i];
    try {
      await flow.fn(customTimeProvider);
      console.log(
        chalk.bgBlack(chalk.green(`Flow ${i} (${flow.name}) passed.`))
      );
      numPassed++;
    } catch (exc) {
      console.error(
        chalk.bgBlack(chalk.red(`Flow ${i} (${flow.name}) failed!!!`)),
        exc
      );
      numFailed++;
    }
  }

  await bootstrap.shutdown();
  console.log(chalk.bgBlack(chalk.blueBright("Tests complete.")));

  if (numFailed === 0) {
    console.log(chalk.bgBlack(chalk.green(`All tests passed.`)));
  } else {
    console.error(
      chalk.bgBlack(
        chalk.red(`${numFailed} tests failed!!! ${numPassed} passed.`)
      )
    );
  }

  process.exit();
};

runEndToEndTests();
