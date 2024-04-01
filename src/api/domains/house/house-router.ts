import { Router, json } from "express";
import { HouseServices } from "../../../Bootstrap.js";
import { Environment } from "../../../env/Environment.js";
import { createJwtPersonAuthenticationMiddleware } from "../../middleware/auth/authenticate-jwt.js";

export const houseRouter = (svc: HouseServices, env: Environment): Router => {
  const router = Router();

  /**
   * @api {get} /v1/house/mine List my houses.
   * @apiName ListMyHouses
   * @apiGroup House
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiSuccess (Success 200) {Object[]} body The list of houses.
   * @apiSuccess (Success 200) {String} body.id The id of the house.
   * @apiSuccess (Success 200) {String} body.name The name of the house.
   * @apiSuccess (Success 200) {String} body.picture The picture of the house.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.get(
    "/v1/house/mine",
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    svc.listMyHousesService.createHandler()
  );

  /**
   * @api {post} /v1/house Create a new house.
   * @apiName CreateHouse
   * @apiGroup House
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiBody {Object} body
   * @apiBody {String} body.name The name of the house.
   *
   * @apiSuccess (Success 201) {Object} body
   * @apiSuccess (Success 201) {String} body.id The id of the house.
   * @apiSuccess (Success 201) {String} body.name The name of the house.
   * @apiSuccess (Success 201) {String} body.picture The picture of the house.
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.post(
    "/v1/house",
    json,
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    svc.createHouseService.createHandler()
  );

  /**
   * @api {delete} /v1/house Delete a house.
   * @apiName DeleteHouse
   * @apiGroup House
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiBody {Object} body
   * @apiBody {String} body.houseId The id of the house.
   *
   * @apiSuccess (Success 204) body
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body House not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.delete(
    "/v1/house",
    json,
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    svc.deleteHouseService.createHandler()
  );

  /**
   * @api {patch} /v1/house/name Update house name.
   * @apiName UpdateHouseName
   * @apiGroup House
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiBody {Object} body
   * @apiBody {String} body.houseId The id of the house.
   * @apiBody {String} body.name The new name of the house.
   *
   * @apiSuccess (Success 204) body
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   * @apiError (Error 400) {String} body.error Error message.
   *
   * @apiError (Error 404) {Object} body House not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.patch(
    "/v1/house/name",
    json,
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    svc.updateHouseNameService.createHandler()
  );

  /**
   * @api {post} /v1/houses/join Join a house by invite code.
   * @apiName JoinHouse
   * @apiGroup House
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} authorization JWT token to authenticate the user.
   *
   * @apiBody {Object} body
   * @apiBody {String} body.invite_code The invite code of the house.
   *
   * @apiSuccess (Success 204) body
   *
   * @apiError (Error 400) {Object} body Error due to missing or invalid fields.
   */
  router.post(
    "/v1/houses/join",
    json,
    createJwtPersonAuthenticationMiddleware(env.jwtSecret),
    svc.joinHouseService.createHandler()
  );

  return router;
};
