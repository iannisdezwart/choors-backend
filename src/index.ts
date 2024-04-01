import { buildAndServeApi } from "./api/index.js";
import { connectToDb } from "./db/index.js";
import { setupEnv } from "./env/setup-env.js";
import { AccountRepository } from "./repositories/AccountRepository.js";
import { GroupRepository } from "./repositories/GroupRepository.js";
import { HouseRepository } from "./repositories/HouseRepository.js";
import { PictureRepository } from "./repositories/PictureRepository.js";
import { TaskRepository } from "./repositories/TaskRepository.js";

const main = async () => {
  setupEnv();
  const dbPool = await connectToDb();
  const taskRepository = new TaskRepository(dbPool);
  const accountRepository = new AccountRepository(dbPool);
  const pictureRepository = new PictureRepository();
  const houseRepository = new HouseRepository(dbPool);
  const groupRepository = new GroupRepository(dbPool);

  buildAndServeApi(
    taskRepository,
    accountRepository,
    pictureRepository,
    houseRepository,
    groupRepository
  );
};

main();
