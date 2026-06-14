begin;

alter table public.working_hours drop constraint if exists working_hours_day_of_week_key;

delete from public.working_hours where user_id is null or day_of_week is null;

alter table public.working_hours alter column user_id set not null;
alter table public.working_hours alter column day_of_week set not null;
alter table public.working_hours alter column is_working_day set default true;
update public.working_hours set is_working_day = true where is_working_day is null;

create unique index if not exists working_hours_user_id_day_of_week_uq
  on public.working_hours (user_id, day_of_week);

insert into public.working_hours (user_id, day_of_week, is_working_day, start_time, end_time, break_start_time, break_end_time)
select u.id, d.day_of_week, true, '09:00'::time, '19:00'::time, null::time, null::time
from auth.users u
cross join (
  values
    ('monday'),
    ('tuesday'),
    ('wednesday'),
    ('thursday'),
    ('friday'),
    ('saturday'),
    ('sunday')
) as d(day_of_week)
on conflict (user_id, day_of_week) do nothing;

commit;;
