# Python, programmation objet

Beyond Expertise · Programme détaillé · Version 2 du 2026-09-12

**Version enrichie proposée, à valider par le formateur avant animation.**

3 jour(s) · 21 heures indicatives · Intermédiaire · Hybride

Répartition pédagogique proposée sur une base de 7 heures par jour, pauses exclues. À ajuster avec le formateur au positionnement initial. Les approfondissements « Pour aller plus loin » sont sélectionnés par le formateur selon le positionnement et le temps disponible ; ils ne constituent pas des heures supplémentaires garanties.

## Objectifs de la fiche de référence

- Comprendre les bases du langage Python et son écosystème
- Acquérir les principes de la programmation objet
- Comprendre et utiliser les fonctions et modules
- Concevoir des interfaces graphiques
- Utiliser les outils de test et d'évaluation de la qualité d'un programme Python

## Public et prérequis

Public : protected, private)Le mécanisme de traitement des exceptionsExemple de formalisme UML (diagramme de classe)Tour d’horizon des classes fondamentales existantes en PythonNotion de Design PatternsTravaux pratiquesObjectifs : Comprendre quand utiliser l’héritage, le polymorphisme et la composition dans notre conception d’application Python Description : On enrichit le cahier des charges de notre application pour faire apparaitre de nouveaux besoins qui amènent à faire des choix d’héritage, de polymorphisme, etc. avec par exemple une classe TransactionRécurrente qui hérite de Transaction et des concepts de validation de transaction (source, auteur, est_validée par, …)Types de données évoluésSavoir choisir les bonnes structures de donnéesTuples, séquences et listes (append, extend, insert, ...)Fonctions utiles avec les listes (filter, map, reduce)Gestion des piles ou des filesLa puissance des dictionnaires (tableaux associatifs)Construire une liste sur la base d'une expression (compréhension)Travaux pratiquesObjectif : Savoir utiliser les listes en PythonDescription : On reprend notre fichier CSV contenant des transactions bancaires (date, libellé, montant, catégorie) et on le stocke dans un tuple pour figer les valeurs. On ajoute ensuite ces tuples à une liste de transactions que l’on analyse avec map, filter, et reduce pour ne garder que des transactions supérieures à un certain montant et les convertir en dollars. Ensuite reduce permet de calculer le total global dépenses. On créé ensuite une liste des catégories où les dépenses dépassent 1000€ et une pile pour simuler une liste d’actions utilisateurs pour annuler les dernières opérations.Jour 3Compléments sur le langage PythonGénérateurs et itérateursScripts exécutablesOpérateurs associés aux listesEnchaînement de tests par rapport aux listesComparer les séquencesTravaux pratiquesObjectif : Savoir utiliser les itérateursDescription : Création d’une classe portefeuille avec itérateur. Elle contient une liste de transactions et permet d’itérer sur les transactions par date croissante.Les modules de PythonPhilosophie de Python avec les modules (standard, tiers, ...) Tour d'horizon des modules standards Module re (expressions rationnelles)Modules os et sys (services du système d'exploitation)Module csv (fichiers structurés par séparateur)Comment trouver les modules ?Installer des modules tiers (setuptools, EasyInstall)Le dépôt central : Python Package index (Pypi)Importer des modulesMieux gérer son environnement avec venv, pipx, poetry ou pip-toolsTravaux pratiquesObjectif : Savoir structurer son application en modules pour la rendre plus lisible et facile à maintenirDescription : On crée un module pour nos classes (le modèle des données), un module pour les services offerts (filtrage, calculs, résumé, etc.), un module dédié aux entrées/sorties (chargement/sauvegarde de notre CSV dans notre projet). On utilise bien sûr des modules standards comme CSV ou RE (filtrages des données avec les expressions régulières) pour montrer comment les modules existants cohabitent avec nos propres modules.Jour 4Gestion des données (Fichiers, SGBD, XML, JSON, API)Accéder aux fichiers (objet File)Conformité des modules Python pour accéder à une base de données (DB-APIPython et requêtes SQL, ORM avec SQLAlchemFiltrer les données grâce aux expressions régulière (RE)Présentation de la manipulation de flux XMl en Python (ElementTree)Manipuler des fichiers CSVTravaux pratiquesObjectif : Connexion à une base de données pour extraire ou sauvegarder des donnéesDescription : Notre application évolue et on abandonne notre CSV pour dialoguer avec une base de données (MySQL ou PostgreSQL). On complète donc l’exercice précédent en construisant une classe TransactionDao dans notre module dédié aux entrées sorties, qui permet toutes les actions standards sur la table Transaction (insérer, mettre à jour, supprimer, lister, rechercher).Échange de données via API et formats standardsLe format JSON : encodage/décodage, gestion de structures complexeSérialisation avec dataclasses et pydantiPrincipe des API et des Web ServiceRequêtes HTTP avec requests (GET, POST, headers, paramètresRécupérer des données via des API externeTraitement et validation des données reçues (modèles Pydantic, typage fort, gestion des erreurs)Travaux pratiquesObjectif : Consommer une API REST dans un programme Python et intégrer « proprement » les données dans son application.Description : On cherche à actualiser en temps réel notre application avec des actualités économiques. Pour cela on va appeler une API publique qui nous retourne un taux de change au format JSON. On définit un modèle de validation avec Pydantic et on créé 2 classes TauxChange et Reponse API. Affichage ou traitement des données dans le terminal ou via un petit script CLI. Bonus : exporter les résultats vers un fichier CSV ou JSON local.Jour 5Création d’interface graphiqueSpécificités du développement d’interface graphique (programmation événementielle)Présentation de la bibliothèque TkInter.Les principaux conteneurs.Présentation des widgets disponibles (Button, Radiobutton, Entry, Label, Listbox, Canvas, Menu, Scrollbar, Text...).Le gestionnaire de fenêtres.Le placement des composants, les différents layouts.La gestion des événements, l'objet event.Les applications multifenêtres.Un petit mot sur la bibliothèque QtLes autres librairies d’IHM (PyQt, PySide, ..) les IHM web (flask/streamlit)Travaux pratiquesObjectif : Mettre en œuvre une IHM en Python avec TkInterDescription : Développement d’une maquette pour compléter l’atelier précédent sous forme graphique (menu, boîtes de dialogue, liste, boutons, …) afin de proposer une interface pour la saisie des actions de manipulations des données et l’affichage des résultatsQualité et outilsEn quoi consiste l’assurance qualité d’un programme Python (QA) ?Vue d’ensemble de la « trousse à outils » proposée au développeur Utiliser les plugins des IDEs IntelliJ ou VSCodeRechercher des bugs avec PyCheckerVérifier le respect des standards avec PyLintUtiliser le guide de style PEP 8 (Python Enhancement Proposals)Générer de la documentationDisposer de statistiques sur l’exécution de son programme (profiling)Comprendre l'intérêt des outils de Tests (Doctests, Unit tests)Travaux pratiquesObjectif : Bien comprendre le champ fonctionnel de chaque outil présenté dans ce chapitre et savoir les utiliserDescription : Audit de code Python ne respectant pas les standards professionnels en termes de lisibilité. Bonnes pratiques dans le déboguage d’un programme. Mise en œuvre de tests unitaires simples dans le cadre de notre projet fil rouge. Génération de documentation. Repérage des parties consommatrices d’un programme Python d’analyse de données (profiling de notre application fil rouge).Public et.

Prérequis de la fiche : Les participants à cette formation doivent connaître un langage de programmation, car la formation ne prévoit pas de revenir sur les bases de la programmation (variables, test, boucle, fonction…). L’assimilation de ces concepts en même temps que la syntaxe de Python reste cependant possible mais constitue un risque pédagogique important.Il est souhaitable (mais pas indispensable) de connaître la programmation objet car la formation prend le temps de présenter les concepts objets fondamentaux (classe, objet, instance, propriétés, méthodes, héritage) puis dans un second temps leur mise en œuvre en Python.

## Préparation de la formation

Premières fonctions et collections Python ; Python, éditeur, pytest et Tkinter disponibles dans le poste de formation.

## Cas fil rouge

Structurer un gestionnaire d'inventaire Python avec modèle objet, interface simple et tests automatisés.

## Méthode pédagogique

Apports illustrés, exercices progressifs, ateliers sur un cas fil rouge et retour argumenté sur les productions. Les ateliers et l'évaluation font partie des heures indiquées.

## Jour 1 · 7 heures

### Consolider fonctions et modules · 210 min

- Organiser fichiers, imports et environnement virtuel.
- Préciser arguments, valeurs de retour et exceptions.
- Distinguer état local, état partagé et effets de bord.
- Clarifier portée, mutabilité, arguments par défaut et annotations ; structurer un paquet sans imports circulaires.

**Atelier prévu :** Transformer un script monolithique d'inventaire en trois modules sans modifier ses résultats.

**Livrable attendu :** Paquet Python organisé et fonctions aux contrats explicites.

**Pour aller plus loin :** Remplacer des variables globales par des dépendances explicites pour rendre le traitement testable.

### Modéliser avec des classes · 210 min

- Définir attributs, initialisation, méthodes et invariants.
- Utiliser propriétés et dataclasses quand elles simplifient le modèle.
- Distinguer identité, égalité et représentation d'un objet.
- Définir invariants, attributs, propriétés et représentation des objets ; comparer classe classique et dataclass.

**Atelier prévu :** Créer un article dont le stock reste valide après entrée et sortie ; tester une quantité négative et un stock insuffisant.

**Livrable attendu :** Modèle objet avec invariants et exemples d’usage.

**Pour aller plus loin :** Concevoir un objet qui refuse un état incohérent et reste compréhensible lors de son affichage ou de sa sérialisation.

## Jour 2 · 7 heures

### Choisir composition et héritage · 210 min

- Comparer composition, délégation et spécialisation.
- Définir un contrat de comportement sans couplage aux détails.
- Comprendre polymorphisme et responsabilité unique.
- Distinguer relation est-un et possède-un ; examiner couplage, polymorphisme et substitution dans les contrats.

**Atelier prévu :** Ajouter deux politiques de remise sans multiplier les conditions dans le calcul de commande.

**Livrable attendu :** Diagramme de conception et refactoring argumenté.

**Pour aller plus loin :** Remplacer une hiérarchie fragile par une composition et vérifier la compatibilité des comportements attendus.

### Fiabiliser les échanges de données · 210 min

- Lire et écrire JSON ou CSV avec gestion des erreurs.
- Encapsuler accès aux fichiers et conversions.
- Employer gestionnaires de contexte et journalisation utile.
- Valider les données aux frontières, gérer exceptions métier et ressources avec des gestionnaires de contexte.

**Atelier prévu :** Construire un dépôt d'articles et gérer un fichier absent, corrompu ou contenant un article invalide.

**Livrable attendu :** Couche d’échange robuste et catalogue d’erreurs.

**Pour aller plus loin :** Simuler un fichier corrompu ou une interruption d’écriture et préserver un état cohérent de l’application.

## Jour 3 · 7 heures

### Créer une interface graphique simple · 210 min

- Relier widgets, événements et validation utilisateur.
- Séparer affichage, logique métier et persistance.
- Éviter les traitements bloquants dans la boucle d'événements.
- Séparer widgets, état de l’interface et logique métier ; expliquer la boucle d’événements et les traitements bloquants.

**Atelier prévu :** Créer une fenêtre de consultation et de saisie d'articles qui réutilise les classes métier testées.

**Livrable attendu :** Interface événementielle et découpage présentation/métier.

**Pour aller plus loin :** Maintenir l’interface réactive pendant une opération longue et éviter les modifications concurrentes de son état.

### Tester et améliorer la conception · 210 min

- Écrire tests unitaires, fixtures et cas limites.
- Utiliser types et analyse statique pour clarifier les contrats.
- Refactorer en conservant les comportements validés.
- Tester comportements publics, cas limites et dépendances externes ; distinguer mock utile et test lié aux détails internes.

**Atelier prévu :** Livrer le gestionnaire avec tests, notice et schéma des responsabilités ; démontrer l'ajout d'un nouveau stockage sans réécrire l'interface.

**Livrable attendu :** Suite de tests et dossier de décisions de conception.

**Pour aller plus loin :** Faire évoluer une règle métier avec une suite de non-régression puis mesurer la réduction du couplage.

## Évaluation finale prévue

Mise en situation individuelle et restitution commentée, incluses dans la dernière séquence. Durée indicative : 60 minutes.

- Les invariants métier sont protégés par le modèle.
- La logique reste testable sans interface graphique.
- Les erreurs de fichiers produisent un comportement explicite.

## Disponibilité des supports

Les ateliers décrivent les travaux prévus. Leurs fichiers, corrigés et évaluations en ligne sont à préparer, sauf ressources explicitement disponibles dans le module pilote.

## Origine et références

Programme original rédigé pour Beyond Expertise à partir des objectifs de la fiche officielle.

[Fiche officielle observée le 11 septembre 2026](https://beyond-expertise.com/formations/opyt-python-programmation-objet)

Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.

- [Python · tutoriel du langage](https://docs.python.org/3/tutorial/)

## Contacts, accès et accompagnement — mise à jour du 12 septembre 2026

Beyond Expertise : [09 54 70 23 80](tel:+33954702380) — [contact@beyondexpertise.eu](mailto:contact@beyondexpertise.eu).

Pour obtenir plus de détails ou le programme détaillé validé, contactez le centre Beyond Expertise.

Le programme, le tarif contractuel, la TVA, les dates et le délai d’accès sont à confirmer avec le centre avant inscription. Aucune session commerciale n’est ouverte dans la copie locale.

Une analyse de vos besoins et une vérification des prérequis doivent précéder l’attribution du parcours. Les aménagements liés au handicap et l’assistance technique ou pédagogique sont à convenir avec le centre ; aucun diagnostic médical n’est nécessaire dans le formulaire.

Dans la copie locale : /informations-pratiques, /positionnement, /accessibilite, /assistance, /reclamations et /avis.

Les supports proposés ne délivrent pas de diplôme ou de certification professionnelle. Une éventuelle préparation à un examen externe nécessite la vérification des habilitations et modalités. Aucun financement CPF ou OPCO n’est garanti.

Démarche Qualiopi en cours ; certification non acquise. Les programmes restent à valider avant animation.
