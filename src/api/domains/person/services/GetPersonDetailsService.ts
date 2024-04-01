import { Request, Response } from "express";
import {
    GetPersonDetailsStatus,
    IPersonRepository,
} from "../../../../repositories/domains/person/IPersonRepository";
import { IService } from "../../../util/IService";

export class GetPersonDetailsService implements IService {
  constructor(private personRepository: IPersonRepository) {}

  async run(request: Request, response: Response) {
    const reqPersonId = response.locals.authenticatedPersonId;
    const personId = request.params.personId;
    const houseId = request.params.houseId;

    const result = await this.personRepository.getPersonDetails(
      reqPersonId,
      personId,
      houseId
    );

    switch (result.status) {
      case GetPersonDetailsStatus.Success:
        return response.status(200).json(result.person);
      case GetPersonDetailsStatus.PersonNotInHouse:
        return response.status(403).json({ error: "Person not in house." });
      case GetPersonDetailsStatus.ReqPersonNotInHouse:
        return response
          .status(403)
          .json({ error: "Requesting person not in house." });
      case GetPersonDetailsStatus.PersonNotFound:
        return response.status(404).json({ error: "Person not found." });
      case GetPersonDetailsStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      case GetPersonDetailsStatus.ReqPersonNotFound:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error(
          "GetPersonDetailsService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
