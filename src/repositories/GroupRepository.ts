import { Pool } from "pg";
import {
    Group,
    IGroupRepository,
    ListGroupsResult,
    ListGroupsStatus,
    UpdateGroupsResult,
    UpdateGroupsStatus,
} from "./IGroupRepository";

export class GroupRepository implements IGroupRepository {
  constructor(private dbPool: Pool) {}

  async listGroups(
    personId: string,
    houseId: string
  ): Promise<ListGroupsResult> {
    const person = await this.dbPool.query(
      "SELECT * FROM person WHERE id = $1",
      [personId]
    );

    if (person.rowCount != 1 || person.rows[0] == null) {
      return { status: ListGroupsStatus.PersonNotFound };
    }

    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: ListGroupsStatus.HouseNotFound };
    }

    const personInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [personId, houseId]
    );

    if (personInHouse.rowCount != 1 || personInHouse.rows[0] == null) {
      return { status: ListGroupsStatus.PersonNotInHouse };
    }

    const groups = await this.dbPool.query(
      `
      SELECT id, name
      FROM task_group
      WHERE house_id = $1
    `,
      [houseId]
    );

    return {
      status: ListGroupsStatus.Success,
      groups: groups.rows.map((row) => ({
        id: row.id,
        name: row.name,
      })),
    };
  }

  async updateGroups(
    personId: string,
    houseId: string,
    addedGroups?: string[],
    removedGroupIds?: string[],
    renamedGroups?: Group[]
  ): Promise<UpdateGroupsResult> {
    const person = await this.dbPool.query(
      "SELECT * FROM person WHERE id = $1",
      [personId]
    );

    if (person.rowCount != 1 || person.rows[0] == null) {
      return { status: UpdateGroupsStatus.PersonNotFound };
    }

    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: UpdateGroupsStatus.HouseNotFound };
    }

    const personInHouse = await this.dbPool.query(
      "SELECT * FROM person_in_house WHERE person_id = $1 AND house_id = $2",
      [personId, houseId]
    );

    if (personInHouse.rowCount != 1 || personInHouse.rows[0] == null) {
      return { status: UpdateGroupsStatus.PersonNotInHouse };
    }

    await this.dbPool.query("BEGIN");

    if (addedGroups) {
      for (const addedGroup of addedGroups) {
        await this.dbPool.query(
          "INSERT INTO task_group (name, house_id) VALUES ($1, $2)",
          [addedGroup, houseId]
        );
      }
    }

    if (renamedGroups) {
      for (const renamedGroup of renamedGroups) {
        await this.dbPool.query(
          "UPDATE task_group SET name = $1 WHERE id = $2",
          [renamedGroup.name, renamedGroup.id]
        );
      }
    }

    if (removedGroupIds) {
      for (const removedGroupId of removedGroupIds) {
        const tasksWithGroup = await this.dbPool.query(
          "SELECT COUNT(*) FROM task WHERE responsible_task_group_id = $1",
          [removedGroupId]
        );

        if (tasksWithGroup.rowCount && tasksWithGroup.rowCount > 0) {
          await this.dbPool.query("ROLLBACK");
          return { status: UpdateGroupsStatus.TaskStillWithGroup };
        }

        const personsInTaskGroup = await this.dbPool.query(
          "SELECT COUNT(*) FROM person_in_task_group WHERE task_group_id = $1",
          [removedGroupId]
        );

        if (personsInTaskGroup.rowCount && personsInTaskGroup.rowCount > 0) {
          await this.dbPool.query("ROLLBACK");
          return { status: UpdateGroupsStatus.PersonStillInGroup };
        }

        await this.dbPool.query("DELETE FROM task_group WHERE id = $1", [
          removedGroupId,
        ]);
      }
    }

    await this.dbPool.query("COMMIT");
    return { status: UpdateGroupsStatus.Success };
  }
}
