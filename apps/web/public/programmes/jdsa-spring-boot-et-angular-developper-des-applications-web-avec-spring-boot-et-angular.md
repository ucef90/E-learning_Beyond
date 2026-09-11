# Spring Boot et Angular : Développer des applications Web avec Spring Boot et Angular

Beyond Expertise · Programme détaillé · Version 1 du 2026-09-11

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial.

## Objectifs de la fiche de référence

- Mener à bien un projet SpringBoot/Angular
- Sécuriser une API Rest avec un modèle stateless
- Mettre en place la sécurité côté client Angular
- Adopter une approche « Design By Contract »
- Savoir tester séparément le service back-end Spring et le client Angular

## Public et prérequis

Public : Professionnels, équipes métier et organisations souhaitant développer des compétences concrètes en développement logiciel.

Prérequis de la fiche : Pour suivre cette formation SpringBoot et Angular, une connaissance préalable minimale de Spring Boot et d'Angular est indispensable.

## Préparation de la formation

Java, HTTP et bases TypeScript ; JDK, Node, IDE, base locale et projet de départ compatibles entre eux.

## Cas fil rouge

Réaliser une application de suivi de demandes avec API Spring Boot, interface Angular et autorisations vérifiées côté serveur.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Définir le contrat entre interface et API · 210 min

- Modéliser demandes, utilisateurs et états métier.
- Décrire routes, schémas, codes HTTP et erreurs de validation.
- Séparer DTO, modèle de persistance et contrat exposé.

**Atelier prévu :** Écrire le contrat de création et de consultation d'une demande, avec exemples valides et erreurs attendues.

### Construire le service Spring Boot · 210 min

- Organiser contrôleurs, services et repositories.
- Valider les entrées et délimiter les transactions.
- Préparer pagination, migrations et gestion centralisée des erreurs.

**Atelier prévu :** Implémenter création et liste des demandes, puis vérifier rollback et validation sur une entrée volontairement invalide.

## Jour 2 · 7 heures

### Développer le parcours Angular · 210 min

- Composer pages, composants et service HTTP typé.
- Relier formulaire, validation et messages d'erreur accessibles.
- Gérer chargement, absence de données et navigation.

**Atelier prévu :** Construire un formulaire et une liste paginée qui restent compréhensibles lorsque l'API répond lentement ou échoue.

### Sécuriser le flux de bout en bout · 210 min

- Expliquer OAuth2, OpenID Connect et validation des jetons.
- Contrôler rôle et propriété de la ressource dans l'API.
- Distinguer garde de route, CORS, XSS et protections liées au stockage choisi.

**Atelier prévu :** Tester deux utilisateurs : modifier l'URL d'une demande ne doit jamais permettre l'accès au dossier de l'autre.

## Jour 3 · 7 heures

### Tester séparément les deux applications · 210 min

- Écrire tests de services et de contrôleurs avec dépendances isolées.
- Tester composants et réponses HTTP simulées côté Angular.
- Vérifier compatibilité du contrat sur succès et erreurs.

**Atelier prévu :** Introduire une rupture de contrat, la détecter avec les tests puis corriger le backend ou le client avec justification.

### Assembler et préparer la livraison · 210 min

- Séparer configurations locales et paramètres de déploiement.
- Construire les artefacts et documenter les variables nécessaires.
- Observer erreurs, santé du service et limites d'exploitation.

**Atelier prévu :** Démontrer le parcours complet, remettre tests et guide de lancement, puis expliquer le traitement d'un incident d'authentification.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Le contrat couvre les erreurs autant que le succès.
- Les permissions sont testées dans l'API.
- Backend et interface disposent de tests exécutables séparément.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/jdsa-spring-boot-et-angular-developper-des-applications-web-avec-spring-boot-et-angular)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [Spring Boot · documentation de référence](https://docs.spring.io/spring-boot/reference/index.html)
- [Angular · tests de l'application](https://angular.dev/guide/testing)
