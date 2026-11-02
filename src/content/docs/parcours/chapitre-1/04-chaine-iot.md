---
title: De l’objet au cloud, la chaîne IoT
description: Les couches d'un système IoT, des capteurs jusqu'à l'application métier.
---

**Objectif :** situer un système embarqué dans une chaîne IoT, du capteur au cloud.

## IoT ou systèmes cyber-physiques ?

Un **système IoT** est un ensemble de capteurs, d'actionneurs et d'unités de calcul connectés par un réseau, souvent sans fil. Il surveille, analyse, évalue et agit. Il peut regrouper des milliards d'objets.

Un **système cyber-physique (CPS)** couple fortement une partie logicielle et des éléments mécaniques ou électroniques, avec un contrôle en temps réel. Il est souvent déployé dans un environnement précis, comme une usine.

## Les cinq couches

1. **Perception** : capteurs et actionneurs, pour mesurer le monde physique et agir sur lui.
2. **Edge** : microcontrôleur et passerelle, pour numériser, filtrer et décider localement.
3. **Réseau et protocoles** : Wi-Fi, BLE, LoRaWAN, NB-IoT, avec les protocoles MQTT, CoAP ou HTTP.
4. **Plateforme et données** : stockage, Big Data et intelligence artificielle.
5. **Application et métier** : tableaux de bord, alertes, aide à la décision.

La **sécurité** et la **gestion** concernent toutes les couches.

## Edge ou cloud ?

- **Edge** : le traitement se fait près de la source, sur l'objet ou une passerelle. Il réagit vite et envoie moins de données.
- **Cloud** : le stockage et le traitement sont centralisés dans des centres de données distants. Il offre une grande puissance d'analyse.

Un bon système combine les deux : l'objet décide localement, le cloud analyse l'ensemble.

## Choisir le réseau

| Famille | Exemples | Portée | Usage |
|---|---|---|---|
| Courte portée | Wi-Fi, Bluetooth LE, Zigbee | Quelques mètres à une centaine de mètres | Maison, bâtiment, débits élevés |
| LPWAN libre | LoRaWAN, Sigfox | Kilomètres, quelques octets | Piles qui durent des années |
| LPWAN cellulaire | NB-IoT, LTE-M | Réseau d'opérateur | Couverture intérieure, mobilité |

:::tip[À retenir]
Plus on va loin, moins on transmet. On choisit le réseau selon le volume de données et la distance.
:::

## Exemples de chaîne de valeur

- **Agriculture de précision** : capteurs d'humidité du sol, LoRaWAN, règles d'irrigation. Résultat : eau économisée.
- **Industrie 4.0** : accéléromètres sur un moteur, passerelle Edge, analyse des vibrations. Résultat : alerte avant la panne.
- **Ville intelligente** : capteurs de présence au sol pour le stationnement. Résultat : guidage des conducteurs.
- **Santé connectée** : capteurs portés (fréquence cardiaque, SpO₂), Bluetooth LE vers un smartphone, alerte au soignant.

## Pour aller plus loin : l'IA sur le microcontrôleur (TinyML)

Le **TinyML** consiste à exécuter un modèle d'intelligence artificielle directement sur un microcontrôleur, avec une très faible consommation. Un modèle est entraîné dans le cloud, compressé (par exemple en int8, environ quatre fois plus petit), puis déployé sur l'objet.

## Pour vérifier ta compréhension

- Quelle couche de la chaîne IoT correspond à un tableau de bord ?
- Pourquoi un capteur de vibrations relié à une passerelle Edge est-il préférable à l'envoi brut de toutes les mesures vers le cloud ?
- Un capteur fonctionne sur pile pendant plusieurs années, à plusieurs kilomètres de la passerelle. Quelle famille de réseau choisis-tu ?

:::note
Quand tu as répondu à ces questions, valide cette leçon en bas de page.
:::
