# Data Warehouse et modélisation dimensionnelle

Beyond Expertise · Programme détaillé · Version 1 du 2026-09-11

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Intermédiaire · Distanciel

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial.

## Objectifs de la fiche de référence

- Différencier entrepôt de données, data mart et lakehouse
- Modéliser des faits et dimensions adaptés aux usages
- Préparer une architecture analytique durable

## Public et prérequis

Public : Data engineers, BI engineers, architectes data, chefs de projet BI.

Prérequis de la fiche : Connaître les bases des bases de données et du reporting.

## Préparation de la formation

Bases relationnelles et reporting ; schémas sources fictifs, SQL et outil de diagramme.

## Cas fil rouge

Concevoir un entrepôt de ventes et de stocks dont le modèle conserve l'historique et fournit des indicateurs cohérents.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Cadrer l'architecture décisionnelle · 210 min

- Distinguer entrepôt, data mart et lakehouse.
- Recueillir questions métier et fréquence de mise à jour.
- Identifier systèmes sources et limites de couverture.

**Atelier prévu :** Établir une matrice processus-dimensions pour ventes, stocks et retours d'une entreprise fictive.

### Définir le grain et les faits · 210 min

- Choisir unité de chaque ligne de fait.
- Distinguer faits de transaction et snapshots.
- Identifier mesures additives, semi-additives et non additives.

**Atelier prévu :** Modéliser ventes et stock journalier en expliquant pourquoi un stock ne s'additionne pas entre plusieurs dates.

## Jour 2 · 7 heures

### Construire les dimensions · 210 min

- Définir clés métier et clés techniques.
- Organiser hiérarchies et dimensions partagées.
- Traiter membre inconnu et données de référence absentes.

**Atelier prévu :** Créer dimensions produit, client et calendrier puis vérifier leur utilisation commune dans deux tables de faits.

### Gérer les changements et l'historique · 210 min

- Comparer SCD de type 1 et de type 2.
- Définir dates de validité et recherche de la bonne version.
- Traiter dimensions arrivant tard et corrections rétroactives.

**Atelier prévu :** Historiser un changement de région client et vérifier que les anciennes ventes restent rattachées à la version correcte.

## Jour 3 · 7 heures

### Charger et contrôler l'entrepôt · 210 min

- Définir ordre de chargement et déduplication.
- Rapprocher lignes, montants et références.
- Préparer tables d'agrégats sans changer le sens des mesures.

**Atelier prévu :** Charger un lot de ventes puis détecter une clé manquante et un doublon qui faussent le reporting.

### Valider le modèle avec les utilisateurs · 210 min

- Écrire requêtes de recette à partir des questions métier.
- Documenter grain, calculs et limites.
- Prévoir évolution de dimensions et suivi de qualité.

**Atelier prévu :** Présenter schéma en étoile, dictionnaire et requêtes de contrôle répondant aux besoins initiaux.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Le grain est défini pour chaque table de faits.
- L'historique restitue les versions correctes.
- Les mesures et les rapprochements sont cohérents.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/data-warehouse-et-modelisation-dimensionnelle)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [Microsoft · modèle en étoile dans Power BI](https://learn.microsoft.com/en-us/power-bi/guidance/star-schema)
