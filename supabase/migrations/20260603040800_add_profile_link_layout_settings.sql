-- Adds profile-level link layout settings used by the public profile page.
-- Safe to run on existing projects.

alter table public.profiles
  add column if not exists link_display_type text default 'list';

alter table public.profiles
  add column if not exists card_columns integer default 1;

update public.profiles
set link_display_type = 'list'
where link_display_type is null
   or link_display_type not in ('list', 'card');

update public.profiles
set card_columns = 1
where card_columns is null
   or card_columns not in (1, 2);

alter table public.profiles
  alter column link_display_type set default 'list',
  alter column link_display_type set not null;

alter table public.profiles
  alter column card_columns set default 1,
  alter column card_columns set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_link_display_type_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_link_display_type_check
      check (link_display_type in ('list', 'card'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_card_columns_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_card_columns_check
      check (card_columns in (1, 2));
  end if;
end $$;
