# Palmary Food — clone de démonstration

> ⚠️ **Avertissement.** Ce dépôt est une **reproduction technique à but pédagogique**
> du site `palmaryfood.com`. Il **n'est pas affilié, approuvé ou sponsorisé** par la
> société Palmary Food. Toutes les marques, logos et photographies appartiennent à
> leurs détenteurs respectifs et **ne sont pas reproduits ici** : les visuels sont
> générés et les textes sont des créations originales, inspirées de la structure d'ensemble.

## Contenu

```
palmary-food/
├── index.html              # page d'accueil
├── contact.html            # page Contact (formulaire -> Supabase)
├── assets/
│   ├── img/                # 10 photos WebP (968 Ko au total)
│   ├── css/
│   │   ├── style.css           # design system de base
│   │   └── enhancements.css    # i18n, animations, formulaire, RTL
│   └── js/
│       ├── config.js           # <-- CLES SUPABASE A REMPLIR ICI
│       ├── i18n.js             # module multilingue
│       ├── i18n-boot.js        # chargeur des traductions
│       ├── contact.js          # envoi vers Supabase
│       ├── main.js             # menu, animations, parallaxe
│       └── locales/
│           ├── fr.json         # 75 cles
│           ├── en.json         # 75 cles
│           └── ar.json         # 75 cles (+ RTL)
└── README.md
```

## Technologies

HTML5 · CSS3 (variables, grid, flexbox, mask-image) · JavaScript vanilla ·
**i18next** (CDN) · **Supabase** (API REST).
Aucun build, aucun framework, aucune dépendance à installer.

## Mise en route du formulaire

Le formulaire est **déjà codé**, mais il ne peut rien envoyer tant que
`assets/js/config.js` n'est pas renseigné :

```js
supabase: {
  url:     'https://VOTRE-PROJET.supabase.co',  // Project Settings -> Data API
  anonKey: 'sb_publishable_...'                 // Project Settings -> API Keys
}
```

### Où trouver les clés dans Supabase

1. Ouvrez votre projet sur `supabase.com`
2. Bouton **"Connect"** en haut à gauche — la fenêtre affiche déjà l'URL et la clé
3. Ou : **Project Settings** (roue dentée, bas de la barre de gauche)
   - **Data API** → `Project URL`
   - **API Keys** → `Publishable key`

### Quelle clé utiliser

| Clé | Usage | Dans ce projet |
|---|---|---|
| `sb_publishable_...` (ou l'ancienne `anon`) | navigateur, publique | ✅ **celle-ci** |
| `sb_secret_...` (ou l'ancienne `service_role`) | serveur, tout-puissante | ❌ **jamais** |

La clé publishable est publique **par conception** : ce qui protège vos données,
ce sont les politiques RLS de la table, pas la clé. Sans policy `SELECT` pour le
rôle `anon`, personne ne peut lire les messages depuis le navigateur.

## Base de données

Table `public.messages` — créée via le SQL Editor :

| Colonne | Type | Rôle |
|---|---|---|
| `id` | uuid | clé primaire |
| `created_at` | timestamptz | horodatage d'envoi |
| `name` | text | nom du visiteur |
| `email` | text | e-mail (validé par contrainte) |
| `phone` | text | facultatif |
| `subject` | text | facultatif |
| `message` | text | contenu (20 à 5000 caractères) |
| `status` | text | `unread` / `read` / `archived` |
| `locale` | text | langue utilisée à l'envoi |

**Consultez vos messages** : menu **Table Editor** → table `messages`.

## Multilingue (i18next)

- 3 langues : **Français**, **Anglais**, **Arabe** (bascule complète en RTL)
- Détection automatique de la langue du navigateur
- Choix mémorisé dans le navigateur
- 75 clés par langue, alignées et vérifiées automatiquement
- Si le CDN est indisponible, le site reste intégralement lisible en français

## Animations

Entrée en cascade du hero · parallaxe douce sur l'image · révélation au
défilement · zoom des cartes au survol · reflet glissant sur les boutons ·
barre de progression de lecture · bouton « haut de page » · bandeau de marques
à défilement infini.

Tout est **automatiquement neutralisé** si le visiteur a demandé moins de
mouvement (`prefers-reduced-motion`).

## Performance

Les 10 photographies pèsent **968 Ko au total** (17,9 Mo de PNG sources réduits
de 95 % en WebP). Images en `loading="lazy"`, dimensions explicites, aucune
cumulative layout shift.

## Mise en ligne (GitHub Pages)

1. *Settings* → *Pages*
2. *Source* : **Deploy from a branch**
3. Branche : **main** · dossier : **/ (root)**
4. *Save* → site en ligne à
   `https://<votre-compte>.github.io/palmary-food/`

## Licence

Code de démonstration libre d'usage (MIT). Les marques et visuels de Palmary Food
appartiennent à leurs détenteurs.
