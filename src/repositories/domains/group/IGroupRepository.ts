export interface IGroupRepository {
  listGroups(personId: string, houseId: string): Promise<ListGroupsResult>;

  updateGroups(
    personId: string,
    houseId: string,
    addedGroups?: string[],
    deletedGroupIds?: string[],
    renamedGroups?: Group[]
  ): Promise<UpdateGroupsResult>;

  personsInTaskGroup(taskGroupId: string): Promise<PersonsInTaskGroupResult>;
}

export type Group = {
  name: string;
  id: string;
};

export type ListGroupsResult = {
  status: ListGroupsStatus;
  groups?: Group[];
};

export enum ListGroupsStatus {
  Success,
  PersonNotFound,
  PersonNotInHouse,
  HouseNotFound,
}

export type UpdateGroupsResult = {
  status: UpdateGroupsStatus;
};

export enum UpdateGroupsStatus {
  Success,
  PersonNotFound,
  PersonNotInHouse,
  HouseNotFound,
  GroupNotFound,
  TaskStillWithGroup,
  PersonStillInGroup,
}

export type PersonsInTaskGroupResult = {
  status: PersonsInTaskGroupStatus;
  personsInGroup?: string[];
};

export enum PersonsInTaskGroupStatus {
  Success,
}
