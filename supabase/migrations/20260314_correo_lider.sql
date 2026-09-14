-- Correo del líder del equipo: único por brigada/MVP.
alter table public.mvps
  add column if not exists correo_lider text;

create unique index if not exists mvps_correo_lider_unique
  on public.mvps (lower(correo_lider))
  where correo_lider is not null and btrim(correo_lider) <> '';
