exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS orders_history (
      history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      id UUID NOT NULL,
      user_id UUID,
      tenant_id UUID NOT NULL,
      amount DECIMAL NOT NULL,
      status VARCHAR(50) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE,
      updated_at TIMESTAMP WITH TIME ZONE,
      valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      valid_to TIMESTAMP WITH TIME ZONE
    );

    CREATE OR REPLACE FUNCTION fn_orders_history() RETURNS TRIGGER AS $$
    BEGIN
      IF (TG_OP = 'UPDATE' OR TG_OP = 'DELETE') THEN
        INSERT INTO orders_history (id, user_id, tenant_id, amount, status, created_at, updated_at, valid_from, valid_to)
        VALUES (OLD.id, OLD.user_id, OLD.tenant_id, OLD.amount, OLD.status, OLD.created_at, OLD.updated_at, OLD.updated_at, NOW());
      END IF;
      IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_orders_history
    AFTER UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION fn_orders_history();
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TRIGGER IF EXISTS trg_orders_history ON orders;
    DROP FUNCTION IF EXISTS fn_orders_history();
    DROP TABLE IF EXISTS orders_history;
  `);
};
