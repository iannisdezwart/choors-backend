export interface IAccountRepository {
  registerPerson(
    username: string,
    password: string
  ): Promise<RegisterPersonResult>;

  verifyPerson(username: string, password: string): Promise<VerifyPersonResult>;

  checkPersonExists(personId: string): Promise<boolean>;

  deleteAccount(
    username: string,
    password: string
  ): Promise<DeleteAccountResult>;

  updateUsername(
    username: string,
    password: string,
    newUsername: string
  ): Promise<UpdateUsernameResult>;

  updatePassword(
    username: string,
    oldPassword: string,
    newPassword: string
  ): Promise<UpdatePasswordResult>;

  updatePicture(
    personId: string,
    pictureHandle: string
  ): Promise<UpdatePictureResult>;
}

export enum RegisterPersonStatus {
  Success,
  UsernameTaken,
  UnknownError,
}

export type PersonRow = {
  id: string;
  picture: string;
  username: string;
};

export type RegisterPersonResult = {
  status: RegisterPersonStatus;
  person?: PersonRow;
};

export enum VerifyPersonStatus {
  Success,
  PersonNotFound,
  IncorrectPassword,
}

export type VerifyPersonResult = {
  status: VerifyPersonStatus;
  person?: PersonRow;
};

export enum DeleteAccountStatus {
  Success,
  PersonNotFound,
  IncorrectPassword,
  UnknownError,
}

export type DeleteAccountResult = {
  status: DeleteAccountStatus;
};

export enum UpdateUsernameStatus {
  Success,
  PersonNotFound,
  IncorrectPassword,
  NewUsernameTaken,
  UnknownError,
}

export type UpdateUsernameResult = {
  status: UpdateUsernameStatus;
};

export enum UpdatePasswordStatus {
  Success,
  PersonNotFound,
  IncorrectPassword,
  UnknownError,
}

export type UpdatePasswordResult = {
  status: UpdatePasswordStatus;
};

export enum UpdatePictureStatus {
  Success,
  PersonNotFound,
  UnknownError,
}

export type UpdatePictureResult = {
  status: UpdatePictureStatus;
};
