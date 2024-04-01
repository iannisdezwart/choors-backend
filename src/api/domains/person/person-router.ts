import { Router, json } from "express";
import { IPersonRepository } from "../../../repositories/domains/person/IPersonRepository";
import { jwtPersonAuthenticationMiddleware } from "../../middleware/auth/authenticate-jwt";
import { houseIdParamValidationMiddleware } from "../../middleware/validation/house-id";
import { personIdParamValidationMiddleware } from "../../middleware/validation/person-id";
import { GetPersonDetailsService } from "./services/GetPersonDetailsService";
import { ListPersonsService } from "./services/ListPersonsService";
import { RemovePersonFromHouseService } from "./services/RemovePersonFromHouseService";
import { UpdatePersonGroupsService } from "./services/UpdatePersonGroupsService";

export const personRouter = (personRepository: IPersonRepository): Router => {
  const router = Router();

  const listPersonsService = new ListPersonsService(personRepository);
  const getPersonDetailsService = new GetPersonDetailsService(personRepository);
  const updatePersonGroupsService = new UpdatePersonGroupsService(
    personRepository
  );
  const removePersonFromHouseService= new RemovePersonFromHouseService(personRepository);

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
    jwtPersonAuthenticationMiddleware,
    houseIdParamValidationMiddleware,
    listPersonsService.run.bind(listPersonsService)
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
   * @apiSuccess (Success 200) {Object} body Detailed person info.
   * @apiSuccess (Success 200) {String} body.id The id of the person.
   * @apiSuccess (Success 200) {String} body.name The name of the person.
   * @apiSuccess (Success 200) {String} body.picture The picture of the person.
   * @apiSuccess (Success 200) {Number} body.points The points of the person.
   * @apiSuccess (Success 200) {Number} body.penalties The penalties of the person.
   * @apiSuccess (Success 200) {string[]} body.groups The groups the person is in.
   * @apiSuccess (Success 200) {Object[]} body.schedule The person's schedule.
   * @apiSuccess (Success 200) {String} body.schedule.id The id of the task.
   * @apiSuccess (Success 200) {String} body.schedule.name The name of the task.
   * @apiSuccess (Success 200) {String} body.schedule.dueDate The due date of the task.
   * @apiSuccess (Success 200) {Number} body.schedule.points The points for the task.
   * @apiSuccess (Success 200) {Object[]} body.historicalTasks The person's historical tasks.
   * @apiSuccess (Success 200) {String} body.historicalTasks.id The id of the task.
   * @apiSuccess (Success 200) {String} body.historicalTasks.name The name of the task.
   * @apiSuccess (Success 200) {Number} body.historicalTasks.points The points for the task.
   * @apiSuccess (Success 200) {Number} body.historicalTasks.penalty The penalty for the task.
   * @apiSuccess (Success 200) {String} body.historicalTasks.dueDate The due date of the task.
   * @apiSuccess (Success 200) {Boolean} body.historicalTasks.isPenalised Whether the task is penalised.
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
    jwtPersonAuthenticationMiddleware,
    houseIdParamValidationMiddleware,
    personIdParamValidationMiddleware,
    getPersonDetailsService.run.bind(getPersonDetailsService)
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
   * @apiBody {string[]} body The new groups of the person.
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
    json,
    jwtPersonAuthenticationMiddleware,
    houseIdParamValidationMiddleware,
    personIdParamValidationMiddleware,
    updatePersonGroupsService.run.bind(updatePersonGroupsService)
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
    jwtPersonAuthenticationMiddleware,
    houseIdParamValidationMiddleware,
    personIdParamValidationMiddleware,
    removePersonFromHouseService.run.bind(removePersonFromHouseService)
  );

  return router;
};
