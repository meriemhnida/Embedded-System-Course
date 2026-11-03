---
title: Exercice — interrupteur coulissant
description: Allumer et éteindre une LED avec un interrupteur coulissant, à réaliser sur Wokwi.
---

**Exercice à faire avant la séance suivante.**

**Objectif :** utiliser un interrupteur coulissant pour commander une LED, et comprendre la notion de résistance de tirage interne.

## L'interrupteur, un capteur à deux positions

Un interrupteur coulissant fonctionne comme un bouton-poussoir, mais il reste dans sa position. Il sert à donner un état stable, comme « lumière allumée » ou « éteinte ».

![Diapositive 90 : le travail à faire avant la séance suivante](../../../../assets/parcours/chapitre-1/diapo-90.webp)

*Diapositive 90 : les exercices 3 et 4 à terminer sur Wokwi. Pense à enregistrer chaque montage dans ton compte.*

## Le montage

![Diapositive 91 : câblage de l'interrupteur coulissant](../../../../assets/parcours/chapitre-1/diapo-91.webp)

*Diapositive 91 : le câblage de l'interrupteur, de la masse à la broche 5, et de la LED sur la broche 13.*

- Une broche de l'**interrupteur** (SW:1.2) est reliée à la **masse GND**.
- L'autre broche (SW:1.3) est reliée à la **broche 5** de l'Arduino.
- La **LED** est branchée comme précédemment : anode sur la broche 13, cathode vers GND à travers 220 Ω.

## Le programme

![Diapositive 92 : le programme de l'interrupteur](../../../../assets/parcours/chapitre-1/diapo-92.webp)

*Diapositive 92 : le code de l'exercice dans la simulation.*

```cpp
const int LED = 13, interrupteur = 5;

void setup() {
  pinMode(LED, OUTPUT);
  pinMode(interrupteur, INPUT_PULLUP);  // résistance de tirage interne activée
}

void loop() {
  int interrupteurState = digitalRead(interrupteur);
  digitalWrite(LED, interrupteurState);
}
```

## Comprendre le tirage interne

`INPUT_PULLUP` active une résistance **interne** à la carte, qui maintient la broche à HAUT (1) quand rien ne la relie à la masse. Quand l'interrupteur relie la broche 5 à GND, la broche lit BAS (0).

Cela remplace la résistance externe de l'atelier précédent. C'est une façon plus économe de fixer le niveau d'une entrée.

:::caution[À observer]
Avec ce programme, la LED s'allume quand l'interrupteur est **ouvert** et s'éteint quand il est **fermé**. C'est l'inverse de ce qu'on attend souvent : la logique est inversée à cause du tirage haut.

Question : comment modifier le programme pour que la LED s'allume quand l'interrupteur est fermé ?
:::

<details>
<summary>Voir une piste</summary>

Il suffit d'inverser la valeur lue : `digitalWrite(LED, !interrupteurState);`. Le symbole `!` signifie « non » : si la broche lit 0, la LED reçoit 1.

</details>

:::note
Quand la LED réagit à l'interrupteur et que tu as compris la logique inversée, valide cette leçon en bas de page.
:::
