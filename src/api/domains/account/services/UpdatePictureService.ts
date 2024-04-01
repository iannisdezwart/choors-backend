import { Request, Response } from "express";
import {
  IAccountRepository,
  UpdatePictureStatus,
} from "../../../../repositories/domains/account/IAccountRepository";
import {
  IPictureRepository,
  StorePictureStatus,
} from "../../../../repositories/domains/picture/IPictureRepository";
import { PictureRepository } from "../../../../repositories/domains/picture/PictureRepository";
import { IService } from "../../../util/IService";

export class UpdatePictureService implements IService {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly pictureRepository: IPictureRepository
  ) {}

  async run(request: Request, response: Response) {
    const authPersonId = response.locals.authenticatedPersonId;
    const contentType = request.headers["content-type"] || "";
    const contentLength = request.headers["content-length"];
    const bodySize = contentLength ? parseInt(contentLength) : null;

    if (!["image/jpeg", "image/png", "image/webp"].includes(contentType)) {
      return response.status(400).json({
        error:
          "Unsupported image type. Only JPEG, PNG, and WebP are supported.",
      });
    }

    if (bodySize != null && bodySize > PictureRepository.MAX_SIZE) {
      return response
        .status(400)
        .json({ error: "Picture size must not exceed 256 KB." });
    }

    const storePictureResult = await this.pictureRepository.storePicture(
      authPersonId,
      request.body
    );

    switch (storePictureResult.status) {
      case StorePictureStatus.PathError:
        return response.status(401).json({ error: "Forbidden." });
      case StorePictureStatus.PictureTooLargeError:
        return response
          .status(400)
          .json({ error: "Picture size must not exceed 256 KB." });
      case StorePictureStatus.Success:
        break;
      default:
        console.error(
          "UpdatePictureService.run() - Unknown status:",
          storePictureResult.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }

    const result = await this.accountRepository.updatePicture(
      authPersonId,
      `person-${authPersonId}`
    );

    switch (result.status) {
      case UpdatePictureStatus.Success:
        return response.status(204).end();
      case UpdatePictureStatus.PersonNotFound:
        return response.status(404).json({ error: "Person not found." });
      case UpdatePictureStatus.UnknownError:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error(
          "UpdatePictureService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
