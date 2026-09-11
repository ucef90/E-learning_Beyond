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


---

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


---

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


---

# Nettoyer les données sans effacer leur histoire

**À la fin de cette leçon**, vous saurez appliquer des règles explicites, séparer les lignes utilisables des rejets et justifier chaque transformation. Un tableau propre n'est pas un tableau dont on a supprimé tout ce qui dérange.

## Décider avant de coder

Dans notre atelier de fournitures, chaque vente possède un identifiant unique. La quantité est un entier strictement positif ; le prix unitaire est un nombre strictement positif. Une région manquante est autorisée : elle sera regroupée sous « Non renseignée ». Ces règles appartiennent à cet exercice. Dans une autre entreprise, une quantité négative pourrait représenter un retour : il faudrait alors une autre règle.

Nous avons sept lignes. A01 est répétée à l'identique, A04 contient « inconnu » comme quantité, A06 une quantité nulle et A05 n'indique pas sa région. Supprimer toutes les lignes contenant une anomalie ferait perdre A05 alors que son montant est calculable.

## Garder la source et tracer les doublons

```python
propre = atelier.copy()
doublons = propre.loc[propre.duplicated()].copy()
propre = propre.drop_duplicates().copy()
assert not propre["vente_id"].duplicated().any()
```

`copy()` crée notre table de travail. La variable `atelier` conserve les données importées. `duplicated()` repère ici les répétitions exactes de toutes les colonnes ; `drop_duplicates()` garde la première occurrence. La vérification suivante arrête le traitement si un identifiant reste répété avec des valeurs différentes. Dans ce cas, choisir arbitrairement une ligne masquerait un conflit à examiner.

## Convertir puis contrôler

```python
for colonne in ["quantite", "prix_unitaire"]:
    propre[colonne] = pd.to_numeric(propre[colonne], errors="coerce")

valide = (
    propre["quantite"].notna()
    & propre["quantite"].gt(0)
    & propre["quantite"].mod(1).eq(0)
    & propre["prix_unitaire"].notna()
    & propre["prix_unitaire"].gt(0)
)
rejets = propre.loc[~valide].copy()
propre = propre.loc[valide].copy()
```

`to_numeric` transforme les textes numériques en nombres. Avec `errors="coerce"`, un texte impossible à convertir devient une valeur manquante. Cela ne « répare » pas la vente : le masque l'écarte ensuite des calculs. `notna()` demande une valeur connue, `gt(0)` une valeur positive et `mod(1).eq(0)` une quantité entière. Sans ce dernier contrôle, 2,5 articles seraient acceptés.

`~valide` inverse le masque. Nous conservons ces lignes dans `rejets` pour expliquer ce qui manque à l'analyse. Ce choix permet d'obtenir quatre ventes valides et deux rejets après le retrait d'un doublon exact.

## Harmoniser une étiquette sans inventer une région

```python
propre["region"] = (
    propre["region"].astype("string").str.strip()
    .replace("", pd.NA).fillna("Non renseignée")
)
```

`str.strip()` retire les espaces en début et fin : « Nord » et « Nord » entouré d'espaces deviennent une même catégorie. Une chaîne vide est traitée comme manquante. Nous n'affectons pas A05 au Nord au motif que cette région est fréquente : aucune information ne permet ce choix.

## À vous de faire · environ 4 minutes

Dans l'atelier guidé, affichez les identifiants rejetés et comptez les lignes de chaque groupe. Vérifiez l'égalité : lignes importées = doublons retirés + lignes rejetées + lignes conservées. Expliquez pourquoi A05 demeure utilisable.

:::details Indice
Utilisez `len(...)` pour compter des lignes et `rejets["vente_id"].tolist()` pour lire les identifiants. Vérifiez les règles de quantité et de région séparément.
:::

:::details Correction expliquée
```python
print(rejets["vente_id"].tolist())  # A04 et A06
assert len(atelier) == len(doublons) + len(rejets) + len(propre)
assert (len(atelier), len(doublons), len(rejets), len(propre)) == (7, 1, 2, 4)
```
A05 contient une quantité et un prix valides. Son montant contribue au total et reste visible sous « Non renseignée » pour la répartition régionale. Cette règle ne s'appliquerait pas à une quantité inconnue : on ne peut pas en déduire un montant fiable.
:::

**Avant de continuer :** vous devez pouvoir expliquer chaque ligne retirée, retrouver la source intacte et vérifier les comptes. Le montant calculé décrira les ventes exploitables, pas l'intégralité de l'activité réelle.

Référence technique : [conversion numérique dans pandas 2.2](https://pandas.pydata.org/pandas-docs/version/2.2/reference/api/pandas.to_numeric.html).


---

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


---

# Présenter une conclusion que l'on peut vérifier

**À la fin de cette leçon**, vous saurez produire un graphique lisible, lui associer un tableau et rédiger une conclusion distinguant observation, limite et prochaine action.

## Choisir le graphique à partir de la question

Nous comparons des montants entre produits : un diagramme en barres convient. Une courbe suggérerait un ordre ou une évolution qui n'existe pas entre Carnet et Stylo. Un graphique ne corrige pas les données ; il représente la synthèse obtenue à la leçon précédente.

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots(figsize=(7, 4))
par_produit["montant"].plot.bar(ax=ax, color="#1a2644")
ax.set_title("Montant des ventes valides par produit")
ax.set_xlabel("Produit")
ax.set_ylabel("Montant en euros")
ax.set_ylim(bottom=0)
ax.tick_params(axis="x", rotation=0)
fig.tight_layout()
plt.show()
print(par_produit)
```

`fig` représente la figure entière et `ax` la zone de tracé. Passer `ax=ax` demande à pandas de dessiner dans cette zone. Le titre décrit ce qui est mesuré et le mot « valides » rappelle le périmètre. Le libellé vertical donne l'unité. `tight_layout()` ajuste les marges pour limiter les textes coupés.

Pour comparer des longueurs de barres, commencer à zéro préserve la lecture des proportions. Ici, Carnet vaut trois fois Stylo : une barre de 30 euros doit être trois fois plus longue qu'une barre de 10 euros. Couper l'axe juste sous 10 ferait paraître l'écart bien plus grand.

## Le tableau reste nécessaire

Les couleurs ne doivent pas porter seules l'information. Une personne doit pouvoir retrouver les montants, les nombres de ventes et les quantités dans le tableau, même si elle ne distingue pas les couleurs ou ne voit pas le graphique. Dans le notebook intégré, la sortie textuelle accompagne donc la figure.

Une couleur par produit n'ajoute rien ici : les étiquettes nomment déjà les catégories. Évitez les effets 3D et les décorations qui rendent la lecture des valeurs moins précise. Avec vingt catégories, privilégiez des barres horizontales et expliquez toute sélection des produits affichés.

## De l'observation à la décision

Une conclusion utile peut suivre trois phrases :

1. **Observation :** sur quatre ventes valides, les carnets représentent 30 euros sur 40, soit 75 % du montant.
2. **Limite :** un doublon a été retiré et deux ventes ont été rejetées pour des quantités invalides. Le fichier ne fournit ni marge ni période suffisamment documentée pour conclure sur la rentabilité ou la tendance.
3. **Suite proposée :** faire corriger les deux ventes rejetées, puis vérifier si la répartition change avant d'engager une décision commerciale.

« Les carnets sont notre produit le plus rentable » dépasserait les données disponibles. « Il faut doubler le stock » serait également prématuré : nous ne connaissons ni les stocks, ni la saisonnalité, ni la demande future.

## À vous de faire · environ 4 minutes

Représentez le montant par région avec le titre et l'unité appropriés. Affichez le tableau correspondant. Rédigez une conclusion contenant un chiffre et une limite, puis expliquez pourquoi « Non renseignée » doit rester visible.

:::details Indice
Réutilisez `par_region` calculé à la leçon 5. Triez ses valeurs avant de tracer. Les trois montants doivent s'additionner au même total que la synthèse par produit.
:::

:::details Correction expliquée
```python
fig, ax = plt.subplots(figsize=(7, 4))
par_region.sort_values(ascending=False).plot.bar(ax=ax, color="#1a2644")
ax.set(title="Montant des ventes valides par région", xlabel="Région", ylabel="Montant en euros")
ax.set_ylim(bottom=0)
ax.tick_params(axis="x", rotation=0)
fig.tight_layout()
plt.show()
print(par_region)
```
Nord représente 25 euros, Sud 10 et Non renseignée 5. Le Nord concentre 62,5 % du montant exploitable, mais 12,5 % du total n'est pas localisé. Retirer cette dernière catégorie ferait disparaître une partie des ventes et masquerait la limite de l'analyse.
:::

## Passer au TP de synthèse

Le TP porte sur du matériel informatique et contient d'autres anomalies. Reprenez les étapes, pas les résultats de l'atelier : importer, diagnostiquer, filtrer, documenter le nettoyage, agréger et présenter. Exécutez l'ensemble depuis un état neuf pour vérifier que votre analyse est reproductible. Sauvegardez le TP sur le serveur, puis remettez-le avec votre interprétation au formateur.

**Avant de remettre votre travail :** le tableau explique le graphique, les totaux concordent, les limites sont écrites et la personne qui relit peut refaire le calcul.
