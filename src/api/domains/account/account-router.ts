import { Router, json } from "express";
import { IAccountRepository } from "../../../repositories/domains/account/IAccountRepository";
import { IPictureRepository } from "../../../repositories/domains/picture/IPictureRepository";
import { jwtPersonAuthenticationMiddleware } from "../../middleware/auth/authenticate-jwt";
import { passwordBodyValidationMiddleware } from "../../middleware/validation/password-body";
import { usernameBodyValidationMiddleware } from "../../middleware/validation/username-body";
import { DeleteAccountService } from "./services/DeleteAccountService";
import { LoginService } from "./services/LoginService";
import { RegisterService } from "./services/RegisterService";
import { UpdatePasswordService } from "./services/UpdatePasswordService";
import { UpdatePictureService } from "./services/UpdatePictureService";
import { UpdateUsernameService } from "./services/UpdateUsernameService";

export const accountRouter = (
  accountRepository: IAccountRepository,
  pictureRepository: IPictureRepository
) => {
  const router = Router();

  const registerService = new RegisterService(accountRepository);
  const loginService = new LoginService(accountRepository);
  const deleteAccountService = new DeleteAccountService(accountRepository);
  const updateUsernameService = new UpdateUsernameService(accountRepository);
  const updatePasswordService = new UpdatePasswordService(accountRepository);
  const updatePictureService = new UpdatePictureService(
    accountRepository,
    pictureRepository
  );

  /**
   * @api {post} /v1/account Register a new account.
   * @apiName RegisterAccount
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiBody {Object} body
   * @apiBody {String} body.username The username of the account.
   * @apiBody {String} body.password The password of the account.
   *
   * @apiSuccess (Success 201) {Object} body
   * @apiSuccess (Success 201) {String} body.token JWT token to authenticate the user.
   * @apiSuccess (Success 201) {String} body.username The username of the account.
   * @apiSuccess (Success 201) {String} body.picture The handle of the profile picture.
   * @apiSuccess (Success 201) {String} body.personId The personId of the account.
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 409) {Object} body Username is already taken.
   * @apiError (Error 409) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} error Error message.
   */
  router.post(
    "/v1/account",
    json,
    usernameBodyValidationMiddleware,
    passwordBodyValidationMiddleware,
    registerService.run.bind(registerService)
  );

  /**
   * @api {post} /v1/account/login Login to an account.
   * @apiName LoginAccount
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiBody {Object} body
   * @apiBody {String} body.username The username of the account.
   * @apiBody {String} body.password The password of the account.
   *
   * @apiSuccess (Success 200) {Object} body
   * @apiSuccess (Success 200) {String} body.token JWT token to authenticate the user.
   * @apiSuccess (Success 200) {String} body.username The username of the account.
   * @apiSuccess (Success 200) {String} body.picture The handle of the profile picture.
   * @apiSuccess (Success 200) {String} body.personId The personId of the account.
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 401) {Object} body Incorrect password.
   * @apiError (Error 401) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body User does not exist.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Erorr 500) {Object} body Internal server error.
   * @apiError (Erorr 500) {String} body.error Error message.
   */
  router.post(
    "/v1/account/:personId",
    json,
    usernameBodyValidationMiddleware,
    passwordBodyValidationMiddleware,
    loginService.run.bind(loginService)
  );

  /**
   * @api {delete} /v1/account Delete an account.
   * @apiName DeleteAccount
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiBody {Object} body
   * @apiBody {String} body.username The username of the account.
   * @apiBody {String} body.password The password of the account.
   *
   * @apiSuccess (Success 204) body
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 401) {Object} body Incorrect password.
   * @apiError (Error 401) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body User does not exist.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.delete(
    "/v1/account/:personId",
    json,
    usernameBodyValidationMiddleware,
    passwordBodyValidationMiddleware,
    deleteAccountService.run.bind(deleteAccountService)
  );

  /**
   * @api {patch} /v1/account/username Update username of an account. Requires password.
   * @apiName UpdateUsername
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiBody {Object} body
   * @apiBody {String} body.username The old username of the account.
   * @apiBody {String} body.password The password of the account.
   * @apiBody {String} body.newUsername The new username of the account.
   *
   * @apiSuccess (Success 204) body
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 401) {Object} body Incorrect password.
   * @apiError (Error 401) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body User does not exist.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 409) {Object} body New username is already taken.
   * @apiError (Error 409) {String} body.error Error message.
   *
   * @apiError (Error 500) {String} error Internal server error.
   */
  router.patch(
    "/v1/account/username",
    json,
    usernameBodyValidationMiddleware,
    passwordBodyValidationMiddleware,
    updateUsernameService.run.bind(updateUsernameService)
  );

  /**
   * @api {patch} /v1/account/password Update password of an account. Requires old password.
   * @apiName UpdatePassword
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiBody {Object} body
   * @apiBody {String} body.username The username of the account.
   * @apiBody {String} body.password The old password of the account.
   * @apiBody {String} body.newPassword The new password of the account.
   *
   * @apiSuccess (Success 204) body
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 401) {Object} body Incorrect old password.
   * @apiError (Error 401) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body User does not exist.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.patch(
    "/v1/account/password",
    json,
    usernameBodyValidationMiddleware,
    passwordBodyValidationMiddleware,
    updatePasswordService.run.bind(updatePasswordService)
  );

  /**
   * @api {patch} /v1/account/picture Update picture of the account that is signed in.
   * @apiName UpdatePicture
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   * @apiHeader {String="image/jpeg","image/png","image/webp"} Content-Type The mime type of the picture.
   * @apiHeader {String {0-256kB}} [Content-Length] The file size of the picture.
   *
   * @apiBody {binary} body The picture data.
   *
   * @apiSuccess (Success 204) body
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 401) {Object} body Incorrect password.
   * @apiError (Error 401) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body User does not exist.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.patch(
    "/v1/account/picture",
    jwtPersonAuthenticationMiddleware,
    updatePictureService.run.bind(updatePictureService)
  );

  return router;
};
