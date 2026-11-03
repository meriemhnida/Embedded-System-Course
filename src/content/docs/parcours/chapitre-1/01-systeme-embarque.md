---
title: Qu’est-ce qu’un système embarqué ?
description: Définition, exemples et contraintes d'un système embarqué.
---

**Objectif :** comprendre ce qu'est un système embarqué, où on le trouve et pourquoi ses contraintes sont différentes de celles d'un ordinateur.

## Un ordinateur caché dans un objet

Quand on pense à un ordinateur, on imagine un portable ou un PC : un écran, un clavier, un système qui peut lancer n'importe quel logiciel. Un **système embarqué** est tout autre chose. C'est un ordinateur **intégré à un produit** pour piloter une fonction précise, et souvent invisible pour l'utilisateur.

Les téléphones, les distributeurs de billets, le régulateur de vitesse d'une voiture ou le pilote automatique d'un avion sont tous des systèmes embarqués.

![Diapositive 29 : objets du quotidien qui sont des systèmes embarqués](../../../../assets/parcours/chapitre-1/diapo-29.webp)

*Diapositive 29 : des objets du quotidien, et même une partie de la voiture, contiennent un système embarqué.*

## Une définition en une phrase

Un système embarqué est un **système électronique et informatique autonome, dédié à une tâche précise et intégré au produit qu'il pilote**.

Trois mots comptent dans cette définition :
- **Autonome** : il fonctionne sans qu'un utilisateur le pilote en permanence.
- **Dédié** : il ne fait qu'une chose, mais il la fait bien.
- **Intégré** : il fait partie du produit, il n'est pas une machine à côté.

Un PC n'est donc pas un système embarqué : il sert à tout faire. En revanche, un thermomètre construit autour d'un microprocesseur en est un, car il n'a qu'une fonction.

![Diapositive 17 : définition, anatomie et contraintes](../../../../assets/parcours/chapitre-1/diapo-17.webp)

*Diapositive 17 : la définition, l'anatomie d'un système embarqué et ses contraintes, résumées sur une seule page.*

## Comment il fonctionne : le cours en une image

Un système embarqué est un bloc qui **observe son environnement**, **décide**, puis **agit**. Ses éléments sont toujours les mêmes :

1. des **capteurs**, qui mesurent le monde physique (température, lumière, distance) ;
2. un **microcontrôleur** avec son logiciel, qui traite les mesures et prend les décisions ;
3. des **actionneurs**, qui agissent sur le monde physique (moteur, LED, buzzer) ;
4. un moyen de **communication** (Wi-Fi, Bluetooth, bus I²C ou SPI) ;
5. une **alimentation** (batterie et régulateur).

![Diapositive 15 : le système embarqué dans son environnement](../../../../assets/parcours/chapitre-1/diapo-15.webp)

*Diapositive 15 : le système embarqué entouré de son environnement physique, avec capteurs, contrôleur et actionneurs.*

Si ce système est relié à Internet, on parle d'**objet connecté** ou d'**IoT** (Internet des objets). Nous y reviendrons au chapitre sur la chaîne IoT.

## Les contraintes : ce qui rend le métier difficile

Un ordinateur de bureau dispose de beaucoup de puissance et d'énergie. Un système embarqué, lui, doit composer avec des contraintes fortes :

| Contrainte | Ce que ça signifie concrètement |
|---|---|
| **Temps réel** | La réponse doit arriver dans un délai garanti. |
| **Énergie** | Il doit fonctionner des mois, voire des années, sur une pile. |
| **Coût** | Il est fabriqué en très grande série, donc chaque centime compte. |
| **Ressources** | Quelques kilo-octets de mémoire, peu de place disponible. |
| **Fiabilité** | Il doit fonctionner sans intervention humaine, parfois pendant des années. |

Prenons la voiture, qui illustre bien ces contraintes. Une voiture haut de gamme contient une centaine de microprocesseurs, et même les modèles bon marché en utilisent une quarantaine. Certains font des tâches simples, comme détecter le port de la ceinture. D'autres contrôlent des fonctions critiques, comme le freinage ou l'allumage.

![Diapositive 35 : la voiture, exemple de système embarqué critique](../../../../assets/parcours/chapitre-1/diapo-35.webp)

*Diapositive 35 : une voiture comme le Ford F-150 contient des millions de lignes de code réparties entre de nombreux systèmes embarqués.*

## Le temps réel, une contrainte à part

Le temps réel mérite un point à part. Dans un système temps réel, le calcul est déclenché par un **événement extérieur**, par exemple une interruption matérielle. Mais surtout, **le résultat n'a de valeur que s'il arrive à temps**.

Imaginez un moniteur cardiaque : une bonne mesure délivrée trop tard ne sert à rien. C'est la validité et la pertinence du résultat qui sont en jeu, pas seulement sa justesse.

![Diapositive 33 : la question de la différence entre système embarqué et système temps réel](../../../../assets/parcours/chapitre-1/diapo-33.webp)

*Diapositive 33 : la question posée au cours, avec une carte électronique qui illustre le sujet.*

## Pour vérifier ta compréhension

- Pourquoi un PC n'est-il pas un système embarqué, alors qu'un thermomètre à microprocesseur en est un ?
- Donne deux contraintes qui s'appliquent à un capteur alimenté par pile.
- Quelle est la différence entre un système embarqué et un système temps réel ?

:::note
Quand tu as répondu à ces questions, valide cette leçon en bas de page.
:::
