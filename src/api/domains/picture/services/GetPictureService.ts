import { Request, Response } from "express";
import {
  IPictureRepository,
  RetrievePictureStatus,
} from "../../../../repositories/domains/picture/IPictureRepository.js";
import { AService } from "../../../util/AService.js";

export class GetPictureService extends AService {
  constructor(private pictureRepository: IPictureRepository) {
    super();
  }

  async run(request: Request, response: Response) {
    const handle = request.params.handle;

    if (typeof handle !== "string") {
      return response
        .status(400)
        .json({ error: "Unexpected type of 'handle' field. Expected string." });
    }

    const picture = await this.pictureRepository.retrievePicture(handle);

    switch (picture.status) {
      case RetrievePictureStatus.PictureNotFoundError:
        return response.status(404).json({ error: "Picture not found." });
      case RetrievePictureStatus.InferMimeTypeError:
        return response.status(500).json({ error: "Unknown error occurred." });
      case RetrievePictureStatus.Success:
        break;
      default:
        console.error(
          "GetPictureService.run() - Unknown status:",
          picture.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }

    response.setHeader("Content-Type", picture.picture!.mimeType);
    picture.picture!.pictureStream.pipe(response);
  }
}
