# Données synthétiques du pilote

Création originale pour Beyond Expertise, sans données personnelles ni reprise de PLB. 38 lignes, 36 identifiants distincts. Réutilisation pédagogique autorisée au sein du projet.

CSV UTF-8, séparateur point-virgule. vente_id : identifiant de vente ; date : jour fictif en mai 2026 ; region : zone commerciale ; produit : article ; quantite : nombre d’unités ; prix_unitaire : euros sans traitement de TVA.

Anomalies volontaires : deux copies exactes ; une quantité textuelle ; un prix absent ; une quantité nulle ; espaces autour d’une région ; région manquante. Il n’y a pas de remboursements dans le modèle métier de cet exercice. Trois lignes sont mises à l’écart, 33 conservées. Les valeurs manquantes ne sont jamais remplacées par une vente fictive.

Environnement visé : Python 3 via Pyodide 0.27.7, pandas et matplotlib de cette distribution. Repli : Jupyter local avec pandas 2.2.x et matplotlib 3.8.x. Le notebook de départ s’exécute avec des étapes à compléter ; le corrigé vérifie les résultats par assertions.
