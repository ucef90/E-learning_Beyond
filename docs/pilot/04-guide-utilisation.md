# Utiliser le pilote

## Ouvrir la version locale

Sur cet ordinateur : [connexion au pilote](http://127.0.0.1:3200/connexion). Les comptes synthétiques et leurs mots de passe aléatoires sont dans `.pilot/accounts.json`, fichier local exclu de Git. Aucun compte n’accepte n’importe quel mot de passe. Les adresses de test se terminent par `.invalid` et ne déclenchent aucun envoi de message.

Compte administrateur : `admin@pilot.invalid`. Formateur : `formateur@pilot.invalid`. Stagiaire : `stagiaire@pilot.invalid`. Deux autres comptes servent à tester l’isolation. Conservez le fichier de mots de passe hors des sources publiques et n’utilisez jamais ces comptes de test en production.

## Administrateur

1. Se connecter, puis ouvrir **Administration**.
2. Pour partir du pilote complet, choisir **Dupliquer la version**, puis **Modifier le contenu** sur la copie. Le cours, le quiz et les notebooks sont copiés ; les attributions et les travaux ne le sont pas.
3. Modifier titre, fiche, leçons et durées. Enregistrer le brouillon. **Créer un module** permet également d’écrire un nouveau module de leçons textuelles.
4. Créer un compte stagiaire ou formateur si nécessaire. Transmettre le lien personnel de création de mot de passe par le canal sûr convenu, après vérification du destinataire. L’envoi automatique d’e-mail n’est pas activé.
5. Choisir module, stagiaire, formateur et groupe, puis **Attribuer le module**. L’accès apparaît immédiatement pour les comptes concernés.
6. Une version attribuée est figée. La dupliquer pour préparer des modifications sans réécrire les contenus déjà suivis.

Le constructeur du premier jalon gère une structure de module textuel ; la duplication permet de partir de la chaîne complète du pilote. L’édition graphique des questions de quiz, du notebook de départ et des données n’est pas encore fournie. Ces ressources sont chargées par le seed sécurisé. L’administration complète de tous les médias et évaluations sera étendue au jalon suivant.

## Stagiaire

1. Ouvrir **Mes modules** et choisir **Analyser un fichier de ventes avec Python et pandas**, puis **Ouvrir mon module**. Les autres modules intitulés « recette » ont été créés par les tests et sont conservés comme preuves synthétiques.
2. Lire la fiche et les leçons. **Marquer la leçon comme lue** enregistre la lecture sur le serveur. À la prochaine connexion, le lecteur propose la première leçon restant à lire.
3. Dans **TP**, modifier les cellules Python et les commentaires Markdown. **Tout exécuter** relance les cellules de code dans un contexte de calcul neuf. Lire le code importé avant toute exécution.
4. **Sauvegarder sur le serveur** synchronise le notebook. Un message affiche la version enregistrée ; en cas de conflit, exporter d’abord son travail puis recharger la version la plus récente.
5. **Exporter .ipynb** fournit un fichier local. Un export seul ne remplace pas une sauvegarde serveur. Télécharger `ventes.csv` pour travailler dans Jupyter local.
6. Ajouter un commentaire et choisir **Remettre mon travail**. La remise est une copie datée, distincte du brouillon.
7. Répondre au quiz. Dans **Résultats et retours**, consulter les scores, explications et commentaires du formateur. Le corrigé du TP devient disponible après une correction humaine.

Les tableaux et sorties textuelles sont sauvegardés dans le notebook. Les images des graphiques sont régénérées par les instructions Python. L’interface prévient lors de la fermeture de la page si des modifications n’ont pas été sauvegardées ; sauvegarder ou exporter avant de changer de rubrique dans le lecteur.

## Formateur

Ouvrir **Groupes et corrections**, choisir un stagiaire, puis **Consulter et corriger**. Les cellules et sorties sont lues sans exécution automatique. Utiliser la grille du TP : diagnostic 15, nettoyage 25, calculs 25, graphique 15, interprétation/reproductibilité 20. Enregistrer note et commentaire. Le stagiaire retrouve immédiatement le retour. Le dossier pédagogique exporté concerne seulement le stagiaire autorisé.

## Vidéo ultérieure

Une leçon comporte une adresse vidéo et une transcription facultatives. L’hébergeur HTTPS doit d’abord être autorisé avec `VIDEO_ALLOWED_HOSTS`. L’administration permet ensuite de renseigner la ressource sans changer le code. Le pilote propose une ouverture volontaire de la vidéo chez l’hébergeur ; il ne fournit pas encore un service d’hébergement ou un lecteur vidéo privé complet. Ne pas retirer le contenu textuel indispensable.

## Récupération d’accès

L’administrateur génère un lien valable une heure ; il invalide les liens antérieurs. Le destinataire définit son nouveau mot de passe. Le lien devient inutilisable et les anciennes sessions du compte sont révoquées. Pour une exploitation réelle, compléter la vérification d’identité et le service de messagerie avant automatisation.

Une confirmation protège les modifications non sauvegardées du notebook lors des changements de rubrique. Annulez la navigation pour sauvegarder ou exporter. Fermer la page déclenche aussi un avertissement du navigateur.
