import { Request, Response } from "express";
import {
    ITaskRepository,
    UpdateTaskStatus,
} from "../../../../repositories/ITaskRepository";
import { IService } from "../../../util/IService";

export class UpdateTaskService implements IService {
  constructor(private taskRepository: ITaskRepository) {}

  async run(request: Request, response: Response) {
    const personId = response.locals.authenticatedPersonId;
    const houseId = request.params.houseId;
    const taskId = request.params.taskId;

    const {
      name,
      description,
      freqBase,
      freqOffset,
      timeLimit,
      scheduleOffset,
      points,
      penalty,
      responsibleTaskGroup,
    } = request.body;

    const result = await this.taskRepository.updateTask(
      personId,
      houseId,
      taskId,
      {
        name,
        description,
        freqBase,
        freqOffset,
        timeLimit,
        scheduleOffset,
        points,
        penalty,
        responsibleTaskGroup,
      }
    );

    switch (result.status) {
      case UpdateTaskStatus.Success:
        return response.status(201).end();
      case UpdateTaskStatus.PersonNotInHouse:
        return response.status(403).json({ error: "Person not in house." });
      case UpdateTaskStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      case UpdateTaskStatus.TaskNotFound:
        return response.status(404).json({ error: "Task not found." });
      case UpdateTaskStatus.ResponsibleGroupNotFound:
        return response
          .status(404)
          .json({ error: "Responsible group not found." });
      default:
        console.error(
          "CreateTaskService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
