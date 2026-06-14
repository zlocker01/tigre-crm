alter table public.class_sessions
add column if not exists series_id text;

create index if not exists class_sessions_series_id_idx
on public.class_sessions(series_id);;
