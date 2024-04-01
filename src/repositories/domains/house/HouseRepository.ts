import pg from "pg";
import {
  CreateHouseResult,
  CreateHouseStatus,
  DeleteHouseResult,
  DeleteHouseStatus,
  GetHousesForPersonResult,
  GetHousesForPersonStatus,
  IHouseRepository,
  JoinHouseResult,
  JoinHouseStatus,
  UpdateHouseNameResult,
  UpdateHouseNameStatus,
} from "./IHouseRepository.js";

export class HouseRepository implements IHouseRepository {
  constructor(private dbPool: pg.Pool) {}

  async getHousesForPerson(
    personId: string
  ): Promise<GetHousesForPersonResult> {
    const person = await this.dbPool.query(
      "SELECT * FROM person WHERE id = $1",
      [personId]
    );

    if (person.rowCount != 1 || person.rows[0] == null) {
      return { status: GetHousesForPersonStatus.PersonNotFound };
    }

    const houses = await this.dbPool.query(
      `
      SELECT house.id, house.name, house.picture, house.invite_code
      FROM house, person_in_house
      WHERE house.id = person_in_house.house_id AND person_in_house.person_id = $1
    `,
      [personId]
    );

    return {
      status: GetHousesForPersonStatus.Success,
      houses: houses.rows.map((row) => ({
        id: row.id,
        name: row.name,
        picture: row.picture,
        inviteCode: row.invite_code,
      })),
    };
  }

  private createRandomInviteCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      if (i == 4) {
        result += "-";
      }
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  async createHouse(
    personId: string,
    name: string
  ): Promise<CreateHouseResult> {
    const person = await this.dbPool.query(
      "SELECT * FROM person WHERE id = $1",
      [personId]
    );

    if (person.rowCount != 1 || person.rows[0] == null) {
      return { status: CreateHouseStatus.PersonNotFound };
    }

    let inviteCode: string;
    while (true) {
      inviteCode = this.createRandomInviteCode();
      const existingHouse = await this.dbPool.query(
        "SELECT * FROM house WHERE invite_code = $1",
        [inviteCode]
      );

      if (existingHouse.rowCount == 0) {
        break;
      }
    }

    const result = await this.dbPool.query(
      "INSERT INTO house (name, invite_code) VALUES ($1, $2) RETURNING name, id, picture, invite_code",
      [name, inviteCode]
    );

    return {
      status: CreateHouseStatus.Success,
      house: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        picture: result.rows[0].picture,
        inviteCode: result.rows[0].invite_code,
      },
    };
  }

  async deleteHouse(
    personId: string,
    houseId: string
  ): Promise<DeleteHouseResult> {
    const person = await this.dbPool.query(
      "SELECT * FROM person WHERE id = $1",
      [personId]
    );

    if (person.rowCount != 1 || person.rows[0] == null) {
      return { status: DeleteHouseStatus.PersonNotFound };
    }

    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: DeleteHouseStatus.HouseNotFound };
    }

    await this.dbPool.query("BEGIN");

    try {
      await this.dbPool.query(
        "DELETE FROM person_in_house WHERE house_id = $1",
        [houseId]
      );

      await this.dbPool.query("DELETE FROM house WHERE id = $1", [houseId]);
      await this.dbPool.query("COMMIT");

      return { status: DeleteHouseStatus.Success };
    } catch (exc) {
      await this.dbPool.query("ROLLBACK");
      console.error(
        "HouseRepository.deleteHouse() - Rolled back due to exception:",
        exc
      );
      return { status: DeleteHouseStatus.UnknownError };
    }
  }

  async updateHouseName(
    personId: string,
    houseId: string,
    newName: string
  ): Promise<UpdateHouseNameResult> {
    const person = await this.dbPool.query(
      "SELECT * FROM person WHERE id = $1",
      [personId]
    );

    if (person.rowCount != 1 || person.rows[0] == null) {
      return { status: UpdateHouseNameStatus.PersonNotFound };
    }

    const house = await this.dbPool.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: UpdateHouseNameStatus.HouseNotFound };
    }

    await this.dbPool.query("UPDATE house SET name = $1 WHERE id = $2", [
      newName,
      houseId,
    ]);

    return { status: UpdateHouseNameStatus.Success };
  }

  async joinHouse(
    personId: string,
    inviteCode: string
  ): Promise<JoinHouseResult> {
    const person = await this.dbPool.query(
      "SELECT * FROM person WHERE id = $1",
      [personId]
    );

    if (person.rowCount != 1 || person.rows[0] == null) {
      return { status: JoinHouseStatus.PersonNotFound };
    }

    const house = await this.dbPool.query(
      "SELECT * FROM house WHERE invite_code = $1",
      [inviteCode]
    );

    if (house.rowCount != 1 || house.rows[0] == null) {
      return { status: JoinHouseStatus.HouseNotFound };
    }

    await this.dbPool.query(
      "INSERT INTO person_in_house (person_id, house_id) VALUES ($1, $2)",
      [personId, house.rows[0].id]
    );

    return { status: JoinHouseStatus.Success };
  }
}
