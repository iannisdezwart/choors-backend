export interface IPictureRepository {
  storePicture(
    handle: string,
    pictureStream: NodeJS.ReadableStream
  ): Promise<StorePictureResult>;

  retrievePicture(handle: string): Promise<RetrievePictureResult>;
}

export enum StorePictureStatus {
  Success,
  PathError,
  PictureTooLargeError,
}

export type StorePictureResult = {
  status: StorePictureStatus;
};

export type Picture = {
  pictureStream: NodeJS.ReadableStream;
  mimeType: string;
};

export enum RetrievePictureStatus {
  Success,
  PictureNotFoundError,
  InferMimeTypeError,
}

export type RetrievePictureResult = {
  status: RetrievePictureStatus;
  picture?: Picture;
};
