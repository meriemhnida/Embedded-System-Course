---
title: Microcontrôleur ou microprocesseur ?
description: Différences entre microcontrôleur, microprocesseur et carte de développement.
---

**Objectif :** distinguer un microcontrôleur d'un microprocesseur, et identifier les blocs d'une carte.

## Microcontrôleur

Un microcontrôleur est une **puce qui regroupe tout le nécessaire** dans un seul composant :

- un processeur (CPU) ;
- des mémoires : Flash pour le programme, SRAM pour les variables, EEPROM pour les réglages ;
- des périphériques : convertisseur analogique-numérique (ADC), UART, I²C, SPI, PWM.

Il est économe en énergie, peu coûteux et adapté aux tâches dédiées.

## Microprocesseur

Un microprocesseur exécute les instructions d'un programme stocké en mémoire, **mais ne contient généralement ni mémoire ni périphériques intégrés**. Il est fait pour la puissance de calcul, la flexibilité et les applications complexes (multimédia, plusieurs tâches en parallèle).

## Comparaison

| Critère | Microcontrôleur | Microprocesseur |
|---|---|---|
| Points forts | Faible consommation, coût bas, contrôle direct des broches | Puissance de calcul, multitâche |
| Mémoire et périphériques | Intégrés à la puce | Externes à la puce |
| Usage typique | Commander un capteur, un moteur, une LED | Systèmes complexes (smartphone, ordinateur) |

## Carte de développement

Un microcontrôleur seul est difficile à utiliser. Une **carte de développement** l'entoure de tout le nécessaire :

- le microcontrôleur (ou son module) ;
- l'alimentation et son régulateur (par exemple 5 V vers 3,3 V) ;
- un pont USB-série, pour programmer la carte et lire le moniteur série ;
- les connecteurs d'entrées-sorties (GPIO, ADC, PWM, bus) ;
- des boutons (BOOT, EN ou RESET).

:::caution[Attention]
Une carte comme le Raspberry Pi 5 est un **ordinateur monocarte** : son processeur fait tourner Linux. Ce n'est pas un microcontrôleur.
:::

## Exemples de microcontrôleurs

| Carte | Fabricant | Caractéristique clé |
|---|---|---|
| Arduino UNO R3 | Arduino (ATmega328P) | Carte de référence 8 bits, 16 MHz, 2 Ko de RAM |
| ESP32-DevKitC V4 | Espressif | Double cœur à 240 MHz, Wi-Fi et Bluetooth |
| Raspberry Pi Pico 2 W | Raspberry Pi (RP2350) | Wi-Fi, blocs PIO programmables |
| Nucleo-F401RE | STMicroelectronics | Carte STM32 pour apprendre le C |

## Pour vérifier ta compréhension

- Cite trois éléments que l'on trouve dans un microcontrôleur et absents d'un microprocesseur classique.
- Dans quelle catégorie rangerais-tu un téléphone ? Une machine à laver ?
- Pourquoi une carte de développement est-elle plus pratique qu'un microcontrôleur nu ?

:::note
Quand tu as répondu à ces questions, valide cette leçon en bas de page.
:::
