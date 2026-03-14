exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS scheduled_jobs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) UNIQUE NOT NULL,
      cron_expr VARCHAR(50) NOT NULL,
      last_run TIMESTAMP WITH TIME ZONE,
      status VARCHAR(50) DEFAULT 'idle',
      payload JSONB
    );
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE IF EXISTS scheduled_jobs;
  `);
};
