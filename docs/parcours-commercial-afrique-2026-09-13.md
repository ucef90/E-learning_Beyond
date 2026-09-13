# Parcours commercial Afrique — livraison du 13 septembre 2026

Cette livraison complète l’audit daté du même jour, sans remplacer ses observations historiques. Elle conserve Next.js, NestJS, PostgreSQL/Prisma, le catalogue et l’administration existants.

## Ce qui est livré

- Page de campagne `/afrique` : sélection de quatre parcours, comparaison, FAQ, demande courte et liens vers les 31 fiches.
- Sélection initiale : MBA Direction générale/stratégie, Direction de projets, Transformation digitale/IA ; DBA Innovation/IA. C’est une hypothèse commerciale fondée sur les expertises Beyond, à comparer ensuite aux résultats réels des campagnes.
- Formulaire : brochure, tarifs, conseil, rappel/rendez-vous à convenir. Programme, identité, email, pays ; téléphone exigé pour un rappel. Contact expressément demandé, sans newsletter.
- Confirmation `/mba-dba/merci` : reçu vérifié auprès de l’API, référence, PDF, appel, candidature. L’ouverture directe sans reçu ne simule pas une conversion. Pas d’email automatique.
- Liens brochure/tarifs/conseiller sur les 31 fiches ; 31 PDF actualisés avec l’identification du centre et les liens commerciaux.
- CRM dans `/admin/commercial` : prospects, origine initiale/dernière campagne, notes, prise en charge, échéance, rendez-vous confirmé, candidature liée, inscription confirmée. Notifications internes aux administrateurs à réception d’un prospect.
- Une inscription nécessite une confirmation explicite et une référence de contrat/dossier. Elle n’effectue aucun paiement et ne crée pas d’accès pédagogique ; ceux-ci restent gérés dans l’administration des cours.
- Origines UTM conservées après consentement, mesure interne, raccordements GA4 et Meta Pixel configurables.
- Mentions légales, confidentialité, conditions de demande/admission et suppression des passages publics parlant d’une copie locale.
- Correction : une demande d’inscription générique avec un identifiant de formation inconnu est refusée, au lieu de perdre silencieusement le programme. Les MBA/DBA utilisent leur candidature dédiée.

## Utilisation par l’équipe commerciale

1. Ouvrir `/admin/commercial` avec un compte administrateur et consulter les nouvelles demandes.
2. Sélectionner le dossier, lire la demande, contacter le prospect suivant sa demande et noter la prochaine action.
3. Après accord avec le prospect, enregistrer la date du rendez-vous. Ce statut ne réserve pas automatiquement un agenda.
4. Étudier la candidature dans l’administration pédagogique. Les candidatures venant du reçu sont liées au prospect si la référence, le programme et l’email correspondent.
5. Après admission et formalisation effective du contrat, passer le prospect en « Inscription confirmée » avec la référence correspondante. Activer séparément les accès aux cours appropriés.
6. Consulter « Mesure et provenance » pour suivre les campagnes et les actions en retard. Les formulaires reçus sont des demandes, pas des personnes uniques ni des ventes.

## Mesure et consentement

| Élément               | Fonctionnement                                                                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Paramètres conservés  | utm_source, utm_medium, utm_campaign, utm_content, utm_term, utm_country ; page d’arrivée sans paramètres ; domaine référent                                                                                                    |
| Attribution           | Première et dernière origine, stockage navigateur 30 jours uniquement après consentement statistiques ; rattachement à la demande envoyée                                                                                       |
| Statistiques internes | page_view, view_programme, form_start, download_brochure, click_phone, click_whatsapp, start_application                                                                                                                        |
| Conversions           | Demandes/candidatures réellement enregistrées côté serveur ; étapes commerciales contrôlées côté administration                                                                                                                 |
| Google/Meta           | Événements navigateur generate_lead / application_submitted (Lead / SubmitApplication pour Meta) uniquement après succès de l’API et consentement correspondant ; dédoublonnage dans la session                                 |
| Durée                 | Événements internes 90 jours ; préférences 180 jours ; nouveaux prospects non inscrits 365 jours                                                                                                                                |
| Protection            | Aucun champ de formulaire dans les événements. Pas d’IP ou d’identifiant visiteur dans MarketingEvent. Validation de l’origine, limitation des requêtes, authentification/roles CRM, révision contre les écrasements simultanés |
| Refus/retrait         | Formulaires utilisables ; pas de balises facultatives avant consentement ; retrait de l’attribution navigateur et rechargement pour arrêter les balises                                                                         |
| Limites               | Les événements ne mesurent que les visiteurs consentants. Les conversions tardives hors de la session ne sont pas renvoyées automatiquement à Meta/GA4. Les comptes externes restent à vérifier après raccordement.             |

Les clics ne prouvent pas qu’un appel ou une conversation WhatsApp a eu lieu. Un rendez-vous confirmé est déclaré par le conseiller après accord avec le prospect. Les demandes sans attribution sont présentées comme telles et ne sont pas inventées comme trafic « direct ».

## Configuration de production

Fichier privé API du VPS : ajouter les valeurs réelles dans les variables suivantes puis recréer le conteneur API avec le compose existant. Ne pas placer de secret ou jeton Meta dans le dépôt.

```dotenv
GA4_MEASUREMENT_ID=
META_PIXEL_ID=
WHATSAPP_BUSINESS_NUMBER=
```

Le numéro WhatsApp est au format international, chiffres uniquement. Il reste vide : le propriétaire le confirmera ultérieurement. Les identifiants GA4 et Meta n’ont pas été fournis à la livraison ; la mesure interne fonctionne indépendamment.

Choix technique : GA4 direct et Meta Pixel manuel, sans ajouter GTM en parallèle pour éviter le double comptage. Une CAPI n’est pas activée ; elle nécessiterait le compte Meta, ses autorisations et une validation spécifique du traitement côté serveur. Aucun jeton CAPI n’a été demandé ou inventé.

Avant d’utiliser une propriété GA4 réelle, désactiver les mesures améliorées automatiques des formulaires et de l’historique de navigation pour conserver cette instrumentation manuelle ; marquer generate_lead et application_submitted comme événements clés. Vérifier dans DebugView et dans le gestionnaire d’événements Meta la réception, les consentements et l’absence de données personnelles. Ne pas installer une seconde balise pour les mêmes événements.

Exemple d’adresse publicitaire sans donnée personnelle :

```text
https://beyond-expertise.com/afrique?programme=mba-projets-programmes-agilite&utm_source=meta&utm_medium=paid_social&utm_campaign=mba_projets_sn&utm_content=video_01&utm_country=senegal
```

## Informations légales et limites avant commercialisation

- Nom, SIREN/SIRET, TVA, adresse et NDA fournis par le propriétaire. SAS et présidente Nadia Loulidi rapprochées de l’API officielle de recherche d’entreprises le 13 septembre 2026. Capital 1 000 € et RCS Melun recoupés dans la publication de création BODACC reprise par les annuaires publics.
- NDA présenté comme déclaration d’activité, avec la mention qu’il ne vaut pas agrément de l’État.
- Le propriétaire confirme l’existence des formations. Cette confirmation ne précise pas, pour chaque programme, un émetteur universitaire et une preuve de reconnaissance : aucune nouvelle reconnaissance universitaire n’est publiée. Le partenaire et la double diplomation demeurent non publiés conformément à sa demande.
- Tarifs, dates et échéancier sont communiqués par proposition écrite avant engagement. Aucun prix ou calendrier commercial n’est inventé.
- Le médiateur de la consommation n’est pas identifié. Le propriétaire a accepté de laisser les demandes gratuites ouvertes, sans activer de vente en ligne. Les coordonnées de médiation doivent être complétées avant des ventes aux particuliers.
- Pas de réservation instantanée dans un agenda tiers, de paiement ou de signature contractuelle en ligne : le conseiller confirme le rendez-vous et finalise le contrat.
- Les anciens brouillons pédagogiques ne sont pas publiés automatiquement.

## Priorités restantes

P0 avant toute publicité promettant un diplôme officiellement reconnu : valider par programme l’intitulé délivré, l’émetteur et la preuve applicable, puis aligner les publicités et documents. P0 avant contractualisation avec des particuliers : médiateur et dossier contractuel définitif. P0 opérationnel : désigner le conseiller qui traite effectivement les demandes, remettre tarifs et calendriers exacts.

P1 : raccorder les identifiants publicitaires, vérifier les événements dans les comptes, confirmer WhatsApp Business, connecter un agenda si des créneaux doivent être réservés instantanément, formaliser la remontée des conversions hors ligne après consentement approprié.

P2 : comparaison des quatre angles commerciaux et des pays, tests de textes et de formulaires à partir de conversions réelles.

## Validation

Migration additive appliquée sur la base locale de travail. Suite API existante : 89 assertions. Nouveau parcours API : 36 contrôles. Parcours navigateur : formulaire, erreur récupérable, reçu, PDF, attribution, consentement/retrait, raccordements simulés sans trafic externe, CRM, largeurs 360/390/768/1440. Suite exécutive existante : 31 pages et 31 PDF, candidature, administration, studio privé et affichages mobile/tablette/desktop.

Brochures : 31 fichiers, 124 pages, texte extrait et deux dernières pages MBA/DBA rendues et examinées. Les constats de déploiement sont consignés dans le rapport du VPS ; aucun prospect de test n’est envoyé à la production.

## Sources de vérification

- [Annuaire officiel de Beyond](https://annuaire-entreprises.data.gouv.fr/entreprise/beyond-expertise-932551674) et [API de recherche des entreprises](https://recherche-entreprises.api.gouv.fr/search?q=932551674).
- [Publication de création et informations de société](https://entreprises.lefigaro.fr/beyond-expertise-77/entreprise-932551674).
- [Article 93-2, direction de publication](https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000033971722).
- [Coordonnées légales OVH](https://www.ovhcloud.com/fr/terms-and-conditions/).
- [Ministère du Travail : formalités des organismes de formation](https://travail-emploi.gouv.fr/les-organismes-de-formation-formalites-administratives).
- [DREETS : achat individuel d’une formation](https://occitanie.dreets.gouv.fr/quand-un-particulier-achete-une-formation-professionnelle-continue).
- [CNIL : cookies](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles), [durées de conservation](https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees).
- [Google : événements GA4](https://developers.google.com/analytics/devguides/collection/ga4/events), [consentement](https://developers.google.com/tag-platform/security/guides/consent).
- [Modèle officiel Meta : configuration manuelle du Pixel](https://github.com/facebook/GoogleTagManager-WebTemplate-For-FacebookPixel/blob/main/template.tpl).
- [WEF, compétences 2025](https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/3-skills-outlook/) : contexte du choix management/projets/IA ; ce choix reste une hypothèse à tester, pas une prévision de rentabilité.
