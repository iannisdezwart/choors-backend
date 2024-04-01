import { buildAndServeApi } from "./api/index.js";
import { connectToDb } from "./db/index.js";
import { setupEnv } from "./env/setup-env.js";
import { AccountRepository } from "./repositories/AccountRepository.js";
import { TaskRepository } from "./repositories/TaskRepository.js";

const main = async () => {
  setupEnv();
  const dbPool = await connectToDb();
  const taskRepository = new TaskRepository(dbPool);
  const accountRepository = new AccountRepository(dbPool);
  buildAndServeApi(taskRepository, accountRepository);
};

main();
