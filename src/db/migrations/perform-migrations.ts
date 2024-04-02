import pg from "pg";

export const performMigrations = async (pool: pg.Pool) => {
  console.log("Performing DB migrations");

  for (let i = 0; i < migrations.length; i++) {
    const migration = migrations[i];
    console.log(
      `Running DB migration ${i + 1}/${migrations.length}: ${migration.comment}`
    );

    await pool.query("BEGIN");
    try {
      await migration.fn(pool);
    } catch {
      await pool.query("ROLLBACK");
      throw new Error(`MIGRATION ${i + 1} FAILED!!! (${migration.comment})`);
    }
    await pool.query("COMMIT");
  }

  console.log("DB migrations complete");
};

type Migration = {
  comment: string;
  fn: (pool: pg.Pool) => Promise<void>;
};

const migrations: Migration[] = [
  {
    comment: "Create initial tables",
    fn: async (pool) => {
      // House table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS house (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          picture TEXT,
          invite_code TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS house_invite_code_idx ON house(invite_code);
      `);

      // Person table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS person (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL,
          pwd_hash TEXT NOT NULL,
          active BOOLEAN NOT NULL DEFAULT TRUE,
          picture TEXT
        );

        CREATE INDEX IF NOT EXISTS person_username_idx ON person(username);
        CREATE INDEX IF NOT EXISTS person_active_idx ON person(active);
      `);

      // Person in house table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS person_in_house (
          person_id INT NOT NULL REFERENCES person(id),
          house_id INT NOT NULL REFERENCES house(id),

          PRIMARY KEY(person_id, house_id)
        );

        CREATE INDEX IF NOT EXISTS person_in_house_house_id_idx ON person_in_house(house_id);
      `);

      // Task group table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS task_group (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          house_id INT NOT NULL REFERENCES house(id),

          UNIQUE(name, house_id)
        );

        CREATE INDEX IF NOT EXISTS task_group_house_id_idx ON task_group(house_id);
      `);

      // Person in task group table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS person_in_task_group (
          person_id INT NOT NULL REFERENCES person(id),
          task_group_id INT NOT NULL REFERENCES task_group(id),

          PRIMARY KEY(person_id, task_group_id)
        );

        CREATE INDEX IF NOT EXISTS person_in_task_group_task_group_id_idx ON person_in_task_group(task_group_id);
      `);

      // Task table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS task (
          id SERIAL PRIMARY KEY,
          house_id INT NOT NULL REFERENCES house(id),
          name TEXT NOT NULL,
          description TEXT,
          freq_base DATE NOT NULL,
          freq_offset INTERVAL NOT NULL,
          time_limit INTERVAL NOT NULL,
          schedule_offset INTERVAL NOT NULL,
          points FLOAT NOT NULL,
          penalty FLOAT NOT NULL,
          responsible_task_group_id INT NOT NULL REFERENCES task_group(id),
          next_scheduler_date DATE NOT NULL,
          active BOOLEAN NOT NULL DEFAULT TRUE,

          UNIQUE(name, house_id)
        );

        CREATE INDEX IF NOT EXISTS task_house_id_idx ON task(house_id);
        CREATE INDEX IF NOT EXISTS task_responsible_task_group_id_idx ON task(responsible_task_group_id);
        CREATE INDEX IF NOT EXISTS task_active_idx ON task(active);
        CREATE INDEX IF NOT EXISTS task_next_scheduler_date_idx ON task(next_scheduler_date);
      `);

      // Scheduled task table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS scheduled_task (
          id SERIAL PRIMARY KEY,
          task_id INT NOT NULL REFERENCES task(id),
          responsible_person_id INT NOT NULL REFERENCES person(id),
          start_date DATE NOT NULL,
          due_date DATE NOT NULL
        );

        CREATE INDEX IF NOT EXISTS scheduled_task_task_id_idx ON scheduled_task(task_id);
        CREATE INDEX IF NOT EXISTS scheduled_task_responsible_person_id_idx ON scheduled_task(responsible_person_id);
      `);

      // Completed task table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS completed_task (
          id SERIAL PRIMARY KEY,
          task_id INT NOT NULL REFERENCES task(id),
          responsible_person_id INT NOT NULL REFERENCES person(id),
          completion_date DATE NOT NULL,
          start_date DATE NOT NULL,
          due_date DATE NOT NULL,
          points FLOAT NOT NULL,
          penalty FLOAT NOT NULL,
          is_penalised BOOLEAN NOT NULL
        );

        CREATE INDEX IF NOT EXISTS completed_task_task_id_idx ON completed_task(task_id);
        CREATE INDEX IF NOT EXISTS completed_task_responsible_person_id_idx ON completed_task(responsible_person_id);
        CREATE INDEX IF NOT EXISTS completed_task_is_penalised_idx ON completed_task(is_penalised);
      `);

      // Complaint table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS complaint (
          completed_task_id INT NOT NULL REFERENCES completed_task(id),
          complainer_person_id INT NOT NULL REFERENCES person(id),
          complaint_date DATE NOT NULL,
          message TEXT NOT NULL,

          PRIMARY KEY(completed_task_id, complainer_person_id)
        );

        CREATE INDEX IF NOT EXISTS complaint_completed_task_id_idx ON complaint(completed_task_id);
        CREATE INDEX IF NOT EXISTS complaint_complainer_person_id_idx ON complaint(complainer_person_id);
      `);
    },
  },
];
