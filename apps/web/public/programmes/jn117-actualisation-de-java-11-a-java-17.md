# Actualisation de Java 11 à Java 17

Beyond Expertise · Programme détaillé · Version 2 du 2026-09-12

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial. Les approfondissements « Pour aller plus loin » sont sélectionnés par le formateur selon le positionnement et le temps disponible ; ils ne constituent pas des heures supplémentaires garanties.

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
- Analyser les dépendances avec les outils du JDK, repérer modules et accès internes, puis distinguer incompatibilité de compilation et d’exécution.

**Atelier prévu :** Construire une matrice de compatibilité du projet et obtenir une exécution de référence sous Java 11.

**Livrable attendu :** Matrice de compatibilité et risques de migration.

**Pour aller plus loin :** Identifier une bibliothèque incompatible avec l’encapsulation renforcée.

### Moderniser les expressions et le texte · 210 min

- Employer expressions switch et vérifier l'exhaustivité.
- Utiliser blocs de texte avec maîtrise des espaces et retours.
- Revoir APIs de chaînes et pratiques de code compatibles Java 17.
- Employer expressions switch et blocs de texte en préservant lisibilité et comportement.

**Atelier prévu :** Refactorer un parseur et ses chaînes multilignes en comparant les sorties avant et après modification.

**Livrable attendu :** Exemples modernisés et tests de non-régression.

**Pour aller plus loin :** Réécrire un traitement avec tests sur valeurs nulles et cas limites.

## Jour 2 · 7 heures

### Modéliser avec records et types scellés · 210 min

- Comprendre composants, égalité et immutabilité limitée des records.
- Encadrer une hiérarchie avec sealed et permits.
- Distinguer nouveauté stable et fonctionnalité encore en preview dans Java 17.
- Utiliser records pour données et types scellés pour hiérarchies contrôlées ; expliciter leurs limites.

**Atelier prévu :** Remplacer un DTO par un record et modéliser un résultat de traitement avec une hiérarchie fermée.

**Livrable attendu :** Modèle de types et invariants vérifiés.

**Pour aller plus loin :** Comparer record immuable en surface et objet contenant une collection mutable.

### Adapter les usages du langage et des bibliothèques · 210 min

- Utiliser le pattern matching pour instanceof.
- Examiner APIs supprimées, dépréciées et encapsulation renforcée.
- Ajuster réflexion, bibliothèques et configuration modulaire si nécessaire.
- Distinguer fonctionnalités finalisées et options preview ; vérifier les changements d’API utilisés.

**Atelier prévu :** Diagnostiquer un accès réflexif cassé et choisir une correction de dépendance plutôt qu'une option de contournement permanente.

**Livrable attendu :** Liste des adaptations et décisions de compatibilité.

**Pour aller plus loin :** Remplacer un accès réflexif fragile par une API prise en charge.

## Jour 3 · 7 heures

### Valider runtime et performances · 210 min

- Rejouer tests unitaires et intégration sous Java 17.
- Mesurer démarrage, mémoire et temps de traitement sur charge identique.
- Examiner logs et options de collecte mémoire effectivement utilisées.
- Mesurer démarrage, allocation, GC et débit avec charge représentative et warm-up.

**Atelier prévu :** Comparer les deux runtimes avec protocole stable et analyser une régression observée sur l'application de démonstration.

**Livrable attendu :** Rapport de performance reproductible.

**Pour aller plus loin :** Expliquer une variation de latence sans l’attribuer automatiquement à la version Java.

### Préparer le basculement · 210 min

- Construire un artefact reproductible avec le JDK cible.
- Mettre à jour CI, images et documentation de support.
- Prévoir validation, surveillance et retour à la version précédente.
- Prévoir CI sur Java 17, packaging, déploiement progressif et procédure de retour arrière.

**Atelier prévu :** Présenter un dossier de migration avec modifications, tests, dépendances et procédure de retour arrière.

**Livrable attendu :** Plan de bascule et critères de validation.

**Pour aller plus loin :** Simuler un échec de production malgré des tests unitaires réussis.

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

## Contacts, accès et accompagnement — mise à jour du 12 septembre 2026

Beyond Expertise : [09 54 70 23 80](tel:+33954702380) — [contact@beyondexpertise.eu](mailto:contact@beyondexpertise.eu).

Pour obtenir plus de détails ou le programme détaillé validé, contactez le centre Beyond Expertise.

Le programme, le tarif contractuel, la TVA, les dates et le délai d’accès sont à confirmer avec le centre avant inscription. Aucune session commerciale n’est ouverte dans la copie locale.

Une analyse de vos besoins et une vérification des prérequis doivent précéder l’attribution du parcours. Les aménagements liés au handicap et l’assistance technique ou pédagogique sont à convenir avec le centre ; aucun diagnostic médical n’est nécessaire dans le formulaire.

Dans la copie locale : /informations-pratiques, /positionnement, /accessibilite, /assistance, /reclamations et /avis.

Les supports proposés ne délivrent pas de diplôme ou de certification professionnelle. Une éventuelle préparation à un examen externe nécessite la vérification des habilitations et modalités. Aucun financement CPF ou OPCO n’est garanti.

Démarche Qualiopi en cours ; certification non acquise. Les programmes restent à valider avant animation.
