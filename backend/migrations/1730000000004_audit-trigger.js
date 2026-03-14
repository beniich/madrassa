exports.up = pgm => {
  pgm.sql(`
    CREATE OR REPLACE FUNCTION fn_audit_trigger() 
    RETURNS TRIGGER AS $$
    DECLARE
      current_user_id VARCHAR;
    BEGIN
      BEGIN
        current_user_id := current_setting('app.current_user_id', true);
      EXCEPTION WHEN OTHERS THEN
        current_user_id := 'system';
      END;

      IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_log(user_id, action, table_name, row_id, old_data, new_data)
        VALUES (current_user_id, TG_OP, TG_TABLE_NAME, OLD.id::VARCHAR, row_to_json(OLD)::JSONB, NULL);
        RETURN OLD;
      ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_log(user_id, action, table_name, row_id, old_data, new_data)
        VALUES (current_user_id, TG_OP, TG_TABLE_NAME, NEW.id::VARCHAR, row_to_json(OLD)::JSONB, row_to_json(NEW)::JSONB);
        RETURN NEW;
      ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_log(user_id, action, table_name, row_id, old_data, new_data)
        VALUES (current_user_id, TG_OP, TG_TABLE_NAME, NEW.id::VARCHAR, NULL, row_to_json(NEW)::JSONB);
        RETURN NEW;
      END IF;
      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_audit_orders
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TRIGGER IF EXISTS trg_audit_orders ON orders;
    DROP FUNCTION IF EXISTS fn_audit_trigger();
  `);
};
