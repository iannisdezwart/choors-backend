import { Router, json } from "express";
import { TaskServices } from "../../../Bootstrap.js";
import { Environment } from "../../../env/Environment.js";
import { createJwtPersonAuthenticationMiddleware } from "../../middleware/auth/authenticate-jwt.js";
import { houseIdParamValidationMiddleware } from "../../middleware/validation/house-id.js";
import { taskIdParamValidationMiddleware } from "../../middleware/validation/task-id.js";
import { createTaskRequestBodyValidationMiddleware } from "./middleware/validation/task-request.js";

export const taskRouter = (svc: TaskServices, env: Environment): Router => {
  const router = Router();

  /**
   * @api {get} /v1/task/:houseId Get list of tasks.
   * @apiName GetTaskList
   * @apiGroup Task
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   *
   * @apiSuccess (Success 200) {Object[]} body The list of tasks.
   * @apiSuccess (Success 200) {Number} body.id The id of the task.
   * @apiSuccess (Success 200) {String} body.name The name of the task.
   * @apiSuccess (Success 200) {String} body.description The description of the task.
   * @apiSuccess (Success 200) {Date} body.freqBase The frequency base of the task.
   * @apiSuccess (Success 200) {Number} body.freqOffset The frequency offset of the task.
   * @apiSuccess (Success 200) {Number} body.timeLimit The time limit of the task.
   * @apiSuccess (Success 200) {Number} body.scheduleOffset The schedule offset of the task.
   * @apiSuccess (Success 200) {Number} body.points The points for the task.
   * @apiSuccess (Success 200) {Number} body.penalty The penalty for the task.
   * @apiSuccess (Success 200) {String} body.responsibleTaskGroup The responsible task group for the task.
   *
   * @apiError (Error 404) {Object} body House not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.get(
    "/v1/task/:houseId",
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    houseIdParamValidationMiddleware,
    svc.getTaskListService.createHandler()
  );

  /**
   * @api {post} /v1/task/:houseId Create a new task.
   * @apiName CreateTask
   * @apiGroup Task
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   *
   * @apiBody {Object} body
   * @apiBody {String} body.name The name of the task.
   * @apiBody {String} body.description The description of the task.
   * @apiBody {Date} body.freqBase The frequency base of the task.
   * @apiBody {Number} body.freqOffset The frequency offset of the task.
   * @apiBody {Number} body.timeLimit The time limit of the task.
   * @apiBody {Number} body.scheduleOffset The schedule offset of the task.
   * @apiBody {Number} body.points The points for the task.
   * @apiBody {Number} body.penalty The penalty for the task.
   * @apiBody {String} body.responsibleTaskGroup The responsible task group for the task.
   *
   * @apiSuccess (Success 201) {Object} body
   * @apiSuccess (Success 201) {Number} body.id The id of the task.
   * @apiSuccess (Success 201) {String} body.name The name of the task.
   * @apiSuccess (Success 201) {String} body.description The description of the task.
   * @apiSuccess (Success 201) {Date} body.freqBase The frequency base of the task.
   * @apiSuccess (Success 201) {Number} body.freqOffset The frequency offset of the task.
   * @apiSuccess (Success 201) {Number} body.timeLimit The time limit of the task.
   * @apiSuccess (Success 201) {Number} body.scheduleOffset The schedule offset of the task.
   * @apiSuccess (Success 201) {Number} body.points The points for the task.
   * @apiSuccess (Success 201) {Number} body.penalty The penalty for the task.
   * @apiSuccess (Success 201) {String} body.responsibleTaskGroup The responsible task group for the task.
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 403) {Object} body Person not in house.
   * @apiError (Error 403) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body House not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.post(
    "/v1/task/:houseId",
    json(),
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    houseIdParamValidationMiddleware,
    createTaskRequestBodyValidationMiddleware({ fieldsRequired: true }),
    svc.createTaskService.createHandler()
  );

  /**
   * @api {get} /v1/task/:houseId/:taskId Get detailed task.
   * @apiName GetDetailedTask
   * @apiGroup Task
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} taskId The id of the task.
   *
   * @apiSuccess (Success 200) {Object} body The detailed task.
   * @apiSuccess (Success 200) {Number} body.id The id of the task.
   * @apiSuccess (Success 200) {String} body.name The name of the task.
   * @apiSuccess (Success 200) {String} body.description The description of the task.
   * @apiSuccess (Success 200) {Date} body.freqBase The frequency base of the task.
   * @apiSuccess (Success 200) {Number} body.freqOffset The frequency offset of the task.
   * @apiSuccess (Success 200) {Number} body.timeLimit The time limit of the task.
   * @apiSuccess (Success 200) {Number} body.scheduleOffset The schedule offset of the task.
   * @apiSuccess (Success 200) {Number} body.points The points for the task.
   * @apiSuccess (Success 200) {Number} body.penalty The penalty for the task.
   * @apiSuccess (Success 200) {String} body.responsibleTaskGroup The responsible task group for the task.
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 403) {Object} body Person not in house.
   * @apiError (Error 403) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body Task or house not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.get(
    "/v1/task/:houseId/:taskId",
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    houseIdParamValidationMiddleware,
    taskIdParamValidationMiddleware,
    svc.getDetailedTaskService.createHandler()
  );

  /**
   * @api {patch} /v1/task/:houseId/:taskId Update a task.
   * @apiName UpdateTask
   * @apiGroup Task
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} taskId The id of the task.
   *
   * @apiBody {Object} body
   * @apiBody {String} [body.name] If set, the new name of the task.
   * @apiBody {String} [body.description] If set, the new description of the task.
   * @apiBody {Date} [body.freqBase] If set, the new frequency base of the task.
   * @apiBody {Number} [body.freqOffset] If set, the new frequency offset of the task.
   * @apiBody {Number} [body.timeLimit] If set, the new time limit of the task.
   * @apiBody {Number} [body.scheduleOffset] If set, the new schedule offset of the task.
   * @apiBody {Number} [body.points] If set, the new points for the task.
   * @apiBody {Number} [body.penalty] If set, the new penalty for the task.
   * @apiBody {String} [body.responsibleTaskGroup] If set, the new responsible task group for the task.
   *
   * @apiSuccess (Success 204) body
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 403) {Object} body Person not in house.
   * @apiError (Error 403) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body Task, house or responsible group not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.patch(
    "/v1/task/:houseId/:taskId",
    json(),
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    houseIdParamValidationMiddleware,
    taskIdParamValidationMiddleware,
    createTaskRequestBodyValidationMiddleware({ fieldsRequired: false }),
    svc.updateTaskService.createHandler()
  );

  /**
   * @api {delete} /v1/task/:houseId/:taskId Delete a task.
   * @apiName DeleteTask
   * @apiGroup Task
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiParam {String} houseId The id of the house.
   * @apiParam {String} taskId The id of the task.
   *
   * @apiSuccess (Success 204) body
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 403) {Object} body Person not in house.
   * @apiError (Error 403) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body Task or house not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.delete(
    "/v1/task/:houseId/:taskId",
    json(),
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    houseIdParamValidationMiddleware,
    taskIdParamValidationMiddleware,
    svc.deleteTaskService.createHandler()
  );

  return router;
};
