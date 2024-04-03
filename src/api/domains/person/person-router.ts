import { Router, json } from "express";
import { Middleware, PersonServices } from "../../../Bootstrap.js";
import { Environment } from "../../../env/Environment.js";

export const personRouter = (
  svc: PersonServices,
  mdw: Middleware,
  env: Environment
): Router => {
  const router = Router();

  /**
   * @api {get} /v1/person/:houseId List all persons in a house.
   * @apiName ListPersons
   * @apiGroup Person
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} Authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   *
   * @apiSuccess (Success 200) {Object[]} body List of persons.
   * @apiSuccess (Success 200) {String} body.id The id of the person.
   * @apiSuccess (Success 200) {String} body.name The name of the person.
   * @apiSuccess (Success 200) {String} body.picture The picture of the person.
   * @apiSuccess (Success 200) {Number} body.points The points of the person.
   * @apiSuccess (Success 200) {Number} body.penalties The penalties of the person.
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
    "/v1/person/:houseId",
    mdw.jwtPersonAuthenticationMiddleware.createHandler(),
    mdw.houseIdPathParamValidationMiddleware.createHandler(),
    svc.listPersonsService.createHandler()
  );

  /**
   * @api {get} /v1/person/:houseId/:personId Get detailed person info by their id.
   * @apiName GetPersonDetails
   * @apiGroup Person
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} Authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} personId The id of the person.
   *
   * @apiSuccess (Success 200) {Object} body
   * @apiSuccess (Success 200) {String} body.person Detailed person info.
   * @apiSuccess (Success 200) {String} body.person.id The id of the person.
   * @apiSuccess (Success 200) {String} body.person.name The name of the person.
   * @apiSuccess (Success 200) {String} body.person.picture The picture of the person.
   * @apiSuccess (Success 200) {Number} body.person.points The points of the person.
   * @apiSuccess (Success 200) {Number} body.person.penalties The penalties of the person.
   * @apiSuccess (Success 200) {string[]} body.person.groups The groups the person is in.
   * @apiSuccess (Success 200) {Object[]} body.person.schedule The person's schedule.
   * @apiSuccess (Success 200) {String} body.person.schedule.id The id of the task.
   * @apiSuccess (Success 200) {String} body.person.schedule.name The name of the task.
   * @apiSuccess (Success 200) {String} body.person.schedule.dueDate The due date of the task.
   * @apiSuccess (Success 200) {Number} body.person.schedule.points The points for the task.
   * @apiSuccess (Success 200) {Object[]} body.person.historicalTasks The person's historical tasks.
   * @apiSuccess (Success 200) {String} body.person.historicalTasks.id The id of the task.
   * @apiSuccess (Success 200) {String} body.person.historicalTasks.name The name of the task.
   * @apiSuccess (Success 200) {Number} body.person.historicalTasks.points The points for the task.
   * @apiSuccess (Success 200) {Number} body.person.historicalTasks.penalty The penalty for the task.
   * @apiSuccess (Success 200) {String} body.person.historicalTasks.dueDate The due date of the task.
   * @apiSuccess (Success 200) {Boolean} body.person.historicalTasks.isPenalised Whether the task is penalised.
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 403) {Object} body Person (either the one checked, or the one requesting) is not in the house.
   * @apiError (Error 403) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body House or person not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.get(
    "/v1/person/:houseId/:personId",
    mdw.jwtPersonAuthenticationMiddleware.createHandler(),
    mdw.houseIdPathParamValidationMiddleware.createHandler(),
    mdw.personIdPathParamValidationMiddleware.createHandler(),
    svc.getPersonDetailsService.createHandler()
  );

  /**
   * @api {patch} /v1/person/:houseId/:personId/groups Update the groups of a person.
   * @apiName UpdatePersonGroups
   * @apiGroup Person
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} Authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} personId The id of the person.
   *
   * @apiBody {Object} body
   * @apiBody {string[]} body.groupIds The new groups ids of the person.
   *
   * @apiSuccess (Success 204) body
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 403) {Object} body Person (either the one updated, or the one requesting) is not in the house.
   * @apiError (Error 403) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body House or person not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.patch(
    "/v1/person/:houseId/:personId/groups",
    json(),
    mdw.jwtPersonAuthenticationMiddleware.createHandler(),
    mdw.houseIdPathParamValidationMiddleware.createHandler(),
    mdw.personIdPathParamValidationMiddleware.createHandler(),
    svc.updatePersonGroupsService.createHandler()
  );

  /**
   * @api {delete} /v1/person/:houseId/:personId Remove a person from a house.
   * @apiName RemovePerson
   * @apiGroup Person
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} Authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} personId The id of the person.
   *
   * @apiSuccess (Success 204) body
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 403) {Object} body Person (either the one removed, or the one requesting) is not in the house.
   * @apiError (Error 403) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body House or person not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.delete(
    "/v1/person/:houseId/:personId",
    mdw.jwtPersonAuthenticationMiddleware.createHandler(),
    mdw.houseIdPathParamValidationMiddleware.createHandler(),
    mdw.personIdPathParamValidationMiddleware.createHandler(),
    svc.removePersonFromHouseService.createHandler()
  );

  return router;
};
