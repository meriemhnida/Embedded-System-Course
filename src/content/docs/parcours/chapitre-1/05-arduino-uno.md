---
title: Découvrir la carte Arduino UNO
description: Localiser le microcontrôleur, les broches numériques, analogiques et d'alimentation de l'Arduino UNO.
---

:::note[Objectifs de la leçon]
À la fin de cette leçon, vous serez capables de :
- localiser le microcontrôleur et l'alimentation sur la carte ;
- distinguer les broches numériques, analogiques, PWM et d'alimentation ;
- configurer une broche en entrée ou en sortie et lire une valeur analogique.
:::

## Une carte, un cerveau

L'Arduino UNO R3 est la carte de référence pour débuter. Son cœur est un **ATmega328P**, un microcontrôleur 8 bits fabriqué par Microchip. C'est lui qui exécute le programme et gère toutes les entrées-sorties.

![Carte Arduino UNO R3 vue de dessus](../../../../assets/parcours/chapitre-1/img/uno-schema.webp)

*La carte Arduino UNO R3. Le grand circuit intégré noir, au centre, est le microcontrôleur ATmega328P.*

La famille Arduino compte d'autres cartes, adaptées à des besoins différents :

![Arduino UNO](../../../../assets/parcours/chapitre-1/img/famille-uno.webp)
![Arduino Mega](../../../../assets/parcours/chapitre-1/img/famille-mega.webp)
![Arduino Nano](../../../../assets/parcours/chapitre-1/img/famille-nano.webp)
![ATtiny85](../../../../assets/parcours/chapitre-1/img/famille-attiny85.webp)

*UNO (la plus connue, idéale pour débuter), Mega (plus de broches et de mémoire), Nano (compacte) et ATtiny85 (microcontrôleur minuscule et économique).*

## Les caractéristiques à retenir

| Caractéristique | Valeur |
|---|---|
| Microcontrôleur | ATmega328P, CPU jusqu'à 16 MHz |
| Mémoire | 32 Ko de Flash, 2 Ko de SRAM, 1 Ko d'EEPROM |
| Entrées-sorties numériques | 14, dont 6 PWM |
| Entrées analogiques | 6 (ADC 10 bits) |
| Communication | 1 UART, 1 I²C, 1 SPI |
| Tension des E/S | 5 V, 20 mA par broche |
| Alimentation | VIN 7 à 12 V (jack) ou USB 5 V |

:::note[Points forts et limites]
**Points forts** : robuste, fonctionne en 5 V, immense écosystème de shields et de bibliothèques.
**Limites** : 2 Ko de RAM seulement, et ni Wi-Fi ni Bluetooth.
:::

## L'alimentation

La carte peut être alimentée par le **câble USB**, pendant le développement, ou par une **alimentation externe** (jack ou broche VIN) quand elle fonctionne seule. Les broches d'alimentation fournissent aussi des tensions pour les composants :

- **VIN** : entrée pour une alimentation externe, recommandée entre 7 et 12 V ;
- **5 V** et **3,3 V** : sorties régulées pour alimenter les composants ;
- **GND** : la masse, à 0 V. La carte en possède plusieurs, toutes reliées entre elles ;
- **IOREF** : indique aux shields la tension de fonctionnement de la carte ;
- **AREF** : définit la tension de référence du convertisseur analogique.

:::caution[Important]
Pour qu'un circuit fonctionne, il doit **toujours** être relié à la **masse (GND)**. Un composant sans retour vers GND n'est pas alimenté.
:::

## Les broches numériques (0 à 13)

Une broche numérique ne connaît que deux états : **HAUT** (5 V, niveau logique 1) ou **BAS** (0 V, niveau logique 0). On la configure :

- en **entrée** (`INPUT`) pour lire un état, par exemple un bouton ;
- en **sortie** (`OUTPUT`) pour commander quelque chose, par exemple une LED.

Quelques broches ont une fonction particulière :

- **D0 et D1** : communication série UART (RX et TX), utilisée aussi par le câble USB ;
- **D2 et D3** : interruptions externes, pour réagir immédiatement à un événement ;
- **D3, D5, D6, D9, D10, D11** : sorties PWM (voir plus bas) ;
- **D10 à D13** : bus SPI ;
- **D13** : LED intégrée à la carte.

```cpp
void setup() {
  pinMode(8, OUTPUT);     // la broche 8 devient une sortie
}

void loop() {
  digitalWrite(8, HIGH);  // elle passe à 5 V : une LED branchée dessus s'allume
}
```

### Brancher une LED correctement

![Une LED branchée avec une résistance sur la carte UNO](../../../../assets/parcours/chapitre-1/img/uno-led.webp)
![Polarité d'une LED : anode (+) patte longue, cathode (−) patte courte, côté plat](../../../../assets/parcours/chapitre-1/img/polarite-led.webp)

*À gauche, une LED branchée sur la carte avec sa résistance. À droite, la polarité d'une LED.*

Une LED a **deux pattes qui ne sont pas interchangeables** : l'**anode** (+, patte longue) va vers la broche de sortie, la **cathode** (−, patte courte, côté plat) va vers la masse. Le courant doit circuler de l'anode vers la cathode.

:::danger[À retenir]
Une LED se branche **toujours avec une résistance en série** (par exemple 220 Ω). Sans elle, le courant est trop fort et la LED peut être détruite.
:::

## Les broches analogiques (A0 à A5)

Une entrée analogique lit une tension qui **varie de façon continue**. Le convertisseur (ADC) de la carte, sur 10 bits, transforme cette tension en un nombre entre **0 et 1023**. A4 et A5 servent aussi au bus I²C.

![Du potentiomètre à des valeurs numériques : tension analogique de 0 à 5 V, convertisseur ADC, valeurs de 0 à 1023](../../../../assets/parcours/chapitre-1/img/convertisseur-adc.webp)

*Le potentiomètre produit une tension entre 0 et 5 V. L'ADC la convertit en un nombre entre 0 et 1023 que le programme peut utiliser.*

Un **potentiomètre** est la façon la plus simple de tester ce principe : en tournant le curseur, on fait varier la tension lue sur A0.

![Un potentiomètre photographié](../../../../assets/parcours/chapitre-1/img/potentiometre-photo.webp)
![Un potentiomètre relié à la carte UNO](../../../../assets/parcours/chapitre-1/img/potentiometre-montage.webp)

*Un potentiomètre réel, puis son branchement sur la carte : GND, 5 V et le curseur vers A0.*

```cpp
void setup() {
  Serial.begin(9600);            // communication série à 9600 bits/s
}

void loop() {
  int valeur = analogRead(A0);   // lit la tension sur A0 : 0 à 1023
  Serial.println(valeur);        // affiche la valeur dans le moniteur série
  delay(300);
}
```

![Le moniteur série affichant les valeurs lues, de 0 à 1023, quand on tourne le potentiomètre](../../../../assets/parcours/chapitre-1/img/moniteur-serie.webp)

*Dans le moniteur série, la valeur change de 0 à 1023 quand on tourne le potentiomètre.*

:::caution[Important]
La UNO R3 **n'a pas de sortie analogique**. Pour simuler une tension variable en sortie, on utilise la **PWM**.
:::

## La PWM : imiter une tension variable

Les broches 3, 5, 6, 9, 10 et 11 savent produire un signal **PWM** (modulation de largeur d'impulsion). Le signal alterne **très vite** entre HAUT et BAS. La proportion de temps passée à l'état HAUT s'appelle le **rapport cyclique**. Plus il est grand, plus la puissance moyenne est élevée.

![La carte UNO avec les broches PWM repérées par un symbole tilde](../../../../assets/parcours/chapitre-1/img/uno-pwm-broches.webp)

*Les broches PWM sont repérées par le symbole ~ sur la carte : 3, 5, 6, 9, 10 et 11.*

![Signal PWM : rapport cyclique de 0 %, 25 %, 50 % et 100 %](../../../../assets/parcours/chapitre-1/img/signal-pwm.webp)

*`analogWrite(0)` donne 0 %, `analogWrite(64)` environ 25 %, `analogWrite(127)` environ 50 % et `analogWrite(255)` 100 %.*

On utilise la PWM pour régler la luminosité d'une LED ou la vitesse d'un moteur.

## Le bouton RESET

Le bouton RESET **redémarre** le microcontrôleur. Il permet aussi de le forcer en mode **bootloader**, un petit programme préinstallé sur la puce. Le bootloader reçoit votre programme depuis l'ordinateur et l'écrit dans la mémoire Flash.

## Testez-vous

1. Combien de broches d'entrées-sorties la UNO R3 possède-t-elle ?
2. Quelles broches permettent d'utiliser `analogWrite()` ?
3. Pourquoi place-t-on une résistance en série avec une LED ?
4. Quelle valeur renvoie `analogRead()` quand le potentiomètre est à mi-course ?

<details>
<summary>Voir les réponses</summary>

1. 20 broches : 14 numériques et 6 analogiques (plus les broches d'alimentation).
2. Les broches PWM : 3, 5, 6, 9, 10 et 11.
3. Pour limiter le courant et éviter de détruire la LED.
4. Environ 512, soit la moitié de la plage de 0 à 1023.

</details>

:::note[Prochaine étape]
Quand vous avez répondu aux questions, validez cette leçon en bas de page.
:::
