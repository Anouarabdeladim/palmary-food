# Supabase — Guide d'intégration pour le site Palmary

> Base de données **gratuite**, ouverte depuis un site statique, sans serveur à gérer.

---

## 1. Pourquoi Supabase pour ce projet

| Critère du brief | Réponse avec Supabase |
|---|---|
| Gratuit pour un projet personnel | Plan Free : 500 MB PostgreSQL, 1 GB Storage, 50 000 MAU [1][2] |
| Compatible site statique (GitHub Pages) | API REST auto‑exposée + SDK JS via CDN ; aucune fonction serveur requise |
| Simple à intégrer | 1 ligne pour charger le SDK, 1 ligne pour initialiser le client |
| Fait pour le navigateur | `anon key` conçue pour être publique, encadrée par Row Level Security |

Le projet a déjà un emplacement réservé dans `assets/js/config.js` (`window.SITE_CONFIG.supabase.url` et `.anonKey`) — il ne reste qu'à fournir les valeurs.

---

## 2. Limites du plan gratuit (à connaître)

| Ressource | Limite Free |
|---|---|
| Projets actifs | **2** maximum (le projet est mis en pause après **7 jours d'inactivité**) [3] |
| Base PostgreSQL | **500 MB** |
| File storage (images/PDF) | **1 GB** |
| Egress (sortie réseau) | **5 GB/mois** (BDD + Storage confondus) [4] |
| Monthly Active Users (Auth) | **50 000** |
| Edge Function invocations | 500 000/mois |
| Bandeau / support | Community (GitHub / Discord) |
| Clé `service_role` | ❌ **JAMAIS dans le navigateur** — uniquement côté serveur |

> **Règle d'or** : la `anon` key peut être dans le repo public (GitHub Pages) **uniquement** si la Row Level Security est activée et restrictive sur chaque table exposée au client. C'est ce que l'on fait ci-dessous.

---

## 3. Intégration en 7 étapes

### Étape 1 — Créer un compte
- Aller sur https://supabase.com → **Start your project** (sign‑in GitHub recommandé).

### Étape 2 — Créer un projet
- **New project** → nom `palmary-food` → mot de passe BD (à sauvegarder) → région la plus proche (Frankfurt EU‑Central‑1 depuis l'Algérie) → **Create new project** (~2 min).

### Étape 3 — Récupérer URL + clé anonyme
- Menu de gauche **⚙️ Project Settings** → **API**.
- Copier :
  - **Project URL** → `https://xxxxx.supabase.co`
  - **anon public key** (la longue clé `eyJhbGciOi...`) → clé publique, conçue pour le navigateur.

### Étape 4 — Renseigner `assets/js/config.js`
Ouvrir le fichier et remplacer les deux placeholders :

```js
window.SITE_CONFIG = {
  supabase: {
    url:    'https://xxxxx.supabase.co',   // ← Project URL
    anonKey: 'eyJhbGciOi...'                // ← anon public key
  },
  // …
};
```

> ⚠️ La `anon` key est publique par conception : ne pas confondre avec `service_role`, qui ne doit **jamais** apparaître ici.

### Étape 5 — Charger le SDK Supabase
Dans `index.html`, ajouter dans le `<head>` (avant les scripts du site) :

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### Étape 6 — Initialiser le client
Créer un petit fichier `assets/js/supabase-client.js` :

```js
(function () {
  'use strict';
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    console.warn('Supabase non configuré (config.js).');
    return;
  }
  const { createClient } = window.supabase;
  window.sb = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
})();
```

Et, dans `config.js`, exposer les deux valeurs au niveau global :

```js
window.SUPABASE_URL    = window.SITE_CONFIG.supabase.url;
window.SUPABASE_ANON_KEY = window.SITE_CONFIG.supabase.anonKey;
```

Charger ce script dans `index.html` après `config.js` :

```html
<script src="assets/js/config.js"></script>
<script src="assets/js/i18n.js"></script>
<script src="assets/js/supabase-client.js"></script>
<script src="assets/js/main.js"></script>
```

### Étape 7 — Exemple concret : table des messages de contact
Dans Supabase → **SQL Editor**, exécuter :

```sql
-- 1) Table
create table contact_messages (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  name        text        not null check (char_length(name) between 1 and 80),
  email       text        not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject     text        not null check (char_length(subject) between 1 and 120),
  message     text        not null check (char_length(message) between 1 and 4000),
  user_locale text
);

-- 2) Activer RLS
alter table contact_messages enable row level security;

-- 3) Politique : le public peut INSÉRER, personne ne peut LIRE
create policy "public insert"
  on contact_messages for insert
  to anon
  with check (true);
-- Aucune policy "select" → SELECT refusé par défaut.
```

Côté site, dans `contact.html` (ou le handler du formulaire) :

```js
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const { error } = await window.sb.from('contact_messages').insert({
    name:    fd.get('name'),
    email:   fd.get('email'),
    subject: fd.get('subject'),
    message: fd.get('message'),
    user_locale: window.i18next?.language || 'fr'
  });
  if (error) {
    alert('Erreur : ' + error.message);
  } else {
    e.target.reset();
    alert('Merci, votre message a bien été envoyé.');
  }
});
```

Le membre de l'équipe lit les messages depuis le dashboard Supabase → **Table Editor** → `contact_messages`. Aucun backend, aucun cron, aucun serveur mail.

---

## 4. Recommandations pour rester dans le plan gratuit

1. **Penser "append‑only"** : ne pas garder les anciens messages indéfiniment. Une purge programmée (Edge Function cron, ou supabase CLI `psql` depuis GitHub Actions) garde la table sous 1‑2 MB même après des années.
2. **Pas de stockage d'images** côté Supabase pour ce projet (les visuels sont déjà en `assets/img/` servis par GitHub Pages, qui ne compte pas dans l'egress Supabase).
3. **Une seule table suffit** pour démarrer (`contact_messages`). Ajouter d'autres tables seulement quand un vrai besoin apparaît.
4. **Garder le projet actif** : un GET HTTP toutes les ~7 jours (ou une visite sur le dashboard) évite la mise en pause automatique.
5. **Limiter l'egress** : éviter les `select *` ; ne ramener que les colonnes utiles ; paginer (`.range(0, 49)`).
6. **Cacher côté client** les données quasi‑statiques (marques, engagements) en `localStorage` quelques minutes — économie d'API calls.

---

## 5. Sources

- [1] Supabase Pricing — https://supabase.com/pricing
- [2] About billing on Supabase — https://supabase.com/docs/guides/platform/billing-on-supabase
- [3] Billing FAQ — https://supabase.com/docs/guides/platform/billing-faq
- [4] Moving to org‑based billing — https://supabase.com/changelog/17061-moving-to-org-based-billing
