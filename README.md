# Systèmes embarqués — site du cours

Site du cours « Développement des applications embarquées », construit avec [Astro](https://docs.astro.build) et [Starlight](https://starlight.astro.build), publié sur GitHub Pages : <https://meriemhnida.github.io/Embedded-System-Course/>.

## Commandes

| Commande | Action |
| :-- | :-- |
| `npm install` | Installe les dépendances (après avoir récupéré le projet) |
| `npm run dev` | Lance le site en local sur `localhost:4321` |
| `npm run build` | Construit le site dans `./dist/` |
| `npm run preview` | Affiche localement le site construit |

Un `git push` sur la branche `main` déclenche la publication (fichier `.github/workflows/deploy.yml`).

## Organisation du contenu

```
src/content/docs/
├── index.mdx                      accueil
├── mon-parcours.mdx               progression de l'étudiant
├── mes-reponses.mdx               réponses aux questions : export, import, impression
└── parcours/
    ├── chapitre-1/                leçons 1 à 9
    └── chapitre-2/
        ├── 01-mcu-mpu-carte.mdx   leçon : carte, MCU ou MPU
        ├── 02-presentation.mdx    leçon : carte Arduino interactive
        ├── 03-guide-tp.mdx        guide des travaux pratiques
        └── tp1/                   TP1 · De la LED au contrôleur de température
            ├── 01-presentation.mdx
            ├── ex01-… à ex11-…    une page par exercice (1 à 5 : prise en main, 6 à 11 : contrôleur)
            └── securite/          partie sécurité, en dernier : consignes et mise à l'épreuve,
                                   cahier des charges et montage, étapes A à D
public/tp/securite/                fichiers de départ de la partie sécurité (sketch.ino, diagram.json, libraries.txt)
```

Le menu se règle dans `astro.config.mjs` (clé `sidebar`). Toute page placée sous `parcours/` et présente dans le menu devient une leçon du parcours, avec le bouton de validation.

## Ajouter une question avec zone de réponse

Dans une page `.mdx` :

```mdx
import Question from '../../../../../components/Question.astro';

<Question id="tp1-q8.4" label="Q8.4" categorie="ingenieur">
Énoncé de la question, en **Markdown**.
</Question>
```

Le chemin d'import dépend de la profondeur de la page : cinq `../` pour une page de `tp1/`, six pour une page de `tp1/securite/`.

- `id` : identifiant **unique sur tout le site** et **définitif** (il sert de clé d'enregistrement : le changer fait « perdre » les réponses déjà saisies). Les questions reprises de l'ancienne organisation en trois TP ont gardé leur identifiant (`tp2-…`, `tp3-…`) même si leur numéro affiché a changé.
- `label` : numéro affiché.
- `type="code"` : zone en police à chasse fixe, pour coller du code.
- `categorie` (facultatif) : `ingenieur`, `surete`, `securite` ou `donnees`, affiché sous forme de badge. Par convention, les trois derniers ne servent que dans la partie sécurité : les exercices 1 à 11 n'abordent pas la sécurité.
- `lignes` (facultatif) : hauteur minimale de la zone.

La page « Mes réponses » retrouve automatiquement toutes les questions, dans l'ordre du menu.

## Où sont enregistrées les réponses ?

Le site est statique : les réponses sont enregistrées **dans le navigateur de l'étudiant** (`localStorage`) et ne sont envoyées nulle part. L'étudiant les rend en exportant un **PDF** (impression) ou un fichier **Markdown** depuis « Mes réponses », et peut les transférer d'un appareil à l'autre avec une **sauvegarde JSON**. Vider les données du navigateur efface les réponses : les étudiants doivent sauvegarder en fin de séance.

## Anciennes adresses

Les pages des anciennes organisations sont redirigées vers leur nouvelle adresse (clé `redirects` de `astro.config.mjs`) : l'ancien dossier `parcours/atelier-1/` vers `parcours/chapitre-2/`, et les anciens dossiers `tp1/`, `tp2/` et `tp3/` vers les exercices et la partie sécurité du TP1. La progression déjà enregistrée par les étudiants est reportée automatiquement (`src/scripts/progression.ts`).
