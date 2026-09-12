# MongoDB - Mise en œuvre et administration

Beyond Expertise · Programme détaillé · Version 2 du 2026-09-12

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial. Les approfondissements « Pour aller plus loin » sont sélectionnés par le formateur selon le positionnement et le temps disponible ; ils ne constituent pas des heures supplémentaires garanties.

## Objectifs de la fiche de référence

- Comprendre les spécificités de l’administration et le vocabulaire d’une base MongoDB
- Savoir installer et configurer MongoDB
- Comprendre la structure et savoir manipuler des données dans une base MongoDB
- Savoir dialoguer et créer des requêtes d’interrogation avec Mongo en ligne de commande et via des scripts
- Mettre en œuvre la réplication de données
- Mettre en œuvre le partitionnement des données sur plusieurs serveurs (sharding)
- Effectuer des sauvegardes et des restaurations
- Sécuriser l’accès aux données de MongoDB

## Public et prérequis

Public : Professionnels, équipes métier et organisations souhaitant développer des compétences concrètes en bases de données & oracle.

Prérequis de la fiche : Les participants possèdent un socle de connaissances et de compétences minimal sur les bases de données et architectures techniques NoSQL. Ils sont en mesure d’effectuer des requêtes simples pour interroger et manipuler des données et disposent idéalement de connaissances en Python ou en Java.

## Préparation de la formation

Bases de données et ligne de commande ; MongoDB et mongosh, plusieurs instances isolées préparées pour la réplication.

## Cas fil rouge

Administrer un catalogue produit MongoDB avec requêtes, réplication, sauvegarde et diagnostic de performance en laboratoire.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Installer et modéliser les documents · 210 min

- Comprendre documents BSON, collections et identifiants.
- Comparer imbrication et références selon les accès.
- Définir validation de schéma et configuration initiale.
- Définir validation de schéma, croissance des tableaux et limites transactionnelles du modèle ; anticiper les mises à jour fréquentes des sous-documents.

**Atelier prévu :** Modéliser produits et variantes puis vérifier le comportement d'une écriture non conforme au schéma.

**Livrable attendu :** Modèle documentaire et justification des choix.

**Pour aller plus loin :** Modéliser une relation à forte croissance sans gonfler indéfiniment un document.

### Interroger et transformer les données · 210 min

- Utiliser filtres, projections et opérations de modification.
- Construire un pipeline d'agrégation avec étapes explicites.
- Contrôler types, tableaux et champs absents.
- Composer agrégations, filtrage, groupement et transformations en contrôlant les volumes.

**Atelier prévu :** Produire un état de stock par catégorie et tester le traitement d'un document incomplet.

**Livrable attendu :** Requêtes d’agrégation et résultats vérifiés.

**Pour aller plus loin :** Comparer deux pipelines et localiser l’étape qui augmente inutilement le travail.

## Jour 2 · 7 heures

### Créer et analyser les index · 210 min

- Choisir index simple ou composé selon les requêtes.
- Lire explain et examiner documents parcourus.
- Mesurer coût d'écriture et taille des index.
- Distinguer index couvrant, partiel et multikey ; comparer documents examinés et résultats renvoyés pour repérer un parcours d’index peu efficace.

**Atelier prévu :** Comparer une requête avant et après indexation et justifier l'ordre des champs dans un index composé.

**Livrable attendu :** Plan d’indexation et mesures avant-après.

**Pour aller plus loin :** Choisir l’ordre des champs d’un index selon les requêtes réelles.

### Configurer réplication et disponibilité · 210 min

- Comprendre replica set, élections et journalisation.
- Relier read concern et write concern au besoin de cohérence.
- Observer retard de réplication et perte d'un membre.
- Comprendre replica set, élections, write concern et read concern selon les garanties recherchées.

**Atelier prévu :** Provoquer une bascule contrôlée dans le laboratoire et relever les effets sur les lectures et écritures du client.

**Livrable attendu :** Scénario de disponibilité et paramètres argumentés.

**Pour aller plus loin :** Observer les effets d’une panne de primaire sur une application de test.

## Jour 3 · 7 heures

### Comprendre le partitionnement · 210 min

- Situer routeurs, serveurs de configuration et shards.
- Choisir clé de partition selon distribution et accès.
- Repérer points chauds et requêtes diffusées à tous les shards.
- Analyser clé de shard, distribution, requêtes ciblées et points chauds.

**Atelier prévu :** Comparer trois clés pour un catalogue multi-tenant et défendre le choix à partir d'une charge simulée.

**Livrable attendu :** Étude de partitionnement et limites.

**Pour aller plus loin :** Comparer deux clés de partitionnement sur une charge déséquilibrée.

### Sauvegarder, restaurer et sécuriser · 210 min

- Distinguer sauvegarde logique, snapshot et réplication.
- Vérifier cohérence et périmètre de restauration selon le déploiement.
- Appliquer authentification, rôles minimaux et supervision.
- Définir sauvegarde, restauration testée, rôles minimaux et surveillance des accès.

**Atelier prévu :** Restaurer une sauvegarde dans une cible isolée puis vérifier volumes, index, droits et requêtes métier avant de valider la reprise.

**Livrable attendu :** Runbook de restauration et contrôles d’accès.

**Pour aller plus loin :** Restaurer un échantillon et vérifier cohérence et délai de récupération.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- La modélisation correspond aux requêtes prioritaires.
- La restauration est vérifiée et distincte de la réplication.
- Les choix de cohérence et de partitionnement sont argumentés.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/bmdb-mongodb-mise-en-uvre-et-administration)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [MongoDB · sauvegarde et restauration](https://www.mongodb.com/docs/manual/core/backups/)

## Contacts, accès et accompagnement — mise à jour du 12 septembre 2026

Beyond Expertise : [09 54 70 23 80](tel:+33954702380) — [contact@beyondexpertise.eu](mailto:contact@beyondexpertise.eu).

Pour obtenir plus de détails ou le programme détaillé validé, contactez le centre Beyond Expertise.

Le programme, le tarif contractuel, la TVA, les dates et le délai d’accès sont à confirmer avec le centre avant inscription. Aucune session commerciale n’est ouverte dans la copie locale.

Une analyse de vos besoins et une vérification des prérequis doivent précéder l’attribution du parcours. Les aménagements liés au handicap et l’assistance technique ou pédagogique sont à convenir avec le centre ; aucun diagnostic médical n’est nécessaire dans le formulaire.

Dans la copie locale : /informations-pratiques, /positionnement, /accessibilite, /assistance, /reclamations et /avis.

Les supports proposés ne délivrent pas de diplôme ou de certification professionnelle. Une éventuelle préparation à un examen externe nécessite la vérification des habilitations et modalités. Aucun financement CPF ou OPCO n’est garanti.

Démarche Qualiopi en cours ; certification non acquise. Les programmes restent à valider avant animation.
