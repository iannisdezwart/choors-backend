import { Router, json } from "express";
import { IHouseRepository } from "../../../repositories/IHouseRepository";
import { jwtPersonAuthenticationMiddleware } from "../../middleware/auth/authenticate-jwt";
import { CreateHouseService } from "./services/CreateHouseService";
import { DeleteHouseService } from "./services/DeleteHouseService";
import { JoinHouseService } from "./services/JoinHouseService";
import { ListMyHousesService } from "./services/ListMyHousesService";
import { UpdateHouseNameService } from "./services/UpdateHouseNameService";

export const houseRouter = (houseRepository: IHouseRepository): Router => {
  const router = Router();

  const listMyHousesService = new ListMyHousesService(houseRepository);
  const createHouseService = new CreateHouseService(houseRepository);
  const deleteHouseService = new DeleteHouseService(houseRepository);
  const updateHouseNameService = new UpdateHouseNameService(houseRepository);
  const joinHouseService = new JoinHouseService(houseRepository);

  /**
   * @api {get} /v1/house/mine List my houses.
   * @apiName ListMyHouses
   * @apiGroup House
   * @apiVersion 1.0.0
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
    jwtPersonAuthenticationMiddleware,
    listMyHousesService.run.bind(listMyHousesService)
  );

  /**
   * @api {post} /v1/house Create a new house.
   * @apiName CreateHouse
   * @apiGroup House
   * @apiVersion 1.0.0
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
    jwtPersonAuthenticationMiddleware,
    createHouseService.run.bind(createHouseService)
  );

  /**
   * @api {delete} /v1/house Delete a house.
   * @apiName DeleteHouse
   * @apiGroup House
   * @apiVersion 1.0.0
   *
   * @apiBody {Object} body
   * @apiBody {String} body.house_id The id of the house.
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
    jwtPersonAuthenticationMiddleware,
    deleteHouseService.run.bind(deleteHouseService)
  );

  /**
   * @api {patch} /v1/house/name Update house name.
   * @apiName UpdateHouseName
   * @apiGroup House
   * @apiVersion 1.0.0
   *
   * @apiBody {Object} body
   * @apiBody {String} body.house_id The id of the house.
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
    jwtPersonAuthenticationMiddleware,
    updateHouseNameService.run.bind(updateHouseNameService)
  );

  /**
   * @api {post} /v1/houses/join Join a house by invite code.
   * @apiName JoinHouse
   * @apiGroup House
   * @apiVersion 1.0.0
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
    jwtPersonAuthenticationMiddleware,
    joinHouseService.run.bind(joinHouseService)
  );

  return router;
};
