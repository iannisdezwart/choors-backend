import { Request, Response } from "express";
import {
  DelegateScheduledTaskStatus,
  IScheduleRepository,
} from "../../../../repositories/domains/schedule/IScheduleRepository";
import { AService } from "../../../util/IService";

export class DelegateScheduledTaskService extends AService {
  constructor(private scheduleRepository: IScheduleRepository) {
    super();
  }

  async run(request: Request, response: Response) {
    const reqPersonId = response.locals.authenticatedPersonId;
    const houseId = request.params.houseId;
    const taskId = request.params.taskId;
    const personId = request.body.personId;

    const result = await this.scheduleRepository.delegateScheduledTask(
      reqPersonId,
      houseId,
      taskId,
      personId
    );

    switch (result.status) {
      case DelegateScheduledTaskStatus.Success:
        return response.status(204).end();
      case DelegateScheduledTaskStatus.TaskNotFound:
        return response.status(404).json({ error: "Task not found." });
      case DelegateScheduledTaskStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      case DelegateScheduledTaskStatus.PersonNotFound:
        return response.status(404).json({ error: "Person not found." });
      case DelegateScheduledTaskStatus.ReqPersonNotInHouse:
        return response.status(404).json({ error: "Person not in house." });
      default:
        console.error(
          "DelegateScheduledTaskService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
