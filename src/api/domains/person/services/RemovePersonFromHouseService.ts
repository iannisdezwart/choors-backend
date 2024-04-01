import { Request, Response } from "express";
import {
  IPersonRepository,
  RemovePersonFromHouseStatus,
} from "../../../../repositories/domains/person/IPersonRepository.js";
import { AService } from "../../../util/AService.js";

export class RemovePersonFromHouseService extends AService {
  constructor(private personRepository: IPersonRepository) {
    super();
  }

  async run(request: Request, response: Response) {
    const personId = response.locals.authenticatedPersonId;
    const houseId = request.params.houseId;
    const personToRemoveId = request.params.personId;

    const result = await this.personRepository.removePersonFromHouse(
      personId,
      houseId,
      personToRemoveId
    );

    switch (result.status) {
      case RemovePersonFromHouseStatus.Success:
        return response.status(204).end();
      case RemovePersonFromHouseStatus.PersonNotInHouse:
        return response.status(403).json({ error: "Person not in house." });
      case RemovePersonFromHouseStatus.ReqPersonNotInHouse:
        return response.status(403).json({
          error: "Requesting person not in house.",
        });
      case RemovePersonFromHouseStatus.PersonNotFound:
        return response.status(404).json({ error: "Person not found." });
      case RemovePersonFromHouseStatus.HouseNotFound:
        return response.status(404).json({
          error: "House not found.",
        });
      case RemovePersonFromHouseStatus.ReqPersonNotFound:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error(
          "RemovePersonFromHouseService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
