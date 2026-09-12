# SQL pour Data Analyst

Beyond Expertise · Programme détaillé · Version 2 du 2026-09-12

**Version enrichie proposée, à valider par le formateur avant animation.**

2 jour(s) · 14 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial. Les approfondissements « Pour aller plus loin » sont sélectionnés par le formateur selon le positionnement et le temps disponible ; ils ne constituent pas des heures supplémentaires garanties.

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
- Définir population, période, fuseau, grain et exclusions avant extraction.

**Atelier prévu :** Extraire les commandes d'un mois et vérifier qu'aucune commande du premier instant du mois suivant n'est incluse.

**Livrable attendu :** Contrat d’extraction et population de référence.

**Pour aller plus loin :** Corriger un biais de sélection dû à un filtre sur le statut actuel.

### Joindre et agréger sans fausser les montants · 210 min

- Choisir jointure selon population attendue.
- Préagréger les relations un-à-plusieurs si nécessaire.
- Distinguer COUNT, COUNT DISTINCT et somme métier.
- Contrôler cardinalités, lignes sans correspondance et agrégation au bon niveau.

**Atelier prévu :** Calculer ventes et paiements par client puis détecter une jointure qui double le chiffre d'affaires.

**Livrable attendu :** Requête multi-tables et contrôle des montants.

**Pour aller plus loin :** Détecter le double comptage d’une commande ayant plusieurs lignes et paiements.

## Jour 2 · 7 heures

### Construire une analyse en étapes · 210 min

- Utiliser CTE pour rendre les calculs lisibles.
- Calculer rang, cumul et variation avec fonctions de fenêtre.
- Traiter ex æquo et absence de période précédente.
- Décomposer en CTE ; employer fenêtres pour rangs, cohortes, cumuls et évolutions.

**Atelier prévu :** Produire un classement des produits et une évolution mensuelle dont les règles sont explicites et vérifiées.

**Livrable attendu :** Analyse SQL structurée et règles métier.

**Pour aller plus loin :** Construire une analyse de rétention avec une définition stable de cohorte.

### Contrôler et livrer l'extraction · 210 min

- Comparer comptages, totaux et lignes sans correspondance.
- Paramétrer période et documenter définitions d'indicateurs.
- Examiner un plan simple et limiter le volume extrait.
- Vérifier volumes, totaux, doublons, dates extrêmes et plan d’exécution.

**Atelier prévu :** Livrer un script analytique et un rapport de contrôle pour un nouveau mois, avec dictionnaire des colonnes exportées.

**Livrable attendu :** Extraction documentée et rapport de contrôle.

**Pour aller plus loin :** Comparer extraction à un échantillon validé puis expliquer tout écart.

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

## Contacts, accès et accompagnement — mise à jour du 12 septembre 2026

Beyond Expertise : [09 54 70 23 80](tel:+33954702380) — [contact@beyondexpertise.eu](mailto:contact@beyondexpertise.eu).

Pour obtenir plus de détails ou le programme détaillé validé, contactez le centre Beyond Expertise.

Le programme, le tarif contractuel, la TVA, les dates et le délai d’accès sont à confirmer avec le centre avant inscription. Aucune session commerciale n’est ouverte dans la copie locale.

Une analyse de vos besoins et une vérification des prérequis doivent précéder l’attribution du parcours. Les aménagements liés au handicap et l’assistance technique ou pédagogique sont à convenir avec le centre ; aucun diagnostic médical n’est nécessaire dans le formulaire.

Dans la copie locale : /informations-pratiques, /positionnement, /accessibilite, /assistance, /reclamations et /avis.

Les supports proposés ne délivrent pas de diplôme ou de certification professionnelle. Une éventuelle préparation à un examen externe nécessite la vérification des habilitations et modalités. Aucun financement CPF ou OPCO n’est garanti.

Démarche Qualiopi en cours ; certification non acquise. Les programmes restent à valider avant animation.
