# RAG et bases vectorielles pour l’entreprise

Beyond Expertise · Programme détaillé · Version 2 du 2026-09-12

**Version enrichie proposée, à valider par le formateur avant animation.**

2 jour(s) · 14 heures indicatives · Avancé · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial. Les approfondissements « Pour aller plus loin » sont sélectionnés par le formateur selon le positionnement et le temps disponible ; ils ne constituent pas des heures supplémentaires garanties.

## Objectifs de la fiche de référence

- Comprendre les composants d’une architecture RAG
- Identifier les cas d’usage métier les plus pertinents
- Anticiper les enjeux de qualité, de sécurité et de gouvernance

## Public et prérequis

Public : Architectes data, responsables innovation, développeurs IA, chefs de projet transformation.

Prérequis de la fiche : Connaître les bases des systèmes d’information et des usages IA générative.

## Préparation de la formation

Bases d'architecture SI et d'IA générative ; corpus fictif, notebook ou démonstration RAG, API simulée possible.

## Cas fil rouge

Concevoir un assistant de recherche dans des procédures d'entreprise et évaluer la pertinence des documents retrouvés avant la réponse générée.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Décomposer une architecture RAG · 210 min

- Distinguer ingestion, indexation, recherche et génération.
- Comparer recherche lexicale, vectorielle et hybride.
- Définir questions métier et sources de référence attendues.
- Relier ingestion, découpage, embeddings, recherche, contexte et génération ; définir une baseline.

**Atelier prévu :** Dessiner l'architecture d'un assistant de procédures et préparer dix questions, dont deux sans réponse dans le corpus.

**Livrable attendu :** Architecture RAG et contrat de réponse.

**Pour aller plus loin :** Comparer recherche documentaire seule et réponse générée selon besoin utilisateur.

### Préparer documents et index · 210 min

- Extraire texte, structure et métadonnées sans perdre le contexte.
- Comparer découpages, embeddings et index avec critères explicites.
- Prévoir mise à jour, suppression et propagation des droits.
- Choisir taille des segments, métadonnées, recherche hybride et filtrage selon les documents.

**Atelier prévu :** Comparer deux découpages d'un même dossier et vérifier quels passages restent interprétables hors de leur document complet.

**Livrable attendu :** Pipeline d’indexation et règles d’accès.

**Pour aller plus loin :** Préserver les droits d’accès lors de l’indexation et de la recherche.

## Jour 2 · 7 heures

### Construire une réponse vérifiable · 210 min

- Filtrer les documents selon les droits avant restitution.
- Sélectionner et éventuellement réordonner les passages pertinents.
- Demander citations et abstention en cas de source insuffisante.
- Construire contexte, citations, refus en absence de preuve et protection contre instructions documentaires.

**Atelier prévu :** Tester l'assistant sur question ambiguë, document obsolète et instruction hostile dans une source, puis examiner les références affichées.

**Livrable attendu :** Réponse sourcée et scénarios de refus.

**Pour aller plus loin :** Traiter deux sources contradictoires sans produire une synthèse faussement certaine.

### Évaluer qualité et exploitation · 210 min

- Séparer qualité de retrieval et fidélité de la réponse.
- Mesurer couverture, pertinence, latence et coût sur un jeu fixe.
- Planifier surveillance du corpus et traitement des retours utilisateurs.
- Séparer rappel de recherche, pertinence, fidélité, latence et coût ; versionner corpus et tests.

**Atelier prévu :** Livrer une matrice de recette et une recommandation d'architecture justifiée par les résultats, avec limites et actions correctives.

**Livrable attendu :** Banc d’évaluation et plan d’exploitation.

**Pour aller plus loin :** Diagnostiquer une réponse erronée en localisant recherche, contexte ou génération.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Les citations soutiennent réellement les réponses.
- Les droits sont respectés au niveau de la recherche.
- Les erreurs de retrieval sont distinguées des erreurs de génération.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/rag-et-bases-vectorielles-pour-entreprise)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [OWASP · sécurité des applications LLM](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [Databricks · architecture lakehouse](https://docs.databricks.com/aws/en/lakehouse/)

## Contacts, accès et accompagnement — mise à jour du 12 septembre 2026

Beyond Expertise : [09 54 70 23 80](tel:+33954702380) — [contact@beyondexpertise.eu](mailto:contact@beyondexpertise.eu).

Pour obtenir plus de détails ou le programme détaillé validé, contactez le centre Beyond Expertise.

Le programme, le tarif contractuel, la TVA, les dates et le délai d’accès sont à confirmer avec le centre avant inscription. Aucune session commerciale n’est ouverte dans la copie locale.

Une analyse de vos besoins et une vérification des prérequis doivent précéder l’attribution du parcours. Les aménagements liés au handicap et l’assistance technique ou pédagogique sont à convenir avec le centre ; aucun diagnostic médical n’est nécessaire dans le formulaire.

Dans la copie locale : /informations-pratiques, /positionnement, /accessibilite, /assistance, /reclamations et /avis.

Les supports proposés ne délivrent pas de diplôme ou de certification professionnelle. Une éventuelle préparation à un examen externe nécessite la vérification des habilitations et modalités. Aucun financement CPF ou OPCO n’est garanti.

Démarche Qualiopi en cours ; certification non acquise. Les programmes restent à valider avant animation.
