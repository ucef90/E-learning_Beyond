# Actualisation de Java 11 à Java 17

Beyond Expertise · Programme détaillé · Version 1 du 2026-09-11

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial.

## Objectifs de la fiche de référence

- Connaitre les nouveautés apportées par les versions de Java 9 et ultérieures.
- Connaître, version après version, les nouveautés apportées aux dernières versions LTS de Java
- Mettre en pratique les nouveautés significatives et les plus importantes

## Public et prérequis

Public : Professionnels, équipes métier et organisations souhaitant développer des compétences concrètes en développement logiciel.

Prérequis de la fiche : Cette formation présente les nouveautés de Java 11 et Java 17 pour un profil maîtrisant déjà le langage Java. Pour suivre cette formation, il est donc indispensable de bien connaître la version Java 8.

## Préparation de la formation

Java 11, compilation et tests ; JDK 11 et 17 isolés, Maven ou Gradle, application de migration préparée.

## Cas fil rouge

Migrer une application Java 11 vers Java 17 en distinguant nouveautés disponibles, fonctionnalités preview et problèmes de compatibilité.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Établir le diagnostic de migration · 210 min

- Inventorier dépendances, plugins et options JVM.
- Situer les changements de Java 9 à 11 utiles au contexte.
- Identifier usages internes et composants à mettre à jour.

**Atelier prévu :** Construire une matrice de compatibilité du projet et obtenir une exécution de référence sous Java 11.

### Moderniser les expressions et le texte · 210 min

- Employer expressions switch et vérifier l'exhaustivité.
- Utiliser blocs de texte avec maîtrise des espaces et retours.
- Revoir APIs de chaînes et pratiques de code compatibles Java 17.

**Atelier prévu :** Refactorer un parseur et ses chaînes multilignes en comparant les sorties avant et après modification.

## Jour 2 · 7 heures

### Modéliser avec records et types scellés · 210 min

- Comprendre composants, égalité et immutabilité limitée des records.
- Encadrer une hiérarchie avec sealed et permits.
- Distinguer nouveauté stable et fonctionnalité encore en preview dans Java 17.

**Atelier prévu :** Remplacer un DTO par un record et modéliser un résultat de traitement avec une hiérarchie fermée.

### Adapter les usages du langage et des bibliothèques · 210 min

- Utiliser le pattern matching pour instanceof.
- Examiner APIs supprimées, dépréciées et encapsulation renforcée.
- Ajuster réflexion, bibliothèques et configuration modulaire si nécessaire.

**Atelier prévu :** Diagnostiquer un accès réflexif cassé et choisir une correction de dépendance plutôt qu'une option de contournement permanente.

## Jour 3 · 7 heures

### Valider runtime et performances · 210 min

- Rejouer tests unitaires et intégration sous Java 17.
- Mesurer démarrage, mémoire et temps de traitement sur charge identique.
- Examiner logs et options de collecte mémoire effectivement utilisées.

**Atelier prévu :** Comparer les deux runtimes avec protocole stable et analyser une régression observée sur l'application de démonstration.

### Préparer le basculement · 210 min

- Construire un artefact reproductible avec le JDK cible.
- Mettre à jour CI, images et documentation de support.
- Prévoir validation, surveillance et retour à la version précédente.

**Atelier prévu :** Présenter un dossier de migration avec modifications, tests, dépendances et procédure de retour arrière.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Les fonctionnalités utilisées sont disponibles dans Java 17 avec leur statut exact.
- L'application conserve son comportement testé.
- Les différences de performance sont mesurées et contextualisées.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/jn117-actualisation-de-java-11-a-java-17)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [Oracle · changements du JDK 17](https://docs.oracle.com/en/java/javase/17/migrate/significant-changes-jdk-release.html)
