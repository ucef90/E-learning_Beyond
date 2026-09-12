# Spring Boot et Angular : Développer des applications Web avec Spring Boot et Angular

Beyond Expertise · Programme détaillé · Version 2 du 2026-09-12

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial. Les approfondissements « Pour aller plus loin » sont sélectionnés par le formateur selon le positionnement et le temps disponible ; ils ne constituent pas des heures supplémentaires garanties.

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
- Préciser DTO, validation, erreurs, pagination et statuts HTTP dans le contrat ; distinguer entité persistée et ressource exposée.

**Atelier prévu :** Écrire le contrat de création et de consultation d'une demande, avec exemples valides et erreurs attendues.

**Livrable attendu :** Contrat d’API et scénarios de parcours.

**Pour aller plus loin :** Prévoir une évolution d’API compatible et formaliser le comportement d’une requête invalide ou concurrente.

### Construire le service Spring Boot · 210 min

- Organiser contrôleurs, services et repositories.
- Valider les entrées et délimiter les transactions.
- Préparer pagination, migrations et gestion centralisée des erreurs.
- Séparer contrôleur, service et dépôt ; définir frontières transactionnelles, contraintes et mapping des réponses.

**Atelier prévu :** Implémenter création et liste des demandes, puis vérifier rollback et validation sur une entrée volontairement invalide.

**Livrable attendu :** API transactionnelle et tests de validation/persistance.

**Pour aller plus loin :** Diagnostiquer un chargement excessif des relations et prévenir une modification concurrente perdue.

## Jour 2 · 7 heures

### Développer le parcours Angular · 210 min

- Composer pages, composants et service HTTP typé.
- Relier formulaire, validation et messages d'erreur accessibles.
- Gérer chargement, absence de données et navigation.
- Composer composants, services et formulaires réactifs ; traiter chargement, absence de résultat, erreur et annulation d’une requête.

**Atelier prévu :** Construire un formulaire et une liste paginée qui restent compréhensibles lorsque l'API répond lentement ou échoue.

**Livrable attendu :** Écrans Angular avec états d’interface et gestion de concurrence réseau.

**Pour aller plus loin :** Empêcher une réponse réseau ancienne de remplacer l’état d’une recherche plus récente.

### Sécuriser le flux de bout en bout · 210 min

- Expliquer OAuth2, OpenID Connect et validation des jetons.
- Contrôler rôle et propriété de la ressource dans l'API.
- Distinguer garde de route, CORS, XSS et protections liées au stockage choisi.
- Distinguer authentification, autorisation, CORS et CSRF ; effectuer les contrôles métier côté serveur.

**Atelier prévu :** Tester deux utilisateurs : modifier l'URL d'une demande ne doit jamais permettre l'accès au dossier de l'autre.

**Livrable attendu :** Matrice d’accès et scénarios de sécurité de bout en bout.

**Pour aller plus loin :** Construire une matrice de droits et prouver qu’un utilisateur ne peut pas lire ou modifier les données d’un autre.

## Jour 3 · 7 heures

### Tester séparément les deux applications · 210 min

- Écrire tests de services et de contrôleurs avec dépendances isolées.
- Tester composants et réponses HTTP simulées côté Angular.
- Vérifier compatibilité du contrat sur succès et erreurs.
- Séparer tests unitaires, intégration HTTP/persistance et parcours UI ; utiliser des données de test maîtrisées.

**Atelier prévu :** Introduire une rupture de contrat, la détecter avec les tests puis corriger le backend ou le client avec justification.

**Livrable attendu :** Suite de tests par couche et rapport de parcours critiques.

**Pour aller plus loin :** Vérifier qu’une erreur métier remonte avec un message utile et qu’un échec réseau ne détruit pas la saisie.

### Assembler et préparer la livraison · 210 min

- Séparer configurations locales et paramètres de déploiement.
- Construire les artefacts et documenter les variables nécessaires.
- Observer erreurs, santé du service et limites d'exploitation.
- Gérer configurations par environnement, secrets, migrations et observabilité de l’API.

**Atelier prévu :** Démontrer le parcours complet, remettre tests et guide de lancement, puis expliquer le traitement d'un incident d'authentification.

**Livrable attendu :** Dossier de livraison, paramètres d’exploitation et recette de déploiement.

**Pour aller plus loin :** Préparer un déploiement compatible avec la version précédente du frontend et une procédure de retour arrière.

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

## Contacts, accès et accompagnement — mise à jour du 12 septembre 2026

Beyond Expertise : [09 54 70 23 80](tel:+33954702380) — [contact@beyondexpertise.eu](mailto:contact@beyondexpertise.eu).

Pour obtenir plus de détails ou le programme détaillé validé, contactez le centre Beyond Expertise.

Le programme, le tarif contractuel, la TVA, les dates et le délai d’accès sont à confirmer avec le centre avant inscription. Aucune session commerciale n’est ouverte dans la copie locale.

Une analyse de vos besoins et une vérification des prérequis doivent précéder l’attribution du parcours. Les aménagements liés au handicap et l’assistance technique ou pédagogique sont à convenir avec le centre ; aucun diagnostic médical n’est nécessaire dans le formulaire.

Dans la copie locale : /informations-pratiques, /positionnement, /accessibilite, /assistance, /reclamations et /avis.

Les supports proposés ne délivrent pas de diplôme ou de certification professionnelle. Une éventuelle préparation à un examen externe nécessite la vérification des habilitations et modalités. Aucun financement CPF ou OPCO n’est garanti.

Démarche Qualiopi en cours ; certification non acquise. Les programmes restent à valider avant animation.
