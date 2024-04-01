import pg from "pg";
import {
  GetPersonDetailsResult,
  GetPersonDetailsStatus,
  IPersonRepository,
  ListPersonsResult,
  ListPersonsStatus,
  RemovePersonFromHouseResult,
  RemovePersonFromHouseStatus,
  UpdatePersonGroupsResult,
  UpdatePersonGroupsStatus,
} from "./IPersonRepository.js";

export class PersonRepository implements IPersonRepository {
  constructor(private dbPool: pg.Pool) {}

  async listPersons(
    personId: string,
    houseId: string
  ): Promise<ListPersonsResult> {
    const person = await this.dbPool.query(
      "SELECT * FROM person WHERE id = $1",
      [personId]
    );

    if (person.rowCount != 1 || person.rows[0] == null) {
      return { status: ListPersonsStatus.PersonNotFound };
    }

    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: ListPersonsStatus.HouseNotFound };
    }

    const personInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [personId, houseId]
    );

    if (personInHouse.rowCount != 1 || personInHouse.rows[0] == null) {
      return { status: ListPersonsStatus.PersonNotInHouse };
    }

    const persons = await this.dbPool.query(
      `
      SELECT person.id, person.name, person.picture,
        SUM(completed_task.points) AS points,
        SUM(completed_task.penalties) AS penalties
      FROM person, person_in_house, completed_task
      WHERE person.id = person_in_house.person_id
      AND person_in_house.house_id = $1
      AND completed_task.responsible_person_id = person.id
      GROUP BY completed_task.responsible_person_id
    `,
      [houseId]
    );

    return {
      status: ListPersonsStatus.Success,
      persons: persons.rows.map((row) => ({
        id: row.id,
        name: row.name,
        picture: row.picture,
        points: row.points,
        penalties: row.penalties,
      })),
    };
  }

  async getPersonDetails(
    reqPersonId: string,
    houseId: string,
    personId: string
  ): Promise<GetPersonDetailsResult> {
    const reqPerson = await this.dbPool.query(
      "SELECT * FROM person WHERE id = $1",
      [reqPersonId]
    );

    if (reqPerson.rowCount != 1 || reqPerson.rows[0] == null) {
      return { status: GetPersonDetailsStatus.ReqPersonNotFound };
    }

    const person = await this.dbPool.query(
      "SELECT * FROM person WHERE id = $1",
      [personId]
    );

    if (person.rowCount != 1 || person.rows[0] == null) {
      return { status: GetPersonDetailsStatus.PersonNotFound };
    }

    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: GetPersonDetailsStatus.HouseNotFound };
    }

    const reqPersonInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [reqPersonId, houseId]
    );

    if (reqPersonInHouse.rowCount != 1 || reqPersonInHouse.rows[0] == null) {
      return { status: GetPersonDetailsStatus.ReqPersonNotInHouse };
    }

    const personInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [personId, houseId]
    );

    if (personInHouse.rowCount != 1 || personInHouse.rows[0] == null) {
      return { status: GetPersonDetailsStatus.PersonNotInHouse };
    }

    const personDetails = await this.dbPool.query(
      `
      SELECT person.id, person.name, person.picture,
        SUM(completed_task.points) AS points,
        SUM(completed_task.penalties) AS penalties
      FROM person, person_in_house, completed_task
      WHERE person.id = person_in_house.person_id
      AND person_in_house.house_id = $1
      AND completed_task.responsible_person_id = person.id
      AND person.id = $2
      GROUP BY completed_task.responsible_person_id
    `,
      [houseId, personId]
    );

    const personEntry = personDetails.rows[0];

    const groups = await this.dbPool.query(
      `
      SELECT task_group.id, task_group.name
      FROM task_group, person_in_task_group
      WHERE task_group.id = person_in_task_group.group_id
      AND person_in_task_group.person_id = $1
      AND task_group.house_id = $2
    `,
      [personId, houseId]
    );

    const schedule = await this.dbPool.query(
      `
      SELECT schedule_entry.id, schedule_entry.name, schedule_entry.due_date, schedule_entry.points
      FROM schedule_entry
      WHERE schedule_entry.person_id = $1
      AND schedule_entry.house_id = $2
    `,
      [personId, houseId]
    );

    const historicalTasks = await this.dbPool.query(
      `
      SELECT completed_task.id, completed_task.name, completed_task.points,
        completed_task.penalty, completed_task.due_date, completed_task.is_penalised
      FROM completed_task
      WHERE completed_task.responsible_person_id = $1
      AND completed_task.house_id = $2
    `,
      [personId, houseId]
    );

    return {
      status: GetPersonDetailsStatus.Success,
      person: {
        id: personEntry.id,
        name: personEntry.name,
        picture: personEntry.picture,
        points: personEntry.points,
        penalties: personEntry.penalties,
        groups: groups.rows.map((row) => row.name),
        schedule: schedule.rows.map((row) => ({
          id: row.id,
          name: row.name,
          dueDate: row.due_date,
          points: row.points,
        })),
        historicalTasks: historicalTasks.rows.map((row) => ({
          id: row.id,
          name: row.name,
          points: row.points,
          penalty: row.penalty,
          dueDate: row.due_date,
          isPenalised: row.is_penalised,
        })),
      },
    };
  }

  async updatePersonGroups(
    reqPersonId: string,
    houseId: string,
    personId: string,
    groupIds: string[]
  ): Promise<UpdatePersonGroupsResult> {
    const reqPerson = await this.dbPool.query(
      "SELECT * FROM person WHERE id = $1",
      [reqPersonId]
    );

    if (reqPerson.rowCount != 1 || reqPerson.rows[0] == null) {
      return { status: UpdatePersonGroupsStatus.ReqPersonNotFound };
    }

    const person = await this.dbPool.query(
      "SELECT * FROM person WHERE id = $1",
      [personId]
    );

    if (person.rowCount != 1 || person.rows[0] == null) {
      return { status: UpdatePersonGroupsStatus.PersonNotFound };
    }

    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: UpdatePersonGroupsStatus.HouseNotFound };
    }

    const reqPersonInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [reqPersonId, houseId]
    );

    if (reqPersonInHouse.rowCount != 1 || reqPersonInHouse.rows[0] == null) {
      return { status: UpdatePersonGroupsStatus.ReqPersonNotInHouse };
    }

    const personInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [personId, houseId]
    );

    if (personInHouse.rowCount != 1 || personInHouse.rows[0] == null) {
      return { status: UpdatePersonGroupsStatus.PersonNotInHouse };
    }

    await this.dbPool.query("BEGIN");

    await this.dbPool.query(
      "DELETE FROM person_in_task_group WHERE person_id = $1",
      [personId]
    );

    for (const groupId of groupIds) {
      await this.dbPool.query(
        "INSERT INTO person_in_task_group (person_id, group_id) VALUES ($1, $2)",
        [personId, groupId]
      );
    }

    await this.dbPool.query("COMMIT");

    return { status: UpdatePersonGroupsStatus.Success };
  }

  async removePersonFromHouse(
    reqPersonId: string,
    houseId: string,
    personId: string
  ): Promise<RemovePersonFromHouseResult> {
    const reqPerson = await this.dbPool.query(
      "SELECT * FROM person WHERE id = $1",
      [reqPersonId]
    );

    if (reqPerson.rowCount != 1 || reqPerson.rows[0] == null) {
      return { status: RemovePersonFromHouseStatus.PersonNotFound };
    }

    const person = await this.dbPool.query(
      "SELECT * FROM person WHERE id = $1",
      [personId]
    );

    if (person.rowCount != 1 || person.rows[0] == null) {
      return { status: RemovePersonFromHouseStatus.PersonNotFound };
    }

    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: RemovePersonFromHouseStatus.HouseNotFound };
    }

    const reqPersonInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [reqPersonId, houseId]
    );

    if (reqPersonInHouse.rowCount != 1 || reqPersonInHouse.rows[0] == null) {
      return { status: RemovePersonFromHouseStatus.PersonNotInHouse };
    }

    const personInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [personId, houseId]
    );

    if (personInHouse.rowCount != 1 || personInHouse.rows[0] == null) {
      return { status: RemovePersonFromHouseStatus.PersonNotInHouse };
    }

    await this.dbPool.query("BEGIN");

    await this.dbPool.query(
      `
          DELETE FROM person_in_task_group
          WHERE person_id = $1
          AND task_group_id IN (SELECT id FROM task_group WHERE house_id = $2)
      `,
      [personId, houseId]
    );

    await this.dbPool.query(
      "DELETE FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [personId, houseId]
    );

    await this.dbPool.query("COMMIT");

    return { status: RemovePersonFromHouseStatus.Success };
  }
}
