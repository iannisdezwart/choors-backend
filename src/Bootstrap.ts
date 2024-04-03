import pg from "pg";
import { DeleteAccountService } from "./api/domains/account/services/DeleteAccountService.js";
import { LoginService } from "./api/domains/account/services/LoginService.js";
import { RegisterService } from "./api/domains/account/services/RegisterService.js";
import { UpdatePasswordService } from "./api/domains/account/services/UpdatePasswordService.js";
import { UpdatePictureService } from "./api/domains/account/services/UpdatePictureService.js";
import { UpdateUsernameService } from "./api/domains/account/services/UpdateUsernameService.js";
import { ListGroupsService } from "./api/domains/group/services/ListGroupsService.js";
import { UpdateGroupsService } from "./api/domains/group/services/UpdateGroupsService.js";
import { CreateHouseService } from "./api/domains/house/services/CreateHouseService.js";
import { DeleteHouseService } from "./api/domains/house/services/DeleteHouseService.js";
import { JoinHouseService } from "./api/domains/house/services/JoinHouseService.js";
import { ListMyHousesService } from "./api/domains/house/services/ListMyHousesService.js";
import { UpdateHouseNameService } from "./api/domains/house/services/UpdateHouseNameService.js";
import { GetPersonDetailsService } from "./api/domains/person/services/GetPersonDetailsService.js";
import { ListPersonsService } from "./api/domains/person/services/ListPersonsService.js";
import { RemovePersonFromHouseService } from "./api/domains/person/services/RemovePersonFromHouseService.js";
import { UpdatePersonGroupsService } from "./api/domains/person/services/UpdatePersonGroupsService.js";
import { GetPictureService } from "./api/domains/picture/services/GetPictureService.js";
import { ComplainAboutCompletedTaskService } from "./api/domains/schedule/services/ComplainAboutCompletedTaskService.js";
import { DelegateScheduledTaskService } from "./api/domains/schedule/services/DelegateScheduledTaskService.js";
import { GetCompletedTaskDetailsService } from "./api/domains/schedule/services/GetCompletedTaskDetailsService.js";
import { GetScheduleForPersonService } from "./api/domains/schedule/services/GetScheduleForPersonService.js";
import { GetScheduledTaskDetailsService } from "./api/domains/schedule/services/GetScheduledTaskDetailsService.js";
import { MarkCompletedTaskUndoneService } from "./api/domains/schedule/services/MarkCompletedTaskUndoneService.js";
import { MarkScheduledTaskDoneService } from "./api/domains/schedule/services/MarkScheduledTaskDoneService.js";
import { CreateTaskService } from "./api/domains/task/services/CreateTaskService.js";
import { DeleteTaskService } from "./api/domains/task/services/DeleteTaskService.js";
import { GetDetailedTaskService } from "./api/domains/task/services/GetDetailedTaskService.js";
import { GetTaskListService } from "./api/domains/task/services/GetTaskListService.js";
import { UpdateTaskService } from "./api/domains/task/services/UpdateTaskService.js";
import { buildAndServeApi } from "./api/index.js";
import { JwtPersonAuthenticationMiddleware } from "./api/middleware/auth/JwtPersonAuthenticationMiddleware.js";
import { HouseIdPathParamValidationMiddleware } from "./api/middleware/validation/HouseIdPathParamValidationMiddleware.js";
import { PasswordBodyFieldValidationMiddleware } from "./api/middleware/validation/PasswordBodyFieldValidationMiddleware.js";
import { PersonIdPathParamValidationMiddleware } from "./api/middleware/validation/PersonIdPathParamValidationMiddleware.js";
import { TaskIdPathParamValidationMiddleware } from "./api/middleware/validation/TaskIdPathParamValidationMiddleware.js";
import { UsernameBodyFieldValidationMiddleware } from "./api/middleware/validation/UsernameBodyFieldValidationMiddleware.js";
import { connectToDb } from "./db/index.js";
import { Environment } from "./env/Environment.js";
import { IEnvironmentProvider } from "./env/IEnvironmentProvider.js";
import { AccountRepository } from "./repositories/domains/account/AccountRepository.js";
import { IAccountRepository } from "./repositories/domains/account/IAccountRepository.js";
import { GroupRepository } from "./repositories/domains/group/GroupRepository.js";
import { IGroupRepository } from "./repositories/domains/group/IGroupRepository.js";
import { HouseRepository } from "./repositories/domains/house/HouseRepository.js";
import { IHouseRepository } from "./repositories/domains/house/IHouseRepository.js";
import { IPersonRepository } from "./repositories/domains/person/IPersonRepository.js";
import { PersonRepository } from "./repositories/domains/person/PersonRepository.js";
import { IPictureRepository } from "./repositories/domains/picture/IPictureRepository.js";
import { PictureRepository } from "./repositories/domains/picture/PictureRepository.js";
import { IScheduleRepository } from "./repositories/domains/schedule/IScheduleRepository.js";
import { ScheduleRepository } from "./repositories/domains/schedule/ScheduleRepository.js";
import { ITaskRepository } from "./repositories/domains/task/ITaskRepository.js";
import { TaskRepository } from "./repositories/domains/task/TaskRepository.js";
import { IScheduler } from "./scheduler/IScheduler.js";
import { Scheduler } from "./scheduler/Scheduler.js";
import { ITimeProvider } from "./utils/time-provider/ITimeProvider.js";

export class Repositories {
  readonly taskRepository: ITaskRepository;
  readonly accountRepository: IAccountRepository;
  readonly pictureRepository: IPictureRepository;
  readonly houseRepository: IHouseRepository;
  readonly groupRepository: IGroupRepository;
  readonly personRepository: IPersonRepository;
  readonly scheduleRepository: IScheduleRepository;

  constructor(dbPool: pg.Pool, env: Environment, timeProvider: ITimeProvider) {
    this.taskRepository = new TaskRepository(dbPool, timeProvider);
    this.accountRepository = new AccountRepository(dbPool);
    this.pictureRepository = new PictureRepository(env);
    this.houseRepository = new HouseRepository(dbPool);
    this.groupRepository = new GroupRepository(dbPool);
    this.personRepository = new PersonRepository(dbPool);
    this.scheduleRepository = new ScheduleRepository(dbPool, timeProvider);
  }
}

export class AccountServices {
  readonly deleteAccountService: DeleteAccountService;
  readonly loginService: LoginService;
  readonly registerService: RegisterService;
  readonly updatePasswordService: UpdatePasswordService;
  readonly updateUsernameService: UpdateUsernameService;
  readonly updatePictureService: UpdatePictureService;

  constructor(
    accountRepository: IAccountRepository,
    pictureRepository: IPictureRepository,
    env: Environment
  ) {
    this.deleteAccountService = new DeleteAccountService(accountRepository);
    this.loginService = new LoginService(accountRepository, env);
    this.registerService = new RegisterService(accountRepository, env);
    this.updatePasswordService = new UpdatePasswordService(accountRepository);
    this.updateUsernameService = new UpdateUsernameService(accountRepository);
    this.updatePictureService = new UpdatePictureService(
      accountRepository,
      pictureRepository,
      env
    );
  }
}

export class GroupServices {
  readonly listGroupsService: ListGroupsService;
  readonly updateGroupsService: UpdateGroupsService;

  constructor(groupRepository: IGroupRepository) {
    this.listGroupsService = new ListGroupsService(groupRepository);
    this.updateGroupsService = new UpdateGroupsService(groupRepository);
  }
}

export class HouseServices {
  readonly createHouseService: CreateHouseService;
  readonly deleteHouseService: DeleteHouseService;
  readonly joinHouseService: JoinHouseService;
  readonly listMyHousesService: ListMyHousesService;
  readonly updateHouseNameService: UpdateHouseNameService;

  constructor(houseRepository: IHouseRepository) {
    this.createHouseService = new CreateHouseService(houseRepository);
    this.deleteHouseService = new DeleteHouseService(houseRepository);
    this.joinHouseService = new JoinHouseService(houseRepository);
    this.listMyHousesService = new ListMyHousesService(houseRepository);
    this.updateHouseNameService = new UpdateHouseNameService(houseRepository);
  }
}

export class PersonServices {
  readonly getPersonDetailsService: GetPersonDetailsService;
  readonly listPersonsService: ListPersonsService;
  readonly removePersonFromHouseService: RemovePersonFromHouseService;
  readonly updatePersonGroupsService: UpdatePersonGroupsService;

  constructor(personRepository: IPersonRepository) {
    this.getPersonDetailsService = new GetPersonDetailsService(
      personRepository
    );
    this.listPersonsService = new ListPersonsService(personRepository);
    this.removePersonFromHouseService = new RemovePersonFromHouseService(
      personRepository
    );
    this.updatePersonGroupsService = new UpdatePersonGroupsService(
      personRepository
    );
  }
}

export class PictureServices {
  readonly getPictureService: GetPictureService;

  constructor(pictureRepository: IPictureRepository) {
    this.getPictureService = new GetPictureService(pictureRepository);
  }
}

export class ScheduleServices {
  readonly complainAboutCompletedTaskService: ComplainAboutCompletedTaskService;
  readonly delegateScheduledTaskService: DelegateScheduledTaskService;
  readonly getCompletedTaskDetailsService: GetCompletedTaskDetailsService;
  readonly getScheduledTaskDetailsService: GetScheduledTaskDetailsService;
  readonly getScheduleForPersonService: GetScheduleForPersonService;
  readonly markCompletedTaskUndoneService: MarkCompletedTaskUndoneService;
  readonly markScheduledTaskDoneService: MarkScheduledTaskDoneService;

  constructor(scheduleRepository: IScheduleRepository) {
    this.complainAboutCompletedTaskService =
      new ComplainAboutCompletedTaskService(scheduleRepository);
    this.delegateScheduledTaskService = new DelegateScheduledTaskService(
      scheduleRepository
    );
    this.getCompletedTaskDetailsService = new GetCompletedTaskDetailsService(
      scheduleRepository
    );
    this.getScheduledTaskDetailsService = new GetScheduledTaskDetailsService(
      scheduleRepository
    );
    this.getScheduleForPersonService = new GetScheduleForPersonService(
      scheduleRepository
    );
    this.markCompletedTaskUndoneService = new MarkCompletedTaskUndoneService(
      scheduleRepository
    );
    this.markScheduledTaskDoneService = new MarkScheduledTaskDoneService(
      scheduleRepository
    );
  }
}

export class TaskServices {
  readonly createTaskService: CreateTaskService;
  readonly deleteTaskService: DeleteTaskService;
  readonly getDetailedTaskService: GetDetailedTaskService;
  readonly getTaskListService: GetTaskListService;
  readonly updateTaskService: UpdateTaskService;

  constructor(taskRepository: ITaskRepository, timeProvider: ITimeProvider) {
    this.createTaskService = new CreateTaskService(
      taskRepository,
      timeProvider
    );
    this.deleteTaskService = new DeleteTaskService(taskRepository);
    this.getDetailedTaskService = new GetDetailedTaskService(taskRepository);
    this.getTaskListService = new GetTaskListService(taskRepository);
    this.updateTaskService = new UpdateTaskService(taskRepository);
  }
}

export class Middleware {
  readonly jwtPersonAuthenticationMiddleware: JwtPersonAuthenticationMiddleware;
  readonly houseIdPathParamValidationMiddleware: HouseIdPathParamValidationMiddleware;
  readonly passwordBodyFieldValidationMiddleware: PasswordBodyFieldValidationMiddleware;
  readonly personIdPathParamValidationMiddleware: PersonIdPathParamValidationMiddleware;
  readonly taskIdPathParamValidationMiddleware: TaskIdPathParamValidationMiddleware;
  readonly usernameBodyFieldValidationMiddleware: UsernameBodyFieldValidationMiddleware;

  constructor(accountRepository: IAccountRepository, env: Environment) {
    this.jwtPersonAuthenticationMiddleware =
      new JwtPersonAuthenticationMiddleware(accountRepository, env);
    this.houseIdPathParamValidationMiddleware =
      new HouseIdPathParamValidationMiddleware();
    this.passwordBodyFieldValidationMiddleware =
      new PasswordBodyFieldValidationMiddleware();
    this.personIdPathParamValidationMiddleware =
      new PersonIdPathParamValidationMiddleware();
    this.taskIdPathParamValidationMiddleware =
      new TaskIdPathParamValidationMiddleware();
    this.usernameBodyFieldValidationMiddleware =
      new UsernameBodyFieldValidationMiddleware();
  }
}

export class Bootstrap {
  private env?: Environment;
  private timeProvider?: ITimeProvider;
  private dbPool?: pg.Pool;
  private repositories?: Repositories;
  private accountServices?: AccountServices;
  private groupServices?: GroupServices;
  private houseServices?: HouseServices;
  private personServices?: PersonServices;
  private pictureServices?: PictureServices;
  private scheduleServices?: ScheduleServices;
  private taskServices?: TaskServices;
  private middleware?: Middleware;
  private scheduler?: IScheduler;
  private server?: ReturnType<typeof buildAndServeApi>;

  public async init(
    envProvider: IEnvironmentProvider,
    timeProvider: ITimeProvider
  ) {
    this.env = envProvider.getEnvironment();
    this.timeProvider = timeProvider;
    this.dbPool = await connectToDb(this.env);
    this.repositories = new Repositories(
      this.dbPool,
      this.env,
      this.timeProvider
    );
    this.accountServices = new AccountServices(
      this.repositories.accountRepository,
      this.repositories.pictureRepository,
      this.env
    );
    this.groupServices = new GroupServices(this.repositories.groupRepository);
    this.houseServices = new HouseServices(this.repositories.houseRepository);
    this.personServices = new PersonServices(
      this.repositories.personRepository
    );
    this.pictureServices = new PictureServices(
      this.repositories.pictureRepository
    );
    this.scheduleServices = new ScheduleServices(
      this.repositories.scheduleRepository
    );
    this.taskServices = new TaskServices(
      this.repositories.taskRepository,
      this.timeProvider
    );
    this.middleware = new Middleware(
      this.repositories.accountRepository,
      this.env
    );
    this.scheduler = new Scheduler(
      this.repositories.taskRepository,
      this.repositories.houseRepository,
      this.repositories.groupRepository,
      this.timeProvider,
      this.env
    );
  }

  public async run() {
    this.server = buildAndServeApi(
      this.env!,
      this.middleware!,
      this.accountServices!,
      this.groupServices!,
      this.houseServices!,
      this.personServices!,
      this.pictureServices!,
      this.scheduleServices!,
      this.taskServices!
    );
    this.scheduler!.start();
  }

  public async shutdown() {
    await new Promise((resolve) => {
      this.server!.close(resolve);
    });
    this.dbPool!.end();
    this.scheduler!.stop();
  }
}
