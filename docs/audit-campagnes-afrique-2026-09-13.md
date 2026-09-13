# Audit avant campagnes Afrique — Beyond Expertise

**Date : 13 septembre 2026. Périmètre : site public, dépôt actuel, brochures, parcours commercial et préparation des MBA/DBA.**

**Décision proposée : ne pas lancer maintenant une campagne vendant des « formations diplômantes reconnues » ou un « doctorat reconnu ».** Les pages et les candidatures existent, mais l’identité précise des diplômes et de leurs émetteurs n’est pas vérifiable dans les pièces disponibles. Les conditions commerciales, l’exploitation des leads et la mesure des conversions restent incomplètes. Cette conclusion ne signifie pas qu’aucun accord ou diplôme valide n’existe : les preuves nécessaires à cette affirmation ne sont pas disponibles pour cet audit.

**Aucune fonctionnalité n’a été développée ou modifiée pendant cet audit.** Les fichiers à publier sur GitHub sont uniquement le rapport et ses annexes. Aucun formulaire n’a été envoyé en production ; les essais d’envoi et de suivi ont utilisé la base locale, avec suppression des demandes synthétiques.

## Périmètre, méthode et limites

- Code de référence : arbre de `github/main`, commit `9a2b929523ea537c280f26043e5db3fa7ed260b2`, identique à celui de la version applicative hébergée `deb9e9b`.
- Architecture conservée : Next.js/React, API NestJS, Prisma/PostgreSQL, services conteneurisés sur OVH. Le catalogue exécutif est une source JSON commune aux pages et aux PDF.
- Contrôle public : 31 fiches MBA/DBA et leurs 31 PDF ; 85 fiches de formations courtes et leurs 85 PDF ; pages catalogue, pédagogie, certifications, candidature, contact, légales, qualité et services ; sitemap et navigation.
- Lecture du contenu et extraction des **124 pages des 31 brochures exécutives**. Contrôle visuel des huit pages de deux brochures : MBA Direction générale et DBA Leadership des systèmes de santé. Cette inspection ne vaut ni validation pédagogique de chaque spécialité ni certification d’accessibilité PDF.
- Tests navigateur : recherche, filtres, liens vers les programmes/candidatures, galerie, ressources chargées, stockage et passage de paramètres de campagne. **18 contrôles de largeur** sur six pages à 320, 390 et 768 px ; parcours local également testé à 1440 px.
- Tests locaux existants réutilisés : `scripts/test-executive.cjs` (**89 assertions réussies**) et `scripts/test-executive-ui.cjs` (candidature, administration, studio, 31 pages/PDF, mobile/tablette/ordinateur). Contrôles complémentaires des formulaires commerciaux documentés dans les annexes.
- Lecture de production limitée à la version déployée, aux indicateurs agrégés des cours et à la présence de configurations. Aucun contenu de dossier prospect ni secret n’est publié dans cet audit.
- Limites : pas d’essai d’envoi en production, pas d’appel réel, de message WhatsApp, de rendez-vous réel ou de paiement. Pas de mesure sur téléphones physiques ni sur les réseaux de chaque pays africain. Pas de données réelles de conversion, de statistiques de trafic ou de taux d’abandon. Ce n’est pas un test d’intrusion ni un avis juridique couvrant tous les pays.

**Lecture des statuts :** « EXISTANT ET FONCTIONNEL » décrit la fonction effectivement vérifiée, sans certifier l’offre académique ; « EXISTANT À AMÉLIORER » désigne une base utilisable mais insuffisante pour l’objectif publicitaire ; « ABSENT » concerne le site/dépôt/configuration inspectés ; « NON VÉRIFIABLE » indique qu’une preuve ou un accès métier indispensable manque. L’absence de preuve ne démontre pas l’absence d’un accord privé.

## A. Ce qui existe déjà — à conserver

1. **21 MBA et 10 DBA**, avec des intitulés distincts, des objectifs, des publics, des prérequis, des modules/jalons, des projets et des évaluations. Le catalogue exécutif est distinct des **85 formations courtes** : ces chiffres ne doivent pas être confondus.
2. Les pages [MBA](https://beyond-expertise.com/mba), [DBA](https://beyond-expertise.com/dba), [MBA & DBA](https://beyond-expertise.com/mba-dba), les 31 fiches individuelles et **une brochure PDF par programme**. L’annexe d’inventaire donne chacun des liens.
3. Les pages [pédagogie](https://beyond-expertise.com/mba-dba/pedagogie), [titres et certifications](https://beyond-expertise.com/mba-dba/certifications) et [services aux organisations en Afrique](https://beyond-expertise.com/entreprises/afrique), avec six formes d’accompagnement.
4. Un formulaire exécutif avec trois intentions : candidature, information/entretien, projet d’entreprise. Il enregistre une référence et permet le suivi administratif.
5. Un suivi commercial général pour contacts/devis/demandes d’inscription, et un suivi séparé des candidatures MBA/DBA. **Il faut les prolonger et les rapprocher, pas créer un troisième CRM indépendant.**
6. Un espace d’apprentissage et un studio pédagogique. Les **31 trames exécutives hébergées sont en DRAFT, non publiées : 290 modules et 611 entrées de leçons**. Ces trames ne constituent pas, à elles seules, 12 à 36 mois de cours finalisés.
7. Une identité visuelle cohérente, des composants adaptatifs, des images optimisées, une galerie interactive, une FAQ générale et des pages qualité/assistance/droits. Les images de remise de diplôme sont déclarées illustratives ; elles ne prouvent pas l’existence de promotions Beyond diplômées.

## B. Ce qui fonctionne réellement

| Vérification | Résultat observé | Limite à conserver dans l’interprétation |
|---|---|---|
| 31 pages programme exécutif | HTTP 200, titres présents, pas du message « contenu temporairement indisponible » | Ouverture et contenu public, pas disponibilité contractuelle d’une cohorte |
| 31 brochures exécutives | HTTP 200, signature PDF, empreinte identique au fichier du dépôt ; 4 pages chacune, environ 81–82 kB | Programme proposé ; informations de diplôme, rentrée et prix encore à préciser |
| 85 fiches courtes et leurs PDF | 85 pages et 85 PDF accessibles | Audit détaillé pédagogique centré sur les MBA/DBA |
| Recherche et navigation exécutives | Recherche « santé » : 7 résultats ; passage catalogue → programme → candidature ; programme présélectionné | La source publicitaire n’est pas transportée |
| Galerie | Ouverture et fermeture au clavier vérifiées ; quatre images de galerie | Personnages fictifs, pas de témoignages d’anciens élèves |
| Candidature exécutive locale | Référence, persistance, validation, protection des doublons, droits ADMIN, statut/notes et journal des modifications vérifiés | Envoi production et prise en charge humaine non testés |
| Formulaires contact/devis/inscription locaux | Envoi navigateur, réponse 201, ligne enregistrée et confirmation dans la même page | Demandes commerciales, pas paiements ; données synthétiques supprimées |
| Accès aux dossiers en production | Lecture anonyme de `/api/v1/executive/applications` refusée : 401 | Pas un audit de sécurité exhaustif |
| SEO de base | Titres/canoniques sur les pages exécutives, 31 fiches dans le sitemap, robots public | Référencement réel, indexation et comptes Search Console non vérifiés |
| Mobile | Aucun débordement horizontal sur les 18 combinaisons page/largeur testées ; CTA principal visible sur les premières vues MBA et programme | Ne permet pas d’affirmer « parfaitement adapté » sur tous les appareils |

## Tableau d’audit des 24 éléments

Les références **S01–S24** renvoient à des fichiers et lignes du code dans la section « Sources du dépôt ». L’état détaillé des informations demandées pour chacun des 31 programmes figure juste après ce tableau.

| N° | Élément | Statut | Où / constat | À créer ou améliorer en conservant l’existant | Priorité |
|---|---|---|---|---|---|
| 1 | Présentation et positionnement | EXISTANT À AMÉLIORER | [À propos](https://beyond-expertise.com/a-propos), accueil, pages exécutives ; S01, S02. Positionnement général surtout formation professionnelle B2B/data/IA. | Clarifier le rôle du centre, l’offre exécutive et les publics africains ; publier l’identité juridique vérifiée ; enlever les formulations de prototype. | P0 identité ; P1 éditorial |
| 2 | Page MBA | EXISTANT ET FONCTIONNEL | [/mba](https://beyond-expertise.com/mba), 21 programmes filtrables ; S02, S03. | Conserver ; ajouter conditions validées, réassurance et CTA commerciaux adaptés. | P1 |
| 3 | Page doctorat/DBA | EXISTANT ET FONCTIONNEL | [/dba](https://beyond-expertise.com/dba), 10 axes ; S02, S03. La fonction vérifiée est une page DBA. | Conserver ; ne pas assimiler son existence à une habilitation à délivrer un doctorat national. Publier la nature exacte du titre seulement après preuve. | P0 titre ; P1 conversion |
| 4 | Une page par programme | EXISTANT ET FONCTIONNEL | 31 URL `/mba-dba/{slug}` ; modèle partagé S04 et annexe des programmes. | Enrichir la source commune, sans reconstruire 31 pages à la main. | P1 |
| 5 | Informations complètes par programme | EXISTANT À AMÉLIORER | S04, S05, S06 ; contenus pédagogiques présents, plusieurs conditions différées. | Voir les 20 critères ci-dessous ; diplôme/émetteur/preuves et conditions réelles en premier. | P0 |
| 6 | Brochure PDF par programme/catégorie | EXISTANT À AMÉLIORER | 31 PDF `/programmes-executive/{slug}.pdf`, générateur S07. Téléchargements fonctionnels. | Compléter les informations commerciales et académiques vérifiées ; améliorer la présentation commerciale et remonter le CTA. Aucun besoin de recréer le système PDF. | P0 contenu ; P1 présentation |
| 7 | Landing publicitaire Afrique | ABSENT | `/mba`, `/dba`, `/mba-dba` évoquent déjà l’Afrique ; `/entreprises/afrique` est une page B2B de services, S08. Pas de landing de campagne dédiée avec tunnel et mesure. | Réutiliser les composants pour une page par famille/intention publicitaire, avec programme identifié, conditions, preuves et conversion principale. | P0 |
| 8 | Formulaire de génération de leads | EXISTANT À AMÉLIORER | [/mba-dba/candidature](https://beyond-expertise.com/mba-dba/candidature), `/contact`, `/devis` ; S09, S10. Sauvegarde opérationnelle localement. | Ajouter une version courte « brochure / tarifs / conseiller » ; garder la candidature détaillée pour l’étape suivante ; accusé et affectation à un conseiller. | P0 |
| 9 | WhatsApp Business visible et traçable | ABSENT | Aucun lien `wa.me`/WhatsApp ni événement correspondant dans les pages et ressources inspectées. L’assistant du site est un autre canal. | Numéro Business validé par Beyond, lien/message contextualisé, événement de clic et rapprochement au dossier quand le contact réel est connu. | P1 ; P0 si canal principal des annonces |
| 10 | Demande de rappel | ABSENT | « Demander un entretien » mène à la candidature en mode information ; téléphone facultatif, aucun choix de rappel/créneau. S04, S09. | Ajouter une intention « être rappelé », téléphone avec indicatif, fuseau/disponibilité et tâche dans le suivi existant. | P1 ; P0 si promesse de l’annonce |
| 11 | Prise de rendez-vous en ligne | ABSENT | Pas d’agenda ni de confirmation de réservation. Le statut « Entretien à organiser » n’est pas un rendez-vous pris. S11. | Brancher un agenda réellement tenu, avec fuseaux, disponibilités, confirmation, annulation et retour fiable au CRM. | P1 |
| 12 | Page de confirmation mesurable | ABSENT | Un reçu s’affiche dans la page de candidature, sans changement d’URL ; S09:70. | Créer une confirmation liée à un enregistrement accepté, avec suite utile. Empêcher le comptage d’un simple rechargement ou accès direct comme nouvelle conversion. | P0 |
| 13 | Provenance du prospect | EXISTANT À AMÉLIORER | Pays de résidence et programme enregistrés pour les candidatures ; `Lead.source` vaut notamment `enrollment_form` pour les demandes générales. S10, S12, S13. | Conserver ces données ; ajouter source/medium/campagne/contenu, page d’entrée et pays ciblé distinct du pays déclaré. Aucun de ces champs ne prouve seul un contact attribué à une plateforme. | P0 |
| 14 | Conservation UTM | ABSENT | Test réel `/mba?utm_source=meta…` → fiche → candidature : disparition des paramètres, aucun stockage correspondant. S09, S12. | Attribution initiale et dernière source selon politique validée, persistance limitée, transfert au serveur et traitement des visites directes ; tester mobile/rechargement/liens PDF. | P0 |
| 15 | Suivi prospects / CRM | EXISTANT À AMÉLIORER | `/apprentissage` → « Candidatures MBA & DBA » ; `/admin/commercial` pour autres demandes. S10–S14. | Vue consolidée, propriétaire du lead, échéance, relances, historique des contacts, dédoublonnage et inscription réelle. Le total commercial actuel exclut les candidatures exécutives. | P0 exploitation ; P1 automatisation |
| 16 | GA4, GTM, Meta Pixel/CAPI… | ABSENT | Aucun script/global/appel de ces outils sur huit pages inspectées ; aucune configuration marketing correspondante côté API. S15 confirme leur absence. | Plan de mesure puis GA4 ou alternative choisie ; Pixel si Meta est utilisé. GTM est un moyen de déploiement optionnel. CAPI vient avec déduplication et base légale, pas comme contournement du consentement. | P0 mesure minimale ; P1 CAPI |
| 17 | Événements de conversion | ABSENT | Pas d’événements publicitaires pour les vues/clics/envois/rendez-vous/inscriptions. Les journaux d’apprentissage et d’administration ont une autre finalité. S09, S10. | Mettre en place le dictionnaire d’événements ci-dessous ; déclencher les conversions sur confirmation réelle du serveur, pas uniquement sur clic. | P0 |
| 18 | Consentement et protection des données | EXISTANT À AMÉLIORER | [/confidentialite](https://beyond-expertise.com/confidentialite), `/vos-droits`, liens aux formulaires, session protégée et droits d’accès. S12, S15, S16. | Compléter bases légales, conservation, prestataires et preuves ; minimiser la demande initiale. Installer une gestion des choix avant activation de traceurs soumis à consentement. | P0 |
| 19 | Mentions légales et conditions commerciales | EXISTANT À AMÉLIORER | [/mentions-legales](https://beyond-expertise.com/mentions-legales) existe mais identité à compléter et hébergement décrit comme local ; pas de conditions contractuelles finalisées disponibles. S17, S18. | Informations juridiques exactes et hébergeur, conditions de vente/formation, frais, paiement, annulation/rétractation/médiation selon situation réelle. | P0 |
| 20 | Smartphone | EXISTANT À AMÉLIORER | Mise en page lisible et sans débordement aux largeurs testées ; captures annexées. S02–S04, S09, S19. | Réduire les étapes de qualification à froid, rendre brochures/tarifs accessibles plus tôt, tester clavier et assistant flottant sur appareils réels. | P0 parcours court ; P1 finition |
| 21 | Performance mobile / réseau lent | EXISTANT À AMÉLIORER | Test synthétique détaillé ci-dessous : formulaire ~2,3 s LCP, MBA 2,81–4,22 s. Optimisation d’images et chargement différé présents. | Fixer un budget aux pages d’entrée, mesurer depuis les marchés cibles, réduire JavaScript et vidéo non essentiels. | P0 validation landing ; P1 optimisation générale |
| 22 | CTA cohérents | EXISTANT À AMÉLIORER | Candidature, entretien, brochure et exploration existent, mais objectifs/canaux dispersés ; brochure en fin de fiche mobile. S04, S09. | Harmoniser « Recevoir la brochure », « Demander les tarifs », « Parler à un conseiller », « Candidater », « Prendre rendez-vous » et leur destination réelle. | P0 parcours principal ; P1 harmonisation |
| 23 | Réassurance vérifiable | NON VÉRIFIABLE | Note 4,8/5 du centre sans période/effectif publiés ; logos de références d’interventions ; visuels fictifs ; pas de dossiers probants de diplômés/formateurs engagés pour les cohortes inspectées. S20–S22. | Obtenir autorisations et preuves ; publier biographies confirmées, témoignages datés et contextualisés, statut du diplôme vérifié. Ne pas transformer les scènes IA en preuves de promotions. | P0 allégations ; P1 preuves supplémentaires |
| 24 | FAQ commerciale | EXISTANT À AMÉLIORER | Six questions générales sur l’accueil, composant FAQ réutilisable ; pas de FAQ MBA/DBA répondant précisément au diplôme, à sa reconnaissance et aux paiements. S23. | Adapter le composant aux réponses validées MBA/DBA : diplôme/émetteur, distanciel, admissions, durée, coût, échéancier, matériel, fuseau, accompagnement, annulation. | P1 ; P0 réponses sur le titre |

### Détail du point 5 — applicable aux 31 programmes

Les champs pédagogiques sont présents dans les 31 objets du catalogue et leurs PDF. « Fonctionnel » ci-dessous signifie **visible et renseigné**, pas approbation par l’organisme délivrant un diplôme. L’annexe donne le résultat de contrôle et l’URL de chaque fiche/brochure.

| Information demandée | Statut | Preuve / limite actuelle | Travail nécessaire | Priorité |
|---|---|---|---|---|
| Intitulé | EXISTANT ET FONCTIONNEL | `title`, `kind`, `domain` dans S05 ; titre de chaque fiche/PDF | Conserver ; relier au titre officiel exact si un diplôme est contractualisé | P0 correspondance diplôme |
| Objectifs | EXISTANT ET FONCTIONNEL | `outcomes` pour 31/31 ; productions observables | Visa pédagogique par spécialité et organisme concerné | P1 |
| Programme détaillé | EXISTANT À AMÉLIORER | 10 modules/MBA, 8 jalons/DBA ; sujets et livrables, soit 290 modules/jalons | Ajouter volumes, séquencement, supports complets et validations ; distinguer syllabus et cours prêts à dispenser | P0 pour cohortes annoncées |
| Prérequis | EXISTANT À AMÉLIORER | MBA : Bac+3/3 ans ou Bac+5/1 an ; DBA : niveau Bac+5 à examiner, 5 ans d’expérience, projet et entretien | Valider admission/équivalences avec l’émetteur ; processus pour diplômes étrangers, sans automaticité annoncée | P0 |
| Public cible | EXISTANT ET FONCTIONNEL | `audience` propre à chaque spécialité | Décliner les annonces par métier/besoin, éviter 31 offres simultanées indifférenciées | P1 |
| Durée | EXISTANT À AMÉLIORER | MBA 12 mois ; DBA 24–36 mois, explicitement « cible » | Durée réelle, heures synchrones/autonomes, prolongations et conditions | P0 |
| Modalités 100 % distancielles | EXISTANT À AMÉLIORER | À distance/classes virtuelles annoncées ; S04 prévoit aussi d’éventuelles séquences présentielles sur accord | Confirmer si cours, évaluations et soutenance peuvent tous être suivis à distance ; ne pas annoncer 100 % sans cette décision | P0 |
| Organisation pédagogique | EXISTANT À AMÉLIORER | Autonomie → classe virtuelle → livrable → retour ; S06 | Calendrier, fuseaux, outils, présence, accès/replay, charge et matériel réellement convenus | P0 |
| Accompagnement | EXISTANT À AMÉLIORER | Tutorat/retours et méthode exposés ; noms et disponibilités différés | Responsable, qualifications, volume de suivi, fréquence et délai de réponse ; direction de recherche/jury DBA confirmés | P0 |
| Évaluations | EXISTANT À AMÉLIORER | MBA : cas 40 %, projet 40 %, soutenance 20 %, seuil 70/100 et reprises ; DBA : huit jalons, validations préalables | Faire approuver barème, jury, identité du candidat, rattrapage, litiges et conditions exactes de délivrance | P0 |
| Diplôme délivré | NON VÉRIFIABLE | S05 `credentialNote` reporte le statut du titre à une information écrite ultérieure | Pièce donnant intitulé exact, nature du document, conditions de délivrance et spécimen autorisé | P0 |
| Organisme(s) délivrant le diplôme | NON VÉRIFIABLE | Aucun émetteur précis vérifiable sur les fiches/PDF | Identité légale et rôle de chaque organisme, capacité à délivrer le document, accord couvrant les programmes vendus | P0 |
| Double diplomation | NON VÉRIFIABLE | Accord déclaré dans les échanges, pièces non fournies ; information volontairement non publiée | Conserver cette confidentialité ; aucune promesse commerciale avant validation de deux titres, deux émetteurs, conditions et autorisation d’annonce | P0 si mise en avant |
| Reconnaissance / accréditation | NON VÉRIFIABLE | Aucune preuve programme/émetteur/référence/durée vérifiable identifiée ; aucun RNCP/ECTS/grade revendiqué | Registre officiel ou décision et périmètre exact ; vérifier séparément toute allégation pays par pays | P0 |
| Prix ou demande de tarifs | EXISTANT À AMÉLIORER | « Sur devis » et formulaire information disponibles ; S04 | CTA « Demander les tarifs », réponse réelle, devise, taxes et totalité des frais ; un devis est possible sans afficher un prix fixe | P0 processus tarifaire |
| Paiements | EXISTANT À AMÉLIORER | Employeur/échéancier « peuvent être étudiés » ; aucun échéancier ni moyen de règlement confirmé | Valider acompte, échéances, devise, frais de transfert, modes disponibles par pays, reçus/remboursements ; pas de promesse Mobile Money sans intégration réelle | P0 conditions ; P1 intégration |
| Prochaines dates / rentrées | ABSENT | Aucun calendrier de cohorte confirmé ; S05 `launchNote` | Rentrées réelles, date limite, capacité, fuseaux, conditions d’ouverture/report ; éviter des dates calculées artificiellement | P0 |
| Bouton de candidature | EXISTANT ET FONCTIONNEL | CTA de chaque fiche et lien PDF avec programme présélectionné ; S04, S07, S09 | Conserver ; séparer intention d’information, candidature et inscription effective | P1 |
| Inscription définitive au parcours | ABSENT | Dossier accepté ≠ inscription ; pas de lien automatique exécutif → contrat/paiement/accès cours ; S11, S13 | Workflow traçable après admission et accord contractuel ; validation de paiement si applicable, rattachement cohorte et attribution du cours | P0 processus ; P1 automatisation |
| Préparation réelle des enseignements | EXISTANT À AMÉLIORER | 31 trames privées DRAFT en production, 290 modules, 611 entrées ; S24 | Valider les contenus et intervenants des programmes effectivement ouverts avant de promettre une disponibilité ou encaisser une inscription | P0 |

## C. Ce qui doit être amélioré

### Crédibilité et exactitude commerciale

La présentation des programmes est structurée et prudente. Elle évite actuellement de revendiquer un diplôme national, un grade universitaire, un RNCP ou des ECTS. **Cette prudence ne remplace pas l’identification du document réellement vendu.** Une page « MBA » et une photographie de remise de diplôme ne constituent pas une preuve de diplôme ou d’habilitation.

Les mentions légales indiquent encore « version de travail locale » et « aucun hébergeur public », alors que le site est hébergé. Des formulations comparables restent dans les pages pratiques, la confidentialité et les formulaires. La page qualité affiche 4,8/5 mais précise que période, effectif et périmètre ne sont pas publiés. Les références d’interventions de formateurs ne sont pas équivalentes à des partenariats académiques ou à des clients directs du centre. Il faut documenter ces distinctions avant de les utiliser dans les annonces. La FAQ générale évoque des prochaines dates au même jour du mois suivant ; cette règle indicative ne doit pas être reprise comme une rentrée MBA/DBA confirmée.

Les brochures sont lisibles, compactes et cohérentes avec les fiches. Elles servent de **programmes pédagogiques proposés**, plutôt que de dossiers commerciaux finalisés. Les détails sur titre/émetteur, rentrée, équipe et financement manquent également dans les PDF. Le DBA échantillonné répète sa question de terrain dans la section projet ; la mise en page laisse beaucoup d’espace libre sur sa troisième page. Ces retouches sont P1 après validation des faits.

### Parcours prospect et exploitation

Le même formulaire sert à candidater et à demander un simple renseignement. Il demande notamment qualification, expérience, fonction, motivation et financement ; neuf contrôles HTML sont obligatoires. Sur 390 px, le bouton d’envoi se situe vers 2 397 px du haut de la page. La fiche MBA échantillonnée atteint environ 9 003 px et le catalogue MBA environ 14 429 px. Le catalogue peut rester long ; une arrivée publicitaire doit conduire plus directement à une proposition précise et à une action simple.

Une demande enregistrée ne garantit pas qu’un conseiller la traite : il manque une affectation, une échéance, une alerte opérationnelle et un suivi consolidé. Aucun accusé email automatique n’est prévu actuellement. Le statut exécutif favorable signifie « avis pédagogique favorable ». Il ne vaut ni inscription ni accès aux cours. Le modèle `Enrollment` général concerne le catalogue court ; il ne faut pas y aiguiller les MBA sans rapprochement explicite. Le test local avec un slug MBA via cet ancien formulaire est accepté (201) mais ne rattache aucune formation : le futur tunnel doit éviter cette perte silencieuse de programme.

### Mesure des conversions

Test public effectué avec des paramètres synthétiques, sans envoi :

```text
/mba?utm_source=meta&utm_medium=paid_social&utm_campaign=audit-afrique&...
    → /mba-dba/mba-direction-strategie-croissance
    → /mba-dba/candidature?programme=mba-direction-strategie-croissance
```

Le programme est conservé, **les paramètres UTM et identifiants de campagne sont perdus**. Aucun stockage local/de session ou cookie d’attribution n’a été observé. Aucun appel aux domaines de mesure publicitaire n’a été observé sur huit pages publiques. La source générique `enrollment_form` existante n’identifie ni Meta, ni Google, ni la campagne. L’ajout d’un champ `utm_source` à une candidature par ailleurs valide est rejeté par la validation actuelle (400, test local) : l’évolution doit couvrir aussi le contrat API et le stockage. Le pays de résidence ne permet pas de déduire le pays ciblé par une annonce.

La page de remerciement et la mesure sont deux besoins distincts : créer une URL ne suffit pas à mesurer une conversion fiable. Un lead doit correspondre à un enregistrement réussi, avec identifiant de déduplication ; un clic WhatsApp n’est pas une conversation ; un dossier accepté n’est pas une vente.

### Consentement et données

La version publique inspectée n’intègre pas de traceurs publicitaires ; **l’absence de bannière n’est donc pas, à elle seule, un défaut dans la version actuelle**. En revanche, la politique indique elle-même que bases légales et durées de conservation restent à confirmer et qu’aucune purge métier conforme à une politique validée n’est encore automatisée.

La case exécutive accepte le traitement de la demande et le recontact à ce sujet ; elle n’autorise pas une inscription à une newsletter ni du reciblage. La validation serveur exige cette case, mais `ExecutiveApplication` ne conserve ni version du texte ni preuve spécifique de ce choix. Il faut choisir la base légale adaptée à chaque finalité et conserver les preuves utiles, sans ajouter de cases inutiles à une simple demande précontractuelle.

Turnstile est prévu dans le code, mais non configuré côté API de production au moment du contrôle. Le formulaire exécutif possède un leurre anti-robot et une limitation serveur. Les formulaires généraux n’offrent pas la même protection dans les services inspectés. Harmoniser ces protections avant exposition publicitaire ; tester expiration, erreurs et reprise si Turnstile est activé. HTTPS et plusieurs en-têtes de protection sont présents ; HSTS/CSP n’ont pas été observés dans les réponses échantillonnées. Cela mérite un durcissement mesuré, sans conclure à une vulnérabilité exploitable sur cette seule observation.

### Mobile et performance

Profil synthétique : Chrome, 390 × 844 px, processeur ralenti ×4, réseau configuré à 1,6 Mbit/s descendant, 0,75 Mbit/s montant et 150 ms de latence, cache navigateur désactivé. Deux chargements par page, observation jusqu’à huit secondes après `load`, sans défilement. Ces résultats ne sont ni des scores Lighthouse ni des statistiques de visiteurs africains.

| Page | LCP observé, deux essais | CLS observé | Lecture |
|---|---|---|---|
| MBA | 4,22 s / 2,81 s | 0 / 0 | Variable et au-dessus de la cible 2,5 s ; améliorer/valider la page d’entrée |
| Fiche MBA échantillonnée | 2,52 s / 2,54 s | 0 / 0 | Proche de la cible, marge limitée sur connexions plus lentes |
| Candidature | 2,38 s / 2,30 s | 0 / 0 | Bon résultat dans ce profil ; la longueur du formulaire reste un problème distinct |
| Accueil général | 3,66 s / 4,98 s | 0 / 0 | Éviter d’y envoyer par défaut les campagnes MBA/DBA |

Les ressources terminées des pages exécutives représentent environ 207–245 kB au premier écran mesuré, pas le poids de toute la page après défilement. Les images sont servies par l’optimiseur Next ; les PDF pèsent environ 81–82 kB chacun. L’accueil utilise une vidéo source de **7,43 MB** : le poids total de cette vidéo n’est pas inclus dans le décompte des ressources terminées pendant la courte fenêtre de test. Ne pas présenter ces mesures partielles comme un poids complet de page.

Le LCP vise le contenu principal affiché ; l’INP réel n’est pas établi par ces chargements. Les objectifs de référence sont LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 au 75e percentile des visites, à mesurer ensuite sur le terrain. [Référence Web Vitals](https://web.dev/articles/vitals?hl=fr).

L’interface MBA/DBA est lisible sur les captures inspectées : contraste visuel net, CTA principal visible, labels de candidature et tailles de texte exploitables. À compléter : Safari/iOS et Android réels, zoom/clavier, contrastes mesurés, tailles des cibles secondaires et superposition de l’assistant. Le formulaire générique d’inscription utilise plusieurs placeholders sans labels persistants ; ne pas reprendre ce modèle pour le futur formulaire court.

## D. Ce qui manque

| Ensemble à préparer | Réutilisation prévue |
|---|---|
| Dossier documentaire des titres et conditions par programme réellement ouvert | Enrichir le catalogue commun et le générateur PDF ; registre de preuves avec responsable/date/périmètre |
| Landing de campagne Afrique et formulaire court | Réutiliser la charte, les composants exécutifs et l’API existante ; pas de deuxième site |
| Confirmation fiable, accusé et notification conseiller | Étendre l’enregistrement de demandes, sans confondre réception et admission |
| WhatsApp Business, rappel et agenda | Relier ces canaux au dossier commercial existant et à des disponibilités réellement assurées |
| Attribution UTM et plan d’événements | Étendre le schéma Prisma et les interfaces/API avec migrations additives |
| Mesure d’audience/conversion et choix de consentement | Ajouter seulement les services nécessaires aux canaux publicitaires retenus |
| Inscription exécutive contractualisée et rapprochement paiement/cohorte/cours | S’appuyer sur l’administration et l’espace apprenant existants ; préserver les inscriptions courtes |
| Preuves de réassurance et FAQ MBA/DBA | Réutiliser galerie/FAQ, publier des preuves autorisées et des réponses validées |

### Événements à spécifier avant intégration

| Événement proposé | Déclencheur fiable | Données non directement identifiantes utiles |
|---|---|---|
| `view_programme` | Fiche du programme réellement consultée | programme, famille, page, contexte de campagne autorisé |
| `download_brochure` | Clic vers la brochure, clairement défini comme intention de téléchargement | programme, version PDF, emplacement du CTA |
| `click_whatsapp` / `click_phone` | Action du visiteur ouvrant le canal | programme, placement, campagne autorisée ; ne pas compter comme échange tenu |
| `form_start` | Première saisie volontaire, une fois par tentative | type de formulaire, programme |
| `generate_lead` | Réponse serveur après persistance réussie | identifiant d’événement opaque, programme, intention, attribution autorisée |
| `schedule_appointment` | Réservation confirmée par le système d’agenda | identifiant opaque de réservation, programme, source autorisée |
| `submit_application` | Candidature complète reçue, distincte d’une demande de brochure | identifiant opaque, programme/cohorte |
| `enrollment_confirmed` | Inscription effective selon règles contractuelles validées | programme/cohorte, statut et identifiant de rapprochement |
| `purchase` si pertinent | Paiement effectivement confirmé ; pas le formulaire d’inscription | montant/devise réels, transaction et déduplication, selon règles du prestataire |

Ne pas envoyer nom, email, téléphone, diplôme précédent ou motivation dans les URL, événements GA4 ou `dataLayer`. Les rapprochements publicitaires côté serveur demandent un cadre explicite ; le hachage d’un identifiant n’en fait pas une donnée anonyme. Si Pixel et CAPI sont utilisés ensemble, partager l’identifiant d’événement et tester la déduplication, les retries et le refus/retrait de consentement. Prévoir les états d’échec, pas uniquement le scénario réussi.

## E. Problèmes bloquants avant lancement

| Blocage P0 | Condition de levée vérifiable |
|---|---|
| Nature des diplômes et droit de les commercialiser non établis dans le dossier audité | Pour chaque programme annoncé : titre exact, émetteur identifié, accord applicable, modalités d’évaluation/délivrance et justificatifs des seules reconnaissances revendiquées. Pas de promesse de double diplôme tant qu’elle doit rester confidentielle/non documentée. |
| Identité juridique, hébergeur, conditions commerciales et information données incomplètes | Pages et documents validés sur pièces ; bases légales/durées/destinataires définis ; contenus « copie locale » corrigés. |
| Offre de cohorte non finalisée | Rentrée et charge confirmées, prix/devis opérationnel, frais/échéancier, format réel de soutenance, équipe et contenus disponibles selon le calendrier annoncé. |
| Tunnel commercial interrompu après réception du dossier | Un responsable et un délai de traitement, contact effectif, suivi des entretiens, décision d’admission puis processus d’inscription traçable. L’automatisation complète peut suivre ; la responsabilité humaine doit déjà exister. |
| Attribution/conversion non mesurables | Test de campagne jusqu’au lead enregistré ; source conservée dans le cadre validé, conversion unique, refus des traceurs respecté, rapprochement à l’inscription réelle prévu. |
| Allégations de réassurance sans pièces vérifiables | Justificatifs ou retrait de la mise en avant concernée : note, logos, témoignages, certifications, habilitations, diplômés. Les illustrations restent clairement désignées comme telles. |
| Parcours d’arrivée publicitaire non validé | Landing ciblée, CTA et formulaire court utilisables sur mobile, absence de blocage sous connexion lente, cohérence exacte entre annonce, page et offre. |

Il n’est pas indispensable d’avoir simultanément GA4, GTM, cinq pixels publicitaires, un paiement entièrement automatisé et un CRM externe pour démarrer. **Il est indispensable de disposer d’une offre exacte, d’un contact réellement traité et d’une conversion mesurable avec les choix de confidentialité respectés.** Si la campagne promet WhatsApp, un rappel ou une réservation instantanée, le canal correspondant devient P0.

### Vérifications officielles à utiliser pour les allégations

- En France, le diplôme national de doctorat est préparé dans un établissement accrédité pour le délivrer. Le terme DBA ne suffit pas à établir cette qualité. [Ministère de l’Enseignement supérieur — doctorat](https://www.enseignementsup-recherche.gouv.fr/fr/doctorat-51898).
- Une inscription RNCP doit être rapprochée de la certification exacte et de son certificateur ; aucun numéro correspondant à l’offre Beyond auditée n’a été identifié dans les ressources fournies. [France compétences — RNCP](https://www.francecompetences.fr/glossary/rncp/).
- Qualiopi concerne la qualité des processus de formation ; ce n’est pas une preuve de grade universitaire ou de reconnaissance internationale d’un MBA/DBA. Beyond affiche une démarche en cours, pas une certification acquise. [Ministère du Travail — Qualiopi](https://travail-emploi.gouv.fr/qualiopi-marque-de-certification-qualite-des-prestataires-de-formation).
- Une allégation de reconnaissance CAMES doit correspondre au diplôme et à l’établissement concernés dans les décisions/répertoires pertinents. L’audit ne conclut à aucune reconnaissance CAMES de Beyond. Il faut également examiner les exigences du pays visé et l’usage du titre envisagé. [CAMES — programme de reconnaissance](https://www.lecames.org/programmes/pred/) ; [répertoire officiel](https://www.lecames.org/diplome_cames/web/site/repertoire).
- Les obligations d’identification et d’information commerciale dépendent du statut réel et du public. Vérifier l’identité du centre avant de finaliser les documents. [Service Public — sociétés](https://entreprendre.service-public.gouv.fr/vosdroits/F37351) ; [entrepreneurs individuels](https://entreprendre.service-public.gouv.fr/vosdroits/F31228).
- Les traceurs nécessitant un consentement ne doivent pas être activés avant le choix correspondant ; les seules fonctions strictement nécessaires sont à distinguer. Les durées de conservation doivent être déterminées et mises en œuvre par finalité. [CNIL — cookies et traceurs](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles) ; [durées de conservation](https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees).

Ces sources établissent des cadres de vérification ; **aucune n’est une accréditation de Beyond**. L’accord privé évoqué par le centre n’a pas été publié ni remplacé par une affirmation marketing. Les pays de campagne devront être nommés pour instruire les questions de reconnaissance locale et les conditions commerciales correspondantes.

## F. Plan de développement priorisé — proposition, non exécutée

| Ordre | Priorité | Lot | Réutiliser / livrer | Responsable ou dépendance | Critère de recette |
|---|---|---|---|---|---|
| 1 | P0 | Dossier d’offre et preuves | Sélectionner les programmes réellement ouvrables ; matrice diplôme/émetteur/accord/preuve/pays ; dates, formats, tarifs, intervenants et conditions | Direction Beyond, responsable pédagogique et organismes concernés | Visa documenté par programme annoncé ; aucune allégation sans pièce |
| 2 | P0 | Informations publiques et contrats | Compléter catalogue JSON, fiches, certifications, PDF, mentions et confidentialité ; retirer les formulations de prototype | Pièces du lot 1 et identité juridique vérifiée | Même information dans annonce, fiche, PDF et contrat ; aucune équivalence inventée |
| 3 | P0 | Arrivée publicitaire et lead court | Une landing par intention/famille prioritaire, CTA brochure/tarifs/conseiller, validation et protections serveur, confirmation utile | Proposition commerciale stabilisée | Parcours mobile complet depuis un lien de campagne ; lead enregistré une seule fois, message d’erreur/reprise correct |
| 4 | P0 | Exploitation des leads | Étendre les deux suivis existants : propriétaire, prochaine action, échéance, notifications, vues consolidées, processus d’admission/inscription | Conseillers désignés, horaires et délai de réponse validés | Un lead test arrive au bon conseiller, peut être suivi jusqu’à l’inscription réelle sans perdre son programme |
| 5 | P0 | Consentement, attribution et mesure minimale | Modèle d’attribution, événements, confidentialité/choix, GA4 ou solution retenue, mesure du canal de lancement | Comptes de mesure/annonceur appartenant à Beyond, règles de données validées | Acceptation/refus/retrait testés ; pas de traceur non autorisé ; conversion après succès serveur uniquement ; pas de doublons/PII |
| 6 | P0 | Recette avant budget publicitaire | Régression des 31 fiches/PDF et ancien catalogue ; téléphone réel, connexion lente, formulaires, droits, déduplication, alertes | Lots 1–5 terminés | Tous les blocages E levés ; rapprochement démontré entre lead, dossier et inscription ; aucune session fictive annoncée |
| 7 | P1 | Canaux et conversions | WhatsApp Business, rappel, agenda avec fuseaux ; devenir P0 pour tout canal promis dès les annonces | Numéro et agenda gérés, règles de réactivité | Clic distingué du contact, réservation confirmée et dossier mis à jour |
| 8 | P1 | Réassurance et contenus commerciaux | Bios confirmées, témoignages autorisés, preuves pertinentes, FAQ exécutive, brochure plus commerciale, CTA harmonisés | Éléments factuels et autorisations | Chaque assertion retrouve sa preuve ; FAQ répond aux questions de diplôme/format/coût/admission |
| 9 | P1 | Attribution avancée et performance | CAPI si Meta choisi, remontée contrôlée des conversions hors ligne, déduplication, budget JavaScript/images/vidéo et mesure terrain | Volume/contexte justifiant ces outils | Rapprochement CRM/plateformes explicable ; amélioration du chargement vérifiée |
| 10 | P2 | Optimisations après données réelles | Tests A/B, automatisations avancées, CRM externe si limites démontrées, variantes pays/devises, paiement intégré, suivi cohorte enrichi | Données suffisantes et exploitation stable | Amélioration démontrée de qualification/coût par inscription, sans dégrader les droits ou l’offre |

Les évolutions techniques doivent rester additives : réutiliser les modèles et composants, conserver les routes et dossiers existants, versionner les nouveaux champs et tester la compatibilité. Le choix d’un CRM externe, d’un outil d’agenda ou d’un prestataire de paiement vient après clarification du besoin ; aucun achat ou intégration n’a été engagé ici.

Le tunnel cible pourra alors être suivi ainsi :

```text
PUBLICITÉ → LANDING CIBLÉE → PROGRAMME → LEAD ENREGISTRÉ
→ CONSEILLER / WHATSAPP / APPEL / RENDEZ-VOUS
→ CANDIDATURE → ADMISSION → CONTRAT / PAIEMENT SELON CONDITIONS
→ INSCRIPTION EFFECTIVE → ACCÈS AU PARCOURS
                 ↘ MESURE ET RAPPROCHEMENT DES CONVERSIONS
```

## Sources du dépôt

Les liens ci-dessous pointent vers le code audité, figé avant toute évolution proposée. Les lignes indiquent le début de la zone utile ; les fichiers permettent d’examiner l’ensemble de l’implémentation.

| Référence | Emplacement et preuve |
|---|---|
| S01 | [Présentation du centre](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/app/a-propos/page.tsx#L1) |
| S02 | [Accueil MBA/DBA partagé](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/components/executive-home.tsx#L8) |
| S03 | [Catalogue, filtres et navigation](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/components/executive-catalogue.tsx#L14) |
| S04 | [Fiche programme partagée](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/app/mba-dba/%5Bslug%5D/page.tsx#L1) |
| S05 | [Catalogue exécutif et champs pédagogiques](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/content/executive/catalogue.json#L1), [réserves sur titres/cohortes](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/content/executive/catalogue.json#L3502), [type des programmes](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/lib/executive.ts#L8) |
| S06 | [Pédagogie et accompagnement](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/app/mba-dba/pedagogie/page.tsx#L1), [titres/certifications](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/app/mba-dba/certifications/page.tsx#L1) |
| S07 | [Générateur des brochures existantes](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/scripts/export-executive-pdfs.py#L1) |
| S08 | [Services aux organisations en Afrique](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/app/entreprises/afrique/page.tsx#L1) |
| S09 | [Formulaire exécutif : charge utile et reçu](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/components/executive-application.tsx#L33), [page et paramètres acceptés](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/app/mba-dba/candidature/page.tsx#L1) |
| S10 | [API exécutive : création, protection, liste, suivi](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/api/src/modules/executive/executive.controller.ts#L40), [validation](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/api/src/modules/executive/executive.dto.ts#L14) |
| S11 | [Administration des dossiers exécutifs](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/components/executive-admin.tsx#L1) |
| S12 | [Table ExecutiveApplication](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/prisma/schema.prisma#L666), [Lead et demandes générales](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/prisma/schema.prisma#L250) |
| S13 | [Formulaires généraux](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/components/forms.tsx#L64), [traitement des demandes d’inscription](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/api/src/modules/enrollments/enrollments.service.ts#L50) |
| S14 | [Écran commercial général](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/app/admin/commercial/page.tsx#L1), [total ne comptant que trois sources](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/api/src/modules/commercial/commercial.controller.ts#L12) |
| S15 | [Confidentialité : conservation, traceurs, droits](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/app/confidentialite/page.tsx#L54) |
| S16 | [Turnstile conditionnel](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/api/src/common/turnstile.service.ts#L14), [validation et sécurité API](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/api/src/main.ts#L9) |
| S17 | [Mentions légales à compléter](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/app/mentions-legales/page.tsx#L10) |
| S18 | [Informations pratiques et documents manquants](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/app/informations-pratiques/page.tsx#L1), [financements](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/app/financements/page.tsx#L1) |
| S19 | [En-tête adaptatif](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/components/header.tsx#L105), [vidéo et réduction des mouvements](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/components/hero-media.tsx#L5) |
| S20 | [Qualité et note 4,8/5](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/app/qualite/page.tsx#L58), [bandeau de réassurance](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/components/trust-elements.tsx#L41) |
| S21 | [Références d’interventions](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/components/client-references.tsx#L5) |
| S22 | [Galerie et mention IA](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/components/executive-gallery.tsx#L7), [photos d’illustration](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/components/executive-photo.tsx#L1) |
| S23 | [FAQ générale actuelle](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/lib/data.ts#L71), [composant réutilisable](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/apps/web/components/faq.tsx#L1) |
| S24 | [État et limites des contenus MBA/DBA](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/docs/MBA-DBA-AFRIQUE.md#L17), [registre de preuves qualité à réunir](https://github.com/ucef90/E-learning_Beyond/blob/9a2b929523ea537c280f26043e5db3fa7ed260b2/docs/qualite/registre-preuves.csv#L1) |

## Annexes

- [Inventaire des 31 programmes, liens et contrôles PDF](audit-campagnes-afrique-2026-09-13/programmes.md).
- [Inventaire CSV exploitable](audit-campagnes-afrique-2026-09-13/programmes.csv).
- [Tableau des 24 critères en CSV](audit-campagnes-afrique-2026-09-13/audit-24-criteres.csv).
- [Résultats techniques et captures sélectionnées](audit-campagnes-afrique-2026-09-13/verifications.md).

Les résultats décrivent la version auditée à cette date. La publication de ce rapport sur GitHub ne remplace pas les lots P0 et ne déploie aucune nouvelle fonctionnalité.
