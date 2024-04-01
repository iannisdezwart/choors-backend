import pg from "pg";
import {
  CreateTaskResult,
  CreateTaskStatus,
  DeleteTaskResult,
  DeleteTaskStatus,
  GetDetailedTaskResult,
  GetDetailedTaskStatus,
  GetTasksForHouseResult,
  GetTasksForHouseStatus,
  ITaskRepository,
  TaskRequest,
  UpdateTaskResult,
  UpdateTaskStatus,
} from "./ITaskRepository.js";

export class TaskRepository implements ITaskRepository {
  constructor(private dbPool: pg.Pool) {}

  async getTasksForHouse(
    personId: string,
    houseId: string
  ): Promise<GetTasksForHouseResult> {
    const person = await this.dbPool.query(
      "SELECT * FROM person WHERE id = $1",
      [personId]
    );

    if (person.rowCount != 1 || person.rows[0] == null) {
      return { status: GetTasksForHouseStatus.PersonNotFound };
    }

    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: GetTasksForHouseStatus.HouseNotFound };
    }

    const personInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [personId, houseId]
    );

    if (personInHouse.rowCount != 1 || personInHouse.rows[0] == null) {
      return { status: GetTasksForHouseStatus.PersonNotInHouse };
    }

    const tasks = await this.dbPool.query(
      `
      SELECT task.id, task.name, task.freq_base, task.freq_offset, task.time_limit,
        task.schedule_offset, task.points, task_group.name AS responsible_task_group
      FROM task, task_group
      WHERE task.responsible_task_group_id = task_group.id
      AND task.house_id = $1
    `,
      [houseId]
    );

    return {
      status: GetTasksForHouseStatus.Success,
      tasks: tasks.rows.map((row) => ({
        id: row.id,
        name: row.name,
        freqBase: row.freq_base,
        freqOffset: row.freq_offset,
        timeLimit: row.time_limit,
        scheduleOffset: row.schedule_offset,
        points: row.points,
        responsibleTaskGroup: row.responsible_task_group,
      })),
    };
  }

  async createTask(
    personId: string,
    houseId: string,
    task: TaskRequest
  ): Promise<CreateTaskResult> {
    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: CreateTaskStatus.HouseNotFound };
    }

    const personInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [personId, houseId]
    );

    if (personInHouse.rowCount != 1 || personInHouse.rows[0] == null) {
      return { status: CreateTaskStatus.PersonNotInHouse };
    }

    const taskGroup = await this.dbPool.query(
      "SELECT * FROM task_group WHERE name = $1",
      [task.responsibleTaskGroup]
    );

    const taskGroupId = taskGroup.rows[0].id;

    if (taskGroup.rowCount != 1 || taskGroupId == null) {
      return { status: CreateTaskStatus.ResponsibleGroupNotFound };
    }

    await this.dbPool.query(
      `
      INSERT INTO task (name, description, freq_base, freq_offset, time_limit,
        schedule_offset, points, penalty, responsible_task_group_id, house_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `,
      [
        task.name,
        task.description,
        task.freqBase,
        task.freqOffset,
        task.timeLimit,
        task.scheduleOffset,
        task.points,
        task.penalty,
        taskGroupId,
        houseId,
      ]
    );

    return { status: CreateTaskStatus.Success };
  }

  async getDetailedTask(
    personId: string,
    houseId: string,
    taskId: string
  ): Promise<GetDetailedTaskResult> {
    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: GetDetailedTaskStatus.HouseNotFound };
    }

    const personInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [personId, houseId]
    );

    if (personInHouse.rowCount != 1 || personInHouse.rows[0] == null) {
      return { status: GetDetailedTaskStatus.PersonNotInHouse };
    }

    const task = await this.dbPool.query(
      `
      SELECT task.id, task.name, task.description, task.freq_base, task.freq_offset, task.time_limit,
        task.schedule_offset, task.points, task.penalty, task_group.name AS responsible_task_group
      FROM task, task_group
      WHERE task.responsible_task_group_id = task_group.id
      AND task.house_id = $1
      AND task.id = $2
    `,
      [houseId, taskId]
    );

    if (task.rowCount != 1 || task.rows[0] == null) {
      return { status: GetDetailedTaskStatus.TaskNotFound };
    }

    const row = task.rows[0];

    return {
      status: GetDetailedTaskStatus.Success,
      task: {
        id: row.id,
        name: row.name,
        description: row.description,
        freqBase: row.freq_base,
        freqOffset: row.freq_offset,
        timeLimit: row.time_limit,
        scheduleOffset: row.schedule_offset,
        points: row.points,
        penalty: row.penalty,
        responsibleTaskGroup: row.responsible_task_group,
      },
    };
  }

  async updateTask(
    personId: string,
    houseId: string,
    taskId: string,
    task: Partial<TaskRequest>
  ): Promise<UpdateTaskResult> {
    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: UpdateTaskStatus.HouseNotFound };
    }

    const personInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [personId, houseId]
    );

    if (personInHouse.rowCount != 1 || personInHouse.rows[0] == null) {
      return { status: UpdateTaskStatus.PersonNotInHouse };
    }

    const existingTask = await this.dbPool.query(
      `
        SELECT task.id, task.name, task.description, task.freq_base, task.freq_offset, task.time_limit,
          task.schedule_offset, task.points, task.penalty, task_group.name AS responsible_task_group
        FROM task, house, task_group
        WHERE house.id = $1
        AND task.id = $2
        AND task.house_id = house.id
        AND task.responsible_task_group_id = task_group.id
      `,
      [houseId, taskId]
    );

    if (existingTask.rowCount != 1 || existingTask.rows[0] == null) {
      return { status: UpdateTaskStatus.TaskNotFound };
    }

    const filledTask: TaskRequest = {
      name: task.name ?? existingTask.rows[0].name,
      description: task.description ?? existingTask.rows[0].description,
      freqBase: task.freqBase ?? existingTask.rows[0].freq_base,
      freqOffset: task.freqOffset ?? existingTask.rows[0].freq_offset,
      timeLimit: task.timeLimit ?? existingTask.rows[0].time_limit,
      scheduleOffset:
        task.scheduleOffset ?? existingTask.rows[0].schedule_offset,
      points: task.points ?? existingTask.rows[0].points,
      penalty: task.penalty ?? existingTask.rows[0].penalty,
      responsibleTaskGroup:
        task.responsibleTaskGroup ??
        existingTask.rows[0].responsible_task_group,
    };

    const taskGroup = await this.dbPool.query(
      "SELECT * FROM task_group WHERE name = $1",
      [filledTask.responsibleTaskGroup]
    );

    const taskGroupId = taskGroup.rows[0].id;

    if (taskGroup.rowCount != 1 || taskGroupId == null) {
      return { status: UpdateTaskStatus.ResponsibleGroupNotFound };
    }

    await this.dbPool.query(
      `
      UPDATE task
      SET name = $1, description = $2, freq_base = $3, freq_offset = $4, time_limit = $5,
        schedule_offset = $6, points = $7, penalty = $8, responsible_task_group_id = $9
      WHERE id = $10
    `,
      [
        filledTask.name,
        filledTask.description,
        filledTask.freqBase,
        filledTask.freqOffset,
        filledTask.timeLimit,
        filledTask.scheduleOffset,
        filledTask.points,
        filledTask.penalty,
        taskGroupId,
        taskId,
      ]
    );

    return { status: UpdateTaskStatus.Success };
  }

  async deleteTask(
    personId: string,
    houseId: string,
    taskId: string
  ): Promise<DeleteTaskResult> {
    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: DeleteTaskStatus.HouseNotFound };
    }

    const personInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [personId, houseId]
    );

    if (personInHouse.rowCount != 1 || personInHouse.rows[0] == null) {
      return { status: DeleteTaskStatus.PersonNotInHouse };
    }

    const task = await this.dbPool.query(
      "SELECT * FROM task WHERE id = $1 AND house_id = $2",
      [taskId, houseId]
    );

    if (task.rowCount != 1 || task.rows[0] == null) {
      return { status: DeleteTaskStatus.TaskNotFound };
    }

    await this.dbPool.query("DELETE FROM task WHERE id = $1", [taskId]);

    return { status: DeleteTaskStatus.Success };
  }
}
