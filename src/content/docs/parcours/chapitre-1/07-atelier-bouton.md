---
title: Atelier 2 — bouton-poussoir
description: Lire l'état d'un bouton-poussoir et allumer une LED en conséquence.
---

**Objectif :** utiliser une broche comme entrée numérique pour lire un bouton-poussoir, et comprendre pourquoi une résistance est indispensable.

## Lire une entrée

Dans l'atelier précédent, la broche 13 **envoyait** un signal. Ici, la broche 2 **reçoit** un signal : le programme demande « le bouton est-il appuyé ? ». La fonction `digitalRead()` répond HAUT (1) ou BAS (0).

![Diapositive 88 : le montage du bouton-poussoir](../../../../assets/parcours/chapitre-1/diapo-88.webp)

*Diapositive 88 : le bouton relie la broche 2 au 5 V, et une résistance relie la broche 2 à la masse.*

## Le montage

- Une extrémité du **bouton-poussoir** est reliée à la **broche 2**.
- L'autre extrémité est reliée au **5 V**. Quand on appuie, la broche 2 reçoit 5 V.
- Une **résistance** relie la **broche 2** à la **masse GND**.
- La LED reste branchée comme dans l'atelier précédent : anode sur la broche 13, cathode vers GND à travers 220 Ω.

## Pourquoi cette résistance ?

Quand le bouton est relâché, la broche 2 n'est reliée à rien. Elle capte alors du bruit électrique, et sa valeur devient imprévisible : la LED pourrait clignoter toute seule.

La résistance règle ce problème en reliant la broche à la masse. Quand le bouton est relâché, la broche reste donc à 0 V, de manière stable. On parle de **résistance de tirage bas**, ou *pull-down*.

:::tip[Retenir]
Une entrée qui n'est reliée à rien doit toujours être fixée à un niveau connu, sinon elle lit n'importe quoi.
:::

## Le programme

```cpp
const int buttonPin = 2;

void setup() {
  pinMode(buttonPin, INPUT);      // la broche 2 est une entrée
  pinMode(LED_BUILTIN, OUTPUT);   // LED_BUILTIN est la broche 13 sur la UNO
}

void loop() {
  digitalWrite(LED_BUILTIN, digitalRead(buttonPin));  // la LED suit le bouton
}
```

La diapositive suivante montre le programme dans la simulation : la LED s'allume quand on appuie sur le bouton.

![Diapositive 89 : le programme qui relie le bouton à la LED](../../../../assets/parcours/chapitre-1/diapo-89.webp)

*Diapositive 89 : le bouton et la LED dans la simulation. Clique sur le bouton dans Wokwi pour l'essayer.*

## Questions

- Quelle valeur lit `digitalRead()` quand le bouton est appuyé ? Quand il est relâché ?
- Que se passe-t-il si tu retires la résistance de la broche 2 ?
- Comment faire pour que la LED reste allumée après un appui ? (Indice : une variable peut mémoriser l'état.)

:::note
Quand le bouton allume la LED et que tu as répondu aux questions, valide cette leçon en bas de page.
:::
