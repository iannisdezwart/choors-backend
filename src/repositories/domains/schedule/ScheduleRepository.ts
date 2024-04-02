import pg from "pg";
import { ITimeProvider } from "../../../utils/time-provider/ITimeProvider.js";
import {
  ComplainAboutTaskResult,
  ComplainAboutTaskStatus,
  DelegateScheduledTaskResult,
  DelegateScheduledTaskStatus,
  GetCompletedTaskDetailsResult,
  GetCompletedTaskDetailsStatus,
  GetScheduleForPersonResult,
  GetScheduleForPersonStatus,
  GetScheduledTaskDetailsResult,
  GetScheduledTaskDetailsStatus,
  IScheduleRepository,
  MarkCompletedTaskUndoneResult,
  MarkCompletedTaskUndoneStatus,
  MarkScheduledTaskDoneResult,
  MarkScheduledTaskDoneStatus,
} from "./IScheduleRepository.js";

export class ScheduleRepository implements IScheduleRepository {
  constructor(private dbPool: pg.Pool, private timeProvider: ITimeProvider) {}

  async getScheduleForPerson(
    reqPersonId: string,
    houseId: string,
    personId: string
  ): Promise<GetScheduleForPersonResult> {
    const person = await this.dbPool.query(
      "SELECT * FROM person WHERE id = $1",
      [personId]
    );

    if (person.rowCount != 1 || person.rows[0] == null) {
      return { status: GetScheduleForPersonStatus.PersonNotFound };
    }

    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: GetScheduleForPersonStatus.HouseNotFound };
    }

    const personInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [personId, houseId]
    );

    if (personInHouse.rowCount != 1 || personInHouse.rows[0] == null) {
      return { status: GetScheduleForPersonStatus.PersonNotInHouse };
    }

    const reqPersonInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [reqPersonId, houseId]
    );

    if (reqPersonInHouse.rowCount != 1 || reqPersonInHouse.rows[0] == null) {
      return { status: GetScheduleForPersonStatus.ReqPersonNotInHouse };
    }

    const schedule = await this.dbPool.query(
      `
      SELECT scheduled_task.id, task.name, task.points, scheduled_task.due_date
      FROM scheduled_task, task
      WHERE scheduled_task.responsible_person_id = $2
      AND scheduled_task.task_id = task.id
      AND task.house_id = $1
    `,
      [houseId, personId]
    );

    const history = await this.dbPool.query(
      `
      SELECT completed_task.id, task.name, task.points, completed_task.due_date,
        completed_task.penalty, completed_task.is_penalised
      FROM completed_task, task
      WHERE completed_task.responsible_person_id = $2
      AND completed_task.task_id = task.id
      AND task.house_id = $1
    `,
      [houseId, personId]
    );

    return {
      status: GetScheduleForPersonStatus.Success,
      schedule: schedule.rows.map((row) => ({
        id: row.id.toString(),
        name: row.name,
        dueDate: row.due_date,
        points: row.points,
      })),
      history: history.rows.map((row) => ({
        id: row.id.toString(),
        name: row.name,
        points: row.points,
        penalty: row.penalty,
        dueDate: row.due_date,
        isPenalised: row.is_penalised,
      })),
    };
  }

  async getScheduledTaskDetails(
    reqPersonId: string,
    houseId: string,
    taskId: string
  ): Promise<GetScheduledTaskDetailsResult> {
    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: GetScheduledTaskDetailsStatus.HouseNotFound };
    }

    const reqPersonInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [reqPersonId, houseId]
    );

    if (reqPersonInHouse.rowCount != 1 || reqPersonInHouse.rows[0] == null) {
      return { status: GetScheduledTaskDetailsStatus.ReqPersonNotInHouse };
    }

    const scheduledTask = await this.dbPool.query(
      `
        SELECT scheduled_task.id, task.name, task.points, scheduled_task.due_date,
          task.description, scheduled_task.responsible_person_id
        FROM scheduled_task, task
        WHERE scheduled_task.id = $2
        AND scheduled_task.task_id = task.id
        AND task.house_id = $1
      `,
      [houseId, taskId]
    );

    if (scheduledTask.rowCount != 1 || scheduledTask.rows[0] == null) {
      return { status: GetScheduledTaskDetailsStatus.TaskNotFound };
    }

    return {
      status: GetScheduledTaskDetailsStatus.Success,
      task: {
        id: scheduledTask.rows[0].id.toString(),
        name: scheduledTask.rows[0].name,
        dueDate: scheduledTask.rows[0].due_date,
        points: scheduledTask.rows[0].points,
        responsiblePerson:
          scheduledTask.rows[0].responsible_person_id.toString(),
        description: scheduledTask.rows[0].description,
      },
    };
  }

  async getCompletedTaskDetails(
    reqPersonId: string,
    houseId: string,
    taskId: string
  ): Promise<GetCompletedTaskDetailsResult> {
    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: GetCompletedTaskDetailsStatus.HouseNotFound };
    }

    const reqPersonInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [reqPersonId, houseId]
    );

    if (reqPersonInHouse.rowCount != 1 || reqPersonInHouse.rows[0] == null) {
      return { status: GetCompletedTaskDetailsStatus.ReqPersonNotInHouse };
    }

    const completedTask = await this.dbPool.query(
      `
        SELECT completed_task.id, task.name, task.points, completed_task.due_date,
          task.description, completed_task.responsible_person_id, completed_task.penalty,
          completed_task.is_penalised
        FROM completed_task, task
        WHERE completed_task.id = $2
        AND completed_task.task_id = task.id
        AND task.house_id = $1
      `,
      [houseId, taskId]
    );

    if (completedTask.rowCount != 1 || completedTask.rows[0] == null) {
      return { status: GetCompletedTaskDetailsStatus.TaskNotFound };
    }

    return {
      status: GetCompletedTaskDetailsStatus.Success,
      task: {
        id: completedTask.rows[0].id.toString(),
        name: completedTask.rows[0].name,
        dueDate: completedTask.rows[0].due_date,
        points: completedTask.rows[0].points,
        responsiblePerson:
          completedTask.rows[0].responsible_person_id.toString(),
        description: completedTask.rows[0].description,
        penalty: completedTask.rows[0].penalty,
        isPenalised: completedTask.rows[0].is_penalised,
      },
    };
  }

  async markScheduledTaskDone(
    reqPersonId: string,
    houseId: string,
    taskId: string
  ): Promise<MarkScheduledTaskDoneResult> {
    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: MarkScheduledTaskDoneStatus.HouseNotFound };
    }

    const reqPersonInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [reqPersonId, houseId]
    );

    if (reqPersonInHouse.rowCount != 1 || reqPersonInHouse.rows[0] == null) {
      return { status: MarkScheduledTaskDoneStatus.ReqPersonNotInHouse };
    }

    const scheduledTask = await this.dbPool.query(
      `
        SELECT task.points, task.penalty, task.id AS task_id,
          scheduled_task.id AS scheduled_task_id,
          scheduled_task.due_date, scheduled_task.start_date,
          scheduled_task.responsible_person_id
        FROM scheduled_task, task
        WHERE scheduled_task.id = $2
        AND scheduled_task.task_id = task.id
        AND task.house_id = $1
      `,
      [houseId, taskId]
    );

    if (scheduledTask.rowCount != 1 || scheduledTask.rows[0] == null) {
      return { status: MarkScheduledTaskDoneStatus.TaskNotFound };
    }

    const scheduledTaskRow = scheduledTask.rows[0];

    await this.dbPool.query("BEGIN");
    try {
      await this.dbPool.query("DELETE FROM scheduled_task WHERE id = $1", [
        taskId,
      ]);

      const now = new Date(this.timeProvider.now());
      await this.dbPool.query(
        `
          INSERT INTO completed_task
          (
            task_id, responsible_person_id, start_date, due_date, completion_date,
            points, penalty, is_penalised
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE)
        `,
        [
          scheduledTaskRow.task_id,
          scheduledTaskRow.responsible_person_id,
          scheduledTaskRow.start_date,
          scheduledTaskRow.due_date,
          now,
          scheduledTaskRow.points,
          scheduledTaskRow.penalty,
        ]
      );

      await this.dbPool.query("COMMIT");
      return { status: MarkScheduledTaskDoneStatus.Success };
    } catch (exc) {
      console.error("MarkScheduledTaskDoneService.run() - Exception:", exc);
      await this.dbPool.query("ROLLBACK");
      return { status: MarkScheduledTaskDoneStatus.UnknownError };
    }
  }

  async markCompletedTaskUndone(
    reqPersonId: string,
    houseId: string,
    taskId: string
  ): Promise<MarkCompletedTaskUndoneResult> {
    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: MarkCompletedTaskUndoneStatus.HouseNotFound };
    }

    const reqPersonInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [reqPersonId, houseId]
    );

    if (reqPersonInHouse.rowCount != 1 || reqPersonInHouse.rows[0] == null) {
      return { status: MarkCompletedTaskUndoneStatus.ReqPersonNotInHouse };
    }

    const completedTask = await this.dbPool.query(
      `
        SELECT task.points, task.penalty, task.id AS task_id,
          completed_task.id AS completed_task_id,
          completed_task.due_date, completed_task.start_date,
          completed_task.responsible_person_id
        FROM completed_task, task
        WHERE completed_task.id = $2
        AND completed_task.task_id = task.id
        AND task.house_id = $1
      `,
      [houseId, taskId]
    );

    if (completedTask.rowCount != 1 || completedTask.rows[0] == null) {
      return { status: MarkCompletedTaskUndoneStatus.TaskNotFound };
    }

    const completedTaskRow = completedTask.rows[0];

    await this.dbPool.query("BEGIN");
    try {
      await this.dbPool.query("DELETE FROM completed_task WHERE id = $1", [
        taskId,
      ]);

      await this.dbPool.query(
        `
          INSERT INTO scheduled_task
          (
            task_id, responsible_person_id, start_date, due_date
          )
          VALUES ($1, $2, $3, $4)
        `,
        [
          completedTaskRow.task_id,
          completedTaskRow.responsible_person_id,
          completedTaskRow.start_date,
          completedTaskRow.due_date,
        ]
      );

      await this.dbPool.query("COMMIT");
      return { status: MarkCompletedTaskUndoneStatus.Success };
    } catch (exc) {
      console.error("MarkCompletedTaskUndoneService.run() - Exception:", exc);
      await this.dbPool.query("ROLLBACK");
      return { status: MarkCompletedTaskUndoneStatus.UnknownError };
    }
  }

  async delegateScheduledTask(
    reqPersonId: string,
    houseId: string,
    taskId: string,
    personId: string
  ): Promise<DelegateScheduledTaskResult> {
    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: DelegateScheduledTaskStatus.HouseNotFound };
    }

    const reqPersonInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [reqPersonId, houseId]
    );

    if (reqPersonInHouse.rowCount != 1 || reqPersonInHouse.rows[0] == null) {
      return { status: DelegateScheduledTaskStatus.ReqPersonNotInHouse };
    }

    const person = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [personId, houseId]
    );

    if (person.rowCount != 1 || person.rows[0] == null) {
      return { status: DelegateScheduledTaskStatus.PersonNotFound };
    }

    const scheduledTask = await this.dbPool.query(
      `
        SELECT task.points, task.penalty, task.id AS task_id,
          scheduled_task.id AS scheduled_task_id,
          scheduled_task.due_date, scheduled_task.start_date,
          scheduled_task.responsible_person_id
        FROM scheduled_task, task
        WHERE scheduled_task.id = $2
        AND scheduled_task.task_id = task.id
        AND task.house_id = $1
      `,
      [houseId, taskId]
    );

    if (scheduledTask.rowCount != 1 || scheduledTask.rows[0] == null) {
      return { status: DelegateScheduledTaskStatus.TaskNotFound };
    }

    await this.dbPool.query(
      "UPDATE scheduled_task SET responsible_person_id = $1 WHERE id = $2",
      [personId, taskId]
    );

    return { status: DelegateScheduledTaskStatus.Success };
  }

  async complainAboutCompletedTask(
    reqPersonId: string,
    houseId: string,
    taskId: string,
    message: string
  ): Promise<ComplainAboutTaskResult> {
    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: ComplainAboutTaskStatus.HouseNotFound };
    }

    const reqPersonInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [reqPersonId, houseId]
    );

    if (reqPersonInHouse.rowCount != 1 || reqPersonInHouse.rows[0] == null) {
      return { status: ComplainAboutTaskStatus.ReqPersonNotInHouse };
    }

    const completedTask = await this.dbPool.query(
      `
        SELECT task.id
        FROM completed_task, task
        WHERE completed_task.id = $2
        AND completed_task.task_id = task.id
        AND task.house_id = $1
      `,
      [houseId, taskId]
    );

    if (completedTask.rowCount != 1 || completedTask.rows[0] == null) {
      return { status: ComplainAboutTaskStatus.TaskNotFound };
    }

    const now = new Date(this.timeProvider.now());
    await this.dbPool.query(
      `
        INSERT INTO complaint
        (completed_task_id, complainer_person_id, complaint_date, message)
        VALUES ($1, $2, $3, $4)
      `,
      [taskId, reqPersonId, now, message] as any[]
    );

    return { status: ComplainAboutTaskStatus.Success };
  }
}
