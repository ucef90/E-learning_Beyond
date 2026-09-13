# MBA, DBA et accompagnement Afrique

La plateforme propose 21 parcours MBA, 10 axes DBA et six services pour les organisations. Les programmes publics sont originaux ; les titres, objectifs, modules, cas et livrables sont définis dans `content/executive/catalogue.json`.

## Parcours utilisateur

- `/mba-dba`, `/mba`, `/dba` : recherche, spécialités et accès aux 31 fiches.
- `/mba-dba/[slug]` : objectifs, admission, rythme cible, modules, évaluations, projet final et brochure PDF.
- `/mba-dba/pedagogie` et `/mba-dba/certifications` : organisation proposée et information sur la nature des titres.
- `/entreprises/afrique` : conseil, transformation des opérations, direction de mission, académies internes, recherche appliquée et formats courts.
- `/mba-dba/candidature` : candidature, entretien d’information ou demande pour une organisation, enregistrés en base avec une référence.
- Espace administrateur, « Candidatures MBA & DBA » : dossiers paginés, statut, notes internes, contrôle des modifications concurrentes et journal d’audit.

La candidature ne crée ni paiement, ni inscription définitive, ni attribution de cours. Aucun email automatique n’est annoncé ou envoyé par cette fonction. Les dossiers sont réservés aux administrateurs.

## Contenu pédagogique

Les 31 brochures PDF sont générées à partir du même catalogue, sans recopier les supports d’un autre établissement. Le script `scripts/export-executive-pdfs.py` utilise ReportLab, pypdf et les polices Arial du répertoire défini par `BEYOND_PDF_FONT_DIR` (par défaut, les polices Windows).

`scripts/import-executive-courses.cjs` ajoute les 31 trames au studio privé : 290 modules et 611 entrées de leçons comprenant des consignes, exercices et grilles de travail. Il préserve tous les cours déjà présents, y compris les cours portant le même slug. Il peut être relancé sans doublons.

Ces trames restent en **DRAFT**, non publiées, sans certificat activé. Elles doivent être complétées par les formateurs avec les supports détaillés, les séances, les corrections et la validation pédagogique avant attribution aux apprenants. Elles ne représentent pas à elles seules 12 à 36 mois de cours prêts à dispenser.

Les rythmes, calendriers, équipes et tarifs sont proposés ou à confirmer par cohorte. Aucun partenaire, double diplôme, grade universitaire, RNCP, ECTS ou accréditation non documentée n’est affiché. Le statut de centre de formation ne suffit pas à établir l’habilitation à délivrer un diplôme national.

## Installation et déploiement

1. Sauvegarder et vérifier la restauration de la base existante et des configurations privées.
2. Construire l’image avec `deploy/ovh/Dockerfile` depuis le commit choisi.
3. Sur une copie de la base, lancer `prisma migrate deploy`, puis `node scripts/import-executive-courses.cjs`, et vérifier les nouveaux dossiers et les cours privés.
4. Sur la base de production sauvegardée, appliquer la migration additive `20260913150000_executive_applications` et lancer le même import.
5. Mettre à jour `BEYOND_IMAGE` dans la configuration privée de Compose, puis recréer les services API, web et laboratoire. Les routes du proxy restent identiques.
6. Vérifier les pages, brochures, accès administrateur, anciens parcours et sauvegarder la version déployée.

La migration ajoute une table et ne réécrit aucune donnée existante. L’ancienne image reste compatible avec la nouvelle table en cas de retour à la version précédente. Les secrets et les sauvegardes ne doivent pas entrer dans le dépôt public.

## Vérification locale

Avec les serveurs locaux 3300/4300 et la base de travail démarrés :

```sh
node --env-file=.env scripts/test-executive.cjs
node --env-file=.env scripts/test-executive-ui.cjs
```

Les deux scripts sont limités à la base locale `beyond_platform_work`. Ils créent puis suppriment leurs seules candidatures synthétiques. Le contrôle API couvre notamment les permissions, les données invalides, la protection d’origine, l’idempotence et les conflits de révision. Le contrôle navigateur couvre les 31 pages et PDF, le formulaire, l’administration, le studio, et les largeurs 1440, 768 et 390 pixels.
