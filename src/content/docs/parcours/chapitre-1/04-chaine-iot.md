---
title: De l’objet au cloud, la chaîne IoT
description: Les couches d'un système IoT, des capteurs jusqu'à l'application métier.
---

:::note[Objectifs de la leçon]
À la fin de cette leçon, vous serez capables de :
- expliquer ce qu'est l'IoT et le distinguer d'un système cyber-physique ;
- décrire les cinq couches d'une chaîne IoT ;
- choisir entre traitement local (Edge) et cloud ;
- choisir un réseau selon la distance et le volume de données.
:::

## Quand l'objet se connecte

Un système embarqué isolé ne sert qu'à celui qui le regarde. Dès qu'il envoie ses mesures sur un réseau, il devient un **objet connecté**, et l'ensemble prend le nom d'**IoT**, pour *Internet of Things*.

![Illustration d'un système IoT : capteurs, microcontrôleurs, réseau, cloud et applications](../../../../assets/parcours/chapitre-1/img/ensemble-iot.webp)

*Du capteur au cloud : un système IoT relie des objets, un réseau, des serveurs et des applications.*

## IoT ou système cyber-physique ?

Deux styles de conception existent pour faire interagir les ordinateurs avec le monde physique :

- Un **système IoT** est un ensemble de capteurs, d'actionneurs et de calcul reliés par un réseau, souvent sans fil. Il **surveille, analyse, évalue et agit**. Il peut regrouper des milliards d'objets répartis dans l'espace.
- Un **système cyber-physique (CPS)** couple très fortement un logiciel et des éléments mécaniques ou électroniques, souvent en temps réel. Il est en général déployé dans un environnement précis, comme une usine.

![Diagramme de Venn : CPS, IoT, et au centre CPS-IoT avec les systèmes embarqués](../../../../assets/parcours/chapitre-1/img/iot-cps.webp)

*Les systèmes IoT et CPS se recouvrent. Les systèmes embarqués en sont l'élément commun.*

:::note[Information]
**IoT** = capteurs + réseaux sans fil + base de données. **CPS** = couplage plus fort entre le logiciel et le monde physique, avec le contrôle en temps réel.
:::

![Industrie 4.0 : des systèmes cyber-physiques reliés à l'IoT et au cloud](../../../../assets/parcours/chapitre-1/img/industrie-40.webp)

*Dans l'Industrie 4.0 (la digitalisation de l'industrie), des systèmes cyber-physiques sont reliés au cloud par l'IoT.*

## Les cinq couches d'une chaîne IoT

Une chaîne IoT se découpe en couches. Chacune répond à une question différente : que mesure-t-on ? Où décide-t-on ? Comment transporte-t-on ? Où stocke-t-on ? Qu'en fait-on ?

![Les cinq couches de l'IoT : perception, edge, réseau, plateforme et données, application et métier, avec la sécurité sur toutes les couches](../../../../assets/parcours/chapitre-1/img/couches-iot.webp)

*Les cinq couches, de la perception (en bas) à l'application métier (en haut). La sécurité concerne toutes les couches.*

1. **Perception** : capteurs et actionneurs mesurent le monde physique et agissent sur lui.
2. **Edge** : le microcontrôleur ou une passerelle numérisent, filtrent et décident localement.
3. **Réseau et protocoles** : Wi-Fi, BLE, LoRaWAN ou NB-IoT pour le transport, avec les protocoles MQTT, CoAP ou HTTP.
4. **Plateforme et données** : stockage, traitement massif (Big Data) et intelligence artificielle.
5. **Application et métier** : tableaux de bord, alertes, aide à la décision.

:::caution[Important]
La **sécurité** concerne **toutes** les couches. Une donnée non protégée sur le réseau, ou un objet mal sécurisé, compromet tout le reste de la chaîne.
:::

## Edge ou cloud : où faire le calcul ?

Cette question revient dans presque tous les projets.

- Le **Edge computing** traite les données **près de leur source**, sur l'objet ou une passerelle. Il réagit vite, consomme peu de réseau et continue de fonctionner si la connexion coupe.
- Le **cloud computing** centralise le stockage et les traitements dans des centres de données distants. Il offre une grande puissance d'analyse, mais dépend du réseau.

![Architecture Edge : des appareils, des nœuds Edge, la couche Edge et le cloud](../../../../assets/parcours/chapitre-1/img/edge-cloud.webp)

*L'architecture Edge : des appareils sur le terrain, un traitement local, puis le cloud pour le stockage et l'analyse.*

:::danger[À retenir]
**Edge** = décider **vite et localement**. **Cloud** = **stocker et analyser** l'ensemble. Un bon système combine les deux.
:::

## Choisir le réseau

Le réseau se choisit selon deux critères : la **distance** et le **volume de données**. Plus un réseau porte loin, moins il transporte de données.

![Graphique du débit selon la portée pour Wi-Fi, Bluetooth LE, Zigbee, LTE-M, NB-IoT, LoRaWAN et Sigfox, avec trois familles](../../../../assets/parcours/chapitre-1/img/reseaux-iot.webp)

*Portée et débit des réseaux sans fil IoT, regroupés en trois familles.*

| Famille | Exemples | Usage |
|---|---|---|
| Courte portée | Wi-Fi, Bluetooth LE, Zigbee | Maison, bâtiment, débits élevés, alimentation fréquente |
| LPWAN libre | LoRaWAN, Sigfox | Kilomètres de portée, quelques octets, piles qui durent des années |
| LPWAN cellulaire | NB-IoT, LTE-M | Réseau d'opérateur, couverture intérieure, mobilité |

:::danger[À retenir]
**Plus on va loin, moins on transmet.** On choisit le réseau selon le volume de données et la distance.
:::

## Des exemples concrets

La chaîne de valeur change d'un secteur à l'autre.

![Tableau de quatre chaînes de valeur : agriculture, industrie, ville intelligente, santé](../../../../assets/parcours/chapitre-1/img/chaine-de-valeur.webp)

*Quatre secteurs : agriculture de précision, maintenance prédictive, ville intelligente et santé connectée, avec leurs capteurs, leur connectivité et leur plateforme.*

- **Agriculture de précision** : des capteurs d'humidité du sol envoient leurs mesures en LoRaWAN, et l'irrigation n'est déclenchée que si nécessaire. Résultat : de l'eau économisée.
- **Industrie 4.0** : des accéléromètres mesurent les vibrations d'un moteur. Une passerelle Edge et des modèles d'IA permettent d'être alerté avant la panne.
- **Ville intelligente** : des capteurs de présence au sol détectent les places libres. Les conducteurs sont guidés en temps réel.
- **Santé connectée** : des capteurs portés mesurent la fréquence cardiaque, puis envoient les données au smartphone en Bluetooth LE. Un soignant est alerté si nécessaire.

## Pour aller plus loin : l'IA sur le microcontrôleur

Le **TinyML** consiste à exécuter un modèle d'intelligence artificielle **directement sur un microcontrôleur**, avec une consommation très faible. Le modèle est entraîné dans le cloud, compressé (par exemple en int8, environ quatre fois plus petit), puis déployé sur l'objet.

![Diagramme de Venn : apprentissage automatique, systèmes embarqués, applications, au centre TinyML](../../../../assets/parcours/chapitre-1/img/tinyml.webp)

*Le TinyML réunit l'apprentissage automatique et les systèmes embarqués pour des appareils alimentés par batterie.*

## Testez-vous

1. Quelle couche de la chaîne IoT correspond à un tableau de bord ?
2. Pourquoi une passerelle Edge est-elle préférable à l'envoi brut de toutes les mesures de vibrations vers le cloud ?
3. Un capteur fonctionne sur pile pendant plusieurs années, à plusieurs kilomètres de la passerelle. Quelle famille de réseau choisissez-vous ?

<details>
<summary>Voir les réponses</summary>

1. La couche 5, **Application et métier**.
2. Le traitement local réduit le volume de données envoyées, réagit plus vite et fonctionne même si la connexion est coupée.
3. Un **LPWAN** (LoRaWAN, par exemple) : grande portée et très faible consommation, au prix d'un débit réduit.

</details>

:::note[Prochaine étape]
Quand vous avez répondu aux questions, validez cette leçon en bas de page.
:::
