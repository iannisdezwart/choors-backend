import { fileTypeFromFile } from "file-type";
import { createReadStream, createWriteStream, existsSync } from "fs";
import path from "path";
import {
  IPictureRepository,
  RetrievePictureResult,
  RetrievePictureStatus,
  StorePictureResult,
  StorePictureStatus,
} from "./IPictureRepository";

export class PictureRepository implements IPictureRepository {
  static MAX_SIZE = 256 * 1024; // 256 KB

  storePicture(
    handle: string,
    pictureStream: NodeJS.ReadableStream
  ): Promise<StorePictureResult> {
    return new Promise((resolve) => {
      const basePath = path.resolve("storage/pictures");
      const filePath = path.resolve(basePath, handle);

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

        if (size > PictureRepository.MAX_SIZE) {
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
    const filePath = path.resolve("storage/pictures", handle);

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
