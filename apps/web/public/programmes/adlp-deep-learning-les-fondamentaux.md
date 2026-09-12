# Deep Learning : les fondamentaux

Beyond Expertise · Programme détaillé · Version 2 du 2026-09-12

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Fondamental · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial. Les approfondissements « Pour aller plus loin » sont sélectionnés par le formateur selon le positionnement et le temps disponible ; ils ne constituent pas des heures supplémentaires garanties.

## Objectifs de la fiche de référence

- Maitriser les concepts fondamentaux du Deep learning et leur origine
- Identifier les principaux types de réseaux de neurones (simples, convolutifs, récursifs, etc.)
- Savoir quand les utiliser ?
- Appréhender les modèles de Deep Learning plus avancés (auto-encodeurs, gans, apprentissage par renforcement, …)
- Appréhender les bases théoriques et pratiques d'architecture et de convergence de réseaux de neurones
- Comprendre en quoi consiste la mise en œuvre concrète des réseaux de neurones
- Utiliser un framework de référence : Keras de TensorFlow

## Public et prérequis

Public : Professionnels, équipes métier et organisations souhaitant développer des compétences concrètes en intelligence artificielle.

Prérequis de la fiche : introduction aux notebooks JupyterDécouverte de TensorFlowInstallation de TensorFlow et son éco système, présentation des tensors (tableaux multidimensionnels), des variables et placeholders, présentation des graphes et sessions TensorFlowExemples avec les APIs TensorFlow : Estimators, Layers, Datasets…Opérations sur des ensembles de données telles que la régression et la classification. Visualiser des graphes et courbes d’apprentissage avec TensorBoard.

## Préparation de la formation

Notions de Python et d'algèbre élémentaire conseillées ; notebook Keras/TensorFlow préparé, données réduites.

## Cas fil rouge

Comprendre les réseaux de neurones en entraînant un petit modèle avec Keras, puis situer les architectures plus avancées.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Du neurone à la fonction de perte · 210 min

- Relier poids, biais, activation et sortie.
- Expliquer apprentissage et minimisation d'une erreur.
- Situer apprentissage profond parmi les méthodes de machine learning.
- Calculer sur un exemple simple l’effet d’un poids sur la perte ; relier dérivée, règle de chaîne et mise à jour par descente de gradient.

**Atelier prévu :** Calculer à la main la sortie d'un neurone simple puis observer l'effet d'un changement de poids.

**Livrable attendu :** Schéma du réseau et calcul commenté d’une prédiction.

**Pour aller plus loin :** Expliquer sur un exemple simple pourquoi une fonction non linéaire est nécessaire pour séparer certaines données.

### Construire un réseau dense avec Keras · 210 min

- Assembler des couches avec formes d'entrée et de sortie cohérentes.
- Choisir perte, optimiseur et métriques pour une tâche simple.
- Séparer données d'entraînement, de validation et de test.
- Définir forme des entrées, encodage des cibles et choix cohérent de la dernière couche et de la perte.

**Atelier prévu :** Entraîner un premier classifieur et vérifier son comportement sur des exemples jamais utilisés pendant l'apprentissage.

**Livrable attendu :** Notebook Keras et contrôles de cohérence des tenseurs.

**Pour aller plus loin :** Construire une baseline puis contrôler la capacité du réseau à apprendre un petit sous-ensemble avant toute recherche d’architecture.

## Jour 2 · 7 heures

### Lire les courbes d'apprentissage · 210 min

- Reconnaître sous-apprentissage et surapprentissage.
- Relier taille des lots et taux d'apprentissage à la convergence.
- Introduire arrêt anticipé et régularisation sur un exemple guidé.
- Identifier sous-apprentissage, surapprentissage et instabilité dans les courbes de perte et les métriques.

**Atelier prévu :** Comparer trois entraînements et expliquer les écarts entre qualité d'entraînement et qualité de validation.

**Livrable attendu :** Courbes annotées et tableau d’expériences.

**Pour aller plus loin :** Comparer arrêt anticipé, régularisation et réduction du taux d’apprentissage en ne changeant qu’un facteur à la fois.

### Comprendre les architectures spécialisées · 210 min

- Relier convolution et structure spatiale des images.
- Situer réseaux récurrents, LSTM et attention pour des séquences.
- Choisir une architecture en fonction de la donnée et de l'objectif.
- Relier convolution, récurrence et attention aux structures des images, séquences et textes.

**Atelier prévu :** Étudier un CNN et un modèle de séquence préparés ; identifier les dimensions et le rôle des principales couches.

**Livrable attendu :** Matrice problèmes/architectures et choix motivé.

**Pour aller plus loin :** Justifier une famille d’architecture à partir des dépendances du problème plutôt que de la popularité du modèle.

## Jour 3 · 7 heures

### Découvrir les familles avancées · 210 min

- Expliquer représentation latente et reconstruction d'un autoencodeur.
- Situer génération adversariale et modèles génératifs sans les entraîner à grande échelle.
- Distinguer apprentissage par renforcement et apprentissage supervisé.
- Situer autoencodeurs, modèles génératifs et apprentissage par renforcement ; distinguer génération et décision.

**Atelier prévu :** Associer détection d'anomalies, génération d'images et contrôle d'un système aux familles adaptées, en explicitant leurs contraintes.

**Livrable attendu :** Fiche de lecture d’une architecture avancée.

**Pour aller plus loin :** Analyser les contraintes d’un modèle préentraîné : domaine de validité, données nécessaires et risques de réutilisation.

### Évaluer la pertinence d'un projet deep learning · 210 min

- Comparer baseline simple et réseau sur coût et qualité.
- Examiner disponibilité des labels, puissance de calcul et maintenance.
- Décrire limites d'interprétation et risques de généralisation.
- Comparer deep learning et méthodes plus simples selon volume, ressources, performance utile et explicabilité.

**Atelier prévu :** Remettre le notebook du classifieur et une note motivant quand l'utiliser, quand préférer un modèle simple et quelles données collecter.

**Livrable attendu :** Dossier de faisabilité et plan d’expérimentation.

**Pour aller plus loin :** Définir un pilote dont les critères de réussite incluent qualité des données, coût d’inférence et conditions de supervision.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Le participant explique les composants du réseau construit.
- Les courbes sont interprétées sans confondre validation et test.
- Les architectures avancées sont situées avec leurs limites.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/adlp-deep-learning-les-fondamentaux)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [Keras · guides de développement](https://keras.io/guides/)

## Contacts, accès et accompagnement — mise à jour du 12 septembre 2026

Beyond Expertise : [09 54 70 23 80](tel:+33954702380) — [contact@beyondexpertise.eu](mailto:contact@beyondexpertise.eu).

Pour obtenir plus de détails ou le programme détaillé validé, contactez le centre Beyond Expertise.

Le programme, le tarif contractuel, la TVA, les dates et le délai d’accès sont à confirmer avec le centre avant inscription. Aucune session commerciale n’est ouverte dans la copie locale.

Une analyse de vos besoins et une vérification des prérequis doivent précéder l’attribution du parcours. Les aménagements liés au handicap et l’assistance technique ou pédagogique sont à convenir avec le centre ; aucun diagnostic médical n’est nécessaire dans le formulaire.

Dans la copie locale : /informations-pratiques, /positionnement, /accessibilite, /assistance, /reclamations et /avis.

Les supports proposés ne délivrent pas de diplôme ou de certification professionnelle. Une éventuelle préparation à un examen externe nécessite la vérification des habilitations et modalités. Aucun financement CPF ou OPCO n’est garanti.

Démarche Qualiopi en cours ; certification non acquise. Les programmes restent à valider avant animation.
