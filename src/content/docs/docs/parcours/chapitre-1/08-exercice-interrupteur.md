---
title: Exercice — interrupteur coulissant
description: Allumer et éteindre une LED avec un interrupteur coulissant, à réaliser sur Wokwi.
---

:::caution[Exercice à terminer avant la séance suivante]
Enregistrez votre montage dans votre compte Wokwi (connexion GitHub) pour garder l'historique de vos projets.
:::

:::note[Objectifs de la leçon]
À la fin de cet exercice, vous serez capables de :
- câbler un interrupteur coulissant sur une entrée numérique ;
- utiliser `INPUT_PULLUP` pour activer la résistance de tirage interne ;
- expliquer pourquoi la logique est inversée.
:::

## L'interrupteur, un capteur à deux positions

Un interrupteur coulissant fonctionne comme un bouton-poussoir, mais il **reste dans sa position**. Il sert à donner un état stable, comme « allumé » ou « éteint ».

## Le montage

![Montage dans Wokwi : un interrupteur coulissant, une LED rouge et une carte UNO](../../../../assets/parcours/chapitre-1/img/montage-interrupteur.webp)

*L'interrupteur relie la masse à la broche 5. La LED est sur la broche 13.*

- Une broche de l'**interrupteur** (SW:1.2) est reliée à la **masse GND**.
- L'autre broche (SW:1.3) est reliée à la **broche 5** de l'Arduino.
- La **LED** est branchée comme précédemment : anode sur la broche 13, cathode vers GND à travers une résistance de 220 Ω.

## Le programme

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

Dans l'atelier précédent, vous aviez ajouté une **résistance externe** pour fixer le niveau de l'entrée. Ici, `INPUT_PULLUP` active une résistance **interne à la carte**, qui maintient la broche à **HAUT (1)** quand rien ne la relie à la masse.

- Interrupteur **ouvert** : rien ne relie la broche à GND, elle lit **HAUT (1)**.
- Interrupteur **fermé** : la broche est reliée à GND, elle lit **BAS (0)**.

:::danger[À retenir]
`INPUT_PULLUP` remplace la résistance externe : la broche lit **HAUT** quand l'interrupteur est ouvert et **BAS** quand il est fermé. La logique est **inversée**.
:::

:::caution[Important]
Avec ce programme, la LED s'allume quand l'interrupteur est **ouvert** et s'éteint quand il est **fermé**. C'est l'inverse de ce que l'on attend souvent.
:::

:::tip[À vous de jouer]
Comment modifier le programme pour que la LED s'allume quand l'interrupteur est **fermé** ?
:::

<details>
<summary>Voir une piste</summary>

Il suffit d'inverser la valeur lue : `digitalWrite(LED, !interrupteurState);`. Le symbole `!` signifie « non » : si la broche lit 0, la LED reçoit 1.

</details>

## Pour aller plus loin : afficher l'état dans le moniteur série

Vous pouvez afficher un message selon la position de l'interrupteur :

![Code Arduino qui affiche un message dans le moniteur série selon l'état de l'interrupteur](../../../../assets/parcours/chapitre-1/img/code-moniteur.webp)

*Un exemple de `loop()` qui lit l'interrupteur et affiche « enfoncé » ou « relâché » dans le moniteur série.*

:::note[Prochaine étape]
Quand la LED réagit à l'interrupteur et que vous avez compris la logique inversée, validez cette leçon en bas de page.
:::
