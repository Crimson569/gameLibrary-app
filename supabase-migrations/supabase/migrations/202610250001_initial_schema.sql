create table public.genres (
    id   text primary key,
    name text not null unique,
    constraint genres_id_not_blank
        check (id = btrim(id) and id <> ''),
    constraint genres_name_not_blank
        check (name = btrim(name) and name <> '')
);

create table public.games (
    id          uuid primary key default gen_random_uuid(),
    owner_id    uuid not null references auth.users(id) on delete cascade,
    genre_id    text not null references public.genres(id)
                    on update cascade on delete restrict,
    title       text not null,
    description text not null default '',
    status      text not null default 'unplayed',
    created_at  timestamptz not null default now(),
    constraint games_title_length
        check (char_length(btrim(title)) between 3 and 100),
    constraint games_status_allowed
        check (status in ('in_progress', 'complete', 'unplayed'))
);

create index games_owner_id_idx on public.games(owner_id);
create index games_genre_id_idx on public.games(genre_id);

alter table public.genres enable row level security;
alter table public.games enable row level security;
revoke all on table public.genres from anon, authenticated;
revoke all on table public.games from anon, authenticated;
grant select on table public.genres to anon, authenticated;
create policy "genres are publicly readable"
on public.genres
for select
to anon, authenticated
using (true);