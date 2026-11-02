---
title: Atelier 1 — première LED
description: Simuler une LED qui clignote sur une Arduino UNO avec Wokwi.
---

**Objectif :** concevoir, simuler et programmer un premier circuit avec une Arduino UNO.

## Préparer la simulation

1. Ouvre **wokwi.com** dans ton navigateur.
2. Connecte-toi avec ton **compte GitHub** : tes projets seront conservés.
3. Crée un nouveau projet **« Arduino Uno »**.

:::tip
Enregistre chaque montage dans ton compte Wokwi : tu gardes ainsi l'historique de tes projets.
:::

## Le montage

- Relie l'**anode** (patte longue) de la LED à la **broche 13**.
- Relie la **cathode** (patte courte) à la masse **GND**, à travers une **résistance de 220 Ω**.

## Le programme

```cpp
const int LEDPin = 13;

void setup() {
  pinMode(LEDPin, OUTPUT);
}

void loop() {
  digitalWrite(LEDPin, HIGH);  // LED allumée
  delay(250);                  // pendant 250 ms
  digitalWrite(LEDPin, LOW);   // LED éteinte
  delay(250);                  // pendant 250 ms
}
```

Lance la simulation et observe la LED.

## Questions

- Quelle est la durée d'un cycle complet (allumée puis éteinte) ?
- Que se passe-t-il si tu remplaces `delay(250)` par `delay(50)` ?
- Pourquoi la résistance de 220 Ω est-elle nécessaire ? Avec une tension de 5 V et une LED qui consomme environ 2 V, quel courant traverse la LED ? (Loi d'Ohm : I = (5 − 2) / 220, soit environ 14 mA.)

:::note
Quand la LED clignote comme prévu et que tu as répondu aux questions, valide cette leçon en bas de page.
:::
