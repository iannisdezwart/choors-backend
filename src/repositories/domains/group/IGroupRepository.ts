export interface IGroupRepository {
  listGroups(personId: string, houseId: string): Promise<ListGroupsResult>;

  updateGroups(
    personId: string,
    houseId: string,
    addedGroups?: string[],
    deletedGroupIds?: string[],
    renamedGroups?: Group[]
  ): Promise<UpdateGroupsResult>;
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
