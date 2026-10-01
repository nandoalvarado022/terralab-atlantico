-- URLs completas de acceso en Firebase Storage (https://firebasestorage.googleapis.com/...) de cada envío.
alter table public.terra_challenge
  add column if not exists logo text,
  add column if not exists imagen_prototipo text,
  add column if not exists pdf text;
