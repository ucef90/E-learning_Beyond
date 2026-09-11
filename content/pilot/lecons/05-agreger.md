# Passer des ventes aux indicateurs utiles

**À la fin de cette leçon**, vous saurez calculer un montant, construire une synthèse par produit et vérifier qu'un regroupement conserve le total. Vous distinguerez le nombre de ventes, le nombre d'articles et le montant vendu.

## Commencer par une question précise

« Quel produit marche le mieux ? » est ambigu. Un produit peut générer le plus de ventes sans représenter le plus d'euros. Nous répondrons ici à trois questions : combien de ventes valides, combien d'articles et quel montant pour chaque produit ? Le jeu de données ne contient ni coûts ni marge ; nous ne pouvons donc pas calculer la rentabilité.

Les données nettoyées contiennent A01 : deux carnets à cinq euros ; A02 : cinq stylos à deux euros ; A03 : trois carnets à cinq euros ; A05 : un carnet à cinq euros. Chaque ligne est une vente. Le prix est un prix par article, pas le montant de la ligne.

```python
propre["montant"] = propre["quantite"] * propre["prix_unitaire"]
total = propre["montant"].sum()
print(propre[["vente_id", "produit", "montant"]])
print("Montant total :", total)
```

Pandas multiplie les valeurs des deux colonnes ligne par ligne. Les quatre montants sont 10, 10, 15 et 5 euros ; leur somme vaut 40 euros. Additionner les prix unitaires donnerait 17 euros, une quantité sans intérêt pour le total des ventes.

## Comprendre le regroupement

```python
par_produit = propre.groupby("produit").agg(
    montant=("montant", "sum"),
    ventes=("vente_id", "count"),
    articles=("quantite", "sum"),
).sort_values("montant", ascending=False)
print(par_produit)
```

`groupby("produit")` réunit les lignes qui possèdent la même étiquette. `agg` indique les calculs à effectuer dans chaque groupe. Le nom à gauche, par exemple `articles`, devient le nom de la colonne du résultat. À droite, le couple désigne la colonne source et l'opération.

`count` compte les identifiants non manquants, tandis que `sum` additionne les quantités. Nous avons vérifié que chaque vente a un identifiant unique : le nombre d'identifiants correspond donc ici au nombre de ventes. Le tri place le montant le plus élevé en premier ; il ne change aucune valeur.

Résultat attendu : Carnet représente 30 euros, trois ventes et six articles ; Stylo représente 10 euros, une vente et cinq articles. Dire « six ventes de carnets » confondrait articles et transactions.

## Contrôler la cohérence d'un tableau agrégé

```python
par_region = propre.groupby("region")["montant"].sum()
assert par_produit["montant"].sum() == total
assert par_region.sum() == total
```

Le total doit être retrouvé après chaque regroupement. Notre catégorie « Non renseignée » conserve les cinq euros de A05. Par défaut, les groupes dont la clé est manquante sont exclus par pandas : oublier le traitement des régions ferait tomber cette synthèse à 35 euros. Pour des calculs avec décimales non exactes, utilisez une tolérance numérique adaptée plutôt qu'une égalité stricte ; les nombres de cet atelier sont entiers.

## À vous de faire · environ 4 minutes

Calculez la part des carnets dans le montant total. Donnez ensuite le montant moyen d'une vente et expliquez pourquoi il diffère du prix moyen d'un article vendu.

:::details Indice
Une part est un montant divisé par le total, multiplié par 100. Pour une moyenne, choisissez le dénominateur correspondant à la question : transactions ou articles.
:::

:::details Correction expliquée
```python
print(100 * par_produit.loc["Carnet", "montant"] / total)  # 75 %
print(total / len(propre))  # 10 euros par vente
print(total / propre["quantite"].sum())  # environ 3,64 euros par article
```
Les quatre ventes totalisent onze articles. La moyenne simple des quatre prix unitaires vaut 4,25 euros : elle donne le même poids à chaque vente, même lorsqu'une ligne porte cinq articles. Elle ne répond donc pas à la question du prix moyen par article vendu.
:::

**Avant de continuer :** nommez vos indicateurs avec leur unité, contrôlez les totaux et précisez le périmètre des lignes retenues. Un chiffre juste répondant à la mauvaise question reste une mauvaise analyse.

Référence technique : [regroupement et traitement des clés manquantes, pandas 2.2](https://pandas.pydata.org/pandas-docs/version/2.2/reference/api/pandas.DataFrame.groupby.html).
