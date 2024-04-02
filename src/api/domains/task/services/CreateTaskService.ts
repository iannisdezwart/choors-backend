import { Request, Response } from "express";
import ms from "ms";
import {
  CreateTaskStatus,
  ITaskRepository,
} from "../../../../repositories/domains/task/ITaskRepository.js";
import { ITimeProvider } from "../../../../utils/time-provider/ITimeProvider.js";
import { AService } from "../../../util/AService.js";

export class CreateTaskService extends AService {
  constructor(
    private taskRepository: ITaskRepository,
    private timeProvider: ITimeProvider
  ) {
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

    const freqBaseDate = new Date(freqBase);

    if (isNaN(freqBaseDate.getTime())) {
      return response.status(400).json({ error: "Invalid freqBase." });
    }

    if (
      freqBaseDate.getMinutes() != 0 ||
      freqBaseDate.getSeconds() != 0 ||
      freqBaseDate.getMilliseconds() != 0
    ) {
      return response.status(400).json({
        error:
          "Invalid task frequency (freqBase). Can only schedule tasks that occur on a whole hour.",
      });
    }

    if (this.timeProvider.now() - freqBaseDate.getTime() > ms("1d")) {
      return response.status(400).json({
        error:
          "Invalid task frequency (freqBase). First instance of task cannot be more than 24 hours ago.",
      });
    }

    if (freqBaseDate.getTime() - this.timeProvider.now() > ms("1y")) {
      return response.status(400).json({
        error:
          "Invalid task frequency (freqBase). First instance of task must be less than a year in the future.",
      });
    }

    if (typeof freqOffset !== "number") {
      return response.status(400).json({ error: "Invalid freqOffset." });
    }

    if (freqOffset % ms("1h") != 0) {
      return response.status(400).json({
        error:
          "Invalid task frequency (freqOffset). Task interval must be a multiple of an hour.",
      });
    }

    if (freqOffset > ms("1y")) {
      return response.status(400).json({
        error:
          "Invalid task frequency (freqOffset). Task interval must be less than a year.",
      });
    }

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
        return response.status(204).end();
      case CreateTaskStatus.PersonNotInHouse:
        return response.status(403).json({ error: "Person not in house." });
      case CreateTaskStatus.HouseNotFound:
        return response.status(404).json({ error: "House not found." });
      case CreateTaskStatus.ResponsibleGroupNotFound:
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
