# Vérifications et éléments de preuve

Audit daté du 13 septembre 2026. [Rapport principal](../audit-campagnes-afrique-2026-09-13.md) · [résultats structurés](resultats.json) · [inventaire des programmes](programmes.md).

## Ce qui a été exécuté

| Contrôle | Environnement | Résultat |
|---|---|---|
| 31 fiches exécutives et 31 brochures | Production, requêtes GET | 62 réponses 200, absence du message de contenu indisponible, signature PDF correcte et fichiers identiques au dépôt |
| 85 fiches courtes et 85 brochures | Production, requêtes GET | 170 réponses 200, absence du message de contenu indisponible |
| Pages de présentation, services, pédagogie, titres, formulaires, qualité et mentions | Production, lecture seule | Accessibles ; les réserves et informations de version locale décrites dans le rapport sont bien présentes |
| Programme inexistant | Production, GET `/mba-dba/introuvable` | 404 attendu |
| Accès anonyme aux dossiers exécutifs et au tableau commercial | Production, GET des deux API protégées | 401 attendu pour `/api/v1/executive/applications` et `/api/v1/admin/commercial/overview` |
| Référencement technique exécutif | Production, métadonnées/sitemap/robots | Les 31 fiches apparaissent dans le sitemap ; les routes privées sont exclues par robots ; canoniques des fiches présents |
| Recherche, navigation, galerie, menu et FAQ | Navigateurs local et production | Recherche « santé » : 7 résultats ; présélection du programme, ouverture/fermeture galerie, menu mobile et FAQ générale opérationnels |
| API exécutive, script existant | Local 3300/4300, base de travail | 89 assertions réussies : validation, droits, doublons, révisions concurrentes, enregistrement et suivi, confidentialité des trames |
| Interface exécutive, script existant | Local, Chrome | PASS : candidature → reçu → consultation administrateur → modification du suivi ; studio privé, 31 fiches/PDF et plusieurs largeurs |
| Contact / devis / inscription générale | Local, Chrome mobile 390 px | Trois envois via les formulaires : 201, enregistrement en base et message de confirmation dans la même page |
| Slug MBA dans le formulaire d’inscription général | Local, requête synthétique | Réponse 201 mais aucune formation rattachée : ne pas utiliser ce flux pour les MBA sans adaptation |
| Ajout UTM à une candidature autrement valide | Local, validation serveur | Réponse 400 pour champ `utm_source` non accepté ; aucun dossier créé |
| Nettoyage des essais | Local | Suppression des seuls dossiers, leads et société synthétiques créés par les contrôles ; aucun envoi en production |
| État pédagogique hébergé | Production, lecture agrégée | 31 cours exécutifs, 0 publié, tous DRAFT ; 290 modules et 611 entrées de leçons |

Les scripts existants `scripts/test-executive.cjs` et `scripts/test-executive-ui.cjs` sont les contrôles de régression réutilisés. Les outils ponctuels de collecte et captures complètes restent dans le répertoire local ignoré `work/audit-campagnes-afrique/`. Seuls les résultats dépourvus de données de prospects sont joints au dépôt.

Les premiers essais d’accès réseau ont rencontré une restriction de l’environnement d’audit, puis ont été relancés avec l’accès réseau autorisé. Ces refus locaux n’ont pas été comptés comme des indisponibilités du site. Un premier essai de devis n’avait pas sélectionné la modalité obligatoire : après correction de cette donnée de test, le formulaire a été vérifié avec succès. Aucun correctif applicatif n’a été effectué.

## Brochures

- **31 PDF, 124 pages**, 4 pages chacun ; 81 374 à 82 403 octets par fichier.
- Extraction de texte de toutes les pages ; intitulés et titres des 290 modules/jalons présents après normalisation des retours à la ligne.
- Chaque brochure contient un lien de candidature ciblant son propre programme.
- Vérification visuelle des huit pages de deux PDF : MBA Direction générale, stratégie et croissance responsable ; DBA Leadership et transformation des systèmes de santé. Texte lisible et pas de chevauchement observé sur cet échantillon. Les autres brochures ont été contrôlées par extraction, structure et empreinte, sans inspection visuelle exhaustive.
- Le détail du statut du titre et les conditions de cohorte restent à compléter. Aucun contrat, certificat d’accréditation, convention diplômante ou dossier de preuves de diplômés n’a été ajouté ou inventé.

## Attribution et outils de mesure

Le parcours public a démarré sur `/mba` avec `utm_source=meta`, `utm_medium=paid_social`, une campagne de test, un contenu de test, un pays de campagne et un identifiant synthétique. Au clic vers le programme, ces paramètres disparaissent. À la candidature, seul le programme est présélectionné ; aucun stockage local/de session ni cookie ne conserve les paramètres.

Sur huit pages publiques contrôlées, les requêtes observées ciblent uniquement `beyond-expertise.com` ; aucun cookie visiteur, stockage d’attribution, global `gtag`, `dataLayer`, `fbq`, `ttq` ou `lintrk` n’a été observé. Cette inspection, rapprochée du code et de la configuration API, ne révèle ni GA4/GTM ni Pixel/CAPI ni CRM externe intégré. Elle ne permet pas de conclure à l’absence de comptes externes appartenant à Beyond mais non raccordés au site.

La configuration API de production ne contient pas de clé Turnstile active lors du contrôle. Les règles serveur spécifiques aux candidatures exécutives sont néanmoins présentes. La politique de conservation n’est pas finalisée dans les pages inspectées. La conformité globale ne peut donc pas être déclarée sur la base de l’existence d’une page « Confidentialité ».

## Mesures de chargement

Chrome 152.0.7977.84, 390 × 844 px, cache navigateur désactivé, CPU ×4, réseau configuré 1,6 Mbit/s descendant / 0,75 Mbit/s montant / 150 ms. Deux essais par page, observation jusqu’à 8 secondes après chargement, sans interaction ni défilement. Version exacte du navigateur dans `resultats.json`.

| Page | Essai | LCP | CLS | Requêtes observées | Octets des ressources terminées |
|---|---:|---:|---:|---:|---:|
| MBA | 1 | 4 224 ms | 0 | 22 | 224 469 |
| MBA | 2 | 2 808 ms | 0 | 21 | 219 457 |
| Fiche MBA Direction générale | 1 | 2 520 ms | 0 | 25 | 244 644 |
| Fiche MBA Direction générale | 2 | 2 544 ms | 0 | 25 | 244 629 |
| Candidature | 1 | 2 376 ms | 0 | 21 | 206 736 |
| Candidature | 2 | 2 304 ms | 0 | 21 | 206 745 |
| Accueil | 1 | 3 656 ms | 0 | 34 | 296 342 |
| Accueil | 2 | 4 984 ms | 0 | 34 | 296 308 |

**Limites de poids :** le compteur porte sur les ressources dont le transfert est terminé pendant l’observation. La vidéo d’accueil en cours de transfert et les médias chargés après défilement ne sont pas intégralement inclus. La vidéo source pèse 7 427 851 octets. Ces valeurs ne doivent pas être utilisées comme poids total de la page.

**Limites de performance :** ce sont des observations synthétiques depuis l’environnement d’audit, pas une moyenne de visiteurs ni une mesure depuis Dakar, Abidjan, Douala ou d’autres villes. Le serveur, le cache intermédiaire et le poste de test peuvent contribuer à la variabilité. L’INP et les percentiles de trafic réel ne sont pas mesurés. Aucun score global de performance ou de conformité WCAG n’est déduit de cet échantillon.

## Captures sélectionnées

Six pages ont été contrôlées à 320, 390 et 768 px : accueil, MBA, DBA, fiche MBA, candidature et contact. Aucun débordement horizontal observé dans ces 18 contrôles. Les captures suivantes sont des pages publiques, sans saisie de prospect.

### Page MBA sur smartphone

![Page MBA, largeur 390 px](captures/mba-390.png)

CTA d’exploration visible dès la première vue. Le visuel représente une scène fictive, pas une promotion vérifiée. L’assistant flottant occupe une partie du bas de l’écran.

### Fiche MBA sur smartphone

![Fiche MBA, largeur 390 px](captures/programme-390.png)

Intitulé lisible, candidature accessible tôt. La brochure et la demande d’entretien se trouvent plus bas dans la page actuelle.

### Formulaire sur smartphone

![Candidature, largeur 390 px](captures/candidature-390.png)

Les labels sont présents ; une première demande d’information requiert le même parcours long qu’une candidature. Les coordonnées commencent après la sélection du programme et de l’intention.

### Page MBA sur ordinateur

![Page MBA, largeur 1440 px](captures/mba-1440.png)

Mise en page existante à conserver. Le travail prioritaire porte sur la preuve de l’offre et la conversion, sans refonte visuelle générale.
