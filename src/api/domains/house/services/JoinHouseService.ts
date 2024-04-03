import { Request, Response } from "express";
import {
  IHouseRepository,
  JoinHouseStatus,
} from "../../../../repositories/domains/house/IHouseRepository.js";
import { AService } from "../../../util/AService.js";

export class JoinHouseService extends AService {
  constructor(private houseRepository: IHouseRepository) {
    super();
  }

  async run(request: Request, response: Response) {
    const personId = response.locals.authenticatedPersonId;
    const inviteCode = request.body.inviteCode;

    if (inviteCode == null) {
      return response
        .status(400)
        .json({ error: "Missing required field 'inviteCode'." });
    }

    if (typeof inviteCode !== "string") {
      return response.status(400).json({
        error: "Unexpected type of 'inviteCode' field. Expected string.",
      });
    }

    const result = await this.houseRepository.joinHouse(personId, inviteCode);

    switch (result.status) {
      case JoinHouseStatus.Success:
        return response.status(204).end();
      case JoinHouseStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      case JoinHouseStatus.PersonNotFound:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error(
          "JoinHouseService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
