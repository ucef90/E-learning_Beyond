# Beyond Expertise — formations RGPD et AI Act
Livraison locale du 12 septembre 2026. Les deux parcours s’ajoutent aux 81 fiches issues de beyond-expertise.com. Le site officiel et l’ancien projet ne sont pas modifiés.

## Ce qui est disponible
- 2 programmes originaux de 14 h, chacun avec 8 séquences, 8 cas corrigés, 20 questions à réponses expliquées et 5 familles de modèles.
- Supports intégraux consultables et téléchargeables ; contenu intégré au lecteur connecté.
- Comptes de démonstration apprenant et formateur déjà associés aux deux parcours, sans modifier leurs mots de passe.
- Progression déclarative et tentatives de quiz enregistrées. Quiz formatifs à livre ouvert. Dossier et soutenance à apprécier séparément par le formateur ; aucune validation globale ou certification automatique.
- Mise en avant sur l’accueil et page /rgpd-ai-act.
- Décor local sans requête vidéo CloudFront ; pages /transparence-ia et /vos-droits ; notice /confidentialite révisée.
- Export authentifié limité aux données rattachées au compte : profil, attributions, progression, quiz, brouillons et travaux. Les demandes publiques et pièces hors plateforme se demandent au centre.
- Demandes de droits stockées dans le registre privé d’administration avec échéance initiale d’un mois, référence et historique.

## Formation et certification
Le RGPD et l’AI Act sont des règlements. La certification CNIL du processus de formation à la protection des données est volontaire. L’article 4 de l’AI Act n’impose pas de certificat individuel. Une attestation de formation ne devient pas une certification officielle, une certification DPO ou une conformité de l’entreprise. Aucune reconnaissance RNCP/RS ou éligibilité de financement n’est revendiquée pour les nouveaux cours.

Les supports ont été rédigés avec assistance d’IA. Les sources sont institutionnelles et datées ; la validation humaine pédagogique et juridique adaptée au périmètre reste à organiser avant animation. Le centre doit justifier les compétences de ses intervenants et actualiser les sources.

## Essayer
Accueil : http://127.0.0.1:3200/
Offre : http://127.0.0.1:3200/rgpd-ai-act
Lecteur : http://127.0.0.1:3200/apprentissage
Droits : http://127.0.0.1:3200/vos-droits

Dans Mes cours, ouvrir RGPD ou AI Act, lire une séquence, ouvrir son corrigé puis le quiz. Les liens du lecteur donnent accès au support et au carnet. Les identifiants privés existants sont conservés dans .pilot/accounts.json et ne doivent pas être publiés.

Le compte administrateur voit les demandes dans Suivi qualité → demandes → Données personnelles. Une réponse envoyée doit être tracée ; aucun email automatique n’est configuré.

## Reproduire
Avec Node et la configuration locale du projet :
1. node scripts/build-regulatory-content.cjs
2. node --env-file=.env scripts/import-regulatory-courses.cjs
3. Construire et lancer API puis web avec les commandes du projet.
4. node --env-file=.env scripts/test-regulatory.cjs

L’import est réservé à 127.0.0.1 / localhost, port 55432, base beyond_pilot_elearning. Il conserve les cours et acquis existants, ajoute uniquement les deux versions nommées et refuse de remplacer une version ayant un contenu différent. Pour modifier les leçons déjà attribuées, créer une nouvelle version. Les fichiers officiels et leur validateur de couverture à 81 restent distincts.

## Limites de la préparation réglementaire
La conformité globale du centre n’est pas établie. L’identité juridique, l’adresse, les bases légales, les durées, les contrats, les prestataires réellement utilisés et les usages internes d’IA doivent être confirmés. Il n’y a pas de purge automatique des données métier ni d’envoi d’email. Les formulaires enregistrent seulement dans la copie locale. Voir PROCEDURES-CENTRE.md et POINTS-A-VALIDER.json.
