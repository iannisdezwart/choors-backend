import { Request, Response } from "express";
import {
  GetDetailedTaskStatus,
  ITaskRepository,
} from "../../../../repositories/domains/task/ITaskRepository";
import { AService } from "../../../util/IService";

export class GetDetailedTaskService extends AService {
  constructor(private taskRepository: ITaskRepository) {
    super();
  }

  async run(request: Request, response: Response) {
    const personId = response.locals.authenticatedPersonId;
    const houseId = request.params.houseId;
    const taskId = request.params.taskId;

    const tasks = await this.taskRepository.getDetailedTask(
      personId,
      houseId,
      taskId
    );

    switch (tasks.status) {
      case GetDetailedTaskStatus.Success:
        return response.status(200).json(tasks.task);
      case GetDetailedTaskStatus.PersonNotInHouse:
        return response.status(403).json({ error: "Unknown error occurred." });
      case GetDetailedTaskStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      case GetDetailedTaskStatus.TaskNotFound:
        return response.status(404).json({ error: "Task not found." });
      default:
        console.error(
          "GetDetailedTaskService.run() - Unknown status:",
          tasks.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
