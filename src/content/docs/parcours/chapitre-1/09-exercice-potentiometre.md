---
title: Exercice — LED et potentiomètre
description: Régler la luminosité d'une LED avec un potentiomètre, grâce à la lecture analogique et à la PWM.
---

:::caution[Exercice à terminer avant la séance suivante]
Enregistrez votre montage dans votre compte Wokwi (connexion GitHub). Pensez aussi à former les binômes du projet (contrôle continu : 40 % de la note), et à revoir : polarité de la LED, résistance série, `analogRead()` et PWM (`analogWrite()`).
:::

:::note[Objectifs de la leçon]
À la fin de cet exercice, vous serez capables de :
- lire une valeur analogique avec un potentiomètre ;
- convertir cette valeur pour l'utiliser en PWM avec `map()` ;
- régler la luminosité d'une LED.
:::

## Deux idées à combiner

Cet exercice réunit deux notions vues dans ce chapitre :

1. la **lecture analogique** : `analogRead()` transforme la position du curseur en un nombre entre **0 et 1023** ;
2. la **PWM** : `analogWrite()` règle la luminosité avec une valeur entre **0 et 255**.

Les deux échelles étant différentes, il faut **convertir** l'une dans l'autre. C'est le rôle de la fonction `map()`.

![Du potentiomètre à des valeurs numériques : tension analogique de 0 à 5 V, convertisseur ADC, valeurs de 0 à 1023](../../../../assets/parcours/chapitre-1/img/convertisseur-adc.webp)

*La lecture analogique : le potentiomètre fournit une tension, l'ADC la transforme en un nombre.*

## Rappel : la PWM

La PWM envoie un signal qui alterne très vite entre HAUT et BAS. La LED ne voit pas le clignotement : elle perçoit une **luminosité moyenne**, proportionnelle à la durée passée à l'état HAUT.

![Signal PWM : rapport cyclique de 0 %, 25 %, 50 % et 100 %](../../../../assets/parcours/chapitre-1/img/signal-pwm.webp)

*Plus le rapport cyclique est élevé, plus la tension moyenne, donc la luminosité, est grande.*

## Le montage

![Montage dans Wokwi : une LED rouge, une résistance, un potentiomètre à glissière et une carte UNO](../../../../assets/parcours/chapitre-1/img/montage-potentiometre.webp)

*La LED est sur la broche 11 (PWM) et le curseur du potentiomètre sur A0.*

- L'anode (patte longue) de la **LED** est reliée à la **broche 11**, qui est une sortie PWM.
- La cathode (patte courte) est reliée à une **résistance**, puis à la **masse GND**.
- Le curseur (broche centrale) du **potentiomètre** est relié à **A0**.
- Une des deux autres broches du potentiomètre est reliée à **GND**, l'autre au **5 V**.

## Le programme

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

La fonction `map()` fait un **changement d'échelle proportionnel** : elle transforme une valeur comprise entre 0 et 1023 en une valeur comprise entre 0 et 255.

:::danger[À retenir]
`analogRead()` donne une valeur de **0 à 1023**. `analogWrite()` attend une valeur de **0 à 255**. On passe de l'une à l'autre avec `map()`.
:::

:::caution[Important]
`analogWrite()` ne fonctionne que sur les broches **PWM** : 3, 5, 6, 9, 10 et 11. C'est pourquoi la LED est branchée sur la broche 11.
:::

:::tip[À vous de jouer]
1. Que vaut `brightness` quand le curseur est à mi-course ?
2. Pourquoi utiliser la broche 11 et non la broche 12 ?
3. Que se passe-t-il si vous enlevez `delay(20)` ?
:::

<details>
<summary>Voir les réponses</summary>

1. Environ 512 pour `value`, donc environ **127** pour `brightness`.
2. Parce que la broche 12 n'est pas une broche PWM : `analogWrite()` n'y règlerait pas la luminosité.
3. Le programme fonctionne toujours, mais il lit le potentiomètre à très grande vitesse. Le `delay(20)` laisse une petite pause entre deux lectures.

</details>

:::note[Prochaine étape]
Quand la luminosité de la LED varie avec le potentiomètre, validez cette leçon en bas de page : vous aurez terminé le chapitre 1.
:::
