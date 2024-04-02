export interface ITaskRepository {
  getTasksForHouse(
    personId: string,
    houseId: string
  ): Promise<GetTasksForHouseResult>;

  createTask(
    personId: string,
    houseId: string,
    task: TaskRequest
  ): Promise<CreateTaskResult>;

  getDetailedTask(
    personId: string,
    houseId: string,
    taskId: string
  ): Promise<GetDetailedTaskResult>;

  updateTask(
    personId: string,
    houseId: string,
    taskId: string,
    task: Partial<TaskRequest>
  ): Promise<UpdateTaskResult>;

  deleteTask(
    personId: string,
    houseId: string,
    taskId: string
  ): Promise<DeleteTaskResult>;

  getTasksToBeScheduled(
    currentTime: Date
  ): Promise<GetTasksToBeScheduledResult>;

  getOverdueScheduledTasks(
    currentTime: Date
  ): Promise<GetOverdueScheduledTasksResult>;

  penaliseOverdueScheduledTask(
    scheduledTaskId: string
  ): Promise<PenaliseOverdueScheduledTaskResult>;

  updateNextSchedulerDateForTask(
    taskId: string,
    nextSchedulerDate: Date
  ): Promise<UpdateNextSchedulerDateForTaskResult>;
}

export type GetTasksForHouseResult = {
  status: GetTasksForHouseStatus;
  tasks?: ShortTaskResult[];
};

export enum GetTasksForHouseStatus {
  Success,
  PersonNotFound,
  PersonNotInHouse,
  HouseNotFound,
}

export type ShortTaskResult = {
  id: string;
  name: string;
  freqBase: Date;
  freqOffset: number;
  timeLimit: number;
  scheduleOffset: number;
  points: number;
  responsibleTaskGroup: string;
};

export type CreateTaskResult = {
  status: CreateTaskStatus;
};

export enum CreateTaskStatus {
  Success,
  HouseNotFound,
  PersonNotInHouse,
  ResponsibleGroupNotFound,
}

export type TaskRequest = {
  name: string;
  description: string;
  freqBase: Date;
  freqOffset: number;
  timeLimit: number;
  scheduleOffset: number;
  points: number;
  penalty: number;
  responsibleTaskGroup: string;
};

export type GetDetailedTaskResult = {
  status: GetDetailedTaskStatus;
  task?: DetailedTask;
};

export enum GetDetailedTaskStatus {
  Success,
  HouseNotFound,
  PersonNotInHouse,
  TaskNotFound,
}

export type DetailedTask = {
  id: string;
  name: string;
  description: string;
  freqBase: Date;
  freqOffset: number;
  timeLimit: number;
  scheduleOffset: number;
  points: number;
  penalty: number;
  responsibleTaskGroup: string;
};

export type UpdateTaskResult = {
  status: UpdateTaskStatus;
};

export enum UpdateTaskStatus {
  Success,
  HouseNotFound,
  PersonNotInHouse,
  TaskNotFound,
  ResponsibleGroupNotFound,
}

export type DeleteTaskResult = {
  status: DeleteTaskStatus;
};

export enum DeleteTaskStatus {
  Success,
  HouseNotFound,
  PersonNotInHouse,
  TaskNotFound,
}

export type GetTasksToBeScheduledResult = {
  status: GetTasksToBeScheduledStatus;
  tasks?: TaskToBeScheduled[];
};

export enum GetTasksToBeScheduledStatus {
  Success,
}

export type TaskToBeScheduled = {
  id: string;
  houseId: string;
  freqBase: Date;
  freqOffset: number;
  timeLimit: number;
  scheduleOffset: number;
  points: number;
  responsibleTaskGroupId: string;
  nextSchedulerDate: string;
};

export type GetOverdueScheduledTasksResult = {
  status: GetOverdueScheduledTasksStatus;
  tasks?: OverdueScheduledTask[];
};

export enum GetOverdueScheduledTasksStatus {
  Success,
}

export type OverdueScheduledTask = {
  id: string;
  taskId: string;
  responsiblePersonId: string;
  startDate: Date;
  dueDate: Date;
};

export type PenaliseOverdueScheduledTaskResult = {
  status: PenaliseOverdueScheduledTaskStatus;
};

export enum PenaliseOverdueScheduledTaskStatus {
  Success,
  TaskNotFound,
  UnknownError
}

export type UpdateNextSchedulerDateForTaskResult = {
  status: UpdateNextSchedulerDateForTaskStatus;
};

export enum UpdateNextSchedulerDateForTaskStatus {
  Success,
  TaskNotFound,
}
