# Programmes détaillés Beyond Expertise

Les 81 formations ont désormais un programme original lié aux objectifs, au niveau et à la durée de leur fiche officielle. Le lot contient 420 séquences, 420 ateliers distincts et 81 évaluations prévues. Le corps des programmes représente environ 23 000 mots, hors métadonnées et consignes communes.

Chaque programme décrit un cas fil rouge, les conditions de préparation, le déroulé par journée, trois sujets précis par séquence, le travail à produire et trois critères d'évaluation finale. La répartition proposée utilise 7 heures par jour, pauses exclues ; les ateliers et l'évaluation sont inclus dans ces heures. Cette répartition complète les durées en jours du catalogue officiel, elle ne constitue pas un horaire relevé sur le site d'origine.

Le statut est « version enrichie proposée, à valider par le formateur ». Les ateliers sont des scénarios pédagogiques originaux. Leur description ne signifie pas que les fichiers de TP, corrigés, vidéos et quiz associés sont déjà disponibles. Le module pilote Python existant conserve ses six leçons, son atelier, son TP et son quiz ; il couvre une partie du programme de trois jours.

## Sources et maintenance

Le relevé officiel du 11 septembre 2026 reste conservé dans `data/official-catalogue.json`. La rédaction nouvelle est dans `data/detailed-programmes.json`. Les références intégrées aux fiches sont des documentations primaires pour approfondir les notions ; leurs éditeurs n'ont pas validé les programmes. Les versions des outils, les licences et les textes réglementaires devront être vérifiés avant l'animation effective.

1. Modifier le programme concerné dans le JSON, en conservant son slug.
2. Exécuter `node scripts/validate-programmes.cjs`.
3. Exécuter `node scripts/export-programmes.cjs` pour régénérer les téléchargements Markdown.
4. Importer avec `LOCAL_CATALOGUE_IMPORT=true node --env-file=.env scripts/import-official-catalogue.cjs`. Sur PowerShell, définir la variable avec `$env:LOCAL_CATALOGUE_IMPORT='true'` avant la commande Node. Le script refuse toute cible autre que la base locale dédiée `beyond_pilot_elearning`.
5. Compiler l'API et le site, puis exécuter `node scripts/test-programmes.cjs` avec les services locaux démarrés.

Le catalogue expose un résumé des programmes. Le détail complet est servi uniquement sur chaque fiche, afin de ne pas envoyer les 81 textes au composant de filtrage du catalogue. Les téléchargements sont dans `apps/web/public/programmes`.

## Vérification pédagogique avant animation

Le formateur pourra ajuster le rythme au positionnement initial, réaliser les supports d'ateliers annoncés et établir les grilles de correction. Les références de formations voisines sont volontairement différenciées : initiation SQL, SQL analytique et SQL avancé ; bases du deep learning et réalisation avec PyTorch ; découverte de l'IA, pratique du prompting et gouvernance de portefeuille IA.
