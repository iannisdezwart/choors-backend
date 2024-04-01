import { Request, Response } from "express";
import {
  GetCompletedTaskDetailsStatus,
  IScheduleRepository,
} from "../../../../repositories/domains/schedule/IScheduleRepository";
import { AService } from "../../../util/IService";

export class GetCompletedTaskDetailsService extends AService {
  constructor(private scheduleRepository: IScheduleRepository) {
    super();
  }

  async run(request: Request, response: Response) {
    const reqPersonId = response.locals.authenticatedPersonId;
    const houseId = request.params.houseId;
    const taskId = request.params.taskId;

    const result = await this.scheduleRepository.getCompletedTaskDetails(
      reqPersonId,
      houseId,
      taskId
    );

    switch (result.status) {
      case GetCompletedTaskDetailsStatus.Success:
        return response.status(200).json({
          task: result.task,
        });
      case GetCompletedTaskDetailsStatus.ReqPersonNotInHouse:
        return response
          .status(403)
          .json({ error: "Requesting person not in house." });
      case GetCompletedTaskDetailsStatus.TaskNotFound:
        return response.status(404).json({ error: "Task not found." });
      case GetCompletedTaskDetailsStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      default:
        console.error(
          "GetCompletedTaskDetailsService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
