import { Pool } from "pg";
import { buildAndServeApi } from "./api";
import { DeleteAccountService } from "./api/domains/account/services/DeleteAccountService";
import { LoginService } from "./api/domains/account/services/LoginService";
import { RegisterService } from "./api/domains/account/services/RegisterService";
import { UpdatePasswordService } from "./api/domains/account/services/UpdatePasswordService";
import { UpdatePictureService } from "./api/domains/account/services/UpdatePictureService";
import { UpdateUsernameService } from "./api/domains/account/services/UpdateUsernameService";
import { ListGroupsService } from "./api/domains/group/services/ListGroupsService";
import { UpdateGroupsService } from "./api/domains/group/services/UpdateGroupsService";
import { CreateHouseService } from "./api/domains/house/services/CreateHouseService";
import { DeleteHouseService } from "./api/domains/house/services/DeleteHouseService";
import { JoinHouseService } from "./api/domains/house/services/JoinHouseService";
import { ListMyHousesService } from "./api/domains/house/services/ListMyHousesService";
import { UpdateHouseNameService } from "./api/domains/house/services/UpdateHouseNameService";
import { GetPersonDetailsService } from "./api/domains/person/services/GetPersonDetailsService";
import { ListPersonsService } from "./api/domains/person/services/ListPersonsService";
import { RemovePersonFromHouseService } from "./api/domains/person/services/RemovePersonFromHouseService";
import { UpdatePersonGroupsService } from "./api/domains/person/services/UpdatePersonGroupsService";
import { GetPictureService } from "./api/domains/picture/services/GetPictureService";
import { ComplainAboutCompletedTaskService } from "./api/domains/schedule/services/ComplainAboutCompletedTaskService";
import { DelegateScheduledTaskService } from "./api/domains/schedule/services/DelegateScheduledTaskService";
import { GetCompletedTaskDetailsService } from "./api/domains/schedule/services/GetCompletedTaskDetailsService";
import { GetScheduleForPersonService } from "./api/domains/schedule/services/GetScheduleForPersonService";
import { GetScheduledTaskDetailsService } from "./api/domains/schedule/services/GetScheduledTaskDetailsService";
import { MarkCompletedTaskUndoneService } from "./api/domains/schedule/services/MarkCompletedTaskUndoneService";
import { MarkScheduledTaskDoneService } from "./api/domains/schedule/services/MarkScheduledTaskDoneService";
import { CreateTaskService } from "./api/domains/task/services/CreateTaskService";
import { DeleteTaskService } from "./api/domains/task/services/DeleteTaskService";
import { GetDetailedTaskService } from "./api/domains/task/services/GetDetailedTaskService";
import { GetTaskListService } from "./api/domains/task/services/GetTaskListService";
import { UpdateTaskService } from "./api/domains/task/services/UpdateTaskService";
import { connectToDb } from "./db";
import { Environment } from "./env/Environment";
import { IEnvironmentProvider } from "./env/IEnvironmentProvider";
import { AccountRepository } from "./repositories/domains/account/AccountRepository";
import { IAccountRepository } from "./repositories/domains/account/IAccountRepository";
import { GroupRepository } from "./repositories/domains/group/GroupRepository";
import { IGroupRepository } from "./repositories/domains/group/IGroupRepository";
import { HouseRepository } from "./repositories/domains/house/HouseRepository";
import { IHouseRepository } from "./repositories/domains/house/IHouseRepository";
import { IPersonRepository } from "./repositories/domains/person/IPersonRepository";
import { PersonRepository } from "./repositories/domains/person/PersonRepository";
import { IPictureRepository } from "./repositories/domains/picture/IPictureRepository";
import { PictureRepository } from "./repositories/domains/picture/PictureRepository";
import { IScheduleRepository } from "./repositories/domains/schedule/IScheduleRepository";
import { ScheduleRepository } from "./repositories/domains/schedule/ScheduleRepository";
import { ITaskRepository } from "./repositories/domains/task/ITaskRepository";
import { TaskRepository } from "./repositories/domains/task/TaskRepository";

export class Repositories {
  readonly taskRepository: ITaskRepository;
  readonly accountRepository: IAccountRepository;
  readonly pictureRepository: IPictureRepository;
  readonly houseRepository: IHouseRepository;
  readonly groupRepository: IGroupRepository;
  readonly personRepository: IPersonRepository;
  readonly scheduleRepository: IScheduleRepository;

  constructor(dbPool: Pool, env: Environment) {
    this.taskRepository = new TaskRepository(dbPool);
    this.accountRepository = new AccountRepository(dbPool);
    this.pictureRepository = new PictureRepository(env);
    this.houseRepository = new HouseRepository(dbPool);
    this.groupRepository = new GroupRepository(dbPool);
    this.personRepository = new PersonRepository(dbPool);
    this.scheduleRepository = new ScheduleRepository(dbPool);
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

  constructor(taskRepository: ITaskRepository) {
    this.createTaskService = new CreateTaskService(taskRepository);
    this.deleteTaskService = new DeleteTaskService(taskRepository);
    this.getDetailedTaskService = new GetDetailedTaskService(taskRepository);
    this.getTaskListService = new GetTaskListService(taskRepository);
    this.updateTaskService = new UpdateTaskService(taskRepository);
  }
}

export class Bootstrap {
  private repositories?: Repositories;
  private accountServices?: AccountServices;
  private groupServices?: GroupServices;
  private houseServices?: HouseServices;
  private personServices?: PersonServices;
  private pictureServices?: PictureServices;
  private scheduleServices?: ScheduleServices;
  private taskServices?: TaskServices;
  private env?: Environment;

  public async init(envProvider: IEnvironmentProvider) {
    this.env = envProvider.getEnvironment();
    const dbPool = await connectToDb(this.env);

    this.repositories = new Repositories(dbPool, this.env);
    this.accountServices = new AccountServices(
      this.repositories.accountRepository!,
      this.repositories.pictureRepository!,
      this.env
    );
    this.groupServices = new GroupServices(this.repositories.groupRepository!);
    this.houseServices = new HouseServices(this.repositories.houseRepository!);
    this.personServices = new PersonServices(
      this.repositories.personRepository!
    );
    this.pictureServices = new PictureServices(
      this.repositories.pictureRepository!
    );
    this.scheduleServices = new ScheduleServices(
      this.repositories.scheduleRepository!
    );
    this.taskServices = new TaskServices(this.repositories.taskRepository!);
  }

  public async run() {
    buildAndServeApi(
      this.env!,
      this.accountServices!,
      this.groupServices!,
      this.houseServices!,
      this.personServices!,
      this.pictureServices!,
      this.scheduleServices!,
      this.taskServices!
    );
  }
}
