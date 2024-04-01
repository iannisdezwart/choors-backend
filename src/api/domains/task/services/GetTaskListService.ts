import { Request, Response } from "express";
import {
  GetTasksForHouseStatus,
  ITaskRepository,
} from "../../../../repositories/domains/task/ITaskRepository.js";
import { AService } from "../../../util/AService.js";

export class GetTaskListService extends AService {
  constructor(private taskRepository: ITaskRepository) {
    super();
  }

  async run(request: Request, response: Response) {
    const personId = response.locals.authenticatedPersonId;
    const houseId = request.params.houseId;

    if (!houseId) {
      return response
        .status(400)
        .json({ error: "Missing required field 'houseId'." });
    }

    const tasks = await this.taskRepository.getTasksForHouse(personId, houseId);

    switch (tasks.status) {
      case GetTasksForHouseStatus.Success:
        return response.status(200).json(tasks.tasks);
      case GetTasksForHouseStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      case GetTasksForHouseStatus.PersonNotFound:
        return response.status(500).json({ error: "Unknown error occurred." });
      default:
        console.error(
          "GetTaskListService.run() - Unknown status:",
          tasks.status
        );
        return response.status(500).json({ error: "Unknown error occurred." });
    }
  }
}
