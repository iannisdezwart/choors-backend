import { Router, json } from "express";
import { GroupServices } from "../../../Bootstrap";
import { Environment } from "../../../env/Environment";
import { createJwtPersonAuthenticationMiddleware } from "../../middleware/auth/authenticate-jwt";
import { houseIdParamValidationMiddleware } from "../../middleware/validation/house-id";

export const groupRouter = (svc: GroupServices, env: Environment): Router => {
  const router = Router();

  /**
   * @api {get} /v1/group/:houseId List all groups in a house.
   * @apiName ListGroups
   * @apiGroup Group
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} Authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   *
   * @apiSuccess (Success 200) {Object[]} body List of groups.
   * @apiSuccess (Success 200) {String} body.id The id of the group.
   * @apiSuccess (Success 200) {String} body.name The name of the group.
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 403) {Object} body Person is not in the house.
   * @apiError (Error 403) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body House not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.get(
    "/v1/group",
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    houseIdParamValidationMiddleware,
    svc.listGroupsService.createHandler()
  );

  /**
   * @api {patch} /v1/group/:houseId Update groups in a house.
   * @apiName UpdateGroups
   * @apiGroup Group
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} Authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   *
   * @apiBody {Object} body
   * @apiBody {String[]} body.addedGroups The names of groups added.
   * @apiBody {String[]} body.removedGroupIds The ids of groups removed.
   * @apiBody {Object[]} body.updatedGroups Groups updated.
   * @apiBody {String} body.updatedGroups.id The id of the group.
   * @apiBody {String} body.updatedGroups.name The new name of the group.
   *
   * @apiSuccess (Success 204) body
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 403) {Object} body Person is not in the house.
   * @apiError (Error 403) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body House not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body Group not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 409) {Object} body Task still with group or person still in group.
   * @apiError (Error 409) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.patch(
    "/v1/group",
    json,
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    houseIdParamValidationMiddleware,
    svc.updateGroupsService.createHandler()
  );

  return router;
};
