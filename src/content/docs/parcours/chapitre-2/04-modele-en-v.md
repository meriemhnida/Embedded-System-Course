---
title: Concevoir avec le modèle en V
description: Le modèle en V appliqué aux systèmes embarqués — des spécifications aux tests, illustré avec le contrôleur de température du TP1.
---

:::note[Objectifs de la leçon]
À la fin de cette leçon, vous serez capables de :
- décrire les deux branches du modèle en V et la correspondance entre chaque phase de conception et sa phase de test ;
- distinguer simulation, prototypage et tests en boucle (SIL, PIL, HIL) ;
- situer les exercices du TP1 dans ce modèle.
:::

## Pourquoi une méthode de conception ?

Écrire du code pour allumer une LED, c'est simple. Concevoir un **contrôleur de température pour une armoire électrique industrielle** — qui doit fonctionner sans interruption, réagir en temps réel, gérer des pannes et résister à des attaques — c'est autre chose.

Sans méthode, les problèmes arrivent tard : on découvre qu'une exigence a été oubliée quand le produit est déjà câblé, ou qu'un cas limite fait planter le programme lors des tests en usine. **Corriger un défaut détecté tard coûte dix à cent fois plus cher** que de le détecter tôt.

Le **modèle en V** est la méthode standard de l'industrie embarquée (automobile, aéronautique, médical). Il organise le développement en deux branches symétriques : concevoir à gauche, vérifier à droite.

## Le schéma

```
Spécification                           Tests d'acceptation
  du système         ←————————————→     (recette client)
    │                                           ↑
    ▼                                           │
Conception                             Tests système
  architecturale     ←————————————→    (tout le système)
    │                                           ↑
    ▼                                           │
Conception                             Tests d'intégration
  détaillée          ←————————————→    (modules ensemble)
    │                                           ↑
    ▼                                           │
                     Implémentation
                       (codage)
```

Chaque flèche horizontale signifie : *ce que l'on conçoit à gauche, on le teste à droite*. On ne code pas sans avoir spécifié ; on ne valide pas sans avoir conçu.

## La branche gauche : concevoir

### 1. Spécification du système

On décrit **ce que le système doit faire**, en termes fonctionnels et non fonctionnels, sans encore décider comment.

Dans le TP1, le cahier des charges de l'exercice 6 joue ce rôle :

| Exigence | Description |
|---|---|
| **EF1** | Mesurer température et humidité toutes les 2 secondes. |
| **EF2** | Signaler la zone thermique : bleu < 10 °C, vert 10–38 °C, rouge > 38 °C. |
| **EF3** | Afficher les mesures sur l'écran LCD à la demande (appui bouton). |
| **EF4** | Émettre un signal sonore au-delà de 40 °C. |
| **EF5** | Afficher en °C ou en °F selon la position de l'interrupteur. |

Ces exigences sont **mesurables et testables** : on sait exactement quand elles sont satisfaites. C'est la première qualité d'une bonne spécification.

### 2. Conception architecturale

On choisit les **composants**, les **protocoles** et la **répartition des responsabilités** entre les modules.

Dans le TP1, c'est le plan de câblage de l'exercice 6 :

| Broche | Composant | Rôle |
|---|---|---|
| D2 | DHT22 | Acquisition (EF1) |
| D3, D5, D11 | LED RVB | Signalisation (EF2) |
| D6 | Bouton-poussoir | Interface (EF3) |
| A4, A5 | Écran LCD I²C | Affichage (EF3, EF5) |
| D8 | Buzzer | Alarme (EF4) |
| D7 | Interrupteur | Choix d'unité (EF5) |

### 3. Conception détaillée

On définit **chaque module logiciel** : ses entrées, sorties, algorithmes, et les cas aux limites. Dans l'exercice 11, les règles de réalisation P1 à P5 décrivent cette étape :

- **P1** — mesure non bloquante avec `millis()` ;
- **P2** — LED et buzzer mis à jour après chaque mesure ;
- **P3** — un appui = un seul affichage (front descendant, anti-rebond) ;
- **P4** — les seuils restent en °C quelle que soit l'unité affichée ;
- **P5** — constantes nommées, chaque fonction a un seul rôle.

## La branche droite : vérifier

### 4. Tests unitaires

On teste **chaque fonction isolément**, avec des entrées connues et des résultats attendus.

Exemple : la conversion °C → °F.

```cpp
// Fonction à tester
float celsiusToFahrenheit(float c) {
  return c * 9.0 / 5.0 + 32.0;
}

// Tests unitaires (avec le framework Unity)
void test_conversion() {
  TEST_ASSERT_EQUAL_FLOAT(32.0,  celsiusToFahrenheit(0.0));
  TEST_ASSERT_EQUAL_FLOAT(104.0, celsiusToFahrenheit(40.0));
  TEST_ASSERT_EQUAL_FLOAT(50.0,  celsiusToFahrenheit(10.0));
}
```

Dans le TP1, les questions de calcul jouent ce rôle : Q5.3 (`map()`), Q11.1 (conversion °C/°F), Q2.2 (dimensionnement résistance).

### 5. Tests d'intégration

On assemble les modules et on vérifie qu'ils **fonctionnent ensemble** : que le DHT22 communique bien avec le microcontrôleur, que l'écran reçoit les bonnes valeurs, que la LED change de couleur au bon seuil.

Dans le TP1, c'est ce que font les exercices 8 à 10 : on réunit le capteur et la LED (exercice 8), puis on ajoute le bouton et l'écran (exercice 9), puis le buzzer (exercice 10).

### 6. Tests système

On valide l'**ensemble du système** dans des conditions réalistes. Dans l'exercice 11, le tableau de tests de Q11.4 correspond exactement à cette étape :

| Température | Couleur attendue | Buzzer | Écran (°C) | Écran (°F) |
|---|---|---|---|---|
| 5 °C | Bleu | Silence | 5,0 °C | 41,0 °F |
| 10 °C | Vert | Silence | 10,0 °C | 50,0 °F |
| 38 °C | Vert | Silence | 38,0 °C | 100,4 °F |
| 39 °C | Rouge | Silence | 39,0 °C | 102,2 °F |
| 41 °C | Rouge | **Alarme** | 41,0 °C | 105,8 °F |

:::caution[Tester aux valeurs limites]
Les valeurs à la frontière (10,0 °C et 38,0 °C exactement) sont les plus dangereuses. Un `>` ou un `>=` mal placé donne un comportement non conforme juste à ces valeurs. C'est pourquoi le tableau de tests inclut explicitement 10 °C et 38 °C.
:::

### 7. Tests d'acceptation (recette)

Le client ou l'utilisateur final vérifie que le produit **répond au besoin exprimé**. Dans le TP1, la partie sécurité rejoue la manipulation finale dans des conditions adverses (pannes, dépassements, attaques) : c'est une forme de recette.

## Simulation et prototypage dans le modèle en V

Selon les ressources disponibles, on peut valider chaque niveau avec différents outils :

| Type | Ce que l'on fait | Dans le TP1 |
|---|---|---|
| **Simulation logicielle** | Tester la logique sur PC, sans matériel | Tests unitaires (`map()`, conversions) sur PC avec Unity |
| **Simulation sur simulateur** | Exécuter le programme dans un simulateur de la cible | Wokwi : simulation complète Arduino dans le navigateur |
| **Prototypage rapide** | Exécuter sur une carte proche de la production | Carte Arduino UNO réelle |
| **Tests sur cible finale** | Tester sur le produit exact livré au client | Contrôleur câblé dans une armoire électrique réelle |

Wokwi joue un rôle central dans ce cours : il permet de simuler le programme *et* le câblage sans risque de détruire un composant, et de tester des conditions difficiles (température à 42 °C, déconnexion du capteur) en un clic.

## Tests en boucle dans l'industrie

Dans l'industrie automobile ou aérospatiale, on distingue trois niveaux de tests en boucle :

| Sigle | Nom | Ce que l'on vérifie | Équivalent dans le cours |
|---|---|---|---|
| **SIL** | Software-in-the-Loop | Le code source : même logique, exécutée sur PC | Tests unitaires avec Unity ou pytest |
| **PIL** | Processor-in-the-Loop | Le code objet : compilé pour la cible, mais sans E/S réelles | Programme téléversé sur Arduino, moniteur série uniquement |
| **HIL** | Hardware-in-the-Loop | Le système complet, avec entrées-sorties simulées en temps réel | Wokwi (simulateur de matériel) ou banc de test avec carte réelle |

:::note[Référence]
Cette classification vient du standard MathWorks/Simulink, largement adopté dans l'industrie automobile (voir [V-model for System Development](https://www.mathworks.com/help/ecoder/gs/v-model-for-system-development.html)). Les outils changent, mais les concepts restent les mêmes, qu'on travaille avec un Arduino Uno ou un calculateur de freinage.
:::

## Bilan : où est le modèle en V dans le TP1 ?

```
Cahier des charges EF1–EF5          ←→   Q11.4 : tableau de tests système
      │                                            ↑
Plan de câblage (ex. 6)             ←→   Tests d'intégration ex. 8–10
      │                                            ↑
Règles P1–P5 (ex. 11)              ←→   Questions de calcul Q2.2, Q5.3, Q11.1
      │                                            ↑
                    Programmes ex. 1–11
```

Vous avez suivi le modèle en V sans le nommer. L'exercice 11 est l'aboutissement de la branche gauche ; Q11.4 est le test système de la branche droite. La partie sécurité pousse plus loin : elle refait la manipulation finale dans des conditions adverses, comme une recette industrielle.

## Teste-toi

1. Quelle est la différence entre un test d'intégration et un test unitaire ? Donnez un exemple tiré du TP1.
2. Pourquoi teste-t-on exactement 10,0 °C et 38,0 °C et pas seulement 5 °C, 24 °C et 42 °C ?
3. Quelle différence y a-t-il entre SIL et HIL ? Lequel Wokwi simule-t-il le mieux ?

<details>
<summary>Voir les réponses</summary>

1. Un test unitaire vérifie une seule fonction isolément (ex. : la conversion °C → °F avec des valeurs fixes). Un test d'intégration vérifie que plusieurs modules fonctionnent ensemble (ex. : que la LED RVB change bien de couleur en fonction de la température lue par le DHT22).

2. Ces valeurs sont les **frontières** des zones thermiques. Un `>` mal placé (au lieu de `>=`) donne un résultat incorrect exactement à ces valeurs. Les tester révèle les bugs de condition limite.

3. SIL vérifie le code source exécuté sur PC (sans matériel cible). HIL vérifie le programme exécuté sur le matériel cible, avec des entrées-sorties simulées en temps réel. Wokwi s'approche du HIL : il simule la carte Arduino et ses composants, et le programme s'y exécute comme sur une vraie carte.

</details>

:::note[Prochaine étape]
Vous pouvez maintenant aborder le [TP1](/Embedded-System-Course/parcours/chapitre-2/tp1/01-presentation/) avec ce cadre en tête : chaque exercice construit une pièce du système, et l'exercice 11 les assemble pour le tester au complet.
:::
