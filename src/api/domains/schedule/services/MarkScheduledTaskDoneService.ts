import { Request, Response } from "express";
import {
  IScheduleRepository,
  MarkScheduledTaskDoneStatus,
} from "../../../../repositories/domains/schedule/IScheduleRepository.js";
import { AService } from "../../../util/AService.js";

export class MarkScheduledTaskDoneService extends AService {
  constructor(private scheduleRepository: IScheduleRepository) {
    super();
  }

  async run(request: Request, response: Response) {
    const reqPersonId = response.locals.authenticatedPersonId;
    const houseId = request.params.houseId;
    const scheduledTaskId = request.params.scheduledTaskId;

    if (scheduledTaskId == null) {
      return response
        .status(400)
        .json({ error: "Missing required parameter 'scheduledTaskId'." });
    }

    const result = await this.scheduleRepository.markScheduledTaskDone(
      reqPersonId,
      houseId,
      scheduledTaskId
    );

    switch (result.status) {
      case MarkScheduledTaskDoneStatus.Success:
        return response.status(204).end();
      case MarkScheduledTaskDoneStatus.ReqPersonNotInHouse:
        return response
          .status(403)
          .json({ error: "Requesting person not in house." });
      case MarkScheduledTaskDoneStatus.TaskNotFound:
        return response.status(404).json({ error: "Task not found." });
      case MarkScheduledTaskDoneStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      case MarkScheduledTaskDoneStatus.UnknownError:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error(
          "MarkScheduledTaskDoneService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
