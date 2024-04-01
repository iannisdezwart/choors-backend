import { Request, Response } from "express";
import {
  CreateTaskStatus,
  ITaskRepository,
} from "../../../../repositories/domains/task/ITaskRepository.js";
import { AService } from "../../../util/AService.js";

export class CreateTaskService extends AService {
  constructor(private taskRepository: ITaskRepository) {
    super();
  }

  async run(request: Request, response: Response) {
    const personId = response.locals.authenticatedPersonId;
    const houseId = request.params.houseId;

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

    const result = await this.taskRepository.createTask(personId, houseId, {
      name,
      description,
      freqBase,
      freqOffset,
      timeLimit,
      scheduleOffset,
      points,
      penalty,
      responsibleTaskGroup,
    });

    switch (result.status) {
      case CreateTaskStatus.Success:
        return response.status(201).end();
      case CreateTaskStatus.PersonNotInHouse:
        return response.status(403).json({ error: "Person not in house." });
      case CreateTaskStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      default:
        console.error(
          "CreateTaskService.run() - Unknown status:",
          result.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
