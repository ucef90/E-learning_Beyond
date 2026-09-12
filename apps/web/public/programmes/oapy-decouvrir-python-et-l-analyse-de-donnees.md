# Découvrir Python et l'analyse de données

Beyond Expertise · Programme détaillé · Version 2 du 2026-09-12

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Fondamental · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial. Les approfondissements « Pour aller plus loin » sont sélectionnés par le formateur selon le positionnement et le temps disponible ; ils ne constituent pas des heures supplémentaires garanties.

## Objectifs de la fiche de référence

- Maîtriser les bases du langage Python
- Connaitre les aspects avancés en Python
- Savoir analyser des données en Python
- Savoir faire une représentation graphique de données en Python
- Acquérir des données externes en Python
- Comprendre les performances et la parallélisation

## Public et prérequis

Public : Professionnels, équipes métier et organisations souhaitant développer des compétences concrètes en développement logiciel.

Prérequis de la fiche : Pour suivre cette formation d'Analyse de données, il est nécessaire de connaître au moins un langage de programmation.

## Préparation de la formation

Aucun code Python préalable ; ordinateur avec Python et notebook préparés, fichiers CSV et API simulée.

## Cas fil rouge

Découvrir Python en construisant une petite analyse de ventes, depuis le fichier source jusqu'au graphique commenté.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Prendre en main le langage · 210 min

- Exécuter instructions et cellules dans l'ordre.
- Manipuler nombres, chaînes, booléens et conversions.
- Lire un message d'erreur et distinguer variable, valeur et type.
- Comparer listes, dictionnaires, ensembles et tuples ; prévoir la conversion des types et le traitement des valeurs absentes.

**Atelier prévu :** Calculer le montant de trois commandes et corriger des erreurs de conversion et de nom de variable.

**Livrable attendu :** Script de calcul annoté et tableau de cas de test.

**Pour aller plus loin :** Décomposer une règle de calcul en petits exemples puis tester ses cas limites avant de parcourir un fichier entier.

### Structurer un traitement simple · 210 min

- Employer listes, dictionnaires, conditions et boucles.
- Écrire une fonction avec paramètres et valeur de retour.
- Importer un module et distinguer code réutilisable et exécution.
- Organiser fonctions, paramètres, valeurs de retour et exceptions ; distinguer affichage d’un résultat et production d’une donnée réutilisable.

**Atelier prévu :** Écrire une fonction de calcul de remise et la vérifier sur un montant nul, un seuil exact et une entrée invalide.

**Livrable attendu :** Module de fonctions et tests d’entrées invalides.

**Pour aller plus loin :** Refactorer un script répétitif en fonctions indépendantes, sans modifier ses résultats attendus.

## Jour 2 · 7 heures

### Lire et explorer des tableaux · 210 min

- Charger un CSV en contrôlant séparateur, encodage et types.
- Inspecter lignes, colonnes, valeurs manquantes et doublons avec pandas.
- Sélectionner des lignes et créer une colonne calculée.
- Contrôler encodage, séparateur, types de colonnes et cardinalité ; repérer ce que la lecture automatique a mal interprété.

**Atelier prévu :** Établir le diagnostic d'un fichier ventes et produire un extrait répondant à une question commerciale précise.

**Livrable attendu :** Notebook de profilage et contrat de colonnes.

**Pour aller plus loin :** Comparer deux exports dont les dates, décimales et noms de colonnes diffèrent, puis rendre leur schéma cohérent.

### Nettoyer et résumer les données · 210 min

- Convertir nombres et dates avec traitement des anomalies.
- Décider quand supprimer, remplacer ou conserver une valeur manquante.
- Calculer sommes, moyennes et regroupements par catégorie.
- Justifier chaque règle de nettoyage ; traiter jointures, regroupements, doublons et valeurs aberrantes avec des contrôles de volume.

**Atelier prévu :** Rédiger les règles de nettoyage puis calculer un total par produit dont la somme se rapproche des ventes valides.

**Livrable attendu :** Table nettoyée, rapport de contrôles et indicateurs vérifiés.

**Pour aller plus loin :** Identifier un double comptage provoqué par une jointure puis vérifier les totaux avant et après correction.

## Jour 3 · 7 heures

### Représenter et acquérir des données externes · 210 min

- Choisir barres ou courbe selon la question posée.
- Ajouter unités, titres et repères lisibles.
- Lire un JSON d'API, gérer absence de réponse et pagination sur un exemple limité.
- Choisir échelle, agrégation et type de graphique ; vérifier pagination, statuts HTTP et limites d’une source externe.

**Atelier prévu :** Enrichir les ventes avec un référentiel simulé puis construire un graphique accompagné de deux observations vérifiables.

**Livrable attendu :** Visualisations commentées et extracteur simple avec gestion des erreurs.

**Pour aller plus loin :** Produire deux graphiques du même indicateur et expliquer lequel répond à la question sans déformer la lecture.

### Rendre l'analyse réutilisable · 210 min

- Paramétrer chemins et filtres sans modifier tout le notebook.
- Comparer boucle et calcul vectorisé sur un petit benchmark.
- Situer la parallélisation comme approfondissement, après mesure du goulot.
- Séparer configuration, données d’entrée et sorties ; conserver versions de bibliothèques et ordre des étapes.

**Atelier prévu :** Relancer l'analyse sur un second fichier et livrer notebook, export et consignes d'exécution ; expliquer une limite de performance.

**Livrable attendu :** Analyse rejouable, notice d’utilisation et synthèse métier.

**Pour aller plus loin :** Exécuter l’analyse sur un nouvel export et faire expliquer le résultat par un pair à partir du seul dossier livré.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Le notebook repart d'une session vide sans dépendance cachée.
- Les totaux sont vérifiés après nettoyage.
- Le graphique répond à une question et comporte ses unités.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/oapy-decouvrir-python-et-l-analyse-de-donnees)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [Python · tutoriel du langage](https://docs.python.org/3/tutorial/)
- [pandas · guide utilisateur](https://pandas.pydata.org/docs/user_guide/index.html)

## Contacts, accès et accompagnement — mise à jour du 12 septembre 2026

Beyond Expertise : [09 54 70 23 80](tel:+33954702380) — [contact@beyondexpertise.eu](mailto:contact@beyondexpertise.eu).

Pour obtenir plus de détails ou le programme détaillé validé, contactez le centre Beyond Expertise.

Le programme, le tarif contractuel, la TVA, les dates et le délai d’accès sont à confirmer avec le centre avant inscription. Aucune session commerciale n’est ouverte dans la copie locale.

Une analyse de vos besoins et une vérification des prérequis doivent précéder l’attribution du parcours. Les aménagements liés au handicap et l’assistance technique ou pédagogique sont à convenir avec le centre ; aucun diagnostic médical n’est nécessaire dans le formulaire.

Dans la copie locale : /informations-pratiques, /positionnement, /accessibilite, /assistance, /reclamations et /avis.

Les supports proposés ne délivrent pas de diplôme ou de certification professionnelle. Une éventuelle préparation à un examen externe nécessite la vérification des habilitations et modalités. Aucun financement CPF ou OPCO n’est garanti.

Démarche Qualiopi en cours ; certification non acquise. Les programmes restent à valider avant animation.
