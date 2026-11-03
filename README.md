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
        ├── 03-guide-tp.mdx        guide commun des TP
        ├── tp1/                   TP1 · Entrées et sorties (présentation + parties A à D)
        ├── tp2/                   TP2 · Contrôleur de température
        └── tp3/                   TP3 · Nœud de surveillance sécurisé
public/tp/tp3/                     fichiers de départ du TP3 (sketch.ino, diagram.json, libraries.txt)
```

Le menu se règle dans `astro.config.mjs` (clé `sidebar`). Toute page placée sous `parcours/` et présente dans le menu devient une leçon du parcours, avec le bouton de validation.

## Ajouter une question avec zone de réponse

Dans une page `.mdx` :

```mdx
import Question from '../../../../../components/Question.astro';

<Question id="tp2-q3.5" label="Q3.5" categorie="surete">
Énoncé de la question, en **Markdown**.
</Question>
```

- `id` : identifiant **unique sur tout le site** et **définitif** (il sert de clé d'enregistrement : le changer fait « perdre » les réponses déjà saisies).
- `label` : numéro affiché.
- `type="code"` : zone en police à chasse fixe, pour coller du code.
- `categorie` (facultatif) : `ingenieur`, `surete`, `securite` ou `donnees`, affiché sous forme de badge.
- `lignes` (facultatif) : hauteur minimale de la zone.

La page « Mes réponses » retrouve automatiquement toutes les questions, dans l'ordre du menu.

## Où sont enregistrées les réponses ?

Le site est statique : les réponses sont enregistrées **dans le navigateur de l'étudiant** (`localStorage`) et ne sont envoyées nulle part. L'étudiant les rend en exportant un **PDF** (impression) ou un fichier **Markdown** depuis « Mes réponses », et peut les transférer d'un appareil à l'autre avec une **sauvegarde JSON**. Vider les données du navigateur efface les réponses : les étudiants doivent sauvegarder en fin de séance.

## Anciennes adresses

Les pages de l'ancien dossier `parcours/atelier-1/` sont redirigées vers `parcours/chapitre-2/` (clé `redirects` de `astro.config.mjs`), et la progression déjà enregistrée par les étudiants est reportée automatiquement (`src/scripts/progression.ts`).
