import { Request, Response } from "express";
import {
    IPersonRepository,
    UpdatePersonGroupsStatus,
} from "../../../../repositories/domains/person/IPersonRepository";
import { IService } from "../../../util/IService";

export class UpdatePersonGroupsService implements IService {
  constructor(private personRepository: IPersonRepository) {}

  async run(request: Request, response: Response) {
    const reqPersonId = response.locals.authenticatedPersonId;
    const personId = request.params.personId;
    const houseId = request.params.houseId;
    const { groups } = request.body;

    if (!groups) {
      return response
        .status(400)
        .json({ error: "Missing required field 'groups'." });
    }

    if (!Array.isArray(groups)) {
      return response.status(400).json({
        error: "Unexpected type of 'groups' field. Expected array.",
      });
    }

    if (groups.some((group) => typeof group !== "string")) {
      return response.status(400).json({
        error: "Unexpected type of 'groups' field. Expected array of strings.",
      });
    }

    const result = await this.personRepository.updatePersonGroups(
      reqPersonId,
      houseId,
      personId,
      groups
    );

    switch (result.status) {
      case UpdatePersonGroupsStatus.Success:
        return response.status(204).end();
      case UpdatePersonGroupsStatus.PersonNotInHouse:
        return response.status(403).json({ error: "Person not in house." });
      case UpdatePersonGroupsStatus.ReqPersonNotInHouse:
        return response
          .status(403)
          .json({ error: "Requesting person not in house." });
      case UpdatePersonGroupsStatus.GroupNotFound:
        return response.status(404).json({ error: "Group not found." });
      case UpdatePersonGroupsStatus.PersonNotFound:
        return response.status(404).json({ error: "Person not found." });
      case UpdatePersonGroupsStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      case UpdatePersonGroupsStatus.ReqPersonNotFound:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error(
          "UpdatePersonGroupsService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
