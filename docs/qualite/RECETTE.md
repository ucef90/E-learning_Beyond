# Recette de la livraison qualité — 12 septembre 2026

**Nature : vérifications techniques sur une copie locale, sans bénéficiaire réel.**

## Résultats

- Compilation NestJS : succès.
- Compilation Next.js et vérification des types : succès. La dernière compilation utilise l’API disponible ; aucune erreur de connexion dans cette compilation.
- API : neuf groupes de contrôles réussis via `scripts/test-quality.cjs` : autorisations, validation, origine, sept types de demandes, persistance, idempotence, traitement et historique, preuves internes, pagination et préservation du catalogue / cours / inscriptions / travaux / quiz.
- Formulaires : rejet des types et champs imprévus, messages trop courts ou trop longs, email invalide, champ anti-spam rempli, absence de niveau ou de note, note nulle et questionnaire pédagogique d’un rôle inadapté.
- Accès : lecture et modification des registres refusées aux visiteurs, apprenants et formateurs. Seuls les administrateurs disposent des API correspondantes.
- Clôture : résolution et référence de réponse requises ; responsables et notes d’action contrôlés. Les versions concurrentes sont refusées pour éviter un écrasement silencieux.
- Registre de preuves : une pièce de test ne peut pas être « examinée » comme preuve réelle. Les justifications et références sont requises pour les décisions correspondantes.
- Pagination : plus de 50 demandes restituées sans omission ni doublon ; fixtures supprimées après test.
- HTTP public : 11 pages, 81 fiches et 81 téléchargements contrôlés. Contacts, liens d’accès, assistance, aménagements et transparence de la certification présents.
- Navigateur : réclamation synthétique reçue avec référence, retrouvée dans l’administration, passée en cours avec note et historique ; recherche « handicap » dans les 33 lignes ; affichage ordinateur et mobile contrôlé.
- Mobile : débordement du menu corrigé ; largeur du contenu 375 px pour un viewport de 390 px. Pas d’audit RGAA complet.
- Sauvegarde : dump PostgreSQL après migration restauré dans une base temporaire isolée. Comptages identiques sur les tables contrôlées : 81 formations, 5 cours, 1 attribution, 0 demande qualité et 0 revue après nettoyage des tests. Base temporaire supprimée.

Les rapports détaillés sont livrés dans le dossier `validation-qualite` à côté du dépôt ; ils ne sont pas des preuves de sessions réelles. Les fixtures API et navigateur ont été retirées, les registres restent vierges pour le travail du centre.

## Contrôle documentaire

`node scripts/quality-readiness.cjs` retourne volontairement **préparation incomplète** : 14 domaines de validation restent en attente. Un succès informatique ne rend pas ces validations acquises. Le fichier ne constitue pas un blocage universel de déploiement ; il sert de liste de contrôle documentaire.

## Limites à connaître

- Aucun audit certificateur ni audit RGAA réalisé.
- Aucun programme signé, contrat réel, dossier de formateur, résultat de session, partenariat handicap ou habilitation n’a été fourni ou inventé.
- Aucun email ni relance automatique ; la réponse humaine et la consultation régulière des registres doivent être organisées.
- Les preuves sont référencées dans le registre, sans téléversement de pièces. Conserver les originaux dans un espace sécurisé séparé.
- Les formulaires publics ne vérifient pas l’identité. Tous les administrateurs habilités peuvent consulter le registre ; prévoir un canal distinct pour les dossiers exigeant une séparation supplémentaire.
- Le seul module pédagogique pilote ne constitue pas l’ensemble des cours du catalogue.
- Informations légales, délais, responsables et politique de données encore à confirmer.

Le site d’origine et son dépôt sont conservés ; aucune publication ou modification du site en ligne n’a été réalisée.
