import { Request, Response } from "express";
import {
    DeleteTaskStatus,
    ITaskRepository,
} from "../../../../repositories/domains/task/ITaskRepository";
import { IService } from "../../../util/IService";

export class DeleteTaskService implements IService {
  constructor(private taskRepository: ITaskRepository) {}

  async run(request: Request, response: Response) {
    const personId = response.locals.authenticatedPersonId;
    const houseId = request.params.houseId;
    const taskId = request.params.taskId;

    const result = await this.taskRepository.deleteTask(
      personId,
      houseId,
      taskId
    );

    switch (result.status) {
      case DeleteTaskStatus.Success:
        return response.status(204).end();
      case DeleteTaskStatus.PersonNotInHouse:
        return response.status(403).json({ error: "Person not in house." });
      case DeleteTaskStatus.TaskNotFound:
        return response.status(404).json({ error: "Task not found." });
      case DeleteTaskStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      default:
        console.error(
          "DeleteTaskService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
