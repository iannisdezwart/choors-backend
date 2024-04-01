import { buildAndServeApi } from "./api/index.js";
import { connectToDb } from "./db/index.js";
import { setupEnv } from "./env/setup-env.js";
import { AccountRepository } from "./repositories/domains/account/AccountRepository.js";
import { GroupRepository } from "./repositories/domains/group/GroupRepository.js";
import { HouseRepository } from "./repositories/domains/house/HouseRepository.js";
import { PersonRepository } from "./repositories/domains/person/PersonRepository.js";
import { PictureRepository } from "./repositories/domains/picture/PictureRepository.js";
import { ScheduleRepository } from "./repositories/domains/schedule/ScheduleRepository.js";
import { TaskRepository } from "./repositories/domains/task/TaskRepository.js";

const main = async () => {
  setupEnv();
  const dbPool = await connectToDb();
  const taskRepository = new TaskRepository(dbPool);
  const accountRepository = new AccountRepository(dbPool);
  const pictureRepository = new PictureRepository();
  const houseRepository = new HouseRepository(dbPool);
  const groupRepository = new GroupRepository(dbPool);
  const personRepository = new PersonRepository(dbPool);
  const scheduleRepository = new ScheduleRepository(dbPool);

  buildAndServeApi(
    taskRepository,
    accountRepository,
    pictureRepository,
    houseRepository,
    groupRepository,
    personRepository,
    scheduleRepository
  );
};

main();
