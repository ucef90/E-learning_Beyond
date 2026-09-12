# Neo4J pour Développeur

Beyond Expertise · Programme détaillé · Version 1 du 2026-09-11

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial.

## Objectifs de la fiche de référence

- Comprendre les spécificités d’une base NoSQL par rapport à un SGBDR
- Savoir installer Neo4J et utiliser les outils du développeur
- Comprendre la structure des données et le vocabulaire associé dans Neo4J
- Savoir manipuler des données sous forme de graphe
- Améliorer les performances avec les index
- Accéder aux données de Neo4J depuis des programmes tiers (C#, Java, JavaScript, Python)
- Accéder aux données de Neo4J via l’API HTTP

## Public et prérequis

Public : Professionnels, équipes métier et organisations souhaitant développer des compétences concrètes en bases de données & oracle.

Prérequis de la fiche : Afin de profiter de cette formation, il est nécessaire que les participants aient des connaissances des principes des bases de données ainsi que des langages de programmation Java, Python ou JavaScript.

## Préparation de la formation

Notions de bases de données et un langage de programmation ; Neo4j local et pilote compatible, version fixée pour l'atelier.

## Cas fil rouge

Modéliser un réseau de clients et de produits dans Neo4j, puis interroger les relations depuis une application.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Passer du relationnel au graphe · 210 min

- Définir nœuds, relations orientées, labels et propriétés.
- Choisir ce qui devient relation plutôt qu'attribut.
- Comparer cas de jointures relationnelles et traversées de graphe.

**Atelier prévu :** Dessiner un graphe clients, achats et produits répondant à trois questions de recommandation.

### Installer et alimenter Neo4j · 210 min

- Prendre en main console et outils de requêtage.
- Importer CSV, créer contraintes d'unicité et contrôler les types.
- Distinguer CREATE et MERGE dans un import rejouable.

**Atelier prévu :** Importer deux fois le même référentiel et vérifier que les nœuds et relations ne sont pas dupliqués.

## Jour 2 · 7 heures

### Interroger avec Cypher · 210 min

- Utiliser MATCH, WHERE, RETURN et tri.
- Enchaîner filtres, agrégations et WITH.
- Traiter relations absentes avec OPTIONAL MATCH.

**Atelier prévu :** Écrire les requêtes de panier moyen et de produits achetés ensemble, avec un cas de client sans achat.

### Explorer chemins et performance · 210 min

- Limiter profondeur et cardinalité des traversées.
- Lire EXPLAIN ou PROFILE et distinguer scan et accès indexé.
- Choisir un index adapté au prédicat de recherche.

**Atelier prévu :** Comparer une traversée non bornée à une requête contrôlée et expliquer les écarts de volume et de temps.

## Jour 3 · 7 heures

### Accéder au graphe depuis un programme · 210 min

- Utiliser un pilote officiel, des paramètres et des transactions.
- Gérer connexion, erreurs et reprise de transaction.
- Situer l'interface HTTP disponible pour la version retenue.

**Atelier prévu :** Créer une fonction applicative de recherche de recommandations sans concaténation de paramètres dans la requête.

### Livrer et faire évoluer le modèle · 210 min

- Tester requêtes métier et intégrité du graphe.
- Préparer export, sauvegarde et contrôle des accès.
- Documenter modèle, hypothèses et limites des recommandations.

**Atelier prévu :** Présenter une API de consultation et ses requêtes ; intégrer une nouvelle relation de retour produit sans casser les tests existants.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Le graphe répond aux questions définies au départ.
- L'import est rejouable sans doublon.
- Les requêtes applicatives sont paramétrées et leurs parcours bornés.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/bneo-neo4j-pour-developpeur)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [Neo4j · manuel Cypher](https://neo4j.com/docs/cypher-manual/current/)

## Contacts, accès et accompagnement — mise à jour du 12 septembre 2026

Beyond Expertise : [09 54 70 23 80](tel:+33954702380) — [contact@beyondexpertise.eu](mailto:contact@beyondexpertise.eu).

Pour obtenir plus de détails ou le programme détaillé validé, contactez le centre Beyond Expertise.

Le programme, le tarif contractuel, la TVA, les dates et le délai d’accès sont à confirmer avec le centre avant inscription. Aucune session commerciale n’est ouverte dans la copie locale.

Une analyse de vos besoins et une vérification des prérequis doivent précéder l’attribution du parcours. Les aménagements liés au handicap et l’assistance technique ou pédagogique sont à convenir avec le centre ; aucun diagnostic médical n’est nécessaire dans le formulaire.

Dans la copie locale : /informations-pratiques, /positionnement, /accessibilite, /assistance, /reclamations et /avis.

Les supports proposés ne délivrent pas de diplôme ou de certification professionnelle. Une éventuelle préparation à un examen externe nécessite la vérification des habilitations et modalités. Aucun financement CPF ou OPCO n’est garanti.

Démarche Qualiopi en cours ; certification non acquise. Les programmes restent à valider avant animation.
