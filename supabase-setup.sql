
create table if not exists public.students (
  id          bigint generated always as identity primary key,
  student_id  text not null unique,
  full_name   text not null,
  program     text not null,
  year_level  smallint not null check (year_level between 1 and 6),
  email       text not null,
  created_at  timestamptz not null default now()
);


grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.students to anon, authenticated;

alter table public.students enable row level security;


drop policy if exists "lab_select" on public.students;
drop policy if exists "lab_insert" on public.students;
drop policy if exists "lab_update" on public.students;
drop policy if exists "lab_delete" on public.students;

create policy "lab_select" on public.students for select to anon, authenticated using (true);
create policy "lab_insert" on public.students for insert to anon, authenticated with check (true);
create policy "lab_update" on public.students for update to anon, authenticated using (true) with check (true);
create policy "lab_delete" on public.students for delete to anon, authenticated using (true);

-
insert into public.students (student_id, full_name, program, year_level, email) values
 ('2024-0001','Maria Santos','BS Information Technology',2,'maria.santos@school.edu'),
 ('2024-0002','Juan Dela Cruz','BS Computer Science',3,'juan.delacruz@school.edu'),
 ('2024-0003','Ana Reyes','BS Information Systems',1,'ana.reyes@school.edu'),
 ('2024-0004','Carlo Mendoza','BS Information Technology',4,'carlo.mendoza@school.edu'),
 ('2024-0005','Liza Garcia','BS Computer Engineering',2,'liza.garcia@school.edu')
on conflict (student_id) do nothing;
