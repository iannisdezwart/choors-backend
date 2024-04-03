import { Router, json } from "express";
import { GroupServices, Middleware } from "../../../Bootstrap.js";
import { Environment } from "../../../env/Environment.js";

export const groupRouter = (
  svc: GroupServices,
  mdw: Middleware,
  env: Environment
): Router => {
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
   * @apiSuccess (Success 200) {Object} body
   * @apiSuccess (Success 200) {Object[]} body.groups List of groups.
   * @apiSuccess (Success 200) {String} body.groups.id The id of the group.
   * @apiSuccess (Success 200) {String} body.groups.name The name of the group.
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
    "/v1/group/:houseId",
    mdw.jwtPersonAuthenticationMiddleware.createHandler(),
    mdw.houseIdPathParamValidationMiddleware.createHandler(),
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
   * @apiBody {String[]} body.deletedGroupIds The ids of groups deleted.
   * @apiBody {Object[]} body.renamedGroups Groups renamed.
   * @apiBody {String} body.renamedGroups.id The id of the group.
   * @apiBody {String} body.renamedGroups.name The new name of the group.
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
    "/v1/group/:houseId",
    json(),
    mdw.jwtPersonAuthenticationMiddleware.createHandler(),
    mdw.houseIdPathParamValidationMiddleware.createHandler(),
    svc.updateGroupsService.createHandler()
  );

  return router;
};
