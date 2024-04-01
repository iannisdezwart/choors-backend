import { Request, Response } from "express";
import {
    GetScheduleForPersonStatus,
    IScheduleRepository,
} from "../../../../repositories/domains/schedule/IScheduleRepository";
import { IService } from "../../../util/IService";

export class GetScheduleForPersonService implements IService {
  constructor(private scheduleRepository: IScheduleRepository) {}

  async run(request: Request, response: Response) {
    const reqPersonId = response.locals.authenticatedPersonId;
    const houseId = request.params.houseId;
    const personId = request.params.personId;

    const result = await this.scheduleRepository.getScheduleForPerson(
      reqPersonId,
      houseId,
      personId
    );

    switch (result.status) {
      case GetScheduleForPersonStatus.Success:
        return response.status(200).json({
          schedule: result.schedule,
          history: result.history,
        });
      case GetScheduleForPersonStatus.ReqPersonNotInHouse:
        return response
          .status(403)
          .json({ error: "Requesting person not in house." });
      case GetScheduleForPersonStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      case GetScheduleForPersonStatus.PersonNotFound:
        return response.status(404).json({ error: "Person not found." });
      case GetScheduleForPersonStatus.PersonNotInHouse:
        return response.status(404).json({ error: "Person not in house." });
      default:
        console.error(
          "GetScheduleForPersonService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
