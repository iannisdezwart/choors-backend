import { Request, Response } from "express";
import {
  GetScheduledTaskDetailsStatus,
  IScheduleRepository,
} from "../../../../repositories/domains/schedule/IScheduleRepository";
import { AService } from "../../../util/IService";

export class GetScheduledTaskDetailsService extends AService {
  constructor(private scheduleRepository: IScheduleRepository) {
    super();
  }

  async run(request: Request, response: Response) {
    const reqPersonId = response.locals.authenticatedPersonId;
    const houseId = request.params.houseId;
    const taskId = request.params.taskId;

    const result = await this.scheduleRepository.getScheduledTaskDetails(
      reqPersonId,
      houseId,
      taskId
    );

    switch (result.status) {
      case GetScheduledTaskDetailsStatus.Success:
        return response.status(200).json({
          task: result.task,
        });
      case GetScheduledTaskDetailsStatus.ReqPersonNotInHouse:
        return response
          .status(403)
          .json({ error: "Requesting person not in house." });
      case GetScheduledTaskDetailsStatus.TaskNotFound:
        return response.status(404).json({ error: "Task not found." });
      case GetScheduledTaskDetailsStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      default:
        console.error(
          "GetScheduledTaskDetailsService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
