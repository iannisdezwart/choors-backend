import { Request, Response } from "express";
import {
    IHouseRepository,
    JoinHouseStatus,
} from "../../../../repositories/domains/house/IHouseRepository";
import { IService } from "../../../util/IService";

export class JoinHouseService implements IService {
  constructor(private houseRepository: IHouseRepository) {}

  async run(request: Request, response: Response) {
    const personId = response.locals.authenticatedPersonId;
    const houseId = request.body.houseId;

    if (!houseId) {
      return response
        .status(400)
        .json({ error: "Missing required field 'houseId'." });
    }

    if (typeof houseId !== "string") {
      return response.status(400).json({
        error: "Unexpected type of 'houseId' field. Expected string.",
      });
    }

    const result = await this.houseRepository.joinHouse(personId, houseId);

    switch (result.status) {
      case JoinHouseStatus.Success:
        return response.status(204).end();
      case JoinHouseStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      case JoinHouseStatus.PersonNotFound:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error(
          "JoinHouseService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
