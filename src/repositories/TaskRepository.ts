import { Pool } from "pg";

export class TaskRepository {
  constructor(private dbPool: Pool) {}

  async getTasks() {
    const result = await this.dbPool.query("SELECT * FROM tasks");
    return result.rows;
  }
}
