# Recette du pilote — 11 septembre 2026

37 contrôles fonctionnels réussis sur Windows avec Chrome. Les essais ont utilisé uniquement la base synthétique locale. Les scénarios API, droits et laboratoire ont été exécutés sur la version compilée de Next.js ; les derniers ajustements concernent les mentions publiques et le retour en haut du lecteur à son ouverture.

| N° | Contrôle réellement exécuté | Résultat |
|---:|---|---|
| 1 | Mot de passe erroné refusé | Réussi |
| 2 | Accès anonyme et anciens accès démo refusés | Réussi |
| 3 | Connexion réelle, cookie HttpOnly et absence de jeton exposé | Réussi |
| 4 | Création d’un module avec une leçon | Réussi |
| 5 | Duplication et édition du module complet avant attribution | Réussi |
| 6 | Attribution nominative et séparation des formateurs | Réussi |
| 7 | Modification d’une version déjà attribuée refusée | Réussi |
| 8 | Droits serveur : pas de création par un stagiaire ni de liste des comptes | Réussi |
| 9 | Cours consultable, réponses et corrigé réservés non divulgués | Réussi |
| 10 | Progression sauvegardée et reprise après déconnexion | Réussi |
| 11 | IDOR : dossiers, exports et modifications interstagiaires refusés | Réussi |
| 12 | Origine étrangère refusée sur les mutations authentifiées | Réussi |
| 13 | Notebook et CSV protégés et accessibles aux inscrits | Réussi |
| 14 | Sauvegarde notebook persistante et conflit entre appareils détecté | Réussi |
| 15 | Remise persistante et accès aux travaux contrôlé | Réussi |
| 16 | Correction formateur visible par le stagiaire et corrigé débloqué | Réussi |
| 17 | Quiz réellement évalué sur le serveur et feedback conservé | Réussi |
| 18 | Export des preuves datées, statut et limites explicites | Réussi |
| 19 | Invitation et récupération par lien unique, révocation des anciens liens | Réussi |
| 20 | Connexion et consultation dans Chrome | Réussi |
| 21 | Laboratoire réel : Python, pandas, matplotlib et graphique | Réussi |
| 22 | Isolation du laboratoire vis-à-vis des cookies et du DOM | Réussi |
| 23 | Export .ipynb depuis le navigateur | Réussi |
| 24 | Vue mobile 390 px sans débordement horizontal | Réussi |
| 25 | Navigation clavier, labels et focus visible | Réussi |
| 26 | Aucune exception JavaScript sur le parcours navigateur | Réussi |
| 27 | Création et édition d’un module depuis les formulaires administrateur | Réussi |
| 28 | Attribution depuis le formulaire administrateur | Réussi |
| 29 | Consultation et correction depuis l’espace formateur | Réussi |
| 30 | Consultation du feedback et du score dans le lecteur | Réussi |
| 31 | Moteur isolé : DOM parent et réseau métier inaccessibles | Réussi |
| 32 | Remise du notebook depuis le lecteur | Réussi |
| 33 | Import sans exécution puis exécution du notebook de départ | Réussi |
| 34 | Une formation non publiée est inaccessible par son slug | Réussi |
| 35 | Une navigation annulée conserve le notebook non sauvegardé | Réussi |
| 36 | Sauvegarde et réouverture du brouillon dans le lecteur | Réussi |
| 37 | Quiz rempli dans le navigateur et feedback explicatif accessible | Réussi |

## Compilation, ressources et reprise

- API : compilation TypeScript réussie (`tsc -p apps/api/tsconfig.json`).
- Web : build Next.js de production réussi, vérification TypeScript et génération de 24 pages statiques. Les avertissements CSS de compatibilité constatés au premier build ont été corrigés.
- Calcul réel : Python 3.12.7, pandas 2.2.3, matplotlib 3.8.4. Le corrigé produit un graphique, valide ses assertions et réconcilie un montant total de 7 945 euros. Après deux doublons et trois lignes rejetées : 33 ventes analysées.
- Notebook de départ importé puis exécuté sans erreur ; il contient volontairement des étapes à compléter.
- Contrôle des formats 4.4 et des SHA-256 des 14 paquets Python du laboratoire. Le programme de préparation vérifie aussi l'empreinte figée du noyau Pyodide.
- Sauvegarde finale PostgreSQL restaurée dans une base distincte : 44 tables, 389 lignes ; nombres et empreintes de contenu identiques à l'instant du contrôle.
- Contrôle Git : aucun mot de passe local, environnement privé ou corrigé réservé dans les sources préparées.

## Portée et vérifications impossibles

Ces résultats ne constituent pas un audit de sécurité exhaustif ni une certification d'accessibilité. Le test mobile utilise un viewport Chrome de 390 px ; aucun appareil iOS/Safari ou Android physique n'a été testé. Les essais clavier portent sur l'accès au contenu, les labels et le focus, pas sur une campagne complète avec lecteurs d'écran.

Le VPS OVH, la relation dépôt–production, les sauvegardes distantes, le courrier, HTTPS distant, les performances sous charge et le site publié ne sont pas vérifiés. La durée des activités nécessite un test pédagogique humain. Le guide Qualiopi complet et les pièces du certificateur n'ont pas été intégralement accessibles.

## Preuves fournies

Les rapports JSON contiennent les résultats datés : `recette-pilote.json`, `recette-interfaces.json`, `finitions.json`, `restauration.json`, `compilation-et-ressources.json`. Le journal `compilation-web.txt` conserve le build final. Les captures montrent le lecteur, la vue mobile, le calcul, l'administration et la correction.

Les premières exécutions ont révélé un laboratoire qui ne chargeait pas et un débordement du pied de page sur mobile. Le laboratoire est désormais servi depuis une origine locale distincte avec paquets préchargés ; le pied de page se replie sur mobile. Les scénarios concernés ont été réexécutés avec succès. Des sélecteurs de la recette d'interface ont aussi été corrigés avant le résultat final.
