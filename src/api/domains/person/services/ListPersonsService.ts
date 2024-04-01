import { Request, Response } from "express";
import {
  IPersonRepository,
  ListPersonsStatus,
} from "../../../../repositories/domains/person/IPersonRepository";
import { AService } from "../../../util/IService";

export class ListPersonsService extends AService {
  constructor(private personRepository: IPersonRepository) {
    super();
  }

  async run(request: Request, response: Response) {
    const personId = response.locals.authenticatedPersonId;
    const houseId = request.params.houseId;

    const result = await this.personRepository.listPersons(personId, houseId);

    switch (result.status) {
      case ListPersonsStatus.Success:
        return response.status(200).json({ persons: result.persons });
      case ListPersonsStatus.PersonNotInHouse:
        return response.status(403).json({ error: "Person not in house." });
      case ListPersonsStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      case ListPersonsStatus.PersonNotFound:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error(
          "ListPersonsService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
