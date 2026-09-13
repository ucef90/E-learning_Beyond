# Recette du 12 septembre 2026
Tests techniques sur la copie locale ; aucune preuve de participation ou de conformité réelle du centre n’est créée.

## Résultats
- Compilation API Nest : réussie.
- Compilation web Next, vérification TypeScript et génération des pages : réussies ; dernière compilation après correction des liens du lecteur.
- test-regulatory.cjs : 6 groupes de contrôles réussis. Catalogue 83, séparation des 81 fiches officielles, 16 leçons, 40 questions, quiz faux et exacts notés 0 et 100, explications persistantes, contrôle des attributions, export personnel sans secrets et sans cache, demande de droits avec échéance et accès privé.
- test-programmes.cjs : 81 programmes / 420 séquences préexistants, API, pages, téléchargements et fiche inconnue vérifiés.
- test-quality-pages.cjs : 11 pages publiques et 81 fiches préexistantes avec accès, contacts et téléchargements.
- test-quality.cjs : accès aux registres, validation serveur, origine, 7 formulaires, idempotence, clôture, historique, concurrence et pagination >50.
- Les fixtures des tests sont supprimées par leurs identifiants propres ; les comptes, cours et travaux existants sont conservés.
- Import des nouveaux cours conçu pour être idempotent et refuser l’écrasement d’une version dont le contenu diffère.

## Vérification navigateur
Accueil à 1280 px : catalogue 83, mise en avant RGPD + AI Act, décor local, aucun élément vidéo, largeur du document égale à celle de l’affichage utile.
Support RGPD à 390 px : largeur 375 px avec barre de défilement, aucun débordement horizontal, 8 corrigés présents ; ouverture du premier corrigé testée.
Compte administrateur : deux nouveaux cours visibles dans Mes cours, groupe de démonstration avec deux attributions, lecteur AI Act avec 8 leçons, carnet et sources accessibles ; 20 questions et 60 choix visibles dans le quiz.
Les tests API vérifient les comptes apprenant et formateur ; cette vérification visuelle du lecteur utilise le compte administrateur de démonstration.

## Portée
Les tests montrent le fonctionnement observé, pas une certification RGPD / AI Act. Une soutenance n’est pas validée par le quiz, aucun email automatique n’est envoyé et les données métier n’ont pas encore de politique de purge validée.
