import { Router } from "express";
import { IGroupRepository } from "../../../repositories/IGroupRepository";
import { jwtPersonAuthenticationMiddleware } from "../../middleware/auth/authenticate-jwt";
import { houseIdParamValidationMiddleware } from "../../middleware/validation/house-id";
import { ListGroupsService } from "./services/ListGroupsService";
import { UpdateGroupsService } from "./services/UpdateGroupsService";

export const groupRouter = (groupRepository: IGroupRepository): Router => {
  const router = Router();

  const listGroupsService = new ListGroupsService(groupRepository);
  const updateGroupsService = new UpdateGroupsService(groupRepository);

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
    jwtPersonAuthenticationMiddleware,
    houseIdParamValidationMiddleware,
    listGroupsService.run.bind(listGroupsService)
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
    jwtPersonAuthenticationMiddleware,
    houseIdParamValidationMiddleware,
    updateGroupsService.run.bind(updateGroupsService)
  );

  return router;
};
