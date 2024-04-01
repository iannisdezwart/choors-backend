import { Request, Response } from "express";
import {
    IPictureRepository,
    RetrievePictureStatus,
} from "../../../../repositories/IPictureRepository";

export class GetPictureService {
  constructor(private pictureRepository: IPictureRepository) {}

  async getPicture(request: Request, response: Response) {
    const handle = request.params.handle;

    if (typeof handle !== "string") {
      return response
        .status(400)
        .send("Unexpected type of 'handle' field. Expected string.");
    }

    const picture = await this.pictureRepository.retrievePicture(handle);

    switch (picture.status) {
      case RetrievePictureStatus.PictureNotFoundError:
        return response.status(404).send("Picture not found.");
      case RetrievePictureStatus.InferMimeTypeError:
        return response.status(500).send("Unknown error occurred.");
      case RetrievePictureStatus.Success:
        break;
      default:
        console.error("Unknown status:", picture.status);
        return response.status(500).send("Unknown error occurred.");
    }

    response.setHeader("Content-Type", picture.picture!.mimeType);
    picture.picture!.pictureStream.pipe(response);
  }
}
