import { Request, Response } from "express";
import {
  IGroupRepository,
  UpdateGroupsStatus,
} from "../../../../repositories/domains/group/IGroupRepository.js";
import { AService } from "../../../util/AService.js";

export class UpdateGroupsService extends AService {
  constructor(private groupRepository: IGroupRepository) {
    super();
  }

  async run(request: Request, response: Response) {
    const houseId = request.params.houseId;
    const personId = response.locals.authenticatedPersonId;
    const { addedGroups, deletedGroupIds, renamedGroups } = request.body;

    if (addedGroups && !Array.isArray(addedGroups)) {
      return response.status(400).json({
        error: "Unexpected type of 'addedGroups' field. Expected array.",
      });
    }

    if (
      addedGroups &&
      addedGroups.some((group: any) => typeof group !== "string")
    ) {
      return response.status(400).json({
        error:
          "Unexpected type of 'addedGroups' field. Expected array of strings.",
      });
    }

    if (deletedGroupIds && !Array.isArray(deletedGroupIds)) {
      return response.status(400).json({
        error: "Unexpected type of 'deletedGroupIds' field. Expected array.",
      });
    }

    if (
      deletedGroupIds &&
      deletedGroupIds.some((id: any) => typeof id !== "string")
    ) {
      return response.status(400).json({
        error:
          "Unexpected type of 'deletedGroupIds' field. Expected array of strings.",
      });
    }

    if (renamedGroups && !Array.isArray(renamedGroups)) {
      return response.status(400).json({
        error: "Unexpected type of 'renamedGroups' field. Expected array.",
      });
    }

    if (
      renamedGroups &&
      renamedGroups.some(
        (group: any) =>
          typeof group !== "object" ||
          !group.id ||
          !group.name ||
          typeof group.id !== "string" ||
          typeof group.name !== "string"
      )
    ) {
      return response.status(400).json({
        error:
          "Unexpected type of 'renamedGroups' field. Expected array of { id: string, name: string }.",
      });
    }

    const result = await this.groupRepository.updateGroups(
      personId,
      houseId,
      addedGroups,
      deletedGroupIds,
      renamedGroups
    );

    switch (result.status) {
      case UpdateGroupsStatus.Success:
        return response.status(204).end();
      case UpdateGroupsStatus.PersonNotInHouse:
        return response
          .status(403)
          .json({ error: "Person is not in the house." });
      case UpdateGroupsStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      case UpdateGroupsStatus.GroupNotFound:
        return response.status(404).json({ error: "Group not found." });
      case UpdateGroupsStatus.TaskStillWithGroup:
        return response.status(409).json({
          error: "Cannot remove group with tasks assigned to it.",
        });
      case UpdateGroupsStatus.PersonStillInGroup:
        return response.status(409).json({
          error: "Cannot remove group with person still assigned to it.",
        });
      case UpdateGroupsStatus.PersonNotFound:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error(
          "UpdateGroupsService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
