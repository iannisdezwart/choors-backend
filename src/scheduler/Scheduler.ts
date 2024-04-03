import _ from "lodash";
import { Environment } from "../env/Environment.js";
import {
  IGroupRepository,
  PersonsInTaskGroupStatus,
} from "../repositories/domains/group/IGroupRepository.js";
import {
  GetPersonCurrentTasksPointsDistributionStatus,
  IHouseRepository,
} from "../repositories/domains/house/IHouseRepository.js";
import {
  AddScheduledTaskStatus,
  GetOverdueScheduledTasksStatus,
  GetTasksToBeScheduledStatus,
  ITaskRepository,
  OverdueScheduledTask,
  PenaliseOverdueScheduledTaskStatus,
  TaskToBeScheduled,
  UpdateNextSchedulerDateForTaskStatus,
} from "../repositories/domains/task/ITaskRepository.js";
import { ITimeProvider } from "../utils/time-provider/ITimeProvider.js";
import { IScheduler } from "./IScheduler.js";

export class Scheduler implements IScheduler {
  constructor(
    private taskRepository: ITaskRepository,
    private houseRepository: IHouseRepository,
    private groupRepository: IGroupRepository,
    private timeProvider: ITimeProvider,
    private env: Environment
  ) {}

  private isRunning = false;

  start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.run();
  }

  stop(): void {
    this.isRunning = false;
  }

  private async iteration(): Promise<void> {
    const tasksToBeScheduled = await this.taskRepository.getTasksToBeScheduled(
      new Date(this.timeProvider.now())
    );

    switch (tasksToBeScheduled.status) {
      case GetTasksToBeScheduledStatus.Success:
        break;
      default:
        console.error(
          "Scheduler.run() - Unexpected GetTasksToBeScheduledStatus",
          tasksToBeScheduled
        );
        return;
    }

    for (const task of tasksToBeScheduled.tasks!) {
      await this.scheduleTask(task);
    }

    const overdueTasks = await this.taskRepository.getOverdueScheduledTasks(
      new Date(this.timeProvider.now())
    );

    switch (overdueTasks.status) {
      case GetOverdueScheduledTasksStatus.Success:
        break;
      default:
        console.error(
          "Scheduler.run() - Unexpected GetTasksToBeScheduledStatus",
          overdueTasks
        );
        return;
    }

    for (const task of overdueTasks.tasks!) {
      this.penaliseOverdueTask(task);
    }
  }

  private async penaliseOverdueTask(task: OverdueScheduledTask): Promise<void> {
    const result = await this.taskRepository.penaliseOverdueScheduledTask(
      task.id
    );

    switch (result.status) {
      case PenaliseOverdueScheduledTaskStatus.TaskNotFound:
        console.error(
          "Scheduler.penaliseOverdueTask() - Task not found",
          result,
          task
        );
        return;
      case PenaliseOverdueScheduledTaskStatus.UnknownError:
        console.error(
          "Scheduler.penaliseOverdueTask() - Unknown error",
          result,
          task
        );
        return;
      case PenaliseOverdueScheduledTaskStatus.Success:
        break;
      default:
        console.error(
          "Scheduler.penaliseOverdueTask() - Unexpected status",
          result,
          task
        );
        return;
    }

    // - TBD: Notification to the user
  }

  private async scheduleTask(task: TaskToBeScheduled): Promise<void> {
    const distrResult =
      await this.houseRepository.getPersonCurrentTasksPointsDistribution(
        task.houseId,
        new Date(this.timeProvider.now())
      );

    switch (distrResult.status) {
      case GetPersonCurrentTasksPointsDistributionStatus.HouseNotFound:
        console.error(
          "Scheduler.scheduleTask() - House not found",
          distrResult,
          task
        );
        return;
      case GetPersonCurrentTasksPointsDistributionStatus.Success:
        break;
      default:
        console.error(
          "Scheduler.scheduleTask() - Unexpected GetPersonCurrentTasksPointsDistributionStatus",
          distrResult,
          task
        );
        return;
    }

    const taskGroupId = task.responsibleTaskGroupId;
    const personsInGroup = await this.groupRepository.personsInTaskGroup(
      taskGroupId
    );

    switch (personsInGroup.status) {
      case PersonsInTaskGroupStatus.Success:
        break;
      default:
        console.error(
          "Scheduler.scheduleTask() - Unexpected PersonsInTaskGroupStatus",
          personsInGroup,
          task
        );
        return;
    }

    let distr = distrResult
      .distribution!.filter((d) =>
        personsInGroup.personsInGroup!.includes(d.personId)
      )
      .sort((a, b) => a.points - b.points);
    const lowestPoints = distr[0].points;
    distr = _.shuffle(distr.filter((d) => d.points === lowestPoints));

    if (distr.length === 0) {
      console.error(
        "Scheduler.scheduleTask() - Task could not be scheduled - No persons in the group",
        taskGroupId
      );
      return;
    }

    const personId = distr[0].personId;

    let nextTime = task.nextSchedulerDate.getTime();
    while (
      nextTime + task.scheduleOffset - task.timeLimit <
      this.timeProvider.now()
    ) {
      nextTime += task.freqOffset;
    }

    const addScheduledTaskResult = await this.taskRepository.addScheduledTask(
      task.id,
      personId,
      new Date(nextTime - task.scheduleOffset),
      new Date(nextTime - task.scheduleOffset + task.timeLimit)
    );

    switch (addScheduledTaskResult.status) {
      case AddScheduledTaskStatus.PersonNotFound:
        console.error(
          "Scheduler.scheduleTask() - Person not found",
          addScheduledTaskResult,
          task
        );
        return;
      case AddScheduledTaskStatus.TaskNotFound:
        console.error(
          "Scheduler.scheduleTask() - Task not found",
          addScheduledTaskResult,
          task
        );
        return;
      case AddScheduledTaskStatus.Success:
        break;
      default:
        console.error(
          "Scheduler.scheduleTask() - Unexpected AddScheduledTaskResult",
          addScheduledTaskResult,
          task
        );
        return;
    }

    const nextSchedulerDate = new Date(nextTime);

    const updateNextSchedulerDateResult =
      await this.taskRepository.updateNextSchedulerDateForTask(
        task.id,
        nextSchedulerDate
      );

    switch (updateNextSchedulerDateResult.status) {
      case UpdateNextSchedulerDateForTaskStatus.TaskNotFound:
        console.error(
          "Scheduler.scheduleTask() - Task not found",
          updateNextSchedulerDateResult,
          task
        );
        return;
      case UpdateNextSchedulerDateForTaskStatus.Success:
        break;
      default:
        console.error(
          "Scheduler.scheduleTask() - Unexpected UpdateNextSchedulerDateForTaskResult",
          updateNextSchedulerDateResult,
          task
        );
        return;
    }

    // - TBD: Notification to the user
  }

  async run(): Promise<void> {
    const startTime = this.timeProvider.now();

    await this.iteration();

    if (!this.isRunning) {
      return;
    }

    const deltaTime = this.timeProvider.now() - startTime;
    const nextRunTime = this.env.schedulerInterval - deltaTime;

    setTimeout(() => {
      this.run();
    }, nextRunTime);
  }
}
