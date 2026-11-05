---
title: Atelier 1 — première LED
description: Simuler une LED qui clignote sur une Arduino UNO avec Wokwi.
---

:::note[Objectifs de la leçon]
À la fin de cet atelier, vous serez capables de :
- créer un projet Arduino sur le simulateur Wokwi ;
- câbler une LED avec sa résistance ;
- écrire et comprendre un programme qui fait clignoter la LED.
:::

## Pourquoi simuler ?

Avant de brancher un vrai circuit, on peut le **simuler**. Wokwi est un simulateur en ligne qui exécute le programme comme le ferait la vraie carte. Une erreur de câblage se corrige en un clic, **sans risque de griller un composant**.

## Préparer la simulation

1. Ouvrez **wokwi.com** dans votre navigateur.
2. Connectez-vous avec votre **compte GitHub** : vos projets seront conservés.
3. Créez un nouveau projet **« Arduino Uno »**.

![Le simulateur Wokwi avec une carte ESP32 et un écran LCD](../../../../assets/parcours/chapitre-1/img/wokwi.webp)

*L'interface de Wokwi : la carte et les composants au centre, le programme à côté.*

:::note[Bon à savoir]
En vous connectant avec votre compte GitHub, vous **conservez l'historique de tous vos projets**. Pensez à enregistrer chaque montage.
:::

## Le montage

- Reliez l'**anode** (patte longue) de la LED à la **broche 13**.
- Reliez la **cathode** (patte courte) à la masse **GND**, à travers une **résistance de 220 Ω**.

![Une LED et sa résistance branchées sur une carte Arduino UNO avec une plaque d'essai](../../../../assets/parcours/chapitre-1/img/montage-led-breadboard.webp)
![Le montage de la LED dans Wokwi](../../../../assets/parcours/chapitre-1/img/montage-led-wokwi.webp)

*À gauche, un montage avec plaque d'essai. À droite, le même circuit dans Wokwi.*

### Pourquoi la résistance ?

La résistance **limite le courant** qui traverse la LED. D'après la loi d'Ohm, **I = U / R**. Avec 5 V à fournir et une LED qui consomme environ 2 V, la résistance reçoit 3 V. Le courant vaut donc environ 3 / 220 ≈ 14 mA, ce que la LED supporte.

:::danger[À retenir]
Sans résistance, le courant n'est pas limité : la LED chauffe et peut être détruite. **Toujours une résistance en série avec une LED.**
:::

## Le programme

Un programme Arduino comporte deux fonctions :

- `setup()` s'exécute **une seule fois** au démarrage ;
- `loop()` **se répète sans fin**.

```cpp
const int LEDPin = 13;

void setup() {
  pinMode(LEDPin, OUTPUT);     // on configure la broche 13 en sortie
}

void loop() {
  digitalWrite(LEDPin, HIGH);  // la broche passe à 5 V : LED allumée
  delay(250);                  // on attend 250 ms
  digitalWrite(LEDPin, LOW);   // la broche passe à 0 V : LED éteinte
  delay(250);                  // on attend 250 ms
}
```

Chaque ligne a un rôle précis :

| Instruction | Ce qu'elle fait |
|---|---|
| `pinMode(LEDPin, OUTPUT)` | Configure la broche 13 en sortie |
| `digitalWrite(LEDPin, HIGH)` | Met la broche à 5 V : la LED s'allume |
| `delay(250)` | Attend 250 millisecondes |
| `digitalWrite(LEDPin, LOW)` | Met la broche à 0 V : la LED s'éteint |

Lancez la simulation et observez la LED.

:::tip[À vous de jouer]
1. Quelle est la durée d'un cycle complet (allumée puis éteinte) ?
2. Que se passe-t-il si vous remplacez `delay(250)` par `delay(50)` ?
3. Modifiez le programme pour que la LED reste allumée 1 seconde et éteinte 250 ms.
:::

<details>
<summary>Voir les réponses</summary>

1. 250 ms + 250 ms = **500 ms**.
2. Le clignotement devient beaucoup plus rapide : le cycle dure 100 ms.
3. Remplacez le premier `delay(250)` par `delay(1000)` : la LED reste allumée 1 seconde, puis éteinte 250 ms.

</details>

:::note[Prochaine étape]
Quand la LED clignote comme prévu, validez cette leçon en bas de page.
:::
