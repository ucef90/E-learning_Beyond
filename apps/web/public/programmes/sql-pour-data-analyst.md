# SQL pour Data Analyst

Beyond Expertise · Programme détaillé · Version 1 du 2026-09-11

**Version enrichie proposée, à valider par le formateur avant animation.**

2 jour(s) · 14 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial.

## Objectifs de la fiche de référence

- Écrire des requêtes analytiques robustes
- Contrôler la qualité et la cohérence des données extraites
- Préparer des jeux de données fiables pour le reporting

## Public et prérequis

Public : Data analysts, business analysts, contrôleurs de gestion, chefs de projet data.

Prérequis de la fiche : Connaître les bases de l’analyse de données et l’usage d’un tableur.

## Préparation de la formation

Pratique de l'analyse et du tableur ; rappels SQL inclus, base de laboratoire en lecture seule pour les exercices analytiques.

## Cas fil rouge

Extraire un jeu de données de reporting fiable à partir de commandes, clients et paiements avec SQL analytique.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Définir la population et les filtres · 210 min

- Lire schéma, clés et grain des tables.
- Employer SELECT, filtres, CASE et fonctions de dates.
- Traiter NULL et distinguer bornes de période.

**Atelier prévu :** Extraire les commandes d'un mois et vérifier qu'aucune commande du premier instant du mois suivant n'est incluse.

### Joindre et agréger sans fausser les montants · 210 min

- Choisir jointure selon population attendue.
- Préagréger les relations un-à-plusieurs si nécessaire.
- Distinguer COUNT, COUNT DISTINCT et somme métier.

**Atelier prévu :** Calculer ventes et paiements par client puis détecter une jointure qui double le chiffre d'affaires.

## Jour 2 · 7 heures

### Construire une analyse en étapes · 210 min

- Utiliser CTE pour rendre les calculs lisibles.
- Calculer rang, cumul et variation avec fonctions de fenêtre.
- Traiter ex æquo et absence de période précédente.

**Atelier prévu :** Produire un classement des produits et une évolution mensuelle dont les règles sont explicites et vérifiées.

### Contrôler et livrer l'extraction · 210 min

- Comparer comptages, totaux et lignes sans correspondance.
- Paramétrer période et documenter définitions d'indicateurs.
- Examiner un plan simple et limiter le volume extrait.

**Atelier prévu :** Livrer un script analytique et un rapport de contrôle pour un nouveau mois, avec dictionnaire des colonnes exportées.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Le jeu extrait possède un grain documenté.
- Les jointures n'altèrent pas les montants.
- Les indicateurs sont contrôlés avant export.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/sql-pour-data-analyst)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [PostgreSQL · langage SQL](https://www.postgresql.org/docs/current/tutorial-sql.html)
