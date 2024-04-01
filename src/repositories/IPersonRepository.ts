export interface IPersonRepository {
  listPersons(personId: string, houseId: string): Promise<ListPersonsResult>;

  getPersonDetails(
    reqPersonId: string,
    houseId: string,
    personId: string
  ): Promise<GetPersonDetailsResult>;

  updatePersonGroups(
    reqPersonId: string,
    houseId: string,
    personId: string,
    groupIds: string[]
  ): Promise<UpdatePersonGroupsResult>;

  removePersonFromHouse(
    reqPersonId: string,
    houseId: string,
    personId: string
  ): Promise<RemovePersonFromHouseResult>;
}

export type ListPersonsResult = {
  status: ListPersonsStatus;
  persons?: BriefPerson[];
  inviteCode?: string;
};

export type BriefPerson = {
  name: string;
  id: string;
  picture: string;
  points: number;
  penalties: number;
};

export enum ListPersonsStatus {
  Success,
  PersonNotFound,
  PersonNotInHouse,
  HouseNotFound,
}

export type GetPersonDetailsResult = {
  status: GetPersonDetailsStatus;
  person?: DetailedPerson;
};

export type DetailedPerson = BriefPerson & {
  groups: string[];
  schedule: BriefScheduleEntry[];
  historicalTasks: BriefHistoricalTaskEntry[];
};

export type BriefScheduleEntry = {
  id: string;
  name: string;
  dueDate: Date;
  points: number;
};

export type BriefHistoricalTaskEntry = {
  id: string;
  name: string;
  points: number;
  penalty: number;
  dueDate: Date;
  isPenalised: boolean;
};

export enum GetPersonDetailsStatus {
  Success,
  ReqPersonNotFound,
  PersonNotFound,
  ReqPersonNotInHouse,
  PersonNotInHouse,
  HouseNotFound,
}

export type UpdatePersonGroupsResult = {
  status: UpdatePersonGroupsStatus;
};

export enum UpdatePersonGroupsStatus {
  Success,
  ReqPersonNotFound,
  PersonNotFound,
  ReqPersonNotInHouse,
  PersonNotInHouse,
  HouseNotFound,
  GroupNotFound,
}

export type RemovePersonFromHouseResult = {
  status: RemovePersonFromHouseStatus;
};

export enum RemovePersonFromHouseStatus {
  Success,
  ReqPersonNotFound,
  PersonNotFound,
  ReqPersonNotInHouse,
  PersonNotInHouse,
  HouseNotFound,
}
