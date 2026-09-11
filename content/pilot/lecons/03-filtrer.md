# Sélectionner et filtrer pour répondre à une question

**Objectif :** traduire une question métier en choix de colonnes et en conditions sur les lignes, sans modifier involontairement les données de départ.

## Commencer par formuler la question

« Affiche les carnets » est une demande de filtrage : certaines lignes doivent rester, d'autres non. « Affiche uniquement le produit et la quantité » est une sélection de colonnes : toutes les lignes peuvent rester, mais moins d'informations sont montrées. On peut combiner les deux opérations.

```python
print(atelier[["vente_id", "produit"]])
masque_carnets = atelier["produit"] == "Carnet"
print(atelier.loc[masque_carnets, ["vente_id", "quantite"]])
```

Dans la première instruction, la liste intérieure désigne les colonnes et les crochets extérieurs appliquent cette sélection au tableau. Dans la seconde, `==` compare chaque produit à `Carnet`. Le résultat est une série de booléens de même longueur que le tableau, appelée **masque**. Une ligne est retenue lorsque son masque vaut `True`.

## Lire une expression `.loc`

`tableau.loc[lignes, colonnes]` se lit dans cet ordre. Avant la virgule, le masque détermine les lignes. Après la virgule, la liste détermine les colonnes à afficher. L'expression renvoie une sélection ; elle n'efface pas les autres lignes du tableau original.

L'atelier conserve encore la copie de A01 et les anomalies. Un filtre sur `produit` fonctionne parce qu'il compare des textes. Un filtre sur la quantité n'est pas encore fiable : certaines quantités sont des chaînes. On ne contourne pas ce problème en changeant la question métier ; on prépare les types avant le calcul numérique.

## Combiner deux conditions : raisonner ligne par ligne

Pour comprendre la logique sans mélanger les problèmes, utilisons un petit tableau propre :

```python
exemple = pd.DataFrame({
    "region": ["Nord", "Sud", "Nord", "Est"],
    "quantite": [2, 5, 4, 1]
})
masque = (exemple["region"] == "Nord") & (exemple["quantite"] >= 3)
print(masque.tolist())
print(exemple.loc[masque])
```

Le masque vaut `[False, False, True, False]`. La première ligne est bien du Nord, mais sa quantité est inférieure à trois : avec **et**, les deux conditions doivent être vraies. Seule la troisième ligne satisfait la question.

`&` représente ce « et » entre conditions pandas ; `|` représente « ou ». Chaque comparaison doit être entourée de parenthèses. Les mots Python `and` et `or` tentent de décider de la vérité d'une série entière, alors que nous voulons une réponse par ligne.

## Exercice de transfert · environ 4 minutes

Dans `exemple`, affichez les ventes **du Sud ou de quantité inférieure à trois**, avec les seules colonnes région et quantité. Avant d'exécuter, écrivez les positions des lignes attendues. Vérifiez ensuite votre prédiction.

Seconde question : si l'on remplace `|` par `&`, quelle observation sera retenue ? Une sortie vide signifie-t-elle nécessairement que le programme est cassé ?

:::details Indice
Évaluez chaque moitié du masque séparément. Pour la première ligne, « Sud » est faux, mais « quantité inférieure à trois » est vrai. Avec « ou », une seule condition vraie suffit.
:::

:::details Correction expliquée
```python
choix = (exemple["region"] == "Sud") | (exemple["quantite"] < 3)
print(exemple.loc[choix, ["region", "quantite"]])
```
Les positions 0, 1 et 3 sont retenues : Nord/2, Sud/5 et Est/1. Avec `&`, aucune ligne n'est retenue : la seule vente du Sud a une quantité de cinq. Le tableau vide exprime correctement l'absence d'observation correspondant à la nouvelle question.
:::

:::details Approfondir : une colonne ou un tableau ?
`atelier["produit"]` renvoie une `Series`, une structure à une dimension. `atelier[["produit"]]` renvoie un DataFrame à une colonne. La différence devient utile lorsque vous combinez des opérations qui attendent un tableau ou lorsque vous voulez conserver une présentation à deux dimensions. Elle ne change pas la signification des produits.
:::

**À retenir :** prévoyez une partie du résultat à la main, puis comparez-la à l'affichage. Une instruction qui s'exécute sans erreur peut tout de même répondre à la mauvaise question.
