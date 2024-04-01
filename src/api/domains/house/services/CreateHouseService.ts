import { Request, Response } from "express";
import {
    CreateHouseStatus,
    IHouseRepository,
} from "../../../../repositories/domains/house/IHouseRepository";
import { IService } from "../../../util/IService";

export class CreateHouseService implements IService {
  constructor(private houseRepository: IHouseRepository) {}

  async run(request: Request, response: Response) {
    const personId = response.locals.authenticatedPersonId;

    const { name } = request.body;

    if (!name) {
      return response
        .status(400)
        .json({ error: "Missing required field 'name'." });
    }

    if (typeof name !== "string") {
      return response
        .status(400)
        .json({ error: "Unexpected type of 'name' field. Expected string." });
    }

    if (name.length < 3) {
      return response
        .status(400)
        .json({ error: "House name must be at least 3 characters long." });
    }

    const result = await this.houseRepository.createHouse(personId, name);

    switch (result.status) {
      case CreateHouseStatus.Success:
        return response.status(201).json({ house: result.house });
      case CreateHouseStatus.PersonNotFound:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error(
          "CreateHouseService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
