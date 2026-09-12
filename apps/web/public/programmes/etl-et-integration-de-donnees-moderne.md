# ETL et intégration de données moderne

Beyond Expertise · Programme détaillé · Version 2 du 2026-09-12

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial. Les approfondissements « Pour aller plus loin » sont sélectionnés par le formateur selon le positionnement et le temps disponible ; ils ne constituent pas des heures supplémentaires garanties.

## Objectifs de la fiche de référence

- Comprendre les modèles ETL et ELT
- Sécuriser les flux d’intégration et le suivi des erreurs
- Concevoir un pipeline réutilisable et maintenable

## Public et prérequis

Public : Data engineers, BI developers, développeurs back-end, responsables d’intégration.

Prérequis de la fiche : Avoir des notions de SQL et de manipulation de données.

## Préparation de la formation

SQL et manipulation de données ; sources locales simulées, scripts ou outil ETL choisi pour l'atelier.

## Cas fil rouge

Créer un flux d'intégration entre fichiers, API et base de reporting en maîtrisant rejets, doublons et reprise après incident.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Concevoir le flux d'intégration · 210 min

- Comparer ETL et ELT selon volumes et plateforme cible.
- Décrire sources, fréquence et règles de transformation.
- Définir contrat de schéma et contrôle de complétude.
- Définir sources, grain, fréquence, contrat de schéma et objectifs de reprise.

**Atelier prévu :** Dessiner un flux de commandes provenant d'un CSV et d'une API, avec tables de staging et de destination.

**Livrable attendu :** Architecture d’intégration et contrats de données.

**Pour aller plus loin :** Comparer ETL et ELT selon volume, sensibilité et capacité de la plateforme.

### Extraire sans perdre d'information · 210 min

- Gérer encodages, types et pagination d'API.
- Choisir extraction complète ou incrémentale.
- Journaliser fichier, date, lot et nombre d'enregistrements.
- Gérer extraction complète ou incrémentale, pagination, curseurs et modifications tardives.

**Atelier prévu :** Importer un fichier mal encodé et une API paginée simulée, puis prouver que tous les enregistrements ont été examinés.

**Livrable attendu :** Connecteur et stratégie de reprise.

**Pour aller plus loin :** Reprendre une extraction interrompue sans perdre ni dupliquer des enregistrements.

## Jour 2 · 7 heures

### Transformer et traiter les rejets · 210 min

- Normaliser formats, unités et codes de référence.
- Appliquer règles métier avec motifs de rejet.
- Conserver provenance et données utiles à la correction.
- Normaliser types, clés et formats ; distinguer rejet bloquant et anomalie tolérée.

**Atelier prévu :** Construire une zone de rejets et corriger un lot sans perdre la correspondance avec les lignes sources.

**Livrable attendu :** Chaîne de transformation et registre des rejets.

**Pour aller plus loin :** Conserver les données rejetées avec motif et possibilité de retraitement.

### Charger et gérer les changements · 210 min

- Choisir insertion, mise à jour ou historisation.
- Définir clés et règles de déduplication.
- Rendre le chargement idempotent et transactionnel selon le besoin.
- Choisir append, upsert, historisation et traitement des suppressions avec idempotence.

**Atelier prévu :** Rejouer un même lot puis un lot corrigé et vérifier que les données cibles restent cohérentes.

**Livrable attendu :** Chargement idempotent et tests de réconciliation.

**Pour aller plus loin :** Rejouer un lot déjà chargé et vérifier l’absence de doublons.

## Jour 3 · 7 heures

### Orchestrer et superviser · 210 min

- Définir dépendances, reprise et notifications d'erreur.
- Mesurer fraîcheur, volumes, délais et taux de rejet.
- Protéger secrets et droits des comptes techniques.
- Définir dépendances, retries bornés, alertes, fraîcheur et supervision des volumes.

**Atelier prévu :** Interrompre le flux après extraction, reprendre au bon point et vérifier les totaux de contrôle.

**Livrable attendu :** Orchestration et tableau de qualité opérationnelle.

**Pour aller plus loin :** Diagnostiquer un flux techniquement réussi mais métier incomplet.

### Documenter et livrer l'intégration · 210 min

- Décrire mapping source-cible et règles de gestion.
- Préparer données de recette et scénarios d'incident.
- Formaliser procédure d'exploitation et responsabilités.
- Documenter lineage, règles, paramètres, responsabilités et procédures de changement.

**Atelier prévu :** Livrer le pipeline avec mapping, tests de reprise, rapport de rapprochement et guide d'exploitation.

**Livrable attendu :** Dossier d’exploitation et recette de transfert.

**Pour aller plus loin :** Faire reprendre le traitement par un autre intervenant à partir du dossier livré.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Le rejeu n'ajoute pas de doublons.
- Chaque rejet conserve un motif et une origine.
- Les totaux source-cible sont rapprochés et les écarts expliqués.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/etl-et-integration-de-donnees-moderne)

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
