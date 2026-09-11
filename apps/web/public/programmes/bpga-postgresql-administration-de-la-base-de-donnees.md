# PostgreSQL : Administration de la base de données

Beyond Expertise · Programme détaillé · Version 1 du 2026-09-11

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial.

## Objectifs de la fiche de référence

- Comprendre l’architecture et le fonctionnement interne de PostgreSQL
- Savoir installer et configurer un serveur PostgreSQL
- Administrer les bases de données et les instances au quotidien
- Gérer des utilisateurs, les rôles et les droits d'accès
- Savoir interagir avec un serveur PostgreSQL au moyen de Psql
- Mettre en œuvre les mécanismes de sécurité
- Surveiller, diagnostiquer et optimiser les performances
- Mettre en place une stratégie de sauvegarde et de restauration

## Public et prérequis

Public : Professionnels, équipes métier et organisations souhaitant développer des compétences concrètes en bases de données & oracle.

Prérequis de la fiche : Les participants possèdent un socle de connaissances et de compétences minimal sur les bases de données relationnelles. Ils sont en mesure d’effectuer des requêtes simples en SQL pour interroger et manipuler des données, en vue de les répliquer au cours des.

## Préparation de la formation

SQL et ligne de commande ; PostgreSQL, psql et cluster de laboratoire, aucune commande d'administration sur une base réelle.

## Cas fil rouge

Exploiter une instance PostgreSQL et démontrer sa capacité de reprise dans un environnement isolé.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Installer et comprendre le cluster · 210 min

- Distinguer cluster, base, schéma et session.
- Situer processus, fichiers de configuration et WAL.
- Utiliser psql pour inspecter connexions et paramètres.

**Atelier prévu :** Installer ou inspecter un cluster préparé et produire une fiche de configuration avec chemins et ports du laboratoire.

### Gérer rôles et accès · 210 min

- Créer rôles, appartenances et privilèges d'objets.
- Configurer authentification et règles pg_hba.conf.
- Examiner droits par défaut, propriété et portée des schémas.

**Atelier prévu :** Créer lecteur et application puis vérifier qu'un objet créé ultérieurement respecte les droits attendus.

## Jour 2 · 7 heures

### Comprendre transactions et maintenance · 210 min

- Expliquer MVCC, versions de lignes et visibilité.
- Observer verrous et transactions longues.
- Relier VACUUM, ANALYZE et autovacuum à la santé de la base.

**Atelier prévu :** Simuler un blocage entre deux sessions, identifier le responsable et choisir une action de résolution proportionnée.

### Diagnostiquer les performances · 210 min

- Lire EXPLAIN ANALYZE sur des requêtes de test.
- Comparer scans, index, cardinalités et lectures.
- Suivre connexions, statistiques et croissance des tables.

**Atelier prévu :** Optimiser une requête lente sans changer son résultat et documenter l'effet de l'index sur les écritures.

## Jour 3 · 7 heures

### Concevoir sauvegarde et restauration · 210 min

- Comparer pg_dump, sauvegarde physique et archivage WAL.
- Relier RPO et RTO aux procédures choisies.
- Préparer les dépendances de restauration, rôles et extensions.

**Atelier prévu :** Restaurer un dump dans une autre base puis vérifier données et droits ; examiner une démonstration de reprise à un instant donné.

### Préparer l'exploitation et les incidents · 210 min

- Distinguer réplication, sauvegarde et haute disponibilité.
- Définir alertes de capacité, retard et échec de sauvegarde.
- Préparer changement de version et procédure de retour.

**Atelier prévu :** Remettre un guide d'exploitation avec preuve de restauration, contrôles quotidiens et scénario de reprise après incident.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Les sauvegardes sont validées par restauration.
- Les droits des nouveaux objets sont anticipés.
- Le diagnostic distingue verrou, requête coûteuse et saturation.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/bpga-postgresql-administration-de-la-base-de-donnees)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [PostgreSQL · sauvegarde et restauration](https://www.postgresql.org/docs/current/backup.html)
- [PostgreSQL · langage SQL](https://www.postgresql.org/docs/current/tutorial-sql.html)
