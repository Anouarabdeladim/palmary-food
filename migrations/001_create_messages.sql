-- =========================================================
-- 001_create_messages.sql
-- Table public.messages — utilisée par contact.html
-- Doit être exécuté UNE fois dans Supabase → SQL Editor.
-- =========================================================

-- 1) Table
--    Les colonnes reflètent le payload envoyé par assets/js/contact.js
--    (name, email, phone, subject, message, locale).
create table if not exists public.messages (
  id          bigserial    primary key,
  name        text         not null,
  email       text         not null,
  phone       text,
  subject     text,
  message     text         not null,
  locale      text         not null default 'fr',
  user_agent  text,
  created_at  timestamptz  not null default now()
);

-- 2) Index utile pour le tri côté dashboard Supabase
create index if not exists messages_created_at_idx
  on public.messages (created_at desc);

-- 3) Sécurité : Row Level Security
--    Important : on COMMIT la anon key dans le repo public (GitHub Pages),
--    donc RLS DOIT être active et la policy d'INSERT seule autorisée.
alter table public.messages enable row level security;

-- 4) Policy : n'importe quel client (rôle anon) peut INSÉRER
--    Aucune policy SELECT/UPDATE/DELETE → les messages ne sont pas lisibles
--    via l'API. Seul le dashboard Supabase (service_role) y accède.
drop policy if exists "anon can insert" on public.messages;
create policy "anon can insert"
  on public.messages
  for insert
  to anon
  with check (true);

-- (Optionnel) Honeypot : si la colonne "website" est remplie, c'est un robot.
-- Le formulaire l'envoie en INSERT. On peut la rejeter côté BDD :
--   alter table public.messages add column website text;
--   drop policy if exists "anon can insert" on public.messages;
--   create policy "anon can insert" on public.messages
--     for insert to anon
--     with check (coalesce(website, '') = '');
-- (décommenter au besoin — le piège est déjà côté JS)
