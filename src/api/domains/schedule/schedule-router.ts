import { Router, json } from "express";
import { IScheduleRepository } from "../../../repositories/domains/schedule/IScheduleRepository";
import { jwtPersonAuthenticationMiddleware } from "../../middleware/auth/authenticate-jwt";
import { houseIdParamValidationMiddleware } from "../../middleware/validation/house-id";
import { personIdParamValidationMiddleware } from "../../middleware/validation/person-id";
import { ComplainAboutCompletedTaskService } from "./services/ComplainAboutTaskService";
import { DelegateScheduledTaskService } from "./services/DelegateTaskService";
import { GetCompletedTaskDetailsService } from "./services/GetCompletedTaskDetailsService";
import { GetScheduleForPersonService } from "./services/GetScheduleForPersonService";
import { GetScheduledTaskDetailsService } from "./services/GetScheduledTaskDetailsService";
import { MarkCompletedTaskUndoneService } from "./services/MarkCompletedTaskUndoneService";
import { MarkScheduledTaskDoneService } from "./services/MarkScheduledTaskDoneService";

export const scheduleRouter = (
  scheduleRepository: IScheduleRepository
): Router => {
  const router = Router();

  const getScheduleForPersonService = new GetScheduleForPersonService(
    scheduleRepository
  );
  const getScheduledTaskDetailsService = new GetScheduledTaskDetailsService(
    scheduleRepository
  );
  const getCompletedTaskDetailsService = new GetCompletedTaskDetailsService(
    scheduleRepository
  );
  const markScheduledTaskDoneService = new MarkScheduledTaskDoneService(
    scheduleRepository
  );
  const markCompletedTaskUndoneService = new MarkCompletedTaskUndoneService(
    scheduleRepository
  );
  const delegateScheduledTaskService = new DelegateScheduledTaskService(
    scheduleRepository
  );
  const complainAboutCompletedTaskService =
    new ComplainAboutCompletedTaskService(scheduleRepository);

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
    jwtPersonAuthenticationMiddleware,
    houseIdParamValidationMiddleware,
    personIdParamValidationMiddleware,
    getScheduleForPersonService.run.bind(getScheduleForPersonService)
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
    jwtPersonAuthenticationMiddleware,
    houseIdParamValidationMiddleware,
    personIdParamValidationMiddleware,
    getScheduledTaskDetailsService.run.bind(getScheduledTaskDetailsService)
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
    jwtPersonAuthenticationMiddleware,
    houseIdParamValidationMiddleware,
    personIdParamValidationMiddleware,
    getCompletedTaskDetailsService.run.bind(getCompletedTaskDetailsService)
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
    jwtPersonAuthenticationMiddleware,
    houseIdParamValidationMiddleware,
    personIdParamValidationMiddleware,
    markScheduledTaskDoneService.run.bind(markScheduledTaskDoneService)
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
    jwtPersonAuthenticationMiddleware,
    houseIdParamValidationMiddleware,
    personIdParamValidationMiddleware,
    markCompletedTaskUndoneService.run.bind(markCompletedTaskUndoneService)
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
    jwtPersonAuthenticationMiddleware,
    houseIdParamValidationMiddleware,
    personIdParamValidationMiddleware,
    delegateScheduledTaskService.run.bind(delegateScheduledTaskService)
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
    jwtPersonAuthenticationMiddleware,
    houseIdParamValidationMiddleware,
    personIdParamValidationMiddleware,
    complainAboutCompletedTaskService.run.bind(
      complainAboutCompletedTaskService
    )
  );

  return router;
};
