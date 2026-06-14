
-- Eliminar foreign keys que referencian a class_sessions
ALTER TABLE IF EXISTS public.satisfaction_metrics DROP CONSTRAINT IF EXISTS satisfaction_metrics_class_session_id_fkey;

-- Eliminar la tabla class_sessions
DROP TABLE IF EXISTS public.class_sessions;
;
