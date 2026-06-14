create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null default auth.uid(),
  client_id uuid null references public.clients(id) on delete set null,
  service_id bigint null references public.services(id) on delete set null,
  promotion_id bigint null references public.promotions(id) on delete set null,
  status text null default 'Confirmada' check (status = any (array['Confirmada','Cancelada','Proceso'])),
  start_datetime timestamp with time zone not null,
  end_datetime timestamp with time zone not null,
  notes text null,
  price_charged numeric null,
  actual_duration_minutes smallint null,
  appointment_source text null,
  series_id text null,
  created_at timestamp with time zone not null default now()
);

alter table public.class_sessions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='class_sessions' and policyname='Enable insert for all'
  ) then
    create policy "Enable insert for all" on public.class_sessions
      for insert to public
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='class_sessions' and policyname='Enable read access for all users'
  ) then
    create policy "Enable read access for all users" on public.class_sessions
      for select to public
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='class_sessions' and policyname='Update just for admin role users'
  ) then
    create policy "Update just for admin role users" on public.class_sessions
      for update to authenticated
      using (
        exists (
          select 1 from public.users u
          where u.id = auth.uid() and u.role = any (array['admin','empleado'])
        )
      )
      with check (
        exists (
          select 1 from public.users u
          where u.id = auth.uid() and u.role = any (array['admin','empleado'])
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='class_sessions' and policyname='Delete just ofr admin role users'
  ) then
    create policy "Delete just ofr admin role users" on public.class_sessions
      for delete to authenticated
      using (
        exists (
          select 1 from public.users u
          where u.id = auth.uid() and u.role = 'admin'
        )
      );
  end if;
end $$;

create index if not exists class_sessions_start_datetime_idx on public.class_sessions (start_datetime);
create index if not exists class_sessions_series_id_idx on public.class_sessions (series_id);
create index if not exists class_sessions_client_id_idx on public.class_sessions (client_id);
;
