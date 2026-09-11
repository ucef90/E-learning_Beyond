# Diagnostiquer les données avant de calculer

**Objectif observable :** construire un diagnostic qui distingue taille du fichier, types, valeurs absentes, doublons exacts et conflits d'identifiants. À ce stade, vous observez ; vous ne supprimez encore rien.

## Un import réussi n'est pas un contrôle qualité

Imaginez une caisse contenant sept tickets. Compter les tickets ne dit pas si certains sont photocopiés, si le prix est absent ou si la quantité est lisible. Un DataFrame pose les mêmes questions. Une somme calculée trop tôt peut être fausse tout en paraissant plausible.

Dans l'atelier guidé, le fichier comporte sept lignes et cinq colonnes. L'une des quantités contient le texte `inconnu`. Une région manque. Une ligne répète une vente. Ces anomalies sont intentionnelles : elles permettent de choisir et d'expliquer des contrôles.

## Quatre observations complémentaires

```python
print(atelier.shape)
print(atelier.dtypes)
print(atelier.isna().sum())
print(atelier["region"].value_counts(dropna=False))
```

`shape` renvoie `(7, 5)` : d'abord les lignes, ensuite les colonnes. Ce sont des dimensions, pas des statistiques de vente. `dtypes` indique comment pandas représente les valeurs. Avec pandas 2.2 utilisé ici, la colonne `quantite` est lue comme des objets textuels à cause de `inconnu`. Un nom de colonne promettant un nombre ne garantit donc pas un type numérique.

`isna()` pose une question pour chaque cellule : « Cette valeur est-elle manquante ? » Le résultat contient des booléens. Dans leur somme, chaque `True` compte pour un ; `isna().sum()` donne donc le nombre d'absences par colonne. Pour l'atelier, une région est absente. En revanche, le texte `inconnu` n'est pas reconnu comme une absence : c'est un texte présent mais inutilisable pour le calcul voulu.

`value_counts(dropna=False)` compte les libellés et conserve les absences dans l'affichage. Il révèle aussi que `Nord` et ` Nord ` sont deux chaînes différentes. Nous normaliserons les espaces après avoir constaté le problème.

## Compter les lignes et compter les ventes

```python
print(len(atelier))
print(atelier["vente_id"].nunique())
print(atelier.duplicated().sum())
repetitions = atelier["vente_id"].duplicated(keep=False)
print(atelier.loc[repetitions])
```

Il y a **sept lignes, six identifiants distincts et une copie exacte excédentaire**. La vente A01 apparaît deux fois. Le dernier affichage montre les deux lignes concernées : c'est nécessaire pour les comparer, et pas seulement constater qu'un identifiant se répète.

Sans argument, `duplicated()` marque les copies après la première occurrence. Avec `keep=False`, toutes les lignes appartenant à une répétition sont marquées. Ces deux réponses servent à des questions différentes : combien de lignes retirer si ce sont de vraies copies, ou quelles lignes faut-il examiner ?

## Exercice : rédiger un diagnostic utile · environ 4 minutes

Complétez ce compte rendu sans nettoyer le tableau : « Le fichier contient … lignes et … ventes identifiées. La colonne … ne permet pas encore un calcul numérique fiable. Le contrôle des absences ne détecte pas … . L'identifiant … doit être examiné. »

Puis répondez à ce cas : deux lignes portent A08, mais l'une indique deux articles et l'autre trois. Peut-on supprimer arbitrairement l'une des deux ?

:::details Correction expliquée
Le fichier contient sept lignes et six ventes identifiées. La colonne `quantite` contient un texte non numérique. `isna()` ne détecte pas le texte `inconnu` comme une absence. A01 doit être examiné ; ses deux lignes sont effectivement identiques.

Pour A08, les valeurs diffèrent : c'est un **conflit**, pas une copie exacte. Il faut revenir à la source ou conserver le conflit à part. Garder la première ligne uniquement parce qu'elle arrive en premier est une décision arbitraire qui peut changer le montant analysé.
:::

:::details Approfondir : pourquoi un maximum ne suffit pas à juger une anomalie
Une quantité de 500 peut être une erreur de saisie ou une commande professionnelle normale. `describe()` permet de repérer une valeur inhabituelle ; il ne fournit pas la règle métier permettant de la rejeter. Le diagnostic doit distinguer « inhabituel » de « invalide » et consigner les questions à poser à la personne qui connaît le processus de vente.
:::

**Votre livrable intermédiaire :** une courte liste d'anomalies avec leur preuve. Vous devez pouvoir expliquer le problème à une personne qui ne connaît pas pandas.
