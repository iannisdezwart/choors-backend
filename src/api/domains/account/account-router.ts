import { Router } from "express";
import {
  IAccountRepository
} from "../../../repositories/AccountRepository";
import { DeleteAccountService } from "./services/DeleteAccountService";
import { LoginService } from "./services/LoginService";
import { RegisterService } from "./services/RegisterService";
import { UpdateAccountService } from "./services/UpdateAccountService";

export const accountRouter = (accountRepository: IAccountRepository) => {
  const router = Router();
  const registerService = new RegisterService(accountRepository);
  const loginService = new LoginService(accountRepository);
  const deleteAccountService = new DeleteAccountService(accountRepository);
  const updateAccountService = new UpdateAccountService(accountRepository);

  /**
   * @api {post} /v1/account Register a new account.
   * @apiName RegisterAccount
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiBody {String} username The username of the account.
   * @apiBody {String} password The password of the account.
   *
   * @apiSuccess (Success 201) {Object} body
   * @apiSuccess (Success 201) {String} body.token JWT token to authenticate the user.
   *
   * @apiError (Error 400) {String} error Error due to missing or invalid fields.
   *
   * @apiError (Error 409) {String} error Username is already taken.
   *
   * @apiError (Error 500) {String} error Internal server error.
   */
  router.post(
    "/v1/account",
    registerService.registerPerson.bind(registerService)
  );

  /**
   * @api {post} /v1/account/:username Login to an account.
   * @apiName LoginAccount
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiParam {String} username The username of the account.
   * @apiBody {String} password The password of the account.
   *
   * @apiSuccess (Success 200) {Object} body
   * @apiSuccess (Success 200) {String} body.token JWT token to authenticate the user.
   *
   * @apiError (Error 400) {String} error Error due to missing or invalid fields.
   *
   * @apiError (Error 401) {String} error Incorrect password.
   *
   * @apiError (Error 404) {String} error User does not exist.
   *
   * @apiError (Erorr 500) {String} error Internal server error.
   */
  router.post("/v1/account/:username", loginService.login.bind(loginService));

  /**
   * @api {delete} /v1/account/:username Delete an account.
   * @apiName DeleteAccount
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiParam {String} username The username of the account.
   * @apiBody {String} password The password of the account.
   *
   * @apiSuccess (Success 204) {void} void
   *
   * @apiError (Error 400) {String} error Error due to missing or invalid fields.
   *
   * @apiError (Error 401) {String} error Incorrect password.
   *
   * @apiError (Error 404) {String} error User does not exist.
   *
   * @apiError (Error 500) {String} error Internal server error.
   */
  router.delete(
    "/v1/account/:username",
    deleteAccountService.deleteAccount.bind(deleteAccountService)
  );

  /**
   * @api {patch} /v1/account/:username Update account details.
   * @apiName UpdateAccount
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiParam {String} username The username of the account.
   * @apiBody {String} password The password of the account.
   *
   * @apiSuccess (Success 204) {void} void
   *
   * @apiError (Error 400) {String} error Error due to missing or invalid fields.
   *
   * @apiError (Error 401) {String} error Incorrect password.
   *
   * @apiError (Error 404) {String} error User does not exist.
   *
   * @apiError (Error 500) {String} error Internal server error.
   */
  router.patch(
    "/v1/account/:username",
    updateAccountService.updateAccount.bind(updateAccountService)
  );

  return router;
};
