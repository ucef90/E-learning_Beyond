# Machine Learning pour Data Scientist Junior

Beyond Expertise · Programme détaillé · Version 2 du 2026-09-12

**Version enrichie proposée, à valider par le formateur avant animation.**

4 jour(s) · 28 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial. Les approfondissements « Pour aller plus loin » sont sélectionnés par le formateur selon le positionnement et le temps disponible ; ils ne constituent pas des heures supplémentaires garanties.

## Objectifs de la fiche de référence

- Construire un premier pipeline de machine learning supervisé
- Comparer des modèles et interpréter leurs résultats
- Éviter les erreurs classiques de cadrage et d’évaluation

## Public et prérequis

Public : Juniors data scientists, data analysts techniques, profils en montée de compétence vers la data science.

Prérequis de la fiche : Connaître Python, les bases statistiques et la manipulation de données.

## Préparation de la formation

Python, pandas et statistiques élémentaires ; notebook scikit-learn, données fictives et environnement préparé.

## Cas fil rouge

Réaliser un premier projet supervisé de bout en bout, en comparant modèles simples, métriques et limites sur un cas client fictif.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Formuler le problème supervisé · 210 min

- Distinguer classification et régression.
- Définir cible, unité d'observation et décision métier.
- Construire une baseline et préciser le coût des erreurs.
- Identifier les observations censurées, les labels issus d’anciennes décisions et les délais d’obtention de la cible ; expliciter leurs conséquences sur le problème.

**Atelier prévu :** Transformer une demande de score client en problème testable avec horizon, population et métrique principale.

**Livrable attendu :** Cadrage du problème et critères de succès.

**Pour aller plus loin :** Identifier une tâche qui semble supervisée mais ne possède pas de cible fiable.

### Explorer et découper les données · 210 min

- Examiner types, distributions et données manquantes.
- Séparer entraînement, validation et test selon temps ou groupes.
- Repérer doublons et informations fuyant la cible.
- Explorer déséquilibre, valeurs absentes et groupes ; choisir séparation aléatoire, temporelle ou groupée.

**Atelier prévu :** Construire le découpage et vérifier qu'un même client ne se retrouve pas artificiellement dans plusieurs ensembles.

**Livrable attendu :** Audit exploratoire et découpage justifié.

**Pour aller plus loin :** Repérer la présence d’un même individu dans apprentissage et test.

## Jour 2 · 7 heures

### Préparer un pipeline de données · 210 min

- Imputer, encoder et mettre à l'échelle si nécessaire.
- Apprendre les transformations uniquement sur l'entraînement.
- Préparer gestion des catégories inconnues.
- Intégrer imputation, encodage et normalisation dans un pipeline sans fuite.

**Atelier prévu :** Créer un pipeline capable de traiter un nouvel exemple sans reproduire manuellement les transformations.

**Livrable attendu :** Pipeline de préparation et contrôles de schéma.

**Pour aller plus loin :** Tester catégories inconnues et colonnes manquantes à l’utilisation.

### Entraîner les premiers modèles · 210 min

- Comprendre régression linéaire ou logistique et arbres.
- Comparer baseline, modèle linéaire et ensemble d'arbres.
- Lire paramètres et premiers signes de surapprentissage.
- Comparer capacité de généralisation et courbes d’apprentissage ; examiner les effets de régularisation, profondeur et déséquilibre des classes.

**Atelier prévu :** Entraîner trois modèles avec les mêmes données et enregistrer temps, métriques et configuration.

**Livrable attendu :** Tableau comparatif et choix initial.

**Pour aller plus loin :** Expliquer pourquoi un modèle plus complexe n’améliore pas la référence.

## Jour 3 · 7 heures

### Évaluer les erreurs · 210 min

- Lire matrice de confusion ou distribution des résidus.
- Choisir métriques adaptées au déséquilibre et au coût métier.
- Examiner résultats par segments avec prudence.
- Analyser matrice de confusion, erreurs par segment, seuil et calibration selon la tâche.

**Atelier prévu :** Analyser les erreurs les plus coûteuses et proposer un seuil compatible avec la capacité d'action métier.

**Livrable attendu :** Rapport d’erreurs et seuil argumenté.

**Pour aller plus loin :** Choisir un seuil en tenant compte du coût des faux positifs et faux négatifs.

### Améliorer sans surajuster · 210 min

- Utiliser validation croisée adaptée aux données.
- Régler quelques hyperparamètres avec budget limité.
- Conserver le test final pour l'évaluation de la solution retenue.
- Encadrer validation croisée, recherche d’hyperparamètres et conservation d’un test final.

**Atelier prévu :** Comparer des candidats en validation et justifier le choix d'un modèle plus simple lorsque le gain complexe reste faible.

**Livrable attendu :** Protocole d’optimisation et résultats validés.

**Pour aller plus loin :** Détecter un ajustement répété sur le jeu de test qui invalide la conclusion.

## Jour 4 · 7 heures

### Interpréter et préparer la réutilisation · 210 min

- Décrire les variables influentes sans en déduire une causalité.
- Enregistrer le pipeline et son environnement.
- Définir contrat d'entrée et contrôles de qualité.
- Expliquer effets des variables avec prudence ; documenter limites et domaine d’utilisation.

**Atelier prévu :** Recharger le pipeline dans une session propre et produire des prédictions sur un lot nouveau.

**Livrable attendu :** Fiche modèle et analyse des limites.

**Pour aller plus loin :** Vérifier stabilité d’une explication entre échantillons et variables corrélées.

### Présenter le projet et ses limites · 210 min

- Restituer problème, protocole, résultats et erreurs.
- Documenter périmètre, risques et surveillance nécessaire.
- Proposer les prochaines données ou expériences utiles.
- Présenter problème, données, baseline, résultats, risques et prochaine décision.

**Atelier prévu :** Présenter un dossier de projet avec notebook reproductible, comparaison à la baseline et fiche modèle argumentée.

**Livrable attendu :** Dossier final et soutenance argumentée.

**Pour aller plus loin :** Défendre un choix simple et robuste face à une demande de meilleur score seul.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Le protocole évite les fuites et l'usage répété du test final.
- Le modèle est comparé à une baseline.
- La restitution explique les erreurs et le domaine d'utilisation.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/machine-learning-pour-data-scientist-junior)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [scikit-learn · pièges méthodologiques](https://scikit-learn.org/stable/common_pitfalls.html)

## Contacts, accès et accompagnement — mise à jour du 12 septembre 2026

Beyond Expertise : [09 54 70 23 80](tel:+33954702380) — [contact@beyondexpertise.eu](mailto:contact@beyondexpertise.eu).

Pour obtenir plus de détails ou le programme détaillé validé, contactez le centre Beyond Expertise.

Le programme, le tarif contractuel, la TVA, les dates et le délai d’accès sont à confirmer avec le centre avant inscription. Aucune session commerciale n’est ouverte dans la copie locale.

Une analyse de vos besoins et une vérification des prérequis doivent précéder l’attribution du parcours. Les aménagements liés au handicap et l’assistance technique ou pédagogique sont à convenir avec le centre ; aucun diagnostic médical n’est nécessaire dans le formulaire.

Dans la copie locale : /informations-pratiques, /positionnement, /accessibilite, /assistance, /reclamations et /avis.

Les supports proposés ne délivrent pas de diplôme ou de certification professionnelle. Une éventuelle préparation à un examen externe nécessite la vérification des habilitations et modalités. Aucun financement CPF ou OPCO n’est garanti.

Démarche Qualiopi en cours ; certification non acquise. Les programmes restent à valider avant animation.
