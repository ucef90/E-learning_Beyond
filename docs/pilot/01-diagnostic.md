> Diagnostic historique du premier pilote. Domaine officiel confirmé depuis : **beyond-expertise.com**. Consulter `../catalogue-officiel.md` pour le nouvel inventaire et le dépôt indépendant.

# Diagnostic du premier jalon

Examen du 11 septembre 2026. Référence : cahier des charges initial et consigne du module pilote. Aucune intervention sur le site en production.

## Accès et traçabilité

| Élément | Conclusion et preuve |
|---|---|
| Dépôt | Confirmé : GitHub retourne `ucef90/Site-BeyondExpertise-2026`, public, propriétaire `ucef90`, droits admin/maintain/pull/push. |
| Révision de départ | `fb8b5c896172d8e77532f6dc5dd67ce22130c0dd`, commit du 5 juin 2026, branche distante par défaut `main`. |
| Copie de travail | Clone neuf, initialement propre, branche locale `feat/pilote-python-pandas`. Aucun fichier d’un autre projet écrasé. |
| Site public | Non vérifié : ouverture Web refusée par l’outil ; tentative HTTPS locale refusée. Ces échecs d’accès ne prouvent pas une panne du site. |
| Lien dépôt–production | **Non vérifiable** : aucune révision déployée, configuration d’hébergement ou preuve de déploiement disponible. |
| Domaine, données et médias distants | Propriété et configuration non vérifiées. Les sources Git ne prouvent pas qu’ils sont tous présents dans le dépôt. |
| VPS OVH | Aucun accès SSH/OVH établi ; système, CPU, RAM, disque, sauvegardes et services non mesurés. Alias ou moyen d’accès demandé sans secret dans la conversation. |
| Préproduction livrée | Locale, sur cet ordinateur, liée à une base PostgreSQL distincte `beyond_pilot`, hors production. |

## Problèmes prioritaires

| Priorité | Constat initial et preuve | Correction du pilote | Validation |
|---|---|---|---|
| P0 | `auth.service.ts` signait des jetons pour `demo-user` sans vérifier le mot de passe | Comptes persistants, scrypt, sessions opaques en base, cookie HttpOnly, expiration et révocation | Mot de passe faux refusé ; reconnexion et déconnexion testées |
| P0 | GET contacts/devis/inscriptions et modifications de statut sans garde | Refus par défaut ; rôle ADMIN sur les routes commerciales ; POST de demande commerciale reste public | Accès anonyme/stagiaire refusé |
| P0 | Fiche de formation accessible par slug sans vérifier `isPublished` | Filtre de publication et vraie réponse 404 | Création d’une fiche non publiée et appel par slug : 404 vérifié |
| P1 | `courses.service.ts` et `users.service.ts` renvoyaient des objets simulés | Identité réelle, cours attribués, droits par ressource et formateur | Dossiers, exports et remises interstagiaires refusés |
| P1 | Pages apprenant/formateur et connexion de présentation | Espace fonctionnel commun, actions selon rôle, lecteur, administration et correction | Recettes API et navigateur |
| P1 | Catalogue de secours dans `apps/web/lib/api.ts` masquant une panne | Suppression des retours fictifs ; erreur explicite de chargement | API indisponible ne doit pas afficher un catalogue de démonstration |
| P1 | Accueil, À propos et pied de page affirmaient Qualiopi acquis, CPF et chiffres sans pièces | Formulation « démarche en cours, certification non acquise », suppression des badges et statistiques non justifiés | Recherche des occurrences ; contrôle visuel |
| P1 | Notebook, remises et résultats absents | Python navigateur sur origine distincte ; brouillons versionnés, copies de remise, feedback et traces PostgreSQL | Exécution réelle, persistance et conflit de sauvegarde testés |
| P2 | README contredisait les formulaires et l’interface commerciale présents | Documentation actualisée ; correction de la remise à zéro des formulaires après requête asynchrone | Compilation et consultation des parcours |

## Catalogue et limites de l’audit

L’import PLB contient bien **24 fiches et trois catégories**, extraction du **20 avril 2026 à 14:40:25 UTC**. Ce chiffre ne représente pas le catalogue actif de production. Aucun import PLB n’a été exécuté dans la base du pilote. Le module Python et son jeu de données sont originaux ; les droits des textes PLB restent à vérifier avant réutilisation commerciale.

Les migrations existantes ont été conservées ; une migration additive introduit les sessions, attributions, brouillons, remises et traces du pilote. Aucune suppression de données de production n’a été réalisée. La page `/espace` présentait des informations simulées : elle mène maintenant à l’espace réel ; les formulaires de demandes commerciales et leur administration sont conservés.

L’audit SEO complet, les formulaires et données **en production**, l’international, les licences pédagogiques et la capacité réelle du VPS appartiennent aux étapes suivantes. La présence de l’interface de vente n’équivaut pas à une offre e-learning validée et prête à être commercialisée.
