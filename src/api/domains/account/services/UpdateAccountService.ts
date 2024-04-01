import { Request, Response } from "express";
import { AccountRepository } from "../../../../repositories/AccountRepository";

export class UpdateAccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async updateAccount(request: Request, response: Response) {
    
  }
}
