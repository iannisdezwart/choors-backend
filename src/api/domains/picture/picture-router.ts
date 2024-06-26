import { Router } from "express";
import { PictureServices } from "../../../Bootstrap.js";

export const pictureRouter = (svc: PictureServices): Router => {
  const router = Router();

  /**
   * @api {get} /v1/picture/:handle Get picture by its handle.
   * @apiName GetPicture
   * @apiGroup Picture
   * @apiVersion 1.0.0
   *
   * @apiParam {String} handle The handle of the picture.
   *
   * @apiSuccess (Success 200) {binary} body The picture.
   *
   * @apiError (Error 404) {Object} body Picture not found.
   * @apiError (Error 404) {String} body.error Error message.
   *
   * @apiError (Error 500) {Object} body Internal server error.
   * @apiError (Error 500) {String} body.error Error message.
   */
  router.get("/v1/picture/:handle", svc.getPictureService.createHandler());

  return router;
};
