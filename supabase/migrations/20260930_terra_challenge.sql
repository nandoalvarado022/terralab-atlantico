-- Respuestas de Terralab Challenge. Varios envíos por el mismo correo de líder.
-- Colegio, terranautas y nombre del proyecto viven en public.mvps y se unen por correo_lider.

create table if not exists public.terra_challenge (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  correo_lider text not null,
  reto text not null,
  solucion text not null,
  aprendizaje_prototipo text not null,
  cambio_concreto text not null,
  viabilidad text not null,
  propuesta_valor text not null,
  compromiso_colegio text not null
);

create index if not exists terra_challenge_correo_lider_idx
  on public.terra_challenge (lower(correo_lider));

create index if not exists terra_challenge_created_at_idx
  on public.terra_challenge (created_at desc);

alter table public.terra_challenge enable row level security;
