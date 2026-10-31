insert into public.genres (id, name)
values
('soulslike', 'Souls-like'),
('fps', 'FPS'),
('rpg', 'RPG'),
('adventure', 'Adventure'),
('openworld', 'Open World'),
('action', 'Action'),
('sandbox', 'Sandbox')
on conflict (id) do update
set name = excluded.name;