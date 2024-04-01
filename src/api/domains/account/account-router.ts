import { Router, json } from "express";
import { AccountServices } from "../../../Bootstrap.js";
import { Environment } from "../../../env/Environment.js";
import { createJwtPersonAuthenticationMiddleware } from "../../middleware/auth/authenticate-jwt.js";
import { passwordBodyValidationMiddleware } from "../../middleware/validation/password-body.js";
import { usernameBodyValidationMiddleware } from "../../middleware/validation/username-body.js";

export const accountRouter = (svc: AccountServices, env: Environment) => {
  const router = Router();

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
    json(),
    usernameBodyValidationMiddleware,
    passwordBodyValidationMiddleware,
    svc.registerService.createHandler()
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
    json(),
    usernameBodyValidationMiddleware,
    passwordBodyValidationMiddleware,
    svc.loginService.createHandler()
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
    json(),
    usernameBodyValidationMiddleware,
    passwordBodyValidationMiddleware,
    svc.deleteAccountService.createHandler()
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
    json(),
    usernameBodyValidationMiddleware,
    passwordBodyValidationMiddleware,
    svc.updateUsernameService.createHandler()
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
    json(),
    usernameBodyValidationMiddleware,
    passwordBodyValidationMiddleware,
    svc.updatePasswordService.createHandler()
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
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    svc.updatePictureService.createHandler()
  );

  return router;
};
