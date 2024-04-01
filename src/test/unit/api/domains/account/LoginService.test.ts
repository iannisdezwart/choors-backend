import { Request, Response } from "express";
import { LoginService } from "../../../../../api/domains/account/services/LoginService.js";
import { Environment } from "../../../../../env/Environment.js";
import {
  VerifyPersonResult,
  VerifyPersonStatus,
} from "../../../../../repositories/domains/account/IAccountRepository.js";
import { makeAccountRepositoryMock } from "../../../repositories/AccountRepositoryMock.js";

test("happy path", async () => {
  const mockedAccountRepository = makeAccountRepositoryMock();
  mockedAccountRepository.verifyPerson.mockResolvedValue({
    status: VerifyPersonStatus.Success,
    person: {
      id: "1",
      username: "name",
      pwd_hash: "hash(pwd)",
      picture: "pic",
    },
  } as VerifyPersonResult);

  const mockEnv = {} as Environment;
  const loginService = new LoginService(mockedAccountRepository, mockEnv);

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

  await loginService.run(request, mockedResponse);

  expect(mockedResponse.status).toHaveBeenCalledWith(200);
  expect(mockedResponse.send).toHaveBeenCalledWith({
    token: expect.any(String),
  });
});
