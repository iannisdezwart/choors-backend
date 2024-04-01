import { Request, Response } from "express";
import {
  IAccountRepository,
  VerifyPersonResult,
  VerifyPersonStatus,
} from "../../../../repositories/AccountRepository.js";
import { LoginService } from "./LoginService.js";

beforeAll(() => {
  process.env.JWT_SECRET = "secret";
});

test("happy path", async () => {
  const mockedAccountRepository: jest.Mocked<IAccountRepository> = {
    registerPerson: jest.fn(),
    deleteAccount: jest.fn(),
    verifyPerson: jest.fn().mockResolvedValue({
      status: VerifyPersonStatus.Success,
      person: {
        id: 1,
        username: "name",
        pwd_hash: "hash(pwd)",
        picture: "pic",
      },
    } as VerifyPersonResult),
  };

  const loginService = new LoginService(mockedAccountRepository);

  const mockedResponse = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as any as jest.Mocked<Response>;

  const request = {
    params: {
      username: "name",
    },
    body: {
      password: "pwd",
    },
  } as any as Request;

  await loginService.login(request, mockedResponse);

  expect(mockedResponse.status).toHaveBeenCalledWith(200);
  expect(mockedResponse.send).toHaveBeenCalledWith({
    token: expect.any(String),
  });
});
