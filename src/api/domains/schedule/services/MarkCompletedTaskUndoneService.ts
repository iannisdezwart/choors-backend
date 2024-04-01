import { Request, Response } from "express";
import {
  IScheduleRepository,
  MarkCompletedTaskUndoneStatus,
} from "../../../../repositories/domains/schedule/IScheduleRepository.js";
import { AService } from "../../../util/AService.js";

export class MarkCompletedTaskUndoneService extends AService {
  constructor(private scheduleRepository: IScheduleRepository) {
    super();
  }

  async run(request: Request, response: Response) {
    const reqPersonId = response.locals.authenticatedPersonId;
    const houseId = request.params.houseId;
    const taskId = request.params.taskId;

    const result = await this.scheduleRepository.markCompletedTaskUndone(
      reqPersonId,
      houseId,
      taskId
    );

    switch (result.status) {
      case MarkCompletedTaskUndoneStatus.Success:
        return response.status(204).end();
      case MarkCompletedTaskUndoneStatus.ReqPersonNotInHouse:
        return response
          .status(403)
          .json({ error: "Requesting person not in house." });
      case MarkCompletedTaskUndoneStatus.TaskNotFound:
        return response.status(404).json({ error: "Task not found." });
      case MarkCompletedTaskUndoneStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      case MarkCompletedTaskUndoneStatus.UnknownError:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error(
          "MarkCompletedTaskDoneService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
