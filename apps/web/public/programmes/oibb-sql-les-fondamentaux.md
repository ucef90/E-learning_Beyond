# SQL : les fondamentaux

Beyond Expertise · Programme détaillé · Version 1 du 2026-09-11

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Fondamental · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial.

## Objectifs de la fiche de référence

- Comprendre le modèle d’algèbre relationnelle sur lequel repose le SQL
- Appréhender l'écriture des requêtes SQL (conception et compréhension des requêtes SQL)
- Décrire les principales fonctions d’un SGBDR
- Être à l’aise dans son environnement de développement SQL (IDE)
- Extraire des données avec le SQL (select)
- Mettre à jour les données avec le SQL (insert, update, delete)
- Extraire les données de plusieurs tables (jointure)
- Connaître les principales fonctions du langage SQL

## Public et prérequis

Public : Professionnels, équipes métier et organisations souhaitant développer des compétences concrètes en bases de données & oracle.

Prérequis de la fiche : Maîtriser l’utilisation de son poste de travail sous Windows et avoir des notions de gestion des données dans l'entreprise (par exemple la création de tableaux simples dans Excel se référant à des données structurées : référence, nom, adresse, etc.).

## Préparation de la formation

Aucun SQL préalable ; notions de tableaux utiles, environnement SQL guidé et données fictives.

## Cas fil rouge

Apprendre à lire et modifier des données avec SQL dans une base de commandes, en contrôlant chaque résultat.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Comprendre tables et requêtes · 210 min

- Situer SGBDR, schéma, clé et contrainte.
- Comprendre sélection, projection et jointure de manière intuitive.
- Utiliser l'éditeur SQL et lire les messages d'erreur.

**Atelier prévu :** Explorer une base commandes et décrire les relations entre clients, produits et lignes de commande.

### Filtrer et ordonner les lignes · 210 min

- Utiliser SELECT, WHERE, AND, OR et parenthèses.
- Rechercher intervalles, listes et motifs de texte.
- Distinguer NULL, chaîne vide et valeur zéro.

**Atelier prévu :** Écrire cinq filtres dont une combinaison de critères et une recherche de coordonnées manquantes.

## Jour 2 · 7 heures

### Calculer et regrouper · 210 min

- Employer expressions numériques, texte et dates.
- Utiliser COUNT, SUM, AVG et GROUP BY.
- Distinguer filtre de ligne et filtre de groupe avec HAVING.

**Atelier prévu :** Calculer ventes et nombre de commandes par mois puis rapprocher les totaux du détail.

### Relier plusieurs tables · 210 min

- Construire jointures internes et gauches.
- Choisir la clé et vérifier la cardinalité.
- Conserver ou exclure les lignes sans correspondance intentionnellement.

**Atelier prévu :** Lister tous les clients, y compris sans commande, sans dupliquer les montants.

## Jour 3 · 7 heures

### Créer et modifier les données · 210 min

- Définir types et contraintes simples.
- Utiliser INSERT, UPDATE et DELETE avec précaution.
- Vérifier le filtre puis utiliser transaction et rollback dans l'exercice.

**Atelier prévu :** Corriger un tarif dans une transaction et annuler une modification volontairement trop large.

### Construire un reporting reproductible · 210 min

- Organiser les requêtes et nommer les colonnes.
- Préparer un export et ses contrôles de cohérence.
- Relire les différences de dialecte et les erreurs fréquentes.

**Atelier prévu :** Livrer un script de reporting avec trois indicateurs, contrôles de lignes et notice d'exécution.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Les filtres produisent la population demandée.
- Les jointures et agrégations conservent les bons montants.
- Les modifications sont encadrées et vérifiées.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/oibb-sql-les-fondamentaux)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [PostgreSQL · langage SQL](https://www.postgresql.org/docs/current/tutorial-sql.html)
