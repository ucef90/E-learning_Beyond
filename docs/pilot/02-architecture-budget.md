# Architecture et budget du pilote

## Architecture retenue

L’existant est conservé : Next.js/React pour l’interface, NestJS pour l’API, Prisma/PostgreSQL pour les données. Le navigateur passe par `/api/v1` sur la même origine que le site ; l’API écoute seulement l’interface locale. Les sessions sont révocables, persistent en base et expirent après huit heures. Les comptes créés par l’administration utilisent un lien personnel de définition de mot de passe, valable une heure et à usage unique.

Le laboratoire est un petit serveur statique sur une **origine distincte**, sans base métier ni route d’exécution serveur. Il fournit Pyodide 0.27.7 et les bibliothèques contrôlées. Le code du stagiaire s’exécute dans un Worker du navigateur. Un iframe avec scripts et origine propre conserve la séparation avec le site ; sa politique de contenu limite le réseau aux ressources du laboratoire. Ne jamais servir le laboratoire sur l’origine du site. En hébergement externe, utiliser un nom d’hôte distinct, HTTPS et des cookies de session limités à l’hôte de l’application.

La documentation officielle décrit l’usage de Pyodide dans un Worker pour préserver la réactivité de l’interface. La version du pilote est explicitement figée. [Pyodide 0.27.7](https://pyodide.org/en/0.27.7/usage/webworker.html).

Les bibliothèques sont servies localement : 32 621 081 octets avant cache, environ 33 Mo. Les paquets Python sont vérifiés avec les SHA-256 du verrou de distribution. Le manifeste complet est produit par `scripts/setup-lab.py`. Aucun accès CDN n’est requis par l’apprenant après cette préparation. Ce choix résout l’échec rencontré avec le CDN dans le navigateur de cet environnement.

## Persistance et évaluation

- Lecture : état déclaré par le stagiaire et date, conservés dans LessonProgress.
- Brouillon : notebook en base avec numéro de révision. Une sauvegarde dépassée est refusée, pour éviter l’écrasement entre appareils.
- Remise : copie indépendante datée, non remplacée par les sauvegardes suivantes.
- Quiz : évaluation serveur, tentative, réponses et feedback persistants.
- Correction : note et commentaire du formateur attribué ; historique des modifications dans les événements.
- Export : relevé JSON, programme/version, progression, tentatives, brouillon et traces du stagiaire concerné. Aucune certification professionnelle annoncée.

L’exécution navigateur n’est pas une preuve d’examen surveillé. Le code des remises n’est jamais exécuté par le serveur ou automatiquement par le formateur. Les sorties HTML actives sont écartées à l’enregistrement. La mémoire Python est temporaire ; les sauvegardes serveur et les exports sont explicites. Les sorties textuelles sont conservées, les graphiques se régénèrent par le code.

Un calcul est arrêté au bout de 120 secondes, y compris le chargement initial. L’utilisateur peut l’arrêter plus tôt. La mémoire est celle de son appareil ; aucun quota de RAM inviolable n’est promis pour un navigateur. Bibliothèques compatibles avec le TP : Python 3.12.7, pandas 2.2.3, NumPy 2.0.2, matplotlib 3.8.4. Jupyter local constitue le repli pour un appareil incompatible.

## Budget estimatif

| Poste | Montant mensuel retenu | Nature |
|---|---:|---|
| VPS OVH existant | Environ 11 € | Montant indiqué par le propriétaire ; HT/TTC non confirmé |
| Nouvelle souscription pour ce pilote local | 0 € | Aucun achat ni abonnement déclenché |
| Calcul Python du pilote | 0 € de service de calcul ajouté | Utilise les appareils des stagiaires ; bande passante et électricité ne sont pas évaluées |
| Sauvegarde externe future | Enveloppe de 5 à 10 € | Provision de planification, pas un tarif fournisseur vérifié |
| Courriels techniques futurs | Enveloppe de 0 à 10 € | À chiffrer selon le fournisseur et les volumes ; aucune messagerie activée |

Budget de planification : **environ 16 à 31 €/mois**, avant différences HT/TTC et éventuels dépassements, domaine non inclus s’il n’est pas déjà couvert. Il reste sous l’enveloppe de 100 € dans ces hypothèses, mais ne constitue pas un devis. Le seul montant récurrent connu est le VPS indiqué par l’utilisateur. Aucun prix de service supplémentaire n’a été présenté comme vérifié ni souscrit. Les coûts réels de sauvegarde, domaine, trafic et mail seront vérifiés avant toute décision. Développement, accompagnement humain, certification et examens sont exclus du fonctionnement technique.

## Dimensionnement à vérifier sur OVH

Scénarios hypothétiques sans vidéo au lancement :

| Actifs simultanés | Lecture / quiz | Python navigateur | Implication |
|---:|---:|---:|---|
| 20 | 15 | 5 | Mesurer API, sauvegardes et téléchargements initiaux |
| 50 | 35 | 15 | Vérifier latence, connexions base et bande passante |
| 100 | 70 | 30 | Test de charge préalable indispensable ; aucune capacité promise |

Cent premières ouvertures du laboratoire représenteraient environ 3,3 Go de fichiers non compressés hors cache. Ce n’est pas une mesure de trafic réel ni de facturation OVH. Les vidéos restent un coût distinct à étudier ultérieurement. JupyterHub n’est pas installé : ce TP fonctionne dans le navigateur et ne justifie pas un calcul mutualisé sur un VPS non mesuré.
