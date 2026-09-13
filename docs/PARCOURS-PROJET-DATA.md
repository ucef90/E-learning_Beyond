# Parcours Projet et Data

Deux fiches publiques complètent le catalogue :

- `/formations/pmp-preparation-projets-valeur-2026` : préparation indépendante, objectif pédagogique 35 heures, 20 modules.
- `/formations/data-fullstack-python-sql-machine-learning` : 140 heures pédagogiques proposées, 20 modules, ateliers Python/SQL et produit data.

Chaque cours privé comprend 20 modules, 80 entrées pédagogiques (concept, exemple, atelier et quiz), 40 questions originales et un dossier de travail. Les corrigés sont réservés au formateur ou à l’après-revue. Le parcours Data ajoute trois notebooks, un CSV synthétique de 120 interventions et un kit local FastAPI/Streamlit. Le laboratoire navigateur couvre les calculs Python, pandas, NumPy, matplotlib et SQLite ; Docker, FastAPI, Streamlit et Power BI demandent un poste adapté.

Les 35/140 heures comprennent pratique, accompagnement et évaluation. Elles restent à étalonner par le formateur. Une lecture de page ne constitue pas une preuve d’heures suivies. La préparation PMP ne garantit ni admissibilité ni réussite à l’examen PMI ; aucun agrément ATP n’est revendiqué.

## Données publiques et pédagogie privée

`content/professional/programmes.json` contient seulement les fiches et programmes publics. Les PDF sont produits par `scripts/export-professional-pdfs.py`. Le générateur de connaissances de l’assistant utilise ces deux fiches en plus du catalogue antérieur.

Les leçons, questions, solutions et fichiers d’exercice sont conservés dans le bundle privé, hors dépôt public. L’import explicite se fait avec :

```sh
node scripts/import-professional-courses.cjs /chemin/prive/professional-content.json NOM_BASE_ATTENDU
```

Le script compare les fiches à la source publique, vérifie les empreintes des pièces, crée seulement les éléments absents et refuse de remplacer une version différente. Aucun compte, inscription ou cours existant n’est modifié. Les nouveaux cours restent des brouillons privés à relire dans **Mon espace → Contenus pédagogiques** avant publication et attribution nominative. Le statut n’est pas assimilé à une validation humaine.

Les contenus sont rédigés pour Beyond. Aucune vidéo, transcription, question d’examen ou correction d’un autre organisme n’est incluse. Les références officielles figurent sur les programmes.

## Vérification

- Contrôle des durées, cardinalités, bonnes réponses et empreintes à l’import.
- Exécution des notebooks dans le laboratoire Pyodide réel.
- Vérification des pages et téléchargements publics, du studio administrateur et du refus d’accès anonyme aux ressources privées.
- Import idempotent en base de test puis sur une copie de production avant bascule.
