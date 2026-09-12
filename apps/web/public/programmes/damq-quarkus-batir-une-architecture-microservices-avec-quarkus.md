# Quarkus : bâtir une architecture microservices avec Quarkus

Beyond Expertise · Programme détaillé · Version 2 du 2026-09-12

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial. Les approfondissements « Pour aller plus loin » sont sélectionnés par le formateur selon le positionnement et le temps disponible ; ils ne constituent pas des heures supplémentaires garanties.

## Objectifs de la fiche de référence

- Mettre en place un IDE et les outils de développement pour quarkus
- Développer différents types de microservices avec Quarkus (API RestFul, Messagerie réactive, Client Rest)
- Comprendre la compilation AOT et les phases de build d’une application Quarkus
- Déployer et surveiller une architecture micro-services Quarkus vers Kubernetes

## Public et prérequis

Public : Professionnels, équipes métier et organisations souhaitant développer des compétences concrètes en développement logiciel.

Prérequis de la fiche : Pour suivre cette formation Quarkus, il est nécessaire de savoir développer en Java, de posséder une connaissance des architectures Web, une connaissance du protocole HTTP et des concepts REST, ainsi que d'avoir des notions de déploiement de conteneurs.

## Préparation de la formation

Java, HTTP et conteneurs ; JDK, Maven, Quarkus et cluster Kubernetes de démonstration préparés.

## Cas fil rouge

Développer et exploiter deux microservices Quarkus échangeant des commandes par API et messagerie.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Préparer le projet Quarkus · 210 min

- Comprendre extensions, injection et configuration par profil.
- Utiliser le mode développement et les tests continus.
- Définir frontières des services et contrats d'échange.
- Structurer configuration, injection de dépendances et profils ; isoler les secrets.

**Atelier prévu :** Créer un service commandes et isoler sa configuration locale, de test et de déploiement.

**Livrable attendu :** Projet Quarkus configuré et reproductible.

**Pour aller plus loin :** Détecter une différence de comportement entre profil de test et production.

### Exposer et consommer des API REST · 210 min

- Définir ressources, validation et réponses d'erreur.
- Appeler un autre service avec un client REST typé.
- Encadrer délais, erreurs distantes et autorisations.
- Définir contrats REST, validation, codes d’erreur, timeouts et compatibilité des API.

**Atelier prévu :** Relier commandes et catalogue puis simuler un catalogue indisponible pour vérifier la réponse de secours.

**Livrable attendu :** API documentée et tests de contrat.

**Pour aller plus loin :** Simuler une dépendance lente et vérifier les erreurs renvoyées au client.

## Jour 2 · 7 heures

### Persister et tester les données · 210 min

- Organiser entités, accès aux données et transactions.
- Gérer migrations et contraintes métier.
- Tester les ressources et les dépendances avec services de laboratoire.
- Maîtriser transactions, concurrence, migrations et tests d’intégration de persistance.

**Atelier prévu :** Enregistrer une commande de façon atomique et démontrer le rollback lorsque la validation d'une ligne échoue.

**Livrable attendu :** Couche de persistance et tests transactionnels.

**Pour aller plus loin :** Reproduire une mise à jour concurrente et choisir une stratégie de verrouillage.

### Introduire les échanges réactifs · 210 min

- Comprendre messages, canaux, accusés de réception et reprises.
- Éviter les traitements bloquants dans un chemin réactif.
- Gérer doublons et erreurs de consommation.
- Distinguer traitement bloquant et non bloquant ; traiter pression, erreurs et retries.

**Atelier prévu :** Publier un événement commande puis traiter deux fois le même message sans créer deux expéditions.

**Livrable attendu :** Flux réactif et stratégie d’idempotence.

**Pour aller plus loin :** Éviter une duplication métier après reprise d’un message.

## Jour 3 · 7 heures

### Comparer build JVM et compilation native · 210 min

- Expliquer phases de build et contraintes de compilation AOT.
- Mesurer démarrage, mémoire et temps de construction.
- Identifier ressources et bibliothèques nécessitant une configuration spécifique.
- Comparer démarrage, mémoire, compilation et contraintes de réflexion entre JVM et natif.

**Atelier prévu :** Comparer deux artefacts du même service et documenter les limites observées de la version native.

**Livrable attendu :** Rapport de mesures et choix d’exécution.

**Pour aller plus loin :** Mesurer deux variantes avec le même scénario sans généraliser un microbenchmark.

### Déployer et surveiller sur Kubernetes · 210 min

- Configurer déploiement, service, secrets et ressources.
- Distinguer disponibilité, démarrage et santé fonctionnelle.
- Collecter métriques et traces pour diagnostiquer une panne.
- Séparer readiness et liveness ; configurer ressources, traces et déploiement progressif.

**Atelier prévu :** Démontrer le déploiement de laboratoire et une reprise après arrêt d'un pod ; remettre contrats, tests et guide d'exploitation.

**Livrable attendu :** Manifestes et guide de diagnostic.

**Pour aller plus loin :** Diagnostiquer un service sain localement mais indisponible derrière le cluster.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Les appels distants et messages gèrent les erreurs attendues.
- La comparaison JVM/native repose sur des mesures.
- Les contrôles de santé et les paramètres de déploiement sont documentés.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/damq-quarkus-batir-une-architecture-microservices-avec-quarkus)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [Quarkus · guides officiels](https://quarkus.io/guides/)

## Contacts, accès et accompagnement — mise à jour du 12 septembre 2026

Beyond Expertise : [09 54 70 23 80](tel:+33954702380) — [contact@beyondexpertise.eu](mailto:contact@beyondexpertise.eu).

Pour obtenir plus de détails ou le programme détaillé validé, contactez le centre Beyond Expertise.

Le programme, le tarif contractuel, la TVA, les dates et le délai d’accès sont à confirmer avec le centre avant inscription. Aucune session commerciale n’est ouverte dans la copie locale.

Une analyse de vos besoins et une vérification des prérequis doivent précéder l’attribution du parcours. Les aménagements liés au handicap et l’assistance technique ou pédagogique sont à convenir avec le centre ; aucun diagnostic médical n’est nécessaire dans le formulaire.

Dans la copie locale : /informations-pratiques, /positionnement, /accessibilite, /assistance, /reclamations et /avis.

Les supports proposés ne délivrent pas de diplôme ou de certification professionnelle. Une éventuelle préparation à un examen externe nécessite la vérification des habilitations et modalités. Aucun financement CPF ou OPCO n’est garanti.

Démarche Qualiopi en cours ; certification non acquise. Les programmes restent à valider avant animation.
