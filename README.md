# Calculateur de Moyenne Générale

## Description

Le Calculateur de Moyenne Générale est une application web conçue pour aider les étudiants à calculer leurs moyennes de manière précise et personnalisée. Cette application permet de gérer plusieurs matières avec des coefficients différents et plusieurs épreuves par matière, chacune avec son propre pourcentage. Elle supporte également une organisation académique avancée avec des blocs de matières et des semestres.

## Fonctionnalités

- **Interface intuitive en 4 étapes** : configuration du système d'évaluation, configuration des matières, saisie des notes, affichage des résultats
- **Mode sombre/clair** avec sauvegarde des préférences
- **Organisation académique avancée** :
  - Structure par blocs de matières et/ou par semestres
  - Règles de compensation personnalisables entre matières et entre blocs
  - Seuil de validation configurable (par défaut : 10/20)
- **Personnalisation complète** :
  - Nombre illimité de matières (jusqu'à 50)
  - Coefficients personnalisables par matière
  - Plusieurs épreuves par matière avec pondération en pourcentage
  - Regroupement de matières par blocs et/ou semestres
- **Visualisation de la structure** avec un aperçu interactif de l'organisation académique
- **Calcul précis** des moyennes pondérées à tous les niveaux (matière, bloc, semestre)
- **Affichage détaillé des résultats** avec statut de validation
- **Exportation des données** en formats CSV, JSON et PDF
- **Validation en temps réel** des saisies pour éviter les erreurs
- **Interface responsive** fonctionnant sur ordinateurs, tablettes et smartphones
- **Persistance des données** grâce au stockage local dans le navigateur

## Technologies utilisées

- **HTML5** pour la structure du document
- **CSS3** avec **Tailwind CSS** pour le style et le responsive design
- **JavaScript** (Vanilla JS) pour toutes les fonctionnalités
- **LocalStorage API** pour la persistance des données
- **jsPDF** et **jspdf-autotable** pour l'export en PDF
- Aucun framework ou bibliothèque lourde, pour des performances optimales

## Guide d'utilisation

### Étape 0 : Configuration du système d'évaluation

1. Définissez la structure académique (semestres et/ou blocs)
2. Configurez les règles de validation et de compensation
3. Ajoutez des blocs et/ou semestres selon vos besoins
4. Cliquez sur "Continuer" pour passer à l'étape suivante

### Étape 1 : Configuration du nombre de matières

1. Entrez le nombre de matières que vous souhaitez inclure dans votre calcul
2. Cliquez sur "Continuer" pour passer à l'étape suivante

### Étape 2 : Saisie des matières et des notes

Pour chaque matière :

1. Saisissez le nom de la matière
2. Définissez le coefficient de la matière
3. Associez la matière à un bloc et/ou un semestre si nécessaire
4. Ajoutez une ou plusieurs épreuves en indiquant :
   - La note obtenue (sur 20)
   - Le pourcentage que représente cette épreuve dans la moyenne de la matière
5. Assurez-vous que le total des pourcentages pour chaque matière est égal à 100%
6. Cliquez sur "Calculer la moyenne générale" une fois toutes les données saisies

### Étape 3 : Résultats

- Visualisez votre moyenne générale et une évaluation personnalisée
- Consultez le statut de validation de votre année
- Examinez les résultats détaillés par bloc et par semestre
- Consultez le détail des moyennes par matière
- Exportez vos résultats dans différents formats :
  - CSV (compatible avec Excel)
  - JSON (pour les développeurs)
  - PDF (document formaté pour l'impression ou le partage)

## Installation et déploiement

### Méthode simple (utilisation directe)

1. Téléchargez l'ensemble des fichiers
2. Ouvrez le fichier `index.html` dans un navigateur web

### Méthode pour développeurs

1. Clonez le dépôt : `git clone https://github.com/amine830/grade-calculator.git`
2. Aucune dépendance à installer (tout est chargé via CDN)
3. Ouvrez `index.html` dans votre navigateur ou utilisez un serveur web local


### Structure du projet

Le projet est organisé selon une architecture modulaire pour faciliter la maintenance et les extensions :

```plaintext
grade-calculator/
├── index.html              # Point d'entrée de l'application
├── css/                    # Styles et animations
│   ├── main.css            # Styles généraux
│   ├── themes.css          # Gestion des thèmes clair/sombre
│   └── animations.css      # Animations de l'interface
├── js/                     # Scripts JavaScript
│   ├── app.js              # Point d'entrée et orchestration
│   ├── ui/                 # Composants d'interface utilisateur
│   │   ├── components.js   # Génération dynamique des éléments
│   │   ├── themes.js       # Gestion du thème clair/sombre
│   │   └── notifications.js # Système de notifications
│   ├── core/               # Logique métier
│   │   ├── calculator.js           # Calculs des moyennes simples
│   │   ├── advanced-calculator.js  # Calculs avec blocs et semestres
│   │   ├── data-manager.js         # Gestion de la persistance des données
│   │   └── validation.js           # Validation des entrées
│   └── export/             # Fonctionnalités d'exportation
│       ├── csv.js          # Export au format CSV
│       ├── json.js         # Export au format JSON
│       └── pdf.js          # Export au format PDF
```

## Gestion des données

L'application utilise le stockage local (localStorage) du navigateur pour :

1. **Persistance des données** : vos configurations et notes sont sauvegardées automatiquement
2. **Préférences utilisateur** : le thème choisi (clair/sombre) est mémorisé
3. **Continuité d'utilisation** : vous pouvez quitter et revenir plus tard sans perdre vos données ~(+/-)

## Fonctionnalités avancées

### Structure académique personnalisable

- **Organisation par blocs** : regroupez les matières par unités d'enseignement
- **Organisation par semestres** : répartissez vos matières sur plusieurs périodes
- **Combinaison possible** : utilisez à la fois les blocs et les semestres

### Règles de validation configurables

- **Seuil de validation** : définissez la note minimale pour valider (par défaut : 10/20)
- **Compensation entre matières** : permettez aux bonnes notes de compenser les moins bonnes
- **Compensation entre blocs** : choisissez si les blocs peuvent se compenser entre eux

### Aperçu visuel de la structure

Un panneau interactif vous permet de visualiser l'organisation de votre année avec :
- Représentation hiérarchique des semestres, blocs et matières
- Affichage des coefficients pour chaque matière
- Indicateurs visuels pour les règles de validation

## Contribution et développement

### Prérequis

- Connaissances de base en HTML, CSS et JavaScript
- Un éditeur de code (VS Code, Sublime Text, etc.)
- Un navigateur moderne (Chrome, Firefox, Edge, Safari)

### Extension des fonctionnalités

Pour toute autre contribution, merci de créer une pull request sur le dépôt GitHub.

### Bonnes pratiques

Le code suit une architecture modulaire avec :

- Séparation claire entre UI, logique métier et exportation
- Utilisation des modules ES6 pour une meilleure organisation
- Documentation des fonctions avec JSDoc
- Gestion des erreurs avec feedback utilisateur
- Synchronisation des données entre l'interface et le stockage

## Compatibilité

L'application est compatible avec :

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Tous les navigateurs modernes supportant ES6 et localStorage

## Licence et crédits

Ce projet est sous licence MIT et utilise les bibliothèques suivantes :

- [Tailwind CSS](https://tailwindcss.com/) pour le design
- [jsPDF](https://github.com/MrRio/jsPDF) pour la génération de PDF
- [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) pour les tableaux en PDF

---

Pour toute question ou suggestion, merci de créer une issue sur le dépôt GitHub du projet ou de me contacter directement par [email](amine.nedjar4716@gmail.com).
