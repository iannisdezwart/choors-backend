import { Request, Response } from "express";
import {
  ComplainAboutTaskStatus,
  IScheduleRepository,
} from "../../../../repositories/domains/schedule/IScheduleRepository.js";
import { AService } from "../../../util/AService.js";

export class ComplainAboutCompletedTaskService extends AService {
  constructor(private scheduleRepository: IScheduleRepository) {
    super();
  }

  async run(request: Request, response: Response) {
    const reqPersonId = response.locals.authenticatedPersonId;
    const houseId = request.params.houseId;
    const taskId = request.params.taskId;
    const message = request.body.message;

    if (!message) {
      return response.status(400).json({ error: "Missing 'message' field." });
    }

    if (typeof message !== "string") {
      return response.status(400).json({
        error: "Unexpected type of 'message' field. Expected string.",
      });
    }

    const result = await this.scheduleRepository.complainAboutCompletedTask(
      reqPersonId,
      houseId,
      taskId,
      message
    );

    switch (result.status) {
      case ComplainAboutTaskStatus.Success:
        return response.status(204).end();
      case ComplainAboutTaskStatus.TaskNotFound:
        return response.status(404).json({ error: "Task not found." });
      case ComplainAboutTaskStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      default:
        console.error(
          "ComplainAboutCompletedTaskService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
