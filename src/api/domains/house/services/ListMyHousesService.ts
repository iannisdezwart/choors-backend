import { Request, Response } from "express";
import {
    GetHousesForPersonStatus,
    IHouseRepository,
} from "../../../../repositories/domains/house/IHouseRepository";
import { IService } from "../../../util/IService";

export class ListMyHousesService implements IService {
  constructor(private houseRepository: IHouseRepository) {}

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
