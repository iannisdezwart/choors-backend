import { Router, json } from "express";
import { Middleware, ScheduleServices } from "../../../Bootstrap.js";
import { Environment } from "../../../env/Environment.js";

export const scheduleRouter = (
  svc: ScheduleServices,
  mdw: Middleware,
  env: Environment
): Router => {
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
   * @apiSuccess (Success 200) {Date} body.schedule.dueDate The due date for the task.
   * @apiSuccess (Success 200) {Number} body.schedule.points The points for the task.
   * @apiSuccess (Success 200) {Object[]} body.history The schedule for the person.
   * @apiSuccess (Success 200) {String} body.history.id The id of the task.
   * @apiSuccess (Success 200) {String} body.history.name The name of the task.
   * @apiSuccess (Success 200) {Date} body.history.dueDate The due date for the task.
   * @apiSuccess (Success 200) {Number} body.history.points The points for the task.
   * @apiSuccess (Success 200) {Number} body.history.penalty The penalty for the task.
   * @apiSuccess (Success 200) {Boolean} body.history.isPenalised Whether the task is penalised.
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
    mdw.jwtPersonAuthenticationMiddleware.createHandler(),
    mdw.houseIdPathParamValidationMiddleware.createHandler(),
    mdw.personIdPathParamValidationMiddleware.createHandler(),
    svc.getScheduleForPersonService.createHandler()
  );

  /**
   * @api {get} /v1/schedule/:houseId/scheduled-task/:scheduledTaskId Get details for a scheduled task.
   * @apiName GetScheduledTaskDetails
   * @apiGroup Schedule
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} scheduledTaskId The id of the task.
   *
   * @apiSuccess (Success 200) {Object} body
   * @apiSuccess (Success 200) {String} body.task.id The id of the task.
   * @apiSuccess (Success 200) {String} body.task.name The name of the task.
   * @apiSuccess (Success 200) {Date} body.task.dueDate The due date for the task.
   * @apiSuccess (Success 200) {Number} body.task.points The points for the task.
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
    "/v1/schedule/:houseId/scheduled-task/:scheduledTaskId",
    mdw.jwtPersonAuthenticationMiddleware.createHandler(),
    mdw.houseIdPathParamValidationMiddleware.createHandler(),
    svc.getScheduledTaskDetailsService.createHandler()
  );

  /**
   * @api {get} /v1/schedule/:houseId/completed-task/:completedTaskId Get details for a completed task.
   * @apiName GetCompletedTaskDetails
   * @apiGroup Schedule
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} completedTaskId The id of the task.
   *
   * @apiSuccess (Success 200) {Object} body
   * @apiSuccess (Success 200) {String} body.task.id The id of the task.
   * @apiSuccess (Success 200) {String} body.task.name The name of the task.
   * @apiSuccess (Success 200) {Date} body.task.dueDate The due date for the task.
   * @apiSuccess (Success 200) {Number} body.task.points The points for the task.
   * @apiSuccess (Success 200) {String} body.task.description The description of the task.
   * @apiSuccess (Success 200) {String} body.task.responsiblePerson The name of the responsible person.
   * @apiSuccess (Success 200) {Number} body.task.penalty The penalty for the task.
   * @apiSuccess (Success 200) {Boolean} body.task.isPenalised Whether the task is penalised.
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
    "/v1/schedule/:houseId/completed-task/:completedTaskId",
    mdw.jwtPersonAuthenticationMiddleware.createHandler(),
    mdw.houseIdPathParamValidationMiddleware.createHandler(),
    svc.getCompletedTaskDetailsService.createHandler()
  );

  /**
   * @api {patch} /v1/schedule/:houseId/scheduled-task/:scheduledTaskId/mark-done Mark a scheduled task as done.
   * @apiName MarkScheduledTaskDone
   * @apiGroup Schedule
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} scheduledTaskId The id of the scheduled task.
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
    "/v1/schedule/:houseId/scheduled-task/:scheduledTaskId/mark-done",
    json(),
    mdw.jwtPersonAuthenticationMiddleware.createHandler(),
    mdw.houseIdPathParamValidationMiddleware.createHandler(),
    svc.markScheduledTaskDoneService.createHandler()
  );

  /**
   * @api {patch} /v1/schedule/:houseId/completed-task/:completedTaskId/mark-undone Mark a completed task as undone.
   * @apiName MarkCompletedTaskUndone
   * @apiGroup Schedule
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} completedTaskId The id of the completed task.
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
    "/v1/schedule/:houseId/completed-task/:completedTaskId/mark-undone",
    json(),
    mdw.jwtPersonAuthenticationMiddleware.createHandler(),
    mdw.houseIdPathParamValidationMiddleware.createHandler(),
    svc.markCompletedTaskUndoneService.createHandler()
  );

  /**
   * @api {patch} /v1/schedule/:houseId/scheduled-task/:scheduledTaskId/delegate Delegate a task to a person.
   * @apiName DelegateScheduledTask
   * @apiGroup Schedule
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} scheduledTaskId The id of the scheduled task.
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
    "/v1/schedule/:houseId/scheduled-task/:scheduledTaskId/delegate",
    json(),
    mdw.jwtPersonAuthenticationMiddleware.createHandler(),
    mdw.houseIdPathParamValidationMiddleware.createHandler(),
    svc.delegateScheduledTaskService.createHandler()
  );

  /**
   * @api {patch} /v1/schedule/:houseId/completed-task/:completedTaskId/complain Complain about a task.
   * @apiName ComplainAboutCompletedTask
   * @apiGroup Schedule
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} completedTaskId The id of the task.
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
    "/v1/schedule/:houseId/completed-task/:completedTaskId/complain",
    json(),
    mdw.jwtPersonAuthenticationMiddleware.createHandler(),
    mdw.houseIdPathParamValidationMiddleware.createHandler(),
    svc.complainAboutCompletedTaskService.createHandler()
  );

  return router;
};
