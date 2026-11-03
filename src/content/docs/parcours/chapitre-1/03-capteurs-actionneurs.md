---
title: Capteurs et actionneurs
description: Mesurer le monde physique avec un capteur, agir sur lui avec un actionneur.
---

**Objectif :** distinguer un capteur d'un actionneur, comprendre la boucle qui les relie, et savoir choisir un composant.

## Mesurer et agir

Un système embarqué n'existe que parce qu'il est en contact avec le monde physique. Pour cela, il dispose de deux types de composants :

- **Un capteur** mesure une grandeur physique (température, lumière, distance, mouvement) et la convertit en **signal électrique**. Ce passage d'une grandeur physique à un signal électrique s'appelle la **transduction**.
- **Un actionneur** fait l'inverse : il reçoit un signal électrique et produit une **action physique** (mouvement, lumière, son, eau qui coule).

Une machine à laver en donne un bon exemple : un capteur mesure le niveau d'eau, un actionneur ouvre la vanne de remplissage.

## La chaîne complète

Entre le capteur et l'actionneur, le signal fait un long chemin. La diapositive ci-dessous le résume.

![Diapositive 18 : du monde physique au monde physique, la chaîne complète](../../../../assets/parcours/chapitre-1/diapo-18.webp)

*Diapositive 18 : la chaîne complète, du capteur à l'actionneur en passant par le microcontrôleur.*

Chaque étape a son rôle :

1. **Capteur** : transduction de la grandeur physique en signal électrique.
2. **Conditionnement** : le signal est amplifié, filtré, puis converti en nombre (ADC) ou envoyé sur un bus comme l'I²C.
3. **Microcontrôleur** : il lit la valeur, décide et envoie une commande.
4. **Interface de puissance** : une broche de microcontrôleur ne fournit que quelques milliampères. Pour alimenter un moteur, on passe par un transistor, un relais ou un pont en H (L298).
5. **Actionneur** : moteur, servo, LED, buzzer.

Le schéma forme une **boucle fermée** : l'action modifie la grandeur mesurée, qui est mesurée à nouveau, et ainsi de suite. Un thermostat fonctionne exactement comme cela.

## Les capteurs : une grande famille

Un capteur se choisit selon trois critères : ce qu'il mesure, la plage et la précision, et l'interface électrique (numérique ou analogique).

![Diapositive 46 : exemples de capteurs de température](../../../../assets/parcours/chapitre-1/diapo-46.webp)

*Diapositive 46 : plusieurs capteurs de température. Le choix dépend de la plage et de la précision demandées.*

| Capteur | Mesure | Plage et précision |
|---|---|---|
| DS18B20 | Température (numérique) | −55 à 125 °C, ±0,5 °C |
| DHT22 | Température et humidité | −40 à 80 °C, ±0,5 °C |
| DHT11 | Température et humidité | 0 à 50 °C, ±2 °C |
| TMP36 | Température (analogique) | −40 à 125 °C, ±1 °C |
| Photorésistance (LDR) | Lumière | Sa résistance baisse quand la lumière augmente |
| BH1750 | Lumière ambiante (I²C) | Réglage de la luminosité des écrans |
| Capteur ultrason | Distance | Calcul à partir du temps d'écho (son à environ 340 m/s) |
| Bouton-poussoir | Tout ou rien | Gestion d'événements |

Le bouton-poussoir est le plus simple des capteurs : il ne donne que deux états, appuyé ou relâché. Pourtant il sert à déclencher des événements, comme la demande de traversée d'un piéton à un feu.

![Diapositive 47 : le bouton-poussoir, un capteur tout ou rien](../../../../assets/parcours/chapitre-1/diapo-47.webp)

*Diapositive 47 : le bouton-poussoir, un capteur « tout ou rien ».*

Le capteur à ultrasons, lui, mesure une distance. Il émet une onde sonore, puis mesure le temps que met l'écho à revenir. Connaissant la vitesse du son (environ 340 m/s), on en déduit la distance. C'est le principe des robots aspirateurs qui détectent les obstacles.

![Diapositive 50 : le capteur ultrason](../../../../assets/parcours/chapitre-1/diapo-50.webp)

*Diapositive 50 : le capteur à ultrasons, qui mesure une distance grâce au temps d'écho.*

## Les actionneurs : agir sur le monde

Les actionneurs transforment le signal du programme en action physique. Leur nature dépend de ce qu'on veut produire : du mouvement, du son, de la lumière, de l'eau.

![Diapositive 52 : le principe d'un actionneur](../../../../assets/parcours/chapitre-1/diapo-52.webp)

*Diapositive 52 : un actionneur reçoit l'énergie électrique et la transforme en action.*

- **La LED** produit un signal lumineux, par exemple un voyant vert ou rouge pour indiquer l'état d'une machine.

![Diapositive 53 : les LED, actionneurs lumineux](../../../../assets/parcours/chapitre-1/diapo-53.webp)

*Diapositive 53 : les LED, qui signalent l'état d'un système.*

- **Le buzzer** produit un son, par exemple l'alarme d'un détecteur de fumée.

![Diapositive 54 : les buzzers](../../../../assets/parcours/chapitre-1/diapo-54.webp)

*Diapositive 54 : des buzzers, utilisés pour les alarmes sonores.*

- **Le moteur à courant continu** fait tourner un mécanisme, par exemple les roues d'un robot.

![Diapositive 55 : moteur à courant continu](../../../../assets/parcours/chapitre-1/diapo-55.webp)

*Diapositive 55 : un moteur à courant continu.*

- **L'électrovanne** contrôle le débit d'un liquide, par exemple dans un système d'arrosage automatique.

![Diapositive 56 : électrovanne](../../../../assets/parcours/chapitre-1/diapo-56.webp)

*Diapositive 56 : une électrovanne, qui ouvre ou ferme le passage d'un liquide.*

## Comment choisir un capteur ?

Le bon capteur dépend de l'application. Il faut regarder la plage de mesure, la précision, la consommation, le coût et l'interface. Les capteurs numériques sont en général plus précis et plus simples à utiliser que les analogiques. Les thermocouples servent pour les températures très élevées.

:::tip[Exercice]
Tu dois mesurer la température et l'humidité d'une serre, avec une plage de 0 à 50 °C. Quel capteur choisis-tu, et pourquoi ?
:::

<details>
<summary>Voir une réponse possible</summary>

Le **DHT22** : il mesure à la fois la température et l'humidité, sur une plage qui couvre 0 à 50 °C, avec une précision de ±0,5 °C. Le DHT11 fonctionne aussi, mais sa précision est moins bonne (±2 °C).

</details>

## Pour vérifier ta compréhension

- Donne un exemple de capteur et un exemple d'actionneur dans une machine à laver.
- Pourquoi place-t-on un transistor ou un relais entre le microcontrôleur et un moteur ?

:::note
Quand tu as répondu à ces questions, valide cette leçon en bas de page.
:::
