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
          invite_code TEXT NOT NULL,
        );
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
      `);

      // Person in house table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS person_in_house (
          person_id INT NOT NULL REFERENCES person(id),
          house_id INT NOT NULL REFERENCES house(id),

          PRIMARY KEY(person_id, house_id)
        );
      `);

      // Task group table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS task_group (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          house_id INT NOT NULL REFERENCES house(id),

          UNIQUE(name, house_id)
        );
      `);

      // Person in task group table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS person_in_task_group (
          person_id INT NOT NULL REFERENCES person(id),
          task_group_id INT NOT NULL REFERENCES task_group(id),

          PRIMARY KEY(person_id, task_group_id)
        );
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
          active BOOLEAN NOT NULL,

          UNIQUE(name, house_id)
        );
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
      `);
    },
  },
];
