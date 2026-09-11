# Lire un CSV et comprendre le tableau obtenu

**À la fin de cette leçon**, vous saurez charger un fichier, expliquer ce que représentent une ligne, une colonne et l'index, puis vérifier que l'importation correspond au fichier de départ.

## La mission qui relie les six leçons

Une boutique demande : « Quels produits contribuent le plus au montant des ventes ? » Avant de dessiner un graphique, il faut établir ce que contient le fichier et quelles lignes peuvent être utilisées. Pendant les leçons, nous suivons un petit **atelier de fournitures**. Le TP utilisera ensuite un autre fichier, consacré au matériel informatique : vous devrez transférer la démarche.

Ouvrez **Atelier guidé** pour retrouver les exemples exécutables et les exercices. Revenez à la leçon pour lire les explications. Le carnet d'entraînement est temporaire ; exportez-le pour conserver votre travail. Le TP possède son propre brouillon sauvegardé sur le serveur.

## Ce qu'est réellement un CSV

Un CSV est du texte organisé en enregistrements. Dans notre exemple, une ligne représente une vente et les champs sont séparés par un point-virgule. Ce n'est pas un classeur Excel : il ne contient ni onglets, ni formules, ni mise en forme.

```text
vente_id;region;produit;quantite;prix_unitaire
A01;Nord;Carnet;2;5
A02;Sud;Stylo;5;2
```

La première ligne donne les noms des colonnes. La deuxième indique que la vente A01 porte sur deux carnets à cinq euros l'unité. Son montant serait dix euros, mais ce calcul n'apparaît pas encore dans le fichier. Le caractère `;` sépare les champs ; il ne fait pas partie de leurs valeurs.

Une colonne doit porter une signification stable. Ici, `quantite` désigne un nombre d'articles et `prix_unitaire` un montant en euros par article. Confondre ces unités conduirait à additionner des nombres qui ne décrivent pas la même chose.

## Charger le fichier : chaque morceau de l'instruction a un rôle

```python
import pandas as pd
ventes = pd.read_csv("ventes.csv", sep=";", encoding="utf-8")
print(ventes.head(3))
```

`import` rend la bibliothèque disponible. `pd` est simplement son nom abrégé. La fonction `read_csv` reçoit un chemin et renvoie un **DataFrame**, c'est-à-dire un tableau à deux dimensions dont les colonnes portent des noms. L'affectation `ventes = ...` conserve ce tableau pour la suite.

`sep=";"` décrit le séparateur de ce fichier précis. `encoding="utf-8"` indique comment interpréter les caractères, notamment les accents. `head(3)` montre trois lignes sans modifier le tableau. Ce premier aperçu sert à contrôler l'importation, pas à conclure que toutes les données sont correctes.

## Index et identifiant : deux notions différentes

Pandas affiche généralement une colonne sans nom à gauche, commençant par 0. C'est l'**index**. Il permet de repérer des lignes dans le tableau, mais ne prouve pas l'unicité d'une vente. Après un filtre, l'index peut contenir 0, 2 et 5 : aucune vente n'a disparu par erreur pour autant.

`vente_id`, en revanche, est un identifiant métier. Si A01 apparaît deux fois, il faut comparer les lignes. Réinitialiser l'index ne résout pas ce doublon. Vous contrôlerez les identifiants dans la leçon suivante.

## À vous de faire · environ 4 minutes

Dans l'atelier, exécutez la cellule d'importation. Affichez les **deux dernières lignes**, puis la liste des noms de colonnes. Écrivez ensuite une phrase expliquant ce qu'une ligne représente et une autre expliquant pourquoi l'index n'est pas le numéro de vente.

:::details Indice
`head` affiche le début d'un tableau ; `tail` en affiche la fin. Les noms de colonnes sont accessibles par l'attribut `columns`. Un attribut s'utilise sans parenthèses ; une méthode comme `tail(2)` est appelée avec des parenthèses.
:::

:::details Correction expliquée
```python
print(atelier.tail(2))
print(atelier.columns.tolist())
```
Les deux dernières lignes de l'atelier portent les identifiants A06 puis A01. Les cinq colonnes sont `vente_id`, `region`, `produit`, `quantite` et `prix_unitaire`. L'index décrit l'organisation actuelle du tableau ; l'identifiant désigne une vente, indépendamment de son emplacement. Nous reviendrons sur la répétition de A01.
:::

## Si le résultat semble étrange

**Une seule colonne contenant des points-virgules :** vérifier `sep` avant de renommer les colonnes. **Fichier introuvable :** vérifier son nom et son dossier ; le notebook intégré reçoit `ventes.csv` automatiquement. **Accents illisibles :** vérifier l'encodage d'origine. Changer des valeurs à la main pour masquer une mauvaise importation rendrait l'analyse difficile à reproduire.

**Avant de continuer :** vous devez pouvoir nommer l'unité d'observation, expliquer les colonnes et retrouver le fichier source sans le modifier.
