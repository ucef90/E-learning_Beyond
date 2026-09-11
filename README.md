# E-learning Beyond Expertise

Projet indépendant, préparé localement avant hébergement. Catalogue de 81 fiches vérifiées sur [beyond-expertise.com](https://beyond-expertise.com), et module Python/pandas enrichi : six leçons, atelier guidé de 26 cellules, TP et quiz de dix questions. Les autres cours restent à produire ; leur disponibilité est indiquée explicitement.

Dépôt : `ucef90/E-learning_Beyond`. Base technique issue du pilote local de `ucef90/Site-BeyondExpertise-2026`, commit `bf7c7c3ffed8d1406cc97cec585b729e7c0ce6c6`. Le nouveau projet possède sa base et ses ports. L’ancien pilote et le site officiel restent inchangés. Aucun déploiement effectué.

Sur le PC de livraison : lancer `../Demarrer-E-learning.ps1`, puis ouvrir http://127.0.0.1:3200/formations. Comptes privés dans `.pilot/accounts.json`. Le compte `stagiaire@pilot.invalid` possède le module enrichi. Consulter `docs/catalogue-officiel.md` et `docs/validation-locale.md` pour cette livraison ; les documents du premier pilote restent des références historiques.

## Dossier de livraison

- [Diagnostic](docs/pilot/01-diagnostic.md)
- [Architecture et budget](docs/pilot/02-architecture-budget.md)
- [Qualité et preuves](docs/pilot/03-qualite-pilote.md)
- [Guide utilisateur](docs/pilot/04-guide-utilisation.md)
- [Installation et reprise](docs/pilot/05-exploitation-reprise.md)
- [Livraisons suivantes et parcours](docs/pilot/06-livraisons-suivantes.md)
- [Six leçons et TP](content/pilot/COURS.md), [données](content/pilot/DONNEES.md), [notebook de départ](content/pilot/depart.ipynb)

## Installation

Next.js 15 / React 19, NestJS 11, Prisma 6 et PostgreSQL. Versions testées : Node 24.19.0, pnpm 11.19.0, PostgreSQL 15.5. Utiliser `pnpm-lock.yaml` ; l'ancien `package-lock.json` ne décrit pas la procédure du workspace.

1. `pnpm install --frozen-lockfile`.
2. Adapter `.env.example` en `.env`, `apps/api/.env` et `apps/web/.env.local` avec des secrets privés et une base dédiée.
3. `pnpm db:generate` puis `pnpm db:deploy`.
4. `python scripts/setup-lab.py` prépare les actifs Pyodide figés et vérifie les empreintes des paquets.
5. Utiliser une base locale distincte nommée `beyond_pilot_elearning`. Définir `LOCAL_CATALOGUE_IMPORT=true`, puis lancer `pnpm catalog:official:import` pour importer les 81 fiches sans créer de sessions commerciales.
6. Obtenir le lot pédagogique privé, dont `content/pilot/pilot.json`. Définir `PILOT_SEED=true`, puis `pnpm pilot:seed`. Si `tsx` échoue sur Windows, compiler avec `node node_modules/typescript/bin/tsc scripts/seed-pilot.ts --outDir .pilot/compiled --module commonjs --target es2022 --esModuleInterop --skipLibCheck --moduleResolution node`, puis exécuter `node --env-file=.env .pilot/compiled/scripts/seed-pilot.js`.
7. Exécuter `node --env-file=.env scripts/prepare-local-demo.cjs` pour rattacher le pilote à la fiche Python et l’attribuer au stagiaire synthétique.
8. Démarrer séparément l'API, Next sur le port 3200 et le laboratoire. Pour la compilation : `pnpm build`. Les variables de `.env.example` documentent les trois services.

Application sur `http://127.0.0.1:3200/connexion`, API sur 4200, laboratoire sur 3201. L’ancien pilote reste sur 3100/4100/3101. Un accès externe nécessite HTTPS, `COOKIE_SECURE=true`, une origine dédiée au laboratoire et une préproduction privée. Ne pas exposer PostgreSQL ou l'API directement.

Le Docker Compose historique est facultatif et conserve son volume et sa base `beyond_expertise`. Son port est limité à l'interface locale et un mot de passe est requis. Cette variable ne renouvelle pas le mot de passe d'un volume déjà initialisé. Le pilote livré utilise une autre instance PostgreSQL sur 55432 ; aucun volume existant n'a été modifié.

## Comptes et contenus privés

Le seed crée des comptes synthétiques à mots de passe aléatoires dans `.pilot/accounts.json`, ignoré par Git. Ne pas les utiliser en production. L'administrateur crée les comptes avec un lien personnel à usage unique ; aucun courriel automatique n'est activé.

Le dépôt GitHub est public. `pilot.json`, le corrigé et les secrets restent dans le lot local privé : ne pas les ajouter au dépôt public. Aucun import PLB n'a été exécuté. Les ressources du module sont originales et les ventes sont synthétiques.

## Contrôles

`pnpm typecheck` et `pnpm build` contrôlent les applications. Avec les services et comptes synthétiques préparés, `pnpm pilot:test` lance la recette API/navigateur ; `node scripts/test-interfaces.cjs` contrôle les formulaires et le parcours formateur. Chrome doit être installé. Les tests créent des modules et comptes synthétiques : ne jamais les exécuter contre un environnement réel.

Les résultats de cette livraison sont dans `../validation-elearning`. Définir `PILOT_API_ONLY=true` pour exécuter uniquement la recette API. L’atelier et le corrigé sont également vérifiés dans le moteur Pyodide figé.

## Périmètre

Six leçons, un TP, dix questions, données et corrigé commenté. Les deux heures restent une cible à valider avec des stagiaires. L'administration crée des contenus textuels, duplique le pilote complet, modifie ses leçons et sa fiche, puis l'attribue. L'édition graphique des questions et fichiers pédagogiques est prévue au jalon suivant ; ces ressources sont gérées dans le lot pédagogique privé.

Les lectures sont déclaratives et le TP reçoit une correction humaine. Qualiopi est en cours et non acquise. Procédures humaines, pièces du certificateur et mentions légales définitives restent à fournir. Aucun certificat professionnel ni financement n'est promis.
