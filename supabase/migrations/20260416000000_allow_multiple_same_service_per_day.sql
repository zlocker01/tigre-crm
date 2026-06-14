DO $$
DECLARE
  c RECORD;
  idx RECORD;
BEGIN
  FOR c IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE nsp.nspname = 'public'
      AND rel.relname = 'class_sessions'
      AND con.contype = 'u'
      AND EXISTS (
        SELECT 1
        FROM unnest(con.conkey) AS key_cols(attnum)
        JOIN pg_attribute a
          ON a.attrelid = rel.oid
         AND a.attnum = key_cols.attnum
        WHERE a.attname = 'service_id'
      )
  LOOP
    EXECUTE format(
      'ALTER TABLE public.class_sessions DROP CONSTRAINT IF EXISTS %I',
      c.conname
    );
  END LOOP;

  FOR idx IN
    SELECT schemaname, indexname
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'class_sessions'
      AND indexdef ILIKE '%unique%'
      AND indexname <> 'class_sessions_pkey'
      AND indexdef ILIKE '%service_id%'
      AND (
        indexdef ILIKE '%date_trunc%'
        OR indexdef ILIKE '%::date%'
        OR indexdef ILIKE '%date(%'
        OR indexdef ILIKE '%start_datetime%'
      )
  LOOP
    EXECUTE format('DROP INDEX IF EXISTS %I.%I', idx.schemaname, idx.indexname);
  END LOOP;
END $$;
