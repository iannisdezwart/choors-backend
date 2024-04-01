import { Router, json } from "express";
import { ScheduleServices } from "../../../Bootstrap.js";
import { Environment } from "../../../env/Environment.js";
import { createJwtPersonAuthenticationMiddleware } from "../../middleware/auth/authenticate-jwt.js";
import { houseIdParamValidationMiddleware } from "../../middleware/validation/house-id.js";
import { personIdParamValidationMiddleware } from "../../middleware/validation/person-id.js";

export const scheduleRouter = (svc: ScheduleServices, env: Environment): Router => {
  const router = Router();

  /**
   * @api {get} /v1/schedule/:houseId/for-person/:personId Get schedule for a person.
   * @apiName GetScheduleForPerson
   * @apiGroup Schedule
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} personId The id of the person.
   *
   * @apiSuccess (Success 200) {Object} body
   * @apiSuccess (Success 200) {Object[]} body.schedule The schedule for the person.
   * @apiSuccess (Success 200) {String} body.schedule.id The id of the task.
   * @apiSuccess (Success 200) {String} body.schedule.name The name of the task.
   * @apiSuccess (Success 200) {String} body.schedule.dueDate The due date for the task.
   * @apiSuccess (Success 200) {String} body.schedule.points The points for the task.
   * @apiSuccess (Success 200) {Object[]} body.history The schedule for the person.
   * @apiSuccess (Success 200) {String} body.history.id The id of the task.
   * @apiSuccess (Success 200) {String} body.history.name The name of the task.
   * @apiSuccess (Success 200) {String} body.history.dueDate The due date for the task.
   * @apiSuccess (Success 200) {String} body.history.points The points for the task.
   * @apiSuccess (Success 200) {String} body.history.penalty The penalty for the task.
   * @apiSuccess (Success 200) {String} body.history.isPenalised Whether the task is penalised.
   *
   * @apiError (Error 403) {Object} body Requesting person not in house.
   * @apiError (Error 403) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body House or person not found, or person not in house.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.get(
    "/v1/schedule/:houseId/for-person/:personId",
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    houseIdParamValidationMiddleware,
    personIdParamValidationMiddleware,
    svc.getScheduleForPersonService.createHandler()
  );

  /**
   * @api {get} /v1/schedule/:houseId/scheduled-task/:taskId Get details for a scheduled task.
   * @apiName GetScheduledTaskDetails
   * @apiGroup Schedule
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} taskId The id of the task.
   *
   * @apiSuccess (Success 200) {Object} body
   * @apiSuccess (Success 200) {String} body.task.id The id of the task.
   * @apiSuccess (Success 200) {String} body.task.name The name of the task.
   * @apiSuccess (Success 200) {String} body.task.dueDate The due date for the task.
   * @apiSuccess (Success 200) {String} body.task.points The points for the task.
   * @apiSuccess (Success 200) {String} body.task.description The description of the task.
   * @apiSuccess (Success 200) {String} body.task.responsiblePerson The name of the responsible person.
   *
   * @apiError (Error 403) {Object} body Requesting person not in house.
   * @apiError (Error 403) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body Task or house not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.get(
    "/v1/schedule/:houseId/scheduled-task/:taskId",
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    houseIdParamValidationMiddleware,
    personIdParamValidationMiddleware,
    svc.getScheduledTaskDetailsService.createHandler()
  );

  /**
   * @api {get} /v1/schedule/:houseId/completed-task/:taskId Get details for a completed task.
   * @apiName GetCompletedTaskDetails
   * @apiGroup Schedule
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} taskId The id of the task.
   *
   * @apiSuccess (Success 200) {Object} body
   * @apiSuccess (Success 200) {String} body.task.id The id of the task.
   * @apiSuccess (Success 200) {String} body.task.name The name of the task.
   * @apiSuccess (Success 200) {String} body.task.dueDate The due date for the task.
   * @apiSuccess (Success 200) {String} body.task.points The points for the task.
   * @apiSuccess (Success 200) {String} body.task.description The description of the task.
   * @apiSuccess (Success 200) {String} body.task.responsiblePerson The name of the responsible person.
   * @apiSuccess (Success 200) {String} body.task.penalty The penalty for the task.
   * @apiSuccess (Success 200) {String} body.task.isPenalised Whether the task is penalised.
   *
   * @apiError (Error 403) {Object} body Requesting person not in house.
   * @apiError (Error 403) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body Task or house not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.get(
    "/v1/schedule/:houseId/completed-task/:taskId",
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    houseIdParamValidationMiddleware,
    personIdParamValidationMiddleware,
    svc.getCompletedTaskDetailsService.createHandler()
  );

  /**
   * @api {patch} /v1/schedule/:houseId/scheduled-task/:taskId/mark-done Mark a scheduled task as done.
   * @apiName MarkScheduledTaskDone
   * @apiGroup Schedule
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} taskId The id of the task.
   *
   * @apiSuccess (Success 204) body
   *
   * @apiError (Error 403) {Object} body Requesting person not in house.
   * @apiError (Error 403) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body Task or house not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.patch(
    "/v1/schedule/:houseId/scheduled-task/:taskId/mark-done",
    json,
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    houseIdParamValidationMiddleware,
    personIdParamValidationMiddleware,
    svc.markScheduledTaskDoneService.createHandler()
  );

  /**
   * @api {patch} /v1/schedule/:houseId/completed-task/:taskId/mark-undone Mark a completed task as undone.
   * @apiName MarkCompletedTaskUndone
   * @apiGroup Schedule
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} taskId The id of the task.
   *
   * @apiSuccess (Success 204) body
   *
   * @apiError (Error 403) {Object} body Requesting person not in house.
   * @apiError (Error 403) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body Task or house not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.patch(
    "/v1/schedule/:houseId/completed-task/:taskId/mark-undone",
    json,
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    houseIdParamValidationMiddleware,
    personIdParamValidationMiddleware,
    svc.markCompletedTaskUndoneService.createHandler()
  );

  /**
   * @api {patch} /v1/schedule/:houseId/scheduled-task/:taskId/delegate Delegate a task to a person.
   * @apiName DelegateTask
   * @apiGroup Schedule
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} taskId The id of the task.
   *
   * @apiBody {Object} body
   * @apiBody {String} body.personId The id of the person to delegate the task to.
   *
   * @apiSuccess (Success 204) body
   *
   * @apiError (Error 403) {Object} body Requesting person not in house.
   * @apiError (Error 403) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body Task or house not found, or person not in house.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.patch(
    "/v1/schedule/:houseId/scheduled-task/:taskId/delegate",
    json,
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    houseIdParamValidationMiddleware,
    personIdParamValidationMiddleware,
    svc.delegateScheduledTaskService.createHandler()
  );

  /**
   * @api {patch} /v1/schedule/:houseId/completed-task/:taskId/complain Complain about a task.
   * @apiName ComplainAboutTask
   * @apiGroup Schedule
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} taskId The id of the task.
   *
   * @apiBody {Object} body
   * @apiBody {String} body.message The complaint message about the task.
   *
   * @apiSuccess (Success 204) body
   *
   * @apiError (Error 403) {Object} body Requesting person not in house.
   * @apiError (Error 403) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body Task or house not found, or person not in house.
   * @apiError (Error 404) {String} body.error Error message.
   *h
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.patch(
    "/v1/schedule/:houseId/completed-task/:taskId/complain",
    json,
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    houseIdParamValidationMiddleware,
    personIdParamValidationMiddleware,
    svc.complainAboutCompletedTaskService.createHandler()
  );

  return router;
};
