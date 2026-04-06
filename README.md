# Calculateur de Moyenne Generale

<p align="left">
  <a href="https://app.netlify.com/projects/grade-calculat0r/deploys"><img alt="Netlify" src="https://api.netlify.com/api/v1/badges/3ba5c5b7-a046-4172-99f9-ddec98bb245a/deploy-status"></a>
  <a href="https://developer.mozilla.org/docs/Web/HTML"><img alt="HTML5" src="https://img.shields.io/badge/HTML5-Structure-E34F26?logo=html5&logoColor=white"></a>
  <a href="https://developer.mozilla.org/docs/Web/CSS"><img alt="CSS3" src="https://img.shields.io/badge/CSS3-Design-1572B6?logo=css3&logoColor=white"></a>
  <a href="https://developer.mozilla.org/docs/Web/JavaScript"><img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=111827"></a>
  <a href="https://tailwindcss.com/"><img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-CDN-06B6D4?logo=tailwindcss&logoColor=white"></a>
  <a href="https://github.com/parallax/jsPDF"><img alt="jsPDF" src="https://img.shields.io/badge/jsPDF-2.5.1-BB1111"></a>
  <a href="https://github.com/simonbengtsson/jsPDF-AutoTable"><img alt="AutoTable" src="https://img.shields.io/badge/jsPDF_AutoTable-3.5.28-7C3AED"></a>
  <a href="https://web.dev/progressive-web-apps/"><img alt="PWA Ready" src="https://img.shields.io/badge/Web_Manifest-PWA-2563EB"></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-16A34A"></a>
</p>

Application web pour calculer une moyenne generale ponderee avec coefficients, epreuves, semestres, blocs, validation academique et export CSV/JSON/PDF.

## Sommaire

- [Apercu](#apercu)
- [Fonctionnalites](#fonctionnalites)
- [Technologies](#technologies)
- [Structure du projet](#structure-du-projet)
- [Demarrage rapide](#demarrage-rapide)
- [Utilisation](#utilisation)
- [Persistance des donnees](#persistance-des-donnees)
- [Accessibilite et UX](#accessibilite-et-ux)
- [Roadmap courte](#roadmap-courte)
- [Licence](#licence)

## Apercu

Le projet permet de modeliser une annee academique (matieres, epreuves, blocs, semestres), de calculer automatiquement les moyennes et de produire un releve exportable.

## Fonctionnalites

- Parcours en etapes avec onglets dynamiques (Configuration, Matieres, Saisie, Resultats).
- Configuration academique flexible:
  - semestres optionnels
  - blocs optionnels
  - seuil de validation configurable
  - options de compensation configurees
- Gestion de 1 a 50 matieres avec coefficients personnalises.
- Saisie de plusieurs epreuves par matiere avec pourcentages.
- Validation en temps reel des entrees (notes, pourcentages, bornes).
- Resultats detailles:
  - moyenne globale
  - moyennes par matiere
  - moyennes par bloc
  - moyennes par semestre
  - statut de validation
- Export des resultats en CSV, JSON et PDF.
- Theme clair/sombre avec preference utilisateur persistante.
- UI modernisee: tabs de progression, toasts, modal de confirmation, panneau d'aide.

## Technologies

- HTML5
- CSS3 + tokens de design system
- JavaScript vanilla (ES modules)
- Tailwind CSS (via CDN)
- jsPDF + jsPDF AutoTable
- LocalStorage (persistance)
- Web Manifest + favicons

## Structure du projet

```text
grade-calculator/
├── index.html
├── assets/
│   ├── site.webmanifest
│   └── icons/
│       ├── apple-touch-icon.png
│       ├── favicon-16x16.png
│       ├── favicon-32x32.png
│       ├── favicon.ico
│       ├── android-chrome-192x192.png
│       └── android-chrome-512x512.png
├── css/
│   ├── main.css
│   ├── themes.css
│   └── animations.css
├── js/
│   ├── app.js
│   ├── core/
│   │   ├── advanced-calculator.js
│   │   ├── calculator.js
│   │   ├── data-manager.js
│   │   └── validation.js
│   ├── export/
│   │   ├── csv.js
│   │   ├── json.js
│   │   └── pdf.js
│   └── ui/
│       ├── components.js
│       ├── notifications.js
│       └── themes.js
└── README.md
```

## Demarrage rapide

### Option 1: ouverture directe

1. Cloner le depot.
2. Ouvrir `index.html` dans un navigateur moderne.

### Option 2: serveur local (recommande)

```bash
# Depuis la racine du projet
python3 -m http.server 8080
```

Puis ouvrir: `http://localhost:8080`

## Utilisation

1. Configurer la structure academique et le seuil.
2. Choisir le nombre de matieres.
3. Saisir matieres, coefficients et epreuves.
4. Calculer, analyser les resultats, puis exporter.

## Persistance des donnees

Les donnees sont stockees dans le navigateur via `localStorage`:

- configuration academique
- matieres et epreuves
- preference de theme

## Accessibilite et UX

- Labels visibles sur les champs.
- Etats focus explicites.
- Navigation par tabs avec attributs ARIA.
- Modal de confirmation pour la reinitialisation.
- Interface responsive (mobile, tablette, desktop).

## Roadmap courte

- Ajouter des tests automatises (unitaires + E2E).
- Renforcer la robustesse des imports/exports.


## Licence

Ce projet est sous licence MIT et utilise les bibliothèques suivantes :

- [Tailwind CSS](https://tailwindcss.com/) pour le design
- [jsPDF](https://github.com/MrRio/jsPDF) pour la génération de PDF
- [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) pour les tableaux en PDF

---

Pour toute question ou suggestion, merci de créer une issue sur le dépôt GitHub du projet ou de me contacter directement par [email](amine.nedjar4716@gmail.com).