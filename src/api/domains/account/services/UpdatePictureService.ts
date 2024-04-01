import bytes from "bytes";
import { Request, Response } from "express";
import { Environment } from "../../../../env/Environment.js";
import {
  IAccountRepository,
  UpdatePictureStatus,
} from "../../../../repositories/domains/account/IAccountRepository.js";
import {
  IPictureRepository,
  StorePictureStatus,
} from "../../../../repositories/domains/picture/IPictureRepository.js";
import { AService } from "../../../util/AService.js";

export class UpdatePictureService extends AService {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly pictureRepository: IPictureRepository,
    private readonly env: Environment
  ) {
    super();
  }

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

    if (bodySize != null && bodySize > this.env.pictureMaxSize) {
      return response.status(400).json({
        error: `Picture size must not exceed ${bytes(
          this.env.pictureMaxSize
        )}.`,
      });
    }

    const pictureHandle = `person-${authPersonId}`;

    const storePictureResult = await this.pictureRepository.storePicture(
      pictureHandle,
      request
    );

    switch (storePictureResult.status) {
      case StorePictureStatus.PathError:
        return response.status(401).json({ error: "Forbidden." });
      case StorePictureStatus.PictureTooLargeError:
        return response.status(400).json({
          error: `Picture size must not exceed ${bytes(
            this.env.pictureMaxSize
          )}.`,
        });
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
      pictureHandle
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
