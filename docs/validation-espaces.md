# Révision du design et des espaces de formation

Le site local est accessible sur http://127.0.0.1:3200/. La connexion reste http://127.0.0.1:3200/connexion, avec les mêmes comptes locaux.

## Changements réalisés

- Accueil rapproché du site officiel : fond animé existant, composition sombre, recherche et boutons orange. Pause disponible pour le fond animé ; préférence de réduction des animations respectée. La vidéo décorative reste servie par son hébergeur d’origine, avec fond statique en cas d’indisponibilité.
- Menu public repliable sur petits écrans, fermeture au clavier et catalogue à introduction claire.
- Page de connexion dédiée, sans grand menu commercial, avec affichage facultatif du mot de passe.
- Tableau de bord apprenant : cours attribués, progression de lecture, prochaine leçon, accès direct au TP et au quiz, résultats et retours, ressources regroupées.
- Tableau de bord formateur : apprenants attribués, travaux à corriger, cours accessibles, recherche dans les groupes, suivi individuel et ressources dont les corrigés réservés.
- Compteurs alimentés par les données autorisées du serveur. Aucun cours, apprenant ou travail simulé ajouté pour remplir les écrans.
- Les réponses au quiz restent affichées en cas d’échec d’enregistrement. Le résultat s’ouvre après confirmation du serveur.

## Vérifications réalisées

Compilations API et web réussies. Contrôles de l’API avec cinq comptes de test : refus du visiteur, même liste de cours autorisés, isolation des apprenants et formateurs, concordance des lectures et remises avec le suivi individuel, absence de notebooks, réponses de quiz et secrets dans le tableau de bord. Les comptes sans attribution reçoivent une liste vide.

Dans le navigateur : connexion apprenant puis formateur ; reprise vers la première leçon non lue ; ouverture directe des dix questions du quiz ; accès au suivi de l’apprenant attribué ; téléchargement du notebook de départ ; corrigé verrouillé côté apprenant et accessible côté formateur ; présentation à 1280 px et contrôle sans débordement à 390 px ; recherche Power BI (deux résultats) ; pause du fond animé ; ouverture du menu public puis fermeture avec Échap.

Les comptes actuels n’ont aucune remise en attente. L’écran vide du formateur reflète cet état ; aucun travail fictif n’a été ajouté. Le parcours complet remise/correction possède les vérifications du jalon précédent ; aucune nouvelle note n’a été attribuée durant cette révision.

## Limites conservées

Un seul module pilote dispose de contenus complets. Cette révision ne crée pas les 80 autres cours, l’espace client entreprise, une messagerie ou un éditeur complet de quiz/notebooks pour les formateurs. L’administrateur conserve les fonctions de création textuelle et d’attribution déjà livrées. Aucun déploiement du site officiel ni changement d’hébergement.

## Comment essayer

1. Se connecter comme stagiaire@pilot.invalid, avec le mot de passe du fichier local privé .pilot/accounts.json.
2. Essayer Vue d’ensemble, Mes cours, Travaux et résultats, Ressources.
3. Se déconnecter puis utiliser formateur@pilot.invalid. Essayer Mes groupes, sélectionner Stagiaire pilote, puis consulter les ressources.
4. Pour tester une correction, remettre d’abord un TP depuis le compte apprenant. Il apparaîtra dans Corrections pour le formateur.
