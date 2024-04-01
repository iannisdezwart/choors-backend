import { IAccountRepository } from "./domains/account/IAccountRepository";

export const makeAccountRepositoryMock = (): jest.Mocked<IAccountRepository> => ({
  registerPerson: jest.fn(),
  deleteAccount: jest.fn(),
  updateUsername: jest.fn(),
  updatePassword: jest.fn(),
  updatePicture: jest.fn(),
  verifyPerson: jest.fn(),
});
