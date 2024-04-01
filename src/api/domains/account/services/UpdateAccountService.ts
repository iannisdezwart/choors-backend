import { Request, Response } from "express";
import {
  IAccountRepository
} from "../../../../repositories/AccountRepository";

export class UpdateAccountService {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async updateAccount(request: Request, response: Response) {}
}
