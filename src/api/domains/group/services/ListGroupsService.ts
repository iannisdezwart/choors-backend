import { Request, Response } from "express";
import {
  IGroupRepository,
  ListGroupsStatus,
} from "../../../../repositories/domains/group/IGroupRepository.js";
import { AService } from "../../../util/AService.js";

export class ListGroupsService extends AService {
  constructor(private groupRepository: IGroupRepository) {
    super();
  }

  async run(request: Request, response: Response) {
    const houseId = request.params.houseId;
    const personId = response.locals.authenticatedPersonId;

    const result = await this.groupRepository.listGroups(personId, houseId);

    switch (result.status) {
      case ListGroupsStatus.Success:
        return response.status(200).json({ groups: result.groups });
      case ListGroupsStatus.PersonNotInHouse:
        return response
          .status(403)
          .json({ error: "Person is not in this house." });
      case ListGroupsStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      case ListGroupsStatus.PersonNotFound:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error(
          "ListGroupsService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
