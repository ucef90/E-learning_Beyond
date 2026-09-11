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
