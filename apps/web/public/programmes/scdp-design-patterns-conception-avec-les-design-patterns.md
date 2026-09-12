# Design Patterns : Conception avec les Design Patterns

Beyond Expertise · Programme détaillé · Version 2 du 2026-09-12

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial. Les approfondissements « Pour aller plus loin » sont sélectionnés par le formateur selon le positionnement et le temps disponible ; ils ne constituent pas des heures supplémentaires garanties.

## Objectifs de la fiche de référence

- Connaître l’origine, la philosophie et l’utilité des Design Patterns
- Connaître les trois grandes familles de patterns et les principaux patrons au sein de chacune de ces familles
- Savoir identifier, pour un problème donné, le patron de conception le plus à même de solutionner le problème
- Savoir appliquer de manière concrète le design pattern ainsi identifié

## Public et prérequis

Public : Professionnels, équipes métier et organisations souhaitant développer des compétences concrètes en développement logiciel.

Prérequis de la fiche : Les participants à cette formation Design Patterns doivent disposer d’une solide expérience en programmation orientée objet (Java, C++...). Une confrontation préalable à l’un de ces langages vous aura permis d’assimiler les problématiques de développement et de conception les plus courantes. Les bénéfices des design patterns en seront d’autant plus appréciés.

## Préparation de la formation

Programmation objet dans un langage maîtrisé ; petit projet avec tests de comportement fournis pour le laboratoire.

## Cas fil rouge

Refactorer un module de tarification évolutif en choisissant des design patterns seulement lorsqu'ils simplifient un problème réel.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Reconnaître un problème de conception · 210 min

- Repérer couplage, duplication et responsabilités mêlées.
- Distinguer patron, principe de conception et recette automatique.
- Formuler les variations que le logiciel doit supporter.
- Repérer couplage, responsabilités dispersées et points de variation avant de choisir un pattern.

**Atelier prévu :** Analyser un module de tarification et définir trois changements futurs avant de choisir une solution.

**Livrable attendu :** Diagnostic de conception et critères de choix.

**Pour aller plus loin :** Justifier l’absence de pattern quand une solution simple suffit.

### Séparer la création des objets · 210 min

- Comparer Factory Method, Abstract Factory et Builder.
- Encapsuler construction complexe et dépendances variables.
- Discuter limites des singletons et de l'état global.
- Préserver les invariants dès la construction, injecter les dépendances et distinguer configuration d’objet et sélection de sa famille concrète.

**Atelier prévu :** Remplacer une construction dispersée d'objets par une fabrique puis tester une nouvelle famille de tarifs.

**Livrable attendu :** Implémentation de création et tests d’invariants.

**Pour aller plus loin :** Faire évoluer une famille d’objets sans propager des conditions partout.

## Jour 2 · 7 heures

### Composer les structures · 210 min

- Utiliser Adapter pour une interface incompatible.
- Comparer Decorator, Facade et Composite selon le besoin.
- Éviter couches d'abstraction sans bénéfice mesurable.
- Distinguer Adapter, Decorator, Facade et Composite selon les relations recherchées.

**Atelier prévu :** Brancher un fournisseur de prix externe via un adaptateur et conserver les tests du contrat interne.

**Livrable attendu :** Structure refactorisée et diagramme de dépendances.

**Pour aller plus loin :** Ajouter une capacité sans modifier le contrat attendu par les clients.

### Faire varier les comportements · 210 min

- Comparer Strategy, State et Template Method.
- Organiser notifications avec Observer et responsabilités explicites.
- Encapsuler une action avec Command si annulation ou journalisation l'exigent.
- Comparer Strategy, State, Observer et Command selon variabilité et temporalité.

**Atelier prévu :** Ajouter une stratégie de remise et une évolution d'état de commande sans empiler des conditions globales.

**Livrable attendu :** Comportements interchangeables et scénarios testés.

**Pour aller plus loin :** Traiter ordre des événements et effets secondaires dans un exemple concret.

## Jour 3 · 7 heures

### Vérifier les compromis · 210 min

- Mesurer lisibilité, dépendances et coût d'extension.
- Tester par contrats et cas de comportement.
- Repérer surconception et abstraction prématurée.
- Évaluer lisibilité, extensibilité, allocation et complexité induite par les patterns.

**Atelier prévu :** Relire deux solutions au même besoin et supprimer un pattern qui complique inutilement l'exemple.

**Livrable attendu :** Matrice de compromis et décision documentée.

**Pour aller plus loin :** Retirer une abstraction devenue coûteuse sans casser le comportement.

### Conduire un refactoring progressif · 210 min

- Protéger le comportement avant la modification.
- Modifier une responsabilité à la fois.
- Documenter l'intention et les alternatives rejetées.
- S’appuyer sur tests de caractérisation, petites étapes et interfaces de transition.

**Atelier prévu :** Livrer le module refactoré et démontrer l'ajout d'une règle tarifaire avec un nombre limité de modifications.

**Livrable attendu :** Plan de refactoring et historique des vérifications.

**Pour aller plus loin :** Conduire une migration tout en conservant la compatibilité des appels existants.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Chaque pattern répond à une variation identifiée.
- Les tests confirment la conservation du comportement.
- Le participant explique le coût de sa conception et une alternative plus simple.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/scdp-design-patterns-conception-avec-les-design-patterns)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [OMG · spécification UML](https://www.omg.org/spec/UML/2.5.1/)

## Contacts, accès et accompagnement — mise à jour du 12 septembre 2026

Beyond Expertise : [09 54 70 23 80](tel:+33954702380) — [contact@beyondexpertise.eu](mailto:contact@beyondexpertise.eu).

Pour obtenir plus de détails ou le programme détaillé validé, contactez le centre Beyond Expertise.

Le programme, le tarif contractuel, la TVA, les dates et le délai d’accès sont à confirmer avec le centre avant inscription. Aucune session commerciale n’est ouverte dans la copie locale.

Une analyse de vos besoins et une vérification des prérequis doivent précéder l’attribution du parcours. Les aménagements liés au handicap et l’assistance technique ou pédagogique sont à convenir avec le centre ; aucun diagnostic médical n’est nécessaire dans le formulaire.

Dans la copie locale : /informations-pratiques, /positionnement, /accessibilite, /assistance, /reclamations et /avis.

Les supports proposés ne délivrent pas de diplôme ou de certification professionnelle. Une éventuelle préparation à un examen externe nécessite la vérification des habilitations et modalités. Aucun financement CPF ou OPCO n’est garanti.

Démarche Qualiopi en cours ; certification non acquise. Les programmes restent à valider avant animation.
