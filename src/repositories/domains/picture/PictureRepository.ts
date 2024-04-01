import { fileTypeFromFile } from "file-type";
import { createReadStream, createWriteStream, existsSync, mkdirSync } from "fs";
import path from "path";
import { Environment } from "../../../env/Environment.js";
import {
  IPictureRepository,
  RetrievePictureResult,
  RetrievePictureStatus,
  StorePictureResult,
  StorePictureStatus,
} from "./IPictureRepository.js";

export class PictureRepository implements IPictureRepository {
  constructor(private readonly env: Environment) {}

  storePicture(
    handle: string,
    pictureStream: NodeJS.ReadableStream
  ): Promise<StorePictureResult> {
    return new Promise((resolve) => {
      const basePath = path.resolve(this.env.pictureStoragePath);
      const filePath = path.resolve(basePath, handle);

      if (!existsSync(basePath)) {
        console.log(
          "PictureRepository.storePicture() - Creating base directory:",
          basePath
        );
        mkdirSync(basePath, { recursive: true });
      }

      if (!filePath.startsWith(basePath)) {
        console.error(
          "PictureReposity.storePicture() - Path error (dot-dot-slash?):",
          filePath,
          "handle: ",
          handle
        );
        resolve({ status: StorePictureStatus.PathError });
      }

      const outputStream = createWriteStream(filePath);
      outputStream.cork();
      let size = 0;

      const dataListener = (chunk: Buffer) => {
        size += chunk.length;

        if (size > this.env.pictureMaxSize) {
          outputStream.destroy();
          pictureStream.removeListener("data", dataListener);
          pictureStream.removeListener("end", endListener);
          pictureStream.pause();
          resolve({ status: StorePictureStatus.PictureTooLargeError });
        }

        outputStream.write(chunk);
      };

      const endListener = () => {
        outputStream.end();
        resolve({ status: StorePictureStatus.Success });
      };

      pictureStream.on("data", dataListener);
      pictureStream.on("end", endListener);
    });
  }

  async retrievePicture(handle: string): Promise<RetrievePictureResult> {
    const filePath = path.resolve(this.env.pictureStoragePath, handle);

    if (!existsSync(filePath)) {
      return { status: RetrievePictureStatus.PictureNotFoundError };
    }

    const type = await fileTypeFromFile(filePath);

    if (!type) {
      console.error(
        "PictureRepository.retrievePicture() - Failed to infer MIME type:",
        filePath
      );
      return { status: RetrievePictureStatus.InferMimeTypeError };
    }

    return {
      status: RetrievePictureStatus.Success,
      picture: {
        pictureStream: createReadStream(filePath),
        mimeType: type.mime,
      },
    };
  }
}
