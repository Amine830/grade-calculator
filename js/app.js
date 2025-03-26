// js/app.js

/**
 * Point d'entrée de l'application Calculateur de Moyenne
 * Ce fichier initialise l'application et gère les interactions principales
 */

// Importation des modules
import { initThemeSystem } from './ui/themes.js';
import { showMessage, showError } from './ui/notifications.js';
import { createSubjectCard, updatePercentageTotal } from './ui/components.js';
import { calculateGeneralAverage, getEvaluationMessage } from './core/calculator.js';
import { validateNumberOfSubjects } from './core/validation.js';
import { exportToCSV } from './export/csv.js';
import { exportToJSON } from './export/json.js';
import { exportToPDF } from './export/pdf.js';

// Variables globales
let detailedData = null;
const subjectTemplate = document.getElementById('subjectTemplate');
const examTemplate = document.getElementById('examTemplate');
const subjectsContainer = document.getElementById('subjectsContainer');

/**
 * Fonction d'initialisation exécutée au chargement de la page
 */
function initApp() {
    // Initialiser le système de thème
    initThemeSystem();
    
    // Configurer la validation du nombre de matières
    setupSubjectNumberValidation();
    
    // Gérer les événements des boutons principaux
    setupMainButtons();
}

/**
 * Configure la validation du nombre de matières
 */
function setupSubjectNumberValidation() {
    const numberOfSubjectsInput = document.getElementById('numberOfSubjects');
    numberOfSubjectsInput.addEventListener('input', () => {
        const value = parseInt(numberOfSubjectsInput.value);
        if (isNaN(value) || value < 1) {
            numberOfSubjectsInput.classList.add('border-red-500');
            numberOfSubjectsInput.classList.remove('border-gray-300', 'dark:border-gray-600');
        } else {
            numberOfSubjectsInput.classList.remove('border-red-500');
            numberOfSubjectsInput.classList.add('border-gray-300', 'dark:border-gray-600');
        }
    });
}

/**
 * Configure les événements pour les boutons principaux
 */
function setupMainButtons() {
    // Bouton de création des matières
    document.getElementById('createSubjectsBtn').addEventListener('click', () => {
        const numSubjects = parseInt(document.getElementById('numberOfSubjects').value);
        const validation = validateNumberOfSubjects(numSubjects);
        
        if (!validation.isValid) {
            showError(validation.message);
            return;
        }
        
        // Vider le conteneur de matières
        subjectsContainer.innerHTML = '';
        
        // Créer les cartes pour chaque matière
        for (let i = 0; i < numSubjects; i++) {
            createSubjectCard(i + 1, subjectTemplate, examTemplate, subjectsContainer, updatePercentageTotal);
        }
        
        // Passer à l'étape 2
        document.getElementById('step1').classList.add('hidden');
        document.getElementById('step2').classList.remove('hidden');
    });
    
    // Bouton de calcul
    document.getElementById('calculateBtn').addEventListener('click', () => {
        const subjects = document.querySelectorAll('.subject-card');
        const result = calculateGeneralAverage(subjects);
        
        if (!result) return; // Une erreur s'est produite
        
        detailedData = result;
        displayResults(detailedData);
        
        // Passer à l'étape 3
        document.getElementById('step2').classList.add('hidden');
        document.getElementById('step3').classList.remove('hidden');
    });
    
    // Bouton de réinitialisation
    document.getElementById('resetBtn').addEventListener('click', () => {
        document.getElementById('step3').classList.add('hidden');
        document.getElementById('step1').classList.remove('hidden');
    });
    
    // Boutons d'export
    document.getElementById('exportCSV').addEventListener('click', () => {
        exportToCSV(detailedData, 'moyennes.csv');
    });
    
    document.getElementById('exportJSON').addEventListener('click', () => {
        exportToJSON(detailedData, 'moyennes.json');
    });
    
    document.getElementById('exportPDF').addEventListener('click', () => {
        exportToPDF(detailedData, 'moyennes.pdf');
    });
}

/**
 * Affiche les résultats dans l'interface utilisateur
 * @param {Object} data - Données à afficher
 */
function displayResults(data) {
    // Afficher la moyenne générale
    document.getElementById('finalAverage').textContent = `${data.averageTotal.toFixed(2)}/20`;
    
    // Afficher le message d'évaluation
    const evaluationResult = getEvaluationMessage(data.averageTotal);
    const evaluationElement = document.getElementById('evaluation-message');
    evaluationElement.textContent = evaluationResult.message;
    evaluationElement.className = `mt-2 p-3 rounded-lg font-medium ${evaluationResult.colorClass}`;
    
    // Afficher le détail par matière dans le tableau
    const tableBody = document.getElementById('detailedTableBody');
    tableBody.innerHTML = '';
    
    data.subjects.forEach(subject => {
        const row = document.createElement('tr');
        row.classList.add('border-b', 'dark:border-gray-700');
        
        // Colonne matière
        const nameCell = document.createElement('td');
        nameCell.classList.add('py-2', 'px-4', 'border-b', 'border-gray-300', 'dark:border-gray-600');
        nameCell.textContent = subject.name;
        row.appendChild(nameCell);
        
        // Colonne coefficient
        const weightCell = document.createElement('td');
        weightCell.classList.add('py-2', 'px-4', 'border-b', 'border-gray-300', 'dark:border-gray-600');
        weightCell.textContent = subject.weight;
        row.appendChild(weightCell);
        
        // Colonne épreuves
        const examsCell = document.createElement('td');
        examsCell.classList.add('py-2', 'px-4', 'border-b', 'border-gray-300', 'dark:border-gray-600');
        
        // Ajouter chaque épreuve
        subject.exams.forEach((exam, index) => {
            const examDiv = document.createElement('div');
            examDiv.classList.add('mb-1');
            examDiv.innerHTML = `Épreuve ${index + 1}: <strong>${exam.grade}/20</strong> (${exam.percentage}%)`;
            examsCell.appendChild(examDiv);
        });
        
        row.appendChild(examsCell);
        
        // Colonne moyenne
        const averageCell = document.createElement('td');
        averageCell.classList.add('py-2', 'px-4', 'border-b', 'border-gray-300', 'dark:border-gray-600', 'text-right');
        averageCell.innerHTML = `<strong>${subject.average.toFixed(2)}/20</strong>`;
        row.appendChild(averageCell);
        
        tableBody.appendChild(row);
    });
    
    // Afficher le récapitulatif par matière
    const subjectResultsContainer = document.getElementById('subjectResults');
    subjectResultsContainer.innerHTML = '';
    
    data.subjects.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('flex', 'justify-between', 'px-2', 'py-1', 'border-b', 'dark:border-gray-700');
        resultItem.innerHTML = `
            <div class="font-medium">${result.name} (coefficient ${result.weight})</div>
            <div>${result.average.toFixed(2)}/20</div>
        `;
        subjectResultsContainer.appendChild(resultItem);
    });
}

// Initialiser l'application lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', initApp);