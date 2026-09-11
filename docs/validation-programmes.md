# Validation de la livraison des programmes

- 81 programmes, 420 séquences, 420 ateliers distincts et 81 évaluations prévues.
- 81 réponses de détail API comparées au JSON source ; 81 pages HTML contenant toutes les séquences et tous les ateliers ; 81 téléchargements Markdown identiques aux fichiers générés.
- Sommes des durées vérifiées pour chaque journée et chaque programme. Cas fil rouge distincts et critères d'évaluation présents sur toutes les fiches.
- Catalogue limité aux résumés des programmes ; un seul module pilote publié conservé. Aucun corps de leçon réservé dans les aperçus publics.
- Empreintes des comptes, cours, leçons, quiz, inscriptions, notebooks et remises identiques avant et après les imports. Identifiants des 81 formations conservés. Import rejoué sans doublon.
- Compilation NestJS réussie. Compilation Next.js de production et vérification TypeScript réussies après le dernier changement d'interface.
- Contrôle navigateur du programme Python, d'une fiche IA Act au titre long et du filtre SQL. Accès aux journées et à l'évaluation vérifié. Références ouvertes au clavier avec Entrée.
- Affichage observé à 1280 × 900, dans le panneau de 663 px et à 390 × 844. Aucun débordement horizontal sur les fiches contrôlées. En-tête compact sur les pages de programme, statique sur mobile.
- Correction de 17 apostrophes échappées provenant du relevé officiel, sans modifier le fichier brut de ce relevé.

Le premier contrôle de la fiche Python a reçu un ancien résultat mis en cache avant l'import. Après le renouvellement du cache de données de Next.js (30 secondes), les deux recettes complètes suivantes ont réussi. Les éditions de données peuvent nécessiter ce délai puis un rafraîchissement.

La validation porte sur la couverture et l'intégration des programmes, pas sur l'exécution de 420 ateliers : leurs supports doivent encore être réalisés et la progression doit être revue par les formateurs avant animation. Les parcours complets ne sont pas déclarés disponibles dans le LMS. Aucun hébergement ni changement du site officiel n'a été effectué.
