import { Request, Response } from "express";
import {
    IHouseRepository,
    UpdateHouseNameStatus,
} from "../../../../repositories/domains/house/IHouseRepository";
import { IService } from "../../../util/IService";

export class UpdateHouseNameService implements IService {
  constructor(private houseRepository: IHouseRepository) {}

  async run(request: Request, response: Response) {
    const personId = response.locals.authenticatedPersonId;
    const houseId = request.body.houseId;
    const newName = request.body.new_name;

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

    if (!newName) {
      return response
        .status(400)
        .json({ error: "Missing required field 'new_name'." });
    }

    if (typeof newName !== "string") {
      return response.status(400).json({
        error: "Unexpected type of 'newName' field. Expected string.",
      });
    }

    const result = await this.houseRepository.updateHouseName(
      personId,
      houseId,
      newName
    );

    switch (result.status) {
      case UpdateHouseNameStatus.Success:
        return response.status(204).end();
      case UpdateHouseNameStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      case UpdateHouseNameStatus.PersonNotFound:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error(
          "UpdateHouseNameService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
