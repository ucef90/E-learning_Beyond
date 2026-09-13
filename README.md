# Beyond Expertise — plateforme de formation

Version de travail du 13 septembre 2026 : 83 fiches publiques, un studio de cours avec modules, leçons, quiz et ressources privées, espaces administrateur/formateur/apprenant et trois nouveaux parcours rédigés en brouillon. Les contenus doivent être relus par un responsable humain avant publication.

La copie actuelle vient de c8f1882 du dépôt local E-learning_Beyond ; branche codex/plateforme-complete, poussée sur https://github.com/ucef90/E-learning_Beyond (demande de fusion no 1). Le remote github cible ce dépôt ; origin conserve la copie locale d'origine. Le site beyond-expertise.com et le VPS vps-60dc9315.vps.ovh.net résolvent vers 164.132.41.177. L'accès SSH est rétabli ; la version Docker est en préparation sur une base restaurée isolée. Consulter docs/EXPLOITATION-OVH.txt pour l'état réel du déploiement.

## Ouvrir la copie de travail

Sur ce PC, lancer Demarrer-plateforme.ps1 si nécessaire (PostgreSQL doit être actif). Site http://127.0.0.1:3300/apprentissage, API http://127.0.0.1:4300/api/v1, laboratoire http://127.0.0.1:3301. Base isolée beyond_platform_work sur PostgreSQL local 55432. La précédente version 3200/4200/3201 conserve sa base et ses fichiers.

Les comptes synthétiques sont dans .pilot/accounts.json, fichier privé ignoré par Git. L'administrateur retrouve les trois parcours dans **Contenus pédagogiques**. Ils ne sont ni publiés ni attribués : leur édition reste possible. L'administrateur peut ouvrir un cours depuis son tableau de bord pour le consulter.

## Fonctions livrées

- Édition de modules, leçons, quiz à réponses expliquées, seuils propres, vidéos HTTPS autorisées avec transcription, fichiers privés et corrigés.
- Relecture tracée, validation administrateur, publication distincte et duplication obligatoire des versions publiées ou attribuées.
- Comptes réels et invitations, connexion, lien de récupération à usage unique remis par l'administrateur après vérification d'identité ; l'envoi automatique de courriels reste à raccorder.
- Attributions par formateur et groupe, positionnement, expiration/révocation, progression et sauvegarde des notebooks avec contrôle de révision.
- Remise de notebook ou dossier écrit, feedback humain, critères calculés pour tous les quiz et le travail, relevé pédagogique imprimable.
- Métadonnées de fiches, sitemap conditionnel et exclusion d'indexation de la préproduction et des espaces privés.
- Modèles OVH, contrôle de configuration, refus des comptes de recette en production, sauvegarde et recette de restauration.

## Installation et vérifications

Prévoir Node 24, pnpm 11.19, PostgreSQL compatible avec Prisma 6 et Python pour installer le laboratoire figé. Installer avec pnpm install --frozen-lockfile, générer Prisma, appliquer les migrations sur une base dédiée et compiler les deux applications. python scripts/setup-lab.py télécharge Pyodide 0.27.7 et ses bibliothèques vérifiées, dont SQLite. Les variables sont décrites dans .env.example.

Les scripts platform:test, platform:test:ui, platform:test:notebooks, platform:test:backup et platform:test:load ciblent exclusivement la copie locale et utilisent les comptes synthétiques. Ils créent des données de recette. Ne pas les lancer contre une base réelle. Les rapports détaillés sont dans work/validation/ ; le bilan daté se trouve dans [le suivi](docs/SUIVI-PLATEFORME.txt).

## Contenus et secrets

Le dépôt historique est public. Les sources pédagogiques avec réponses et corrigés dans content/parcours/*, .pilot/, .private/, les variables et les ressources privées historiques sont ignorées par Git. Les cours importés et pièces privées font partie de la sauvegarde PostgreSQL ; un lot ZIP local conserve aussi les nouvelles sources. Ne pas pousser ces fichiers sur un dépôt public.

Les 83 programmes publics restent des programmes commerciaux proposés à la validation ; seuls les cours explicitement approuvés peuvent être affichés comme disponibles. Les téléchargements visiteurs utilisent des PDF, sans fichier Markdown. Les nouveaux parcours ont des durées estimées de 12 h, 12 h et 9 h 30, à étalonner ; ils ne constituent pas une certification.

## Exploitation et décisions restantes

Consulter [le guide](docs/GUIDE-PLATEFORME.txt), [l'exploitation](docs/EXPLOITATION-OVH.txt) et [l'étude et le budget](docs/etude-marche-budget.html). Le déploiement OVH utilise Docker et le proxy Caddy existant ; les anciens modèles systemd/Nginx restent une alternative non installée. La sauvegarde hors serveur et le service de courriel restent à configurer. Aucun abonnement souscrit.

Qualiopi reste en cours, non acquise. Les informations légales, conditions commerciales, conservation et pièces qualité nécessitant validation humaine restent suivies dans docs/qualite/DECISIONS-CENTRE.json. La publication commerciale et le basculement du site public exigent une validation portant sur la version testée.
