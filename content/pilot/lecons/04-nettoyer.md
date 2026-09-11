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
