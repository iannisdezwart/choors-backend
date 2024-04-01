export interface IHouseRepository {
  getHousesForPerson(personId: string): Promise<GetHousesForPersonResult>;

  createHouse(personId: string, name: string): Promise<CreateHouseResult>;

  deleteHouse(personId: string, houseId: string): Promise<DeleteHouseResult>;

  updateHouseName(
    personId: string,
    houseId: string,
    newName: string
  ): Promise<UpdateHouseNameResult>;

  joinHouse(personId: string, inviteCode: string): Promise<JoinHouseResult>;
}

export enum GetHousesForPersonStatus {
  Success,
  PersonNotFound,
}

export type GetHousesForPersonResult = {
  status: GetHousesForPersonStatus;
  houses?: HouseRow[];
};

export type HouseRow = {
  id: number;
  name: string;
  picture: string;
  inviteCode: string;
};

export enum CreateHouseStatus {
  Success,
  PersonNotFound,
}

export type CreateHouseResult = {
  status: CreateHouseStatus;
  house?: HouseRow;
};

export enum DeleteHouseStatus {
  Success,
  PersonNotFound,
  HouseNotFound,
  UnknownError,
}

export type DeleteHouseResult = {
  status: DeleteHouseStatus;
};

export enum UpdateHouseNameStatus {
  Success,
  PersonNotFound,
  HouseNotFound,
}

export type UpdateHouseNameResult = {
  status: UpdateHouseNameStatus;
};

export enum JoinHouseStatus {
  Success,
  PersonNotFound,
  HouseNotFound,
}

export type JoinHouseResult = {
  status: JoinHouseStatus;
};
