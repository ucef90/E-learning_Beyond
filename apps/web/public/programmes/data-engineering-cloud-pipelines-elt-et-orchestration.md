# Data Engineering cloud : pipelines ELT et orchestration

Beyond Expertise · Programme détaillé · Version 2 du 2026-09-12

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Avancé · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial. Les approfondissements « Pour aller plus loin » sont sélectionnés par le formateur selon le positionnement et le temps disponible ; ils ne constituent pas des heures supplémentaires garanties.

## Objectifs de la fiche de référence

- Concevoir des pipelines cloud robustes et reutilisables
- Mettre en place supervision, logs et qualite de service
- Mieux articuler data engineering, BI et usages IA

## Public et prérequis

Public : Data engineers, developpeurs data, responsables integration, architectes cloud data.

Prérequis de la fiche : Avoir des bases en SQL, integration et manipulation de donnees.

## Préparation de la formation

SQL, Python et bases cloud ; simulations locales d'API et de stockage, comptes cloud facultatifs pour la démonstration.

## Cas fil rouge

Concevoir un pipeline de commandes quotidiennes capable de reprendre après panne et de réconcilier ses résultats avec la source.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Définir contrats et architecture ELT · 210 min

- Identifier volumes, fraîcheur, schémas et règles de conservation.
- Séparer ingestion brute, transformation et exposition analytique.
- Comparer batch, micro-batch et capture de changements selon le besoin.
- Préciser granularité, schéma, clés, SLA de fraîcheur, responsabilité des sources et règles d’évolution des contrats.

**Atelier prévu :** Écrire le contrat d'une source commandes et dessiner le chemin vers les tables analytiques, avec responsabilités et délais attendus.

**Livrable attendu :** Architecture ELT et contrats de données versionnés.

**Pour aller plus loin :** Comparer batch, micro-batch et CDC selon le volume, la latence attendue, le coût et les capacités de reprise.

### Ingérer de manière incrémentale · 210 min

- Gérer pagination, quotas, dates de modification et marqueurs de reprise.
- Traiter suppressions, événements tardifs et évolutions de schéma.
- Conserver données brutes et métadonnées d'exécution.
- Gérer watermark, CDC, suppressions, événements tardifs, doublons et changements de schéma sans perdre la traçabilité.

**Atelier prévu :** Simuler deux extractions avec chevauchement et vérifier que la seconde n'ajoute pas de doublons ni n'oublie une correction tardive.

**Livrable attendu :** Connecteur incrémental, journal de rejets et protocole de reprise.

**Pour aller plus loin :** Rejouer une plage temporelle après incident et démontrer l’idempotence du chargement sur des données déjà présentes.

## Jour 2 · 7 heures

### Transformer et contrôler les tables · 210 min

- Construire couches nettoyées et agrégées avec dépendances explicites.
- Tester unicité, nullité, références et rapprochement des montants.
- Isoler les rejets et documenter les règles de correction.
- Construire des transformations modulaires avec tests de clés, de relations, de complétude et de fraîcheur.

**Atelier prévu :** Assembler clients et commandes ; produire un rapport distinguant données acceptées, mises en quarantaine et erreurs bloquantes.

**Livrable attendu :** Modèles de transformation, tests de données et documentation du lignage.

**Pour aller plus loin :** Comparer reconstruction complète et modèle incrémental, puis traiter une correction tardive modifiant un historique déjà calculé.

### Orchestrer et rejouer les traitements · 210 min

- Définir tâches, dépendances, retries et délais maximaux.
- Rendre les écritures idempotentes et gérer les exécutions concurrentes.
- Rejouer une période historique sans écraser des données récentes.
- Exprimer dépendances, états d’exécution, retries, backoff, paramètres et limites de concurrence dans le DAG.

**Atelier prévu :** Provoquer une panne intermédiaire, relancer le flux et vérifier les totaux après reprise puis après backfill.

**Livrable attendu :** DAG paramétrable et procédure de backfill testée.

**Pour aller plus loin :** Concevoir un backfill borné qui évite doubles calculs, surcharge du système source et incohérence des tables aval.

## Jour 3 · 7 heures

### Exploiter et protéger la plateforme · 210 min

- Suivre fraîcheur, volumes, durée, coûts et taux de rejet.
- Séparer identités techniques, secrets et droits par environnement.
- Dimensionner partitions et traitements à partir de mesures.
- Suivre volumes, erreurs, coûts et fraîcheur ; isoler les secrets et limiter les droits des identités techniques.

**Atelier prévu :** Diagnostiquer une rupture de fraîcheur et proposer une optimisation chiffrée sur des métriques de démonstration.

**Livrable attendu :** Tableau d’exploitation, budget de consommation et matrice des accès.

**Pour aller plus loin :** Analyser une rupture de SLA et arbitrer réduction du scan, partitionnement, parallélisme et fréquence d’exécution.

### Livrer un pipeline maintenable · 210 min

- Versionner code, configuration et transformations.
- Préparer recette, promotion entre environnements et retour arrière.
- Rédiger une procédure d'incident et un catalogue des dépendances.
- Séparer environnements, configurations et données de test ; prévoir validation automatique et promotion contrôlée.

**Atelier prévu :** Restituer le pipeline commandes avec tests, journal de reprise et guide d'exploitation qu'un collègue peut suivre.

**Livrable attendu :** Dépôt livrable, dossier d’exploitation et recette de reprise.

**Pour aller plus loin :** Faire reprendre le pipeline par un tiers à partir du dépôt, du runbook et d’un incident simulé documenté.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Une reprise ne crée ni pertes ni doublons.
- Les écarts entre source et cible sont expliqués.
- Les alertes et les coûts sont associés à des seuils opérationnels.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/data-engineering-cloud-pipelines-elt-et-orchestration)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [Apache Airflow · conception des traitements](https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html)
- [dbt · tests de données](https://docs.getdbt.com/docs/build/data-tests)

## Contacts, accès et accompagnement — mise à jour du 12 septembre 2026

Beyond Expertise : [09 54 70 23 80](tel:+33954702380) — [contact@beyondexpertise.eu](mailto:contact@beyondexpertise.eu).

Pour obtenir plus de détails ou le programme détaillé validé, contactez le centre Beyond Expertise.

Le programme, le tarif contractuel, la TVA, les dates et le délai d’accès sont à confirmer avec le centre avant inscription. Aucune session commerciale n’est ouverte dans la copie locale.

Une analyse de vos besoins et une vérification des prérequis doivent précéder l’attribution du parcours. Les aménagements liés au handicap et l’assistance technique ou pédagogique sont à convenir avec le centre ; aucun diagnostic médical n’est nécessaire dans le formulaire.

Dans la copie locale : /informations-pratiques, /positionnement, /accessibilite, /assistance, /reclamations et /avis.

Les supports proposés ne délivrent pas de diplôme ou de certification professionnelle. Une éventuelle préparation à un examen externe nécessite la vérification des habilitations et modalités. Aucun financement CPF ou OPCO n’est garanti.

Démarche Qualiopi en cours ; certification non acquise. Les programmes restent à valider avant animation.
