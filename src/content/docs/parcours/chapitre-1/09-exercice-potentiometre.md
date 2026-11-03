---
title: Exercice — LED et potentiomètre
description: Régler la luminosité d'une LED avec un potentiomètre, grâce à la lecture analogique et à la PWM.
---

**Exercice à faire avant la séance suivante.**

**Objectif :** relier une lecture analogique à une sortie PWM, pour régler la luminosité d'une LED avec un potentiomètre.

## Deux idées à combiner

Cet exercice combine deux notions vues dans ce chapitre :

1. la **lecture analogique** : `analogRead()` transforme la position du curseur du potentiomètre en un nombre entre 0 et 1023 ;
2. la **PWM** : `analogWrite()` règle la puissance moyenne envoyée à la LED, avec une valeur entre 0 et 255.

Il faut donc convertir l'une dans l'autre.

![Diapositive 76 : entrées analogiques et sorties PWM](../../../../assets/parcours/chapitre-1/diapo-76.webp)

*Diapositive 76 : les broches analogiques lisent des tensions, et les broches PWM en produisent une imitation.*

## La PWM expliquée

La PWM envoie un signal qui alterne très vite entre HAUT et BAS. La LED ne voit pas le clignotement, elle perçoit une luminosité moyenne proportionnelle à la durée passée à l'état HAUT.

![Diapositive 78 : le signal PWM et son rapport cyclique](../../../../assets/parcours/chapitre-1/diapo-78.webp)

*Diapositive 78 : plus le rapport cyclique est élevé, plus la tension moyenne, donc la luminosité, est forte.*

## Le montage

![Diapositive 94 : câblage du potentiomètre et de la LED](../../../../assets/parcours/chapitre-1/diapo-94.webp)

*Diapositive 94 : la LED est reliée à la broche 11, PWM, et le curseur du potentiomètre à A0.*

- L'anode (patte longue) de la **LED** est reliée à la **broche 11**, une sortie PWM.
- La cathode (patte courte) est reliée à une **résistance**, puis à la **masse GND**.
- Le curseur (broche centrale) du **potentiomètre** est relié à **A0**.
- Une des deux autres broches du potentiomètre est reliée à **GND**, l'autre au **5 V**.

## Le programme

![Diapositive 95 : le programme de réglage de la luminosité](../../../../assets/parcours/chapitre-1/diapo-95.webp)

*Diapositive 95 : le code qui relie la lecture de A0 au réglage de la broche 11.*

```cpp
const int LED_pin = 11;

void setup() {
}

void loop() {
  int value = analogRead(A0);                    // valeur de 0 à 1023
  int brightness = map(value, 0, 1023, 0, 255);  // convertie de 0 à 255
  analogWrite(LED_pin, brightness);              // luminosité réglée en PWM
  delay(20);                                     // petite pause entre deux lectures
}
```

La fonction `map()` fait la conversion d'échelle. Elle prend une valeur comprise entre 0 et 1023, et la transforme proportionnellement en une valeur entre 0 et 255.

## Questions

- Que vaut `brightness` quand le curseur est à mi-course ? (Réponse : environ 127.)
- Que se passe-t-il si tu enlèves `delay(20)` ? Pourquoi ce délai peut-il être utile ?
- Pourquoi la broche 11 et non la broche 12 ? (Indice : regarde la liste des broches PWM.)

:::note
Quand la luminosité de la LED varie avec le potentiomètre et que tu as répondu aux questions, valide cette leçon en bas de page.
:::
