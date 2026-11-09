---
title: Atelier 2 — bouton-poussoir
description: Lire l'état d'un bouton-poussoir et allumer une LED en conséquence.
---

:::note[Objectifs de la leçon]
À la fin de cet atelier, vous serez capables de :
- utiliser une broche comme entrée numérique ;
- expliquer le rôle d'une résistance de tirage (pull-down) ;
- écrire un programme où une LED suit l'état d'un bouton.
:::

## Lire une entrée

Dans l'atelier précédent, la broche 13 **envoyait** un signal. Ici, la broche 2 va **recevoir** un signal : le programme demande « le bouton est-il appuyé ? ». La fonction `digitalRead()` répond **HAUT (1)** ou **BAS (0)**.

![Les boutons-poussoirs de plusieurs couleurs](../../../../assets/parcours/chapitre-1/img/capteur-bouton.webp)

*Un bouton-poussoir est un capteur « tout ou rien » : appuyé ou relâché.*

## Le montage

- Une extrémité du **bouton-poussoir** est reliée à la **broche 2**.
- L'autre extrémité du bouton est reliée au **5 V**. Quand on appuie, la broche 2 reçoit 5 V.
- Une **résistance** relie la **broche 2** à la **masse GND**.
- La LED reste branchée comme dans l'atelier précédent : anode sur la broche 13, cathode vers GND à travers 220 Ω.

![Montage dans Wokwi : bouton vert, LED rouge, résistances, carte UNO](../../../../assets/parcours/chapitre-1/img/montage-bouton.webp)

*Le bouton est relié à la broche 2 et au 5 V, et une résistance relie la broche 2 à la masse. La LED est sur la broche 13.*

## Pourquoi cette résistance ?

Quand le bouton est relâché, la broche 2 n'est reliée à **rien**. Elle capte alors du bruit électrique, et sa valeur devient **imprévisible** : la LED pourrait clignoter toute seule.

La résistance règle ce problème : elle relie la broche à la masse. Bouton relâché, la broche reste donc à 0 V, de manière stable. On parle de **résistance de tirage bas**, ou *pull-down*.

:::danger[À retenir]
Une entrée qui n'est reliée à rien est **flottante** : elle lit n'importe quoi. Il faut **toujours fixer son niveau** avec une résistance (tirage bas ou tirage haut).
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

La dernière ligne fait deux choses en une : elle **lit** la broche 2 avec `digitalRead()`, puis **recopie** la valeur sur la LED avec `digitalWrite()`.

:::note[Information]
`LED_BUILTIN` est une constante d'Arduino qui désigne la LED intégrée à la carte. Sur la UNO, il s'agit de la broche 13.
:::

Lancez la simulation et cliquez sur le bouton : la LED s'allume tant que vous appuyez.

:::tip[À vous de jouer]
1. Quelle valeur lit `digitalRead()` quand le bouton est appuyé ? Quand il est relâché ?
2. Que se passe-t-il si vous retirez la résistance de la broche 2 ?
3. Comment faire pour que la LED reste allumée après un appui ? (Indice : une variable peut mémoriser l'état.)
:::

<details>
<summary>Voir les réponses</summary>

1. Appuyé : HAUT (1), car la broche reçoit 5 V. Relâché : BAS (0), grâce à la résistance vers GND.
2. La broche devient flottante : la LED peut s'allumer ou clignoter sans raison.
3. Utiliser une variable `etat` qui change à chaque appui : `if (digitalRead(buttonPin) == HIGH) { etat = !etat; }`, puis `digitalWrite(LED_BUILTIN, etat);`.

</details>

:::note[Prochaine étape]
Quand le bouton allume la LED, validez cette leçon en bas de page.
:::
