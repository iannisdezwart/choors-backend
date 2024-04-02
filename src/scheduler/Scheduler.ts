import { Environment } from "../env/Environment";
import { IHouseRepository } from "../repositories/domains/house/IHouseRepository";
import {
  GetTasksToBeScheduledStatus,
  ITaskRepository,
  TaskToBeScheduled,
} from "../repositories/domains/task/ITaskRepository";
import { ITimeProvider } from "../utils/time-provider/ITimeProvider";
import { IScheduler } from "./IScheduler";

export class Scheduler implements IScheduler {
  constructor(
    private taskRepository: ITaskRepository,
    private houseRepository: IHouseRepository,
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

    // TODO: Handle overdue tasks
    // - ITaskRepository.getOverdueScheduledTasks()
    // - ITaskRepository.penaliseOverdueScheduledTask()
    // - TBD: Notification to the user
  }

  private async scheduleTask(task: TaskToBeScheduled): Promise<void> {
    // TODO: Implement.
    // - IHouseRepository.getPersonCurrentTasksPointsDistribution()
    // - ITaskRepository.updateNextSchedulerDateForTask()
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
