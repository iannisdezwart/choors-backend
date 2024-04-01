import { Request, Response } from "express";
import {
  GetHousesForPersonStatus,
  IHouseRepository,
} from "../../../../repositories/domains/house/IHouseRepository.js";
import { AService } from "../../../util/AService.js";

export class ListMyHousesService extends AService {
  constructor(private houseRepository: IHouseRepository) {
    super();
  }

  async run(_request: Request, response: Response) {
    const personId = response.locals.authenticatedPersonId;

    const result = await this.houseRepository.getHousesForPerson(personId);

    switch (result.status) {
      case GetHousesForPersonStatus.Success:
        return response.status(200).json({ houses: result.houses });
      case GetHousesForPersonStatus.PersonNotFound:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error(
          "ListMyHousesService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
