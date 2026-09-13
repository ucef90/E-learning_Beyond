# Programmes approfondis et fiches formation
Mise à jour locale du 12 septembre 2026.

## Portée
Les 81 programmes du catalogue officiel et les 2 programmes RGPD / AI Act disposent d’un approfondissement spécifique pour chacune de leurs 436 séquences. Les trois thèmes existants sont complétés par un quatrième thème, un défi « Pour aller plus loin » et un livrable attendu. Les cas fil rouge, ateliers, prérequis et critères d’évaluation restent liés à chaque formation.

Exemples : cardinalité des jointures et tests de réconciliation en Python Data Analyst ; données de validation et retours arrière en MLOps ; conflits et checkpoints en GoldenGate ; comparaison des modèles d’attribution en marketing ; jeux de rôle et feedback observable pour la communication.

Les durées initiales sont conservées : 7 heures par journée hors pauses. Les défis supplémentaires sont sélectionnés par le formateur selon le positionnement et le temps disponible. Ils ne sont pas une promesse de sujets obligatoires supplémentaires dans la même durée. Le statut reste DRAFT_FOR_TRAINER_REVIEW. Les supports manquants ne sont pas présentés comme disponibles.

## Présentation
La fiche reprend la hiérarchie du site officiel : catégorie, titre, résumé, durée, niveau, format, public et prérequis, objectifs, informations clés, tarif, prochaine date proposée et demande de devis préremplie.

Le programme est organisé en journées dépliables accessibles au clavier. La navigation ouvre la journée visée. Chaque séquence distingue notions, atelier, livrable et approfondissement. Un cas fil rouge précède le déroulé ; méthode, évaluation et références restent consultables. La colonne de contact accompagne la lecture sur un écran suffisamment haut ; elle revient dans le flux sur petit écran.

Référence visuelle inspectée : https://beyond-expertise.com/formations/python-pour-data-analyst

## Sources et statut éditorial
Les données commerciales capturées restent dans data/official-catalogue.json sans modification. Les enrichissements sont des rédactions originales, conservées dans content/programme-enrichments et content/regulatory/programme-enrichments.json. Les références des organismes et éditeurs sont accessibles en fin de chaque programme ; elles ne constituent pas une validation par ces organismes.

Références institutionnelles consultées pour les sujets réglementaires :
- https://www.cnil.fr/fr/me-mettre-en-conformite/rgpd-par-ou-commencer
- https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra
- https://eur-lex.europa.eu/eli/reg/2024/1689/oj/fra

Les dates d’application des textes doivent être relues dans leur version applicable avant animation. Aucun statut de certification n’a été ajouté.

## Maintenance
- node scripts/enrich-programmes.cjs : compile et valide les 81 enrichissements.
- node scripts/export-programmes.cjs : produit leurs programmes téléchargeables.
- node scripts/build-regulatory-content.cjs : produit les deux programmes réglementaires, sans modifier leurs leçons ni leurs quiz sources.
- node scripts/test-monthly-sessions.mts : vérifie les fins de mois, années bissextiles et dates en Europe/Paris.
- node scripts/test-programmes.cjs : compare 83 programmes API, pages et téléchargements.
- node scripts/test-quality-pages.cjs : vérifie les informations et accès publics existants.

La mise à jour de base passe par scripts/update-local-programmes.cjs avec LOCAL_PROGRAMME_IMPORT=true et node --env-file=.env. Elle est limitée à localhost:55432/beyond_pilot_elearning et au champ Training.program.syllabus. Une sauvegarde préalable est écrite dans work/. L’empreinte des 47 autres tables est comparée avant et après, ainsi que les autres informations des formations.

Les comptes, attributions, cours, leçons, quiz et progressions ne sont pas remplacés par cette opération. La base locale d’origine et le site officiel en ligne ne sont pas modifiés.

## Contrôles réalisés
- 83 fiches API comparées aux sources enrichies ; 436 ateliers, livrables et approfondissements présents dans le rendu.
- 83 programmes téléchargeables comparés aux fichiers générés.
- 11 pages publiques et 81 fiches vérifiées pour les contacts, informations pratiques, accessibilité et transparence.
- Sept cas de calendrier, dont février bissextile, changement d’année et passage de date en Europe/Paris.
- Contrôle d’intégration : 83 cartes avec la prochaine date proposée, cinq liens de navigation sur accueil/catalogue/fiche, devis prérempli.
- Navigateur : 1280 × 900 et 390 × 844, absence de débordement, titre long, ouverture d’une journée par lien, repli au clavier, menu mobile, survol jaune, pause/reprise des références et progression fixée en haut.
- Contrôle du respect de la réduction des animations dans le code ; préférence système du PC non modifiée.

Le cache des fiches a une revalidation de 30 secondes. Après import, rafraîchir les pages et laisser la revalidation se terminer avant une recette comparant strictement les versions.
