import {
  BriefCompletedTaskEntry,
  BriefScheduledTaskEntry,
} from "../../common/types";

export interface IScheduleRepository {
  getScheduleForPerson(
    reqPersonId: string,
    houseId: string,
    personId: string
  ): Promise<GetScheduleForPersonResult>;

  getScheduledTaskDetails(
    reqPersonId: string,
    houseId: string,
    taskId: string
  ): Promise<GetScheduledTaskDetailsResult>;

  getCompletedTaskDetails(
    reqPersonId: string,
    houseId: string,
    taskId: string
  ): Promise<GetCompletedTaskDetailsResult>;

  markScheduledTaskDone(
    reqPersonId: string,
    houseId: string,
    taskId: string
  ): Promise<MarkScheduledTaskDoneResult>;

  markCompletedTaskUndone(
    reqPersonId: string,
    houseId: string,
    taskId: string
  ): Promise<MarkCompletedTaskUndoneResult>;

  delegateScheduledTask(
    reqPersonId: string,
    houseId: string,
    taskId: string,
    personId: string
  ): Promise<DelegateScheduledTaskResult>;

  complainAboutCompletedTask(
    reqPersonId: string,
    houseId: string,
    taskId: string,
    message: string
  ): Promise<ComplainAboutTaskResult>;
}

export type GetScheduleForPersonResult = {
  status: GetScheduleForPersonStatus;
  schedule?: BriefScheduledTaskEntry[];
  history?: BriefCompletedTaskEntry[];
};

export enum GetScheduleForPersonStatus {
  Success,
  PersonNotFound,
  ReqPersonNotInHouse,
  PersonNotInHouse,
  HouseNotFound,
}

export type GetScheduledTaskDetailsResult = {
  status: GetScheduledTaskDetailsStatus;
  task?: DetailedScheduledTask;
};

export type DetailedScheduledTask = BriefScheduledTaskEntry & {
  responsiblePerson: string;
  description: string;
};

export enum GetScheduledTaskDetailsStatus {
  Success,
  ReqPersonNotInHouse,
  TaskNotFound,
  HouseNotFound,
}

export type GetCompletedTaskDetailsResult = {
  status: GetCompletedTaskDetailsStatus;
  task?: DetailedCompletedTask;
};

export type DetailedCompletedTask = BriefCompletedTaskEntry & {
  responsiblePerson: string;
  description: string;
};

export enum GetCompletedTaskDetailsStatus {
  Success,
  ReqPersonNotInHouse,
  TaskNotFound,
  HouseNotFound,
}

export type MarkScheduledTaskDoneResult = {
  status: MarkScheduledTaskDoneStatus;
};

export enum MarkScheduledTaskDoneStatus {
  Success,
  TaskNotFound,
  HouseNotFound,
  ReqPersonNotInHouse,
  UnknownError,
}

export type MarkCompletedTaskUndoneResult = {
  status: MarkCompletedTaskUndoneStatus;
};

export enum MarkCompletedTaskUndoneStatus {
  Success,
  TaskNotFound,
  HouseNotFound,
  ReqPersonNotInHouse,
  UnknownError,
}

export type DelegateScheduledTaskResult = {
  status: DelegateScheduledTaskStatus;
};

export enum DelegateScheduledTaskStatus {
  Success,
  TaskNotFound,
  HouseNotFound,
  PersonNotFound,
  ReqPersonNotInHouse,
}

export type ComplainAboutTaskResult = {
  status: ComplainAboutTaskStatus;
};

export enum ComplainAboutTaskStatus {
  Success,
  TaskNotFound,
  HouseNotFound,
  ReqPersonNotInHouse,
}
