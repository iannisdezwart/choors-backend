import { Request, Response } from "express";
import {
    DeleteHouseStatus,
    IHouseRepository,
} from "../../../../repositories/IHouseRepository";
import { IService } from "../../../util/IService";

export class DeleteHouseService implements IService {
  constructor(private houseRepository: IHouseRepository) {}

  async run(request: Request, response: Response) {
    const personId = response.locals.authenticatedPersonId;
    const houseId = request.body.houseId;

    if (typeof houseId !== "string") {
      return response.status(400).json({
        error: "Unexpected type of 'houseId' field. Expected string.",
      });
    }

    const result = await this.houseRepository.deleteHouse(personId, houseId);

    switch (result.status) {
      case DeleteHouseStatus.Success:
        return response.status(204).end();
      case DeleteHouseStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      case DeleteHouseStatus.PersonNotFound:
        return response.status(500).json({ error: "Unknown error occurred." });
      case DeleteHouseStatus.UnknownError:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error(
          "DeleteHouseService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
