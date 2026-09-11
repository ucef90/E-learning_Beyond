# Initiation aux bases de données et au SQL pour les professionnels non informaticiens

Beyond Expertise · Programme détaillé · Version 1 du 2026-09-11

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Fondamental · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial.

## Objectifs de la fiche de référence

- Concevoir une base de données (modèle relationnel, MCD)
- Créer une base (tables, contraintes d'intégrités)
- Remplir une base de données (chargement depuis un fichier texte ou ordres SQL)
- Écrire des requêtes SQL pour extraire les données de la base (select)
- Comprendre le concept de transaction et des verrous (accès concurrent)
- Comprendre comment les données sont sécurisées (droits)
- Comprendre les formats de données (CSV, XML, import/export, ETL) dans les échanges entre les applications et les bases
- Comprendre la place des bases de données dans les architectures d'entreprise (site WEB, applications internes, décisionnel, outils BI, reporting, etc. )

## Public et prérequis

Public : Professionnels, équipes métier et organisations souhaitant développer des compétences concrètes en bases de données & oracle.

Prérequis de la fiche : Aucun prérequis technique bloquant : les bases utiles sont rappelées en début de formation.

## Préparation de la formation

Aucune programmation nécessaire ; tableur, schémas simples et environnement SQL local guidé.

## Cas fil rouge

Concevoir puis interroger une petite base de commandes en comprenant ce que réalise le système derrière une application métier.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Comprendre une base relationnelle · 210 min

- Distinguer table, ligne, colonne et type de donnée.
- Identifier clés primaires et liens entre tables.
- Situer base, application et reporting dans une architecture.

**Atelier prévu :** Transformer un tableau mêlant clients et commandes en trois tables et expliquer les doublons ainsi évités.

### Dessiner puis créer le modèle · 210 min

- Exprimer entités, associations et cardinalités.
- Traduire le modèle en tables et clés étrangères.
- Définir obligations de saisie et contraintes d'intégrité.

**Atelier prévu :** Créer le modèle clients-commandes-lignes puis tenter un enregistrement invalide pour observer le rôle des contraintes.

## Jour 2 · 7 heures

### Remplir et modifier les données · 210 min

- Importer un CSV en contrôlant séparateur et types.
- Écrire INSERT, UPDATE et DELETE avec filtre vérifié.
- Comprendre validation, annulation et principe de transaction.

**Atelier prévu :** Importer les commandes dans une base d'exercice et annuler une modification avant validation définitive.

### Poser des questions avec SELECT · 210 min

- Choisir colonnes, filtres et ordre d'affichage.
- Calculer sommes, comptes et regroupements.
- Comprendre valeur NULL et recherche de données manquantes.

**Atelier prévu :** Répondre à cinq demandes métier, dont les clients sans adresse renseignée et les montants par mois.

## Jour 3 · 7 heures

### Croiser des tables et gérer les accès · 210 min

- Relier tables par jointures et vérifier le nombre de lignes.
- Comprendre pourquoi une jointure peut multiplier les montants.
- Distinguer lecture, écriture, rôles et verrous concurrents.

**Atelier prévu :** Produire les ventes par client puis simuler deux utilisateurs, dont un lecteur qui ne peut modifier aucune commande.

### Échanger les données et vérifier le résultat · 210 min

- Situer CSV, JSON, XML et flux d'intégration.
- Contrôler comptages, totaux et cohérence après import ou export.
- Documenter dictionnaire de données et requêtes utiles.

**Atelier prévu :** Livrer une petite base et trois requêtes de reporting accompagnées d'un dictionnaire compréhensible par un collègue non informaticien.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Les clés et les relations sont expliquées correctement.
- Les résultats SQL sont rapprochés des données sources.
- Une modification risquée est testée dans une transaction d'exercice.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/bbni-initiation-aux-bases-de-donnees-et-au-sql-pour-les-professionnels-non-informaticiens)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [PostgreSQL · langage SQL](https://www.postgresql.org/docs/current/tutorial-sql.html)
