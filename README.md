# Palmary Food — clone de démonstration

> ⚠️ **Avertissement.** Ce dépôt est une **reproduction technique à but pédagogique**
> du site `palmaryfood.com`. Il **n'est pas affilié, approuvé ou sponsorisé** par la
> société Palmary Food. Toutes les marques, logos et photographies appartiennent à
> leurs détenteurs respectifs et **ne sont pas reproduits ici** : les visuels et
> les textes sont des créations originales, inspirées de la structure d'ensemble.

## Contenu

```
palmary-food/
├── index.html              # page unique (structure + contenu)
├── assets/
│   ├── css/style.css       # design system complet
│   └── js/main.js          # menu mobile, sous-menu, reveal, marquee
└── README.md
```

## Technologies

HTML5 · CSS3 (variables, grid, flexbox, mask-image) · JavaScript vanilla.
Aucune dépendance, aucun build, aucun framework. Ouvrez `index.html` et ça marche.

## Sections reproduites

| Section | Ancre | Contenu |
|---|---|---|
| En-tête | `#top` | Logo, navigation, sous-menu « Palmary group », CTA |
| Hero | — | Titre, accroche, bouton d'appel à l'action |
| Nos produits | `#produits` | 6 gammes (biscuiterie, culinaire, gaufrettes, génoise, chocolat, chocolat à tartiner) |
| Nos marques | `#marques` | Bandeau défilant + bandeau d'excellence |
| Notre raison d'être | `#apropos` | Section sombre, « Notre raison d'être » |
| Engagements | `#engagements` | 4 piliers : employés, innovation, environnement, joie |
| Actualités | `#actualites` | 2 articles |

## Charte reprise du site officiel

Les couleurs ci-dessous ont été relevées sur les feuilles de style publiques du
site officiel :

| Rôle | Valeur |
|---|---|
| Rouge de marque | `#DF271D` |
| Rouge foncé | `#C12A21` |
| Or / bronze | `#A37D5A` |
| Brun | `#A27D6F` |
| Encre (texte fort) | `#2E251E` |
| Accents-produits | `#FFBC7D` · `#6EC1E4` · `#61CE70` |

Typographie : `Poppins` (titres) + `Roboto` (texte courant).

## Fonctionnalités

- **Menu mobile** — burger animé, panneau plein écran, fermeture au clic extérieur
- **Sous-menu au survol** sur desktop, au clic sur mobile
- **Bandeau de marques** — défilement infini sans couture (dupliqué en JS)
- **Révélation au défilement** — `IntersectionObserver`, décalage en cascade
- **Responsive** — 3 points de rupture (900 / 760 / 560 px)
- **Accessibilité** — attributs ARIA, focus visible, navigation clavier
- **`prefers-reduced-motion`** respecté

## Mise en ligne (GitHub Pages)

1. *Settings* → *Pages*
2. *Source* : **Deploy from a branch**
3. Branche : **main** · dossier : **/ (root)**
4. *Save* → le site est en ligne

## Licence

Code de démonstration libre d'usage (MIT). Les marques et visuels de Palmary Food
appartiennent à leurs détenteurs.
