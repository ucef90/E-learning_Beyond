# Optimisation des requêtes SQL sous Oracle

Beyond Expertise · Programme détaillé · Version 1 du 2026-09-11

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial.

## Objectifs de la fiche de référence

- Connaître les particularités des types d'applications
- Savoir traiter des requêtes SQL
- Être en mesure d'utiliser les outils de diagnostic et de mesure de performance
- Être capable d'optimiser le schéma relationnel
- Apprendre à optimiser le serveur
- Comprendre l'optimisation des requêtes SQL
- Comprendre la parallélisation d'exécution des requêtes

## Public et prérequis

Public : Professionnels, équipes métier et organisations souhaitant développer des compétences concrètes en bases de données & oracle.

Prérequis de la fiche : La maîtrise du SQL et PL/SQL est indispensable.

## Préparation de la formation

SQL, jointures et bases Oracle ; schéma et charge de test, outils utilisés selon licences disponibles.

## Cas fil rouge

Diagnostiquer et optimiser des requêtes Oracle en conservant leurs résultats et en justifiant chaque modification par une mesure.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Établir une mesure de référence · 210 min

- Décrire charge, volumes et objectif de temps de réponse.
- Distinguer durée, CPU, lectures et attentes.
- Rejouer une requête dans des conditions comparables.

**Atelier prévu :** Mesurer trois requêtes lentes et construire une fiche de référence avec paramètres, résultat et contexte d'exécution.

### Lire les plans d'exécution · 210 min

- Distinguer plan estimé et statistiques d'une exécution réelle.
- Examiner cardinalités, sélectivité et ordres de jointure.
- Utiliser DBMS_XPLAN dans le périmètre autorisé.

**Atelier prévu :** Repérer l'opération qui multiplie les lignes dans une requête et comparer estimation et observation.

## Jour 2 · 7 heures

### Réécrire sans changer le sens · 210 min

- Examiner prédicats, sous-requêtes et conversions implicites.
- Éviter fonctions inutiles sur colonnes filtrées quand elles gênent l'accès.
- Vérifier NULL, doublons et équivalence des résultats.

**Atelier prévu :** Réécrire une requête de reporting puis comparer exactement les jeux de résultats avant de mesurer le gain.

### Optimiser les accès aux données · 210 min

- Choisir index simples ou composés selon les prédicats.
- Évaluer sélectivité, ordre des colonnes et coût de maintenance.
- Comprendre rôle des statistiques et limites des hints.

**Atelier prévu :** Tester deux index candidats et conserver celui dont le bénéfice est démontré sur la charge représentative.

## Jour 3 · 7 heures

### Examiner les leviers du serveur · 210 min

- Distinguer problème SQL, verrou, mémoire et entrée-sortie.
- Comprendre partitionnement et exécution parallèle selon les options disponibles.
- Évaluer l'effet d'une optimisation sur les autres traitements.

**Atelier prévu :** Étudier un rapport de charge et expliquer pourquoi ajouter du parallélisme peut aggraver la contention.

### Stabiliser et documenter les améliorations · 210 min

- Rejouer paramètres rares et volumes plus importants.
- Prévoir surveillance de régression et retour arrière.
- Documenter les outils nécessitant une licence particulière.

**Atelier prévu :** Remettre trois fiches d'optimisation avec preuve d'équivalence, mesures avant/après et conditions de validité.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Aucune amélioration ne modifie le résultat attendu.
- Les mesures comparent des charges équivalentes.
- Les choix d'index et de parallélisme incluent leurs coûts.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/bors-optimisation-des-requetes-sql-sous-oracle)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [Oracle Database 19c · optimisation SQL](https://docs.oracle.com/en/database/oracle/oracle-database/19/tgsql/index.html)
