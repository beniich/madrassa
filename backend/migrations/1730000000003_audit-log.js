exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR(255),
      action VARCHAR(10) NOT NULL,
      table_name VARCHAR(100) NOT NULL,
      row_id VARCHAR(255) NOT NULL,
      old_data JSONB,
      new_data JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE IF EXISTS audit_log;
  `);
};
