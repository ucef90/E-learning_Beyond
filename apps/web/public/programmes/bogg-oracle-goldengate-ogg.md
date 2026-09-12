# Oracle GoldenGate (OGG)

Beyond Expertise · Programme détaillé · Version 2 du 2026-09-12

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial. Les approfondissements « Pour aller plus loin » sont sélectionnés par le formateur selon le positionnement et le temps disponible ; ils ne constituent pas des heures supplémentaires garanties.

## Objectifs de la fiche de référence

- Installer et préparer les bases de données Source et Destination
- Configurer, lancer ou arrêter les processus d'extraction, de réplication et de chargement des données
- Maîtriser la réplication uni-directionnelle ou la réplication bi-directionnelle
- Utiliser les commandes GGSCI.

## Public et prérequis

Public : Professionnels, équipes métier et organisations souhaitant développer des compétences concrètes en bases de données & oracle.

Prérequis de la fiche : du système d'exploitation Les prérequis des bases de données La matrice de certification GoldenGate Architecture Oracle GoldenGate Les différents modes de capture Les différents modes de réplication Le rôle des groupes de processus Les répertoires GoldenGate Quelques exemples d’architectures Installation d'Oracle GoldenGate Installation avec OUI Configuration des différentes variables d'environnement L'interface GGSCI Configuration du Process Manager Préparation de la base Source (paramètres, privilèges) Le rôle du package DBMS_GOLDENGATE_AUTH.

## Préparation de la formation

Administration Oracle et SQL ; deux bases isolées préparées avec droits et licences adaptés. Atelier GGSCI en architecture Classic, différences avec Microservices explicitées.

## Cas fil rouge

Configurer et surveiller une réplication de commandes entre deux bases de laboratoire avec Oracle GoldenGate.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Préparer la réplication · 210 min

- Identifier source, cible, clés et objets répliqués.
- Comprendre journaux, capture de changements et cohérence transactionnelle.
- Vérifier compatibilité des versions et prérequis de journalisation.
- Examiner journalisation, clés, types de données et compatibilité des versions avant réplication.

**Atelier prévu :** Établir la fiche de préparation de deux bases et repérer une table sans clé appropriée pour la réplication.

**Livrable attendu :** Dossier de prérequis et matrice de compatibilité.

**Pour aller plus loin :** Identifier une table sans clé stable et ses conséquences sur les mises à jour.

### Installer et configurer les processus · 210 min

- Situer Manager, Extract, fichiers trail et Replicat en architecture Classic.
- Définir connexions, paramètres et stockage des traces.
- Utiliser GGSCI pour consulter l'état et les informations des groupes.
- Relier Extract, trails, transfert et Replicat ; préciser checkpoints, droits et paramètres.

**Atelier prévu :** Configurer une extraction sur un schéma d'exercice et vérifier que les transactions apparaissent dans la chaîne de capture.

**Livrable attendu :** Configuration commentée et contrôles de démarrage.

**Pour aller plus loin :** Diagnostiquer une configuration où la capture fonctionne mais la cible n’avance pas.

## Jour 2 · 7 heures

### Initialiser puis maintenir la cible · 210 min

- Planifier chargement initial et point de reprise cohérent.
- Configurer correspondances de tables et transformations limitées.
- Démarrer la réplication unidirectionnelle et mesurer son retard.
- Coordonner chargement initial et capture continue pour éviter pertes et doublons.

**Atelier prévu :** Charger un jeu de commandes puis vérifier insertions, modifications et suppressions entre source et cible.

**Livrable attendu :** Procédure d’initialisation et rapprochement source-cible.

**Pour aller plus loin :** Vérifier la cohérence après une initialisation pendant des écritures concurrentes.

### Diagnostiquer erreurs et reprise · 210 min

- Lire rapports, journaux et erreurs de réplication.
- Comprendre checkpoints, rétention des trails et redémarrage.
- Distinguer donnée rejetée, processus arrêté et retard croissant.
- Lire rapports, erreurs et retards ; distinguer transaction bloquante et problème de débit.

**Atelier prévu :** Provoquer un conflit de clé dans le laboratoire, diagnostiquer l'arrêt et documenter une reprise sans perte de transaction.

**Livrable attendu :** Diagnostic documenté et procédure de reprise.

**Pour aller plus loin :** Reprendre après interruption sans masquer une divergence de données.

## Jour 3 · 7 heures

### Examiner la réplication bidirectionnelle · 210 min

- Identifier boucles, conflits d'écriture et ownership des données.
- Définir stratégie de résolution et règles d'exclusion.
- Comparer besoin métier et complexité d'exploitation.
- Analyser collisions, boucles, clés et règles de résolution en réplication bidirectionnelle.

**Atelier prévu :** Simuler des écritures concurrentes sur les deux bases et proposer une règle de résolution explicite pour chaque conflit.

**Livrable attendu :** Scénarios de conflit et limites de l’architecture.

**Pour aller plus loin :** Simuler deux modifications concurrentes et justifier la règle de résolution.

### Préparer l'exploitation quotidienne · 210 min

- Définir contrôles de cohérence, alertes et capacité disque.
- Encadrer changements de schéma et maintenance.
- Rédiger procédures d'arrêt, de reprise et de rapprochement.
- Définir surveillance du lag, rétention des trails, capacité et validation des changements.

**Atelier prévu :** Livrer un dossier de réplication avec paramètres commentés, mesures de retard et recette de cohérence sur un lot de commandes.

**Livrable attendu :** Runbook d’exploitation et tableau de supervision.

**Pour aller plus loin :** Construire un exercice de reprise avec seuils et critères de retour au service.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- La source et la cible se rapprochent après reprise.
- Les commandes d'administration correspondent à l'architecture choisie.
- Les conflits et les changements de schéma ont une procédure définie.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/bogg-oracle-goldengate-ogg)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [Oracle GoldenGate 21.3 · architecture Classic](https://docs.oracle.com/en/middleware/goldengate/core/21.3/admin/)

## Contacts, accès et accompagnement — mise à jour du 12 septembre 2026

Beyond Expertise : [09 54 70 23 80](tel:+33954702380) — [contact@beyondexpertise.eu](mailto:contact@beyondexpertise.eu).

Pour obtenir plus de détails ou le programme détaillé validé, contactez le centre Beyond Expertise.

Le programme, le tarif contractuel, la TVA, les dates et le délai d’accès sont à confirmer avec le centre avant inscription. Aucune session commerciale n’est ouverte dans la copie locale.

Une analyse de vos besoins et une vérification des prérequis doivent précéder l’attribution du parcours. Les aménagements liés au handicap et l’assistance technique ou pédagogique sont à convenir avec le centre ; aucun diagnostic médical n’est nécessaire dans le formulaire.

Dans la copie locale : /informations-pratiques, /positionnement, /accessibilite, /assistance, /reclamations et /avis.

Les supports proposés ne délivrent pas de diplôme ou de certification professionnelle. Une éventuelle préparation à un examen externe nécessite la vérification des habilitations et modalités. Aucun financement CPF ou OPCO n’est garanti.

Démarche Qualiopi en cours ; certification non acquise. Les programmes restent à valider avant animation.
