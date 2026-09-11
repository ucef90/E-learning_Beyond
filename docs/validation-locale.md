# Validation de la version locale E-learning_Beyond

Vérifications du 11 septembre 2026, sur la base dédiée beyond_pilot_elearning et les ports 3200/4200/3201.

- TypeScript : API et interface sans erreur.
- Compilation finale Nest et Next réussie. Next produit les 24 pages statiques prévues, avec catalogue et fiches servis dynamiquement.
- 21 contrôles API : authentification, cookie HttpOnly, droits et refus interstagiaires, création/duplication/attribution, progression, brouillon et conflit de versions, remise, correction, quiz, exports, récupération, catalogue de 81 fiches et ressource atelier protégée.
- Pyodide 0.27.7 : Python 3.12.7, pandas 2.2.3, matplotlib 3.8.4. Atelier : quatre ventes valides et total de 40 euros. Corrigé du TP : 33 ventes valides et total de 7 945 euros. Les quantités fractionnaires, nulles et absentes sont rejetées. Un graphique produit par chaque carnet.
- Navigateur intégré : connexion avec compte synthétique, ouverture du module enrichi, correction dépliée avec Entrée, exécution réelle de l’atelier et affichage du graphique.
- Export vérifié sur disque : notebook v4 de 26 cellules, avec une sortie d’exécution. Le signal de téléchargement du navigateur n’a pas été remonté par l’outil ; le fichier effectivement téléchargé a été contrôlé.
- Catalogue : recherche Python (quatre résultats), filtre avec module pilote (un résultat), cas sans résultat, réinitialisation (81 fiches).
- Mobile 390 × 844 : aucun débordement horizontal sur le catalogue et le lecteur. L’en-tête du lecteur a été réduit à 136 pixels et cesse de masquer le contenu pendant le défilement. Dimensions du navigateur rétablies après le contrôle.

Les captures ont été inspectées pendant la recette. Les preuves structurées sont dans le dossier voisin validation-elearning : recette-pilote.json et execution-contenus.json.

Le nouveau cookie be_elearning_session est distinct de celui de l’ancien pilote. Les données et services de l’ancien projet ne sont pas modifiés.

## Limites

Il s’agit d’une recette ciblée, pas d’un audit d’accessibilité ou de sécurité exhaustif. La durée de deux heures n’a pas été mesurée avec des apprenants. Les 80 autres cours et le reste du parcours Python de trois jours sont à produire.

Sur ce poste, le lanceur pnpm run build a demandé une réinstallation du dossier modules et a été interrompu faute de terminal interactif. Les compilations ont été exécutées avec succès directement via les commandes Nest et Next indiquées ci-dessous, sans modifier l’installation Python système ni purger les dépendances.

Depuis apps/api : node node_modules/@nestjs/cli/bin/nest.js build

Depuis apps/web : node node_modules/next/dist/bin/next build

La bibliothèque pandas du Python système présente une incompatibilité binaire avec NumPy. Les contenus ont donc été vérifiés avec le moteur Pyodide figé réellement utilisé par le site, sans modifier ce Python système.

Aucune mise en ligne, dépense, modification du VPS ni écriture sur le site officiel n’a été réalisée.
