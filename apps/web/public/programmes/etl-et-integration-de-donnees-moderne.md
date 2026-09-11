# ETL et intégration de données moderne

Beyond Expertise · Programme détaillé · Version 1 du 2026-09-11

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial.

## Objectifs de la fiche de référence

- Comprendre les modèles ETL et ELT
- Sécuriser les flux d’intégration et le suivi des erreurs
- Concevoir un pipeline réutilisable et maintenable

## Public et prérequis

Public : Data engineers, BI developers, développeurs back-end, responsables d’intégration.

Prérequis de la fiche : Avoir des notions de SQL et de manipulation de données.

## Préparation de la formation

SQL et manipulation de données ; sources locales simulées, scripts ou outil ETL choisi pour l'atelier.

## Cas fil rouge

Créer un flux d'intégration entre fichiers, API et base de reporting en maîtrisant rejets, doublons et reprise après incident.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Concevoir le flux d'intégration · 210 min

- Comparer ETL et ELT selon volumes et plateforme cible.
- Décrire sources, fréquence et règles de transformation.
- Définir contrat de schéma et contrôle de complétude.

**Atelier prévu :** Dessiner un flux de commandes provenant d'un CSV et d'une API, avec tables de staging et de destination.

### Extraire sans perdre d'information · 210 min

- Gérer encodages, types et pagination d'API.
- Choisir extraction complète ou incrémentale.
- Journaliser fichier, date, lot et nombre d'enregistrements.

**Atelier prévu :** Importer un fichier mal encodé et une API paginée simulée, puis prouver que tous les enregistrements ont été examinés.

## Jour 2 · 7 heures

### Transformer et traiter les rejets · 210 min

- Normaliser formats, unités et codes de référence.
- Appliquer règles métier avec motifs de rejet.
- Conserver provenance et données utiles à la correction.

**Atelier prévu :** Construire une zone de rejets et corriger un lot sans perdre la correspondance avec les lignes sources.

### Charger et gérer les changements · 210 min

- Choisir insertion, mise à jour ou historisation.
- Définir clés et règles de déduplication.
- Rendre le chargement idempotent et transactionnel selon le besoin.

**Atelier prévu :** Rejouer un même lot puis un lot corrigé et vérifier que les données cibles restent cohérentes.

## Jour 3 · 7 heures

### Orchestrer et superviser · 210 min

- Définir dépendances, reprise et notifications d'erreur.
- Mesurer fraîcheur, volumes, délais et taux de rejet.
- Protéger secrets et droits des comptes techniques.

**Atelier prévu :** Interrompre le flux après extraction, reprendre au bon point et vérifier les totaux de contrôle.

### Documenter et livrer l'intégration · 210 min

- Décrire mapping source-cible et règles de gestion.
- Préparer données de recette et scénarios d'incident.
- Formaliser procédure d'exploitation et responsabilités.

**Atelier prévu :** Livrer le pipeline avec mapping, tests de reprise, rapport de rapprochement et guide d'exploitation.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Le rejeu n'ajoute pas de doublons.
- Chaque rejet conserve un motif et une origine.
- Les totaux source-cible sont rapprochés et les écarts expliqués.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/etl-et-integration-de-donnees-moderne)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [Apache Airflow · conception des traitements](https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html)
- [dbt · tests de données](https://docs.getdbt.com/docs/build/data-tests)
