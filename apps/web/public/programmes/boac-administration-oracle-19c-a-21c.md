# Administration Oracle 19c à 21c

Beyond Expertise · Programme détaillé · Version 1 du 2026-09-11

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial.

## Objectifs de la fiche de référence

- Connaître l’architecture Oracle Database 19c à 21c
- Maîtriser l’installation d’Oracle 19c à 21c
- Savoir gérer une instance de base de données
- Apprendre à gérer la sécurité d’une base de données autonome
- S’approprier les nouveaux concepts de sauvegardes et restaurations
- Se familiariser avec l’architecture Multitenant

## Public et prérequis

Public : Professionnels, équipes métier et organisations souhaitant développer des compétences concrètes en bases de données & oracle.

Prérequis de la fiche : Avoir suivi la formation SQL pour Oracle (Réf. BSPO), ou en posséder les connaissances équivalentes.

## Préparation de la formation

SQL et administration système ; machines Oracle autorisées, version et options explicitement identifiées, aucun environnement de production.

## Cas fil rouge

Administrer une base Oracle 19c et comprendre les différences pertinentes vers 21c, avec sécurité et restauration en laboratoire.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Comprendre architecture et installation · 210 min

- Situer instance, fichiers, mémoire et processus.
- Distinguer CDB, PDB et connexions aux conteneurs.
- Vérifier prérequis et étapes d'une installation reproductible.

**Atelier prévu :** Inventorier une instance préparée et relier chaque composant à sa fonction dans le cycle d'une requête.

### Gérer les instances et le multitenant · 210 min

- Démarrer et arrêter avec les états appropriés.
- Administrer ouverture, fermeture et paramètres d'une PDB.
- Distinguer utilisateur commun et utilisateur local.

**Atelier prévu :** Créer ou configurer une PDB d'exercice puis vérifier la portée des utilisateurs et des paramètres.

## Jour 2 · 7 heures

### Organiser stockage et objets · 210 min

- Gérer tablespaces, fichiers et quotas.
- Examiner croissance, espace libre et segments.
- Prévenir saturation et opérations de maintenance risquées.

**Atelier prévu :** Diagnostiquer une erreur d'espace et proposer une correction justifiée avec contrôle de capacité.

### Administrer la sécurité · 210 min

- Créer rôles et privilèges minimaux.
- Examiner profils, authentification et traces d'audit.
- Situer différences d'administration d'une base autonome gérée.

**Atelier prévu :** Créer un profil applicatif et un profil de lecture puis prouver que chacun dispose uniquement des droits attendus.

## Jour 3 · 7 heures

### Sauvegarder et restaurer avec RMAN · 210 min

- Distinguer sauvegarde complète, incrémentale et journaux archivés.
- Relier objectifs de perte et de reprise aux choix techniques.
- Préparer validation et restauration dans une cible isolée.

**Atelier prévu :** Exécuter une restauration de laboratoire et contrôler tables, dates et cohérence avant de conclure à une reprise réussie.

### Surveiller et préparer les évolutions · 210 min

- Lire alertes, sessions et indicateurs de capacité.
- Distinguer incidents de connexion, verrouillage et ressource.
- Examiner différences 19c/21c, compatibilité et procédure de changement.

**Atelier prévu :** Livrer un guide d'exploitation avec contrôles quotidiens, preuve de restauration et liste des vérifications avant évolution de version.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Les opérations ciblent le bon conteneur.
- Les privilèges sont contrôlés par des tests de refus.
- La stratégie de sauvegarde inclut une restauration vérifiée.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/boac-administration-oracle-19c-a-21c)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [Oracle Database 19c · administration](https://docs.oracle.com/en/database/oracle/oracle-database/19/admin/)
