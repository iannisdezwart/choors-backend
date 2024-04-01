import { Request, Response } from "express";
import { LoginService } from "../../../../src/api/domains/account/services/LoginService.js";
import { makeAccountRepositoryMock } from "../../../repositories/AccountRepositoryMock.js";
import {
  VerifyPersonResult,
  VerifyPersonStatus
} from "../../../repositories/domains/account/IAccountRepository.js";

beforeAll(() => {
  process.env.JWT_SECRET = "secret";
});

test("happy path", async () => {
  const mockedAccountRepository = makeAccountRepositoryMock();
  mockedAccountRepository.verifyPerson.mockResolvedValue({
    status: VerifyPersonStatus.Success,
    person: {
      id: 1,
      username: "name",
      pwd_hash: "hash(pwd)",
      picture: "pic",
    },
  } as VerifyPersonResult);

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
