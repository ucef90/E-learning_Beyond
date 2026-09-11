# SQL Perfectionnement

Beyond Expertise · Programme détaillé · Version 1 du 2026-09-11

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Avancé · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial.

## Objectifs de la fiche de référence

- Maîtriser les jointures et leurs variantes
- Maîtriser les requêtes ensemblistes
- Écrire des requêtes SQL complexes (jointures externes, select imbriqués corrélés, etc.)
- Savoir modéliser une requête complexe à l’aide d’un arbre
- Transcrire cet arbre en requête SQL

## Public et prérequis

Public : Professionnels, équipes métier et organisations souhaitant développer des compétences concrètes en bases de données & oracle.

Prérequis de la fiche : Pour suivre cette formation SQL Perfectionnement, il est important de bien connaître les fondamentaux du SQL (select … from … where, group by, jointure simple, etc.) et les concepts fondamentaux des bases de données relationnelles (table, lignes, colonnes, clef primaire, clef étrangère).La formation SQL : Interroger les bases de données avec le langage SQL (Réf. OIBB) peut constituer un bon prérequis.

## Préparation de la formation

SELECT, agrégations et jointures courantes ; base relationnelle de laboratoire, différences de dialecte indiquées.

## Cas fil rouge

Résoudre des demandes SQL complexes sur commandes, paiements et historiques en maîtrisant le grain et les cas limites.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Raisonner sur le résultat attendu · 210 min

- Définir grain, population et cardinalité du résultat.
- Décomposer une demande en étapes relationnelles.
- Choisir des jeux de test qui révèlent les erreurs.

**Atelier prévu :** Dessiner l'arbre de traitement d'un reporting de commandes partiellement payées avant d'écrire la requête.

### Maîtriser les jointures avancées · 210 min

- Comparer jointures internes, externes et auto-jointures.
- Déplacer un filtre entre ON et WHERE en analysant l'effet.
- Éviter multiplication des montants par relations un-à-plusieurs.

**Atelier prévu :** Conserver les clients sans commande tout en calculant leurs totaux et vérifier les cas zéro, un et plusieurs paiements.

## Jour 2 · 7 heures

### Employer sous-requêtes et opérations ensemblistes · 210 min

- Comparer EXISTS, IN et sous-requête corrélée.
- Analyser NULL dans les exclusions et préférer une formulation sûre.
- Utiliser UNION, INTERSECT et différence selon le dialecte.

**Atelier prévu :** Trouver les clients ayant commandé tous les produits d'une sélection et justifier le traitement des valeurs absentes.

### Structurer avec CTE et fenêtres · 210 min

- Découper une requête avec des CTE lisibles.
- Utiliser partition, ordre et cadre de fenêtre.
- Calculer rang, cumul et comparaison à la ligne précédente.

**Atelier prévu :** Produire un classement mensuel avec ex æquo, cumul et variation en vérifiant la première période de chaque client.

## Jour 3 · 7 heures

### Interroger hiérarchies et périodes · 210 min

- Comprendre récursion et condition d'arrêt.
- Détecter chevauchements et trous dans des historiques.
- Distinguer intervalle inclusif et borne de fin exclusive.

**Atelier prévu :** Interroger une hiérarchie de services et rechercher les périodes contractuelles qui se chevauchent.

### Valider et optimiser la requête finale · 210 min

- Comparer résultat à des invariants métier.
- Lire un plan et réduire les calculs répétés.
- Documenter hypothèses, limites et dépendances de dialecte.

**Atelier prévu :** Livrer une requête complexe en étapes avec données de test et preuve de conservation des montants.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Le grain et les cardinalités sont maîtrisés.
- NULL, doublons, ex æquo et périodes limites sont testés.
- La décomposition de la requête reste explicable.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/oibp-sql-perfectionnement)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [PostgreSQL · langage SQL](https://www.postgresql.org/docs/current/tutorial-sql.html)
