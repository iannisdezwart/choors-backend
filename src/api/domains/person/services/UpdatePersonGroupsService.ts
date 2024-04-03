import { Request, Response } from "express";
import {
  IPersonRepository,
  UpdatePersonGroupsStatus,
} from "../../../../repositories/domains/person/IPersonRepository.js";
import { AService } from "../../../util/AService.js";

export class UpdatePersonGroupsService extends AService {
  constructor(private personRepository: IPersonRepository) {
    super();
  }

  async run(request: Request, response: Response) {
    const reqPersonId = response.locals.authenticatedPersonId;
    const personId = request.params.personId;
    const houseId = request.params.houseId;
    const { groupIds } = request.body;

    if (groupIds == null) {
      return response
        .status(400)
        .json({ error: "Missing required field 'groupIds'." });
    }

    if (!Array.isArray(groupIds)) {
      return response.status(400).json({
        error: "Unexpected type of 'groupIds' field. Expected array.",
      });
    }

    if (groupIds.some((group) => typeof group !== "string")) {
      return response.status(400).json({
        error: "Unexpected type of 'groupIds' field. Expected array of strings.",
      });
    }

    const result = await this.personRepository.updatePersonGroups(
      reqPersonId,
      houseId,
      personId,
      groupIds
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
