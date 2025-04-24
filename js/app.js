/**
 * Point d'entrée de l'application Calculateur de Moyenne
 * Ce fichier initialise l'application et gère les interactions principales
 */

// Importation des modules
import { exportToCSV } from './export/csv.js';
import { exportToPDF } from './export/pdf.js';
import { exportToJSON } from './export/json.js';
import { initThemeSystem } from './ui/themes.js';
import { showMessage, showError } from './ui/notifications.js';
import { validateNumberOfSubjects } from './core/validation.js';
import { calculateAdvancedResults } from './core/advanced-calculator.js';
import { convertData, saveData, loadData, resetAllData } from './core/data-manager.js';
import { createSubjectCard, updatePercentageTotal } from './ui/components.js';
import { calculateGeneralAverage, getEvaluationMessage, calculateResults } from './core/calculator.js';


// Variables globales
let detailedData = null;
const examTemplate = document.getElementById('examTemplate');
const subjectTemplate = document.getElementById('subjectTemplate');
const subjectsContainer = document.getElementById('subjectsContainer');

/**
 * Fonction d'initialisation exécutée au chargement de la page
 */
function initApp() {

    if (!loadData()) {
        resetConfigurationUI();
    }

    // Initialiser le système de thème
    initThemeSystem();
    
    // Configurer la validation du nombre de matières
    setupSubjectNumberValidation();
    
    // Gérer les événements des boutons principaux
    setupMainButtons();

    // Initialiser la configuration avancée
    setupAdvancedConfig();

    document.getElementById('step0')?.classList.remove('hidden');
    document.getElementById('step1')?.classList.add('hidden');
    document.getElementById('step2')?.classList.add('hidden');
    document.getElementById('step3')?.classList.add('hidden');

    // Configurer les écouteurs pour les boutons d'export
    setupExportButtons();
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

    // Récupérer la configuration
    const config = loadData();

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
    
    // Bouton de calcul des moyennes
    document.getElementById('calculateBtn').addEventListener('click', () => {
        // Obtenir les données à jour
        const data = synchronizeData();
        
        if (!data) {
            showError("Erreur lors de la récupération des données");
            return;
        }

        // Vérifier qu'au moins une matière contient des examens avec des notes
        let hasGrades = false;
        let emptySubjectsCount = 0;
        
        data.subjects.forEach(subject => {
            if (subject.exams && subject.exams.length > 0) {
                hasGrades = true;
            } else {
                emptySubjectsCount++;
            }
        });
        
        if (!hasGrades) {
            showError("Veuillez saisir au moins une note avant de calculer la moyenne");
            return;
        }
        
        if (emptySubjectsCount > 0) {
            // Simple avertissement si certaines matières n'ont pas de notes
            showMessage(`Attention : ${emptySubjectsCount} matière${emptySubjectsCount > 1 ? 's n\'ont' : ' n\'a'} pas de notes.`, "warning");
        }
        
        // Calcul des résultats
        let results;
        if (data.hasBlocks || data.hasSemesters) {
            results = calculateAdvancedResults(data);
        } else {
            results = calculateResults(data);
        }
        
        // Mettre à jour l'aperçu de la structure avec les matières configurées
        generateStructurePreview();
        
        // Afficher les résultats
        displayResults(results);
        
        // Passer à l'étape suivante
        document.getElementById('step2').classList.add('hidden');
        document.getElementById('step3').classList.remove('hidden');
    });

    // Bouton de réinitialisation
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm("Voulez-vous vraiment recommencer? Toutes vos données seront perdues.")) {
            // Réinitialiser complètement les données
            resetAllData();
            localStorage.clear();
            
            // Réinitialiser l'interface utilisateur
            resetConfigurationUI();
            
            // Vider le conteneur de matières
            if (subjectsContainer) {
                subjectsContainer.innerHTML = '';
            }
            
            // Masquer le résumé de structure
            const structurePreview = document.getElementById('structurePreview');
            if (structurePreview) {
                structurePreview.classList.add('hidden');
            }
            
            // Masquer toutes les étapes sauf l'étape 0
            document.getElementById('step3').classList.add('hidden');
            document.getElementById('step2').classList.add('hidden');
            document.getElementById('step1').classList.add('hidden');
            document.getElementById('step0').classList.remove('hidden');
            
            // Effacer la variable globale des données détaillées
            detailedData = null;
            
        }
    });
    
    // Boutons d'export
    document.getElementById('exportCSV').addEventListener('click', () => {
        exportToCSV(detailedData, 'releve-notes.csv');
    });
    document.getElementById('exportJSON').addEventListener('click', () => {
        exportToJSON(detailedData, 'releve-notes.json');
    });
    document.getElementById('exportPDF').addEventListener('click', () => {
        exportToPDF(detailedData, 'releve-notes.pdf');
    });
}

/**
 * Affiche l'étape 1 de l'application
 */
function showStep1() {
    document.getElementById('step0').classList.add('hidden');
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step3').classList.add('hidden');
    document.getElementById('step1').classList.remove('hidden');
    
    generateStructurePreview();
}

/**
 * Affiche les résultats dans l'interface utilisateur
 * @param {Object} data - Données à afficher
 */
function displayResults(data) {

    // Déterminer la moyenne à afficher selon le type de résultat
    let averageToDisplay;
    
    if (data.overall && typeof data.overall.average !== 'undefined') {
        // Résultats avancés avec blocs/semestres
        averageToDisplay = data.overall.average;
    } else if (typeof data.averageTotal !== 'undefined') {
        // Résultats standards
        averageToDisplay = data.averageTotal;
    } else {
        // Calcul de secours si aucune moyenne n'est disponible
        averageToDisplay = calculateGeneralAverage(data.subjects);
    }
    
    // Afficher la moyenne générale
    document.getElementById('finalAverage').textContent = `${averageToDisplay.toFixed(2)}/20`;
    
    // Afficher le message d'évaluation
    const evaluationResult = getEvaluationMessage(averageToDisplay);
    const evaluationElement = document.getElementById('evaluation-message');
    evaluationElement.textContent = evaluationResult.message;
    evaluationElement.className = `mt-2 p-3 rounded-lg font-medium ${evaluationResult.colorClass}`;
    
    // Stocker les données pour l'export
    detailedData = data;
    
        // Afficher le détail par matière dans le tableau
    const tableBody = document.getElementById('detailedTableBody');
    tableBody.innerHTML = '';
    
    // Vérifier que data.subjects existe avant de continuer
    if (!data.subjects || !Array.isArray(data.subjects)) {
        console.error("Les données des matières sont invalides", data);
        return;
    }
    
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
        
        // Vérifier que subject.exams existe avant d'itérer dessus
        if (subject.exams && Array.isArray(subject.exams) && subject.exams.length > 0) {
            subject.exams.forEach((exam, index) => {
                const examDiv = document.createElement('div');
                examDiv.classList.add('mb-1');
                examDiv.innerHTML = `Épreuve ${index + 1}: <strong>${exam.grade}/20</strong> (${exam.percentage}%)`;
                examsCell.appendChild(examDiv);
            });
        } else {
            examsCell.textContent = "Aucune épreuve enregistrée";
        }
        
        row.appendChild(examsCell);
        
        // Colonne moyenne
        const averageCell = document.createElement('td');
        averageCell.classList.add('py-2', 'px-4', 'border-b', 'border-gray-300', 'dark:border-gray-600', 'text-right');
        averageCell.innerHTML = `<strong>${subject.average.toFixed(2)}/20</strong>`;
        row.appendChild(averageCell);
        
        tableBody.appendChild(row);
    });
    

    // Affichage des résultats spécifiques aux blocs et semestres
    if (data.blocks || data.semesters) {
        displayAdvancedResults(data);
    }
    
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

/**
 * Configure la section avancée de l'application
 */
function setupAdvancedConfig() {
    const hasBlocksCheckbox = document.getElementById('hasBlocks');
    const hasSemestersCheckbox = document.getElementById('hasSemesters');
    
    hasBlocksCheckbox.addEventListener('change', function() {
        document.getElementById('blocksConfig').classList.toggle('hidden', !this.checked);
        document.getElementById('blockCompensationContainer').classList.toggle('hidden', !this.checked);
    });
    
    hasSemestersCheckbox.addEventListener('change', function() {
        document.getElementById('semestersConfig').classList.toggle('hidden', !this.checked);
    });
    
    // Gestion des ajouts de semestres et blocs
    document.getElementById('addSemesterBtn').addEventListener('click', function() {
        const semestersContainer = document.getElementById('semestersContainer');
        const semesterCount = semestersContainer.children.length + 1;
        
        const semesterDiv = document.createElement('div');
        semesterDiv.className = 'flex items-center gap-2';
        semesterDiv.innerHTML = `
        <input type="text" class="semester-name flex-grow px-2 py-1 border rounded dark:bg-gray-600 dark:border-gray-500" 
                value="Semestre ${semesterCount}" data-id="${semesterCount}">
        <button class="remove-btn text-red-500">×</button>
        `;
        
        semesterDiv.querySelector('.remove-btn').addEventListener('click', function() {
        semesterDiv.remove();
        });
        
        semestersContainer.appendChild(semesterDiv);
    });   
    
    document.getElementById('addBlockBtn')?.addEventListener('click', function() {
        const blocksContainer = document.getElementById('blocksContainer');
        const blockCount = blocksContainer.children.length + 1;
        
        const blockDiv = document.createElement('div');
        blockDiv.className = 'bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-3';
        
        blockDiv.innerHTML = `
            <div class="flex items-center gap-2 mb-2">
                <input type="text" class="block-name flex-grow px-2 py-1 border rounded dark:bg-gray-600 dark:border-gray-500" 
                       value="Bloc ${blockCount}" data-id="${blockCount}">
                <button class="remove-block-btn text-red-500 hover:text-red-700">×</button>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Ce bloc regroupera des matières de n'importe quel semestre</p>
        `;
        
        blockDiv.querySelector('.remove-block-btn').addEventListener('click', function() {
            blockDiv.remove();
        });
        
        blocksContainer.appendChild(blockDiv);
    });
    
    // Sauvegarde de la configuration
    document.getElementById('saveConfigBtn').addEventListener('click', function() {
    try {
        const config = {
            hasBlocks: hasBlocksCheckbox.checked,
            hasSemesters: hasSemestersCheckbox.checked,
            compensationBetweenSubjects: document.getElementById('compensationSubjects').checked,
            compensationBetweenBlocks: document.getElementById('compensationBlocks').checked,
            validationThreshold: parseFloat(document.getElementById('validationThreshold').value)
        };
    
        // Récupérer les semestres configurés
        if (config.hasSemesters) {
            config.semesters = [];
            document.querySelectorAll('#semestersContainer > div').forEach((semesterEl) => {
                const nameInput = semesterEl.querySelector('.semester-name');
                config.semesters.push({
                id: parseInt(nameInput.dataset.id),
                name: nameInput.value
                });
            });

            if (config.semesters.length === 0) {
                throw new Error("Vous avez activé les semestres mais n'en avez configuré aucun");
            }
        }
        
        // Récupérer les blocs configurés
        if (config.hasBlocks) {
            config.blocks = [];
            document.querySelectorAll('#blocksContainer > div').forEach((blockEl) => {
                const nameInput = blockEl.querySelector('.block-name');
                const blockConfig = {
                    id: parseInt(nameInput.dataset.id),
                    name: nameInput.value
                };
            
                // Si les semestres sont activés, récupérer le semestre associé
                if (config.hasSemesters) {
                    const semesterSelect = blockEl.querySelector('.block-semester');
                    if (semesterSelect) {
                        blockConfig.semesterId = parseInt(semesterSelect.value);
                    }
                }
                
                config.blocks.push(blockConfig);
            });
            
            // Déplacer la vérification hors de la boucle
            if (config.blocks.length === 0) {
                throw new Error("Vous avez activé les blocs mais n'en avez configuré aucun");
            }
        }
        
        // Convertir les données existantes si nécessaire
        const existingData = loadData();
        let dataToSave;
        
        if (existingData) {
            try {
                dataToSave = convertData(existingData, config);
            } catch (conversionError) {
                showError("Erreur lors de la conversion des données: " + conversionError.message);
                console.error(conversionError);
                return; // Arrêter l'exécution en cas d'erreur
            }
        } else {
            dataToSave = config;
        }
        
        // Sauvegarder les données, et générer l'aperçu
        saveData(dataToSave);
        showMessage("Configuration enregistrée avec succès !", "success");
        generateStructurePreview();
        showStep1();
        
    } catch (error) {
        showError("Erreur de configuration: " + error.message);
        console.error(error);
        return;
    }
    });
}

/**
* Génère les options pour la liste déroulante des semestres
* @returns {string} HTML des options
*/
function getSemesterOptions() {
    let options = '';
    const semestersContainer = document.getElementById('semestersContainer');
    
    // Si aucun semestre n'est défini, créer une option par défaut
    if (!semestersContainer || semestersContainer.children.length === 0) {
        return '<option value="1">Semestre 1</option>';
    }
    
    // Sinon, créer une option pour chaque semestre défini
    Array.from(semestersContainer.children).forEach(semesterDiv => {
        const nameInput = semesterDiv.querySelector('.semester-name');
        if (nameInput) {
            const id = nameInput.dataset.id;
            const name = nameInput.value;
            options += `<option value="${id}">${name}</option>`;
        }
    });
    
    return options;
}

/**
 * Affiche les résultats avancés (blocs et semestres)
 * @param {Object} data - Données à afficher
 */
function displayAdvancedResults(data) {

    // Vérifications préliminaires pour éviter des erreurs
    if (!data) {
        console.error("Données invalides pour l'affichage avancé", data);
        return;
    }
    
    // Afficher le statut de validation globale
    const validationStatus = document.getElementById('validationStatus');
    const validationMessage = document.getElementById('validationMessage');
    
    if (validationStatus && validationMessage && data.overall && typeof data.overall.validated !== 'undefined') {
        validationStatus.classList.remove('hidden');
        
        if (data.overall.validated) {
            validationMessage.textContent = 'Année validée ✓';
            validationMessage.className = 'text-xl font-bold text-green-600 dark:text-green-400';
            validationStatus.classList.add('bg-green-50', 'dark:bg-green-900/20');
            validationStatus.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'bg-red-50', 'dark:bg-red-900/20');
            showMessage("Félicitations ! Votre année est validée.", "success");
        } else {
            validationMessage.textContent = 'Année non validée ✗';
            validationMessage.className = 'text-xl font-bold text-red-600 dark:text-red-400';
            validationStatus.classList.add('bg-red-50', 'dark:bg-red-900/20');
            validationStatus.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'bg-green-50', 'dark:bg-green-900/20');
            const failedBlocks = data.blocks.filter(b => !b.validated);
            if (failedBlocks.length > 0) {
                const blockNames = failedBlocks.map(b => b.name).join(", ");
                showMessage(`Blocs à améliorer : ${blockNames}`, "warning");
            }
        }
    } else if (validationStatus) {
        validationStatus.classList.add('hidden');
    }
    
    // Afficher les résultats par semestre
    const semesterResults = document.getElementById('semesterResults');
    const semestersContainer = document.getElementById('semestersResultsContainer');
    
    if (data.semesters && data.semesters.length) {
        semesterResults.classList.remove('hidden');
        semestersContainer.innerHTML = '';
        
        data.semesters.forEach(semester => {
            const semesterCard = document.createElement('div');
            const semesterSubjects = data.subjects.filter(s => s.semesterId === semester.id);
            const subjectCount = semesterSubjects.length;
            
            semesterCard.className = 'bg-white dark:bg-gray-800 rounded-lg shadow p-4';
            semesterCard.innerHTML = `
                <h4 class="text-lg font-semibold mb-2">${semester.name}</h4>
                <p class="text-2xl font-bold mb-2">${semester.average.toFixed(2)}/20</p>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                    ${subjectCount} matière${subjectCount !== 1 ? 's' : ''}
                </div>
            `;
            
            semestersContainer.appendChild(semesterCard);
        });
    } else {
        semesterResults.classList.add('hidden');
    }
    
    // Afficher les résultats par bloc
    const blockResults = document.getElementById('blockResults');
    const blocksContainer = document.getElementById('blocksResultsContainer');
    
    if (data.blocks && data.blocks.length) {
        blockResults.classList.remove('hidden');
        blocksContainer.innerHTML = '';
        
        data.blocks.forEach(block => {
            const blockCard = document.createElement('div');
            const isValidated = block.validated;
            
            blockCard.className = `rounded-lg shadow p-4 ${
                isValidated 
                    ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' 
                    : 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
            }`;

            const threshold = data.validationThreshold;

            blockCard.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <h4 class="text-lg font-semibold">${block.name}</h4>
                    <span class="${isValidated ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-bold">
                        ${isValidated ? 'Validé ✓' : 'Non validé ✗'}
                    </span>
                </div>
                <p class="text-2xl font-bold mb-2">${block.average.toFixed(2)}/20</p>
                <div class="text-sm ${isValidated ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
                    Seuil de validation: ${threshold}/20
                </div>
            `;
            
            // Ajouter la liste des matières du bloc
            if (block.subjects && block.subjects.length > 0) {
                const subjectsList = document.createElement('div');
                subjectsList.className = 'mt-3 pt-3 border-t border-gray-200 dark:border-gray-700';
                
                const subjectHeader = document.createElement('p');
                subjectHeader.className = 'text-sm font-medium mb-2';
                subjectHeader.textContent = 'Matières incluses:';
                subjectsList.appendChild(subjectHeader);
                
                const subjectsGrid = document.createElement('div');
                subjectsGrid.className = 'grid grid-cols-1 gap-1';
                
                // Important: correction de la façon dont les matières sont ajoutées
                block.subjects.forEach(subject => {
                    const subjectItem = document.createElement('div');
                    subjectItem.className = 'flex justify-between text-sm py-1';
                    subjectItem.innerHTML = `
                        <span>${subject.name}</span>
                        <span class="font-medium">${subject.average.toFixed(2)}/20</span>
                    `;
                    subjectsGrid.appendChild(subjectItem);
                });
                
                subjectsList.appendChild(subjectsGrid);
                blockCard.appendChild(subjectsList);
            } else {
                const emptyMsg = document.createElement('p');
                emptyMsg.className = 'text-sm text-gray-500 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700';
                emptyMsg.textContent = 'Aucune matière associée à ce bloc';
                blockCard.appendChild(emptyMsg);
            }
            
            blocksContainer.appendChild(blockCard);
        });
    } else {
        blockResults.classList.add('hidden');
    }
}


/**
 * Génère un aperçu visuel amélioré de la structure année/semestres/blocs/matières
 */
function generateStructurePreview() {
    const config = synchronizeData() || loadData();
    if (!config) {
        document.getElementById('structurePreview').classList.add('hidden');
        return;
    }
    
    // Vérifier si des blocs ou des semestres sont configurés
    if ((!config.hasBlocks || !config.blocks || config.blocks.length === 0) &&
        (!config.hasSemesters || !config.semesters || config.semesters.length === 0)) {
        document.getElementById('structurePreview').classList.add('hidden');
        return;
    }
    
    document.getElementById('structurePreview').classList.remove('hidden');
    const previewContainer = document.getElementById('structurePreview');
    previewContainer.innerHTML = '';
    previewContainer.className = 'mb-6 bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md';
    
    // En-tête avec titre et icône
    const header = document.createElement('div');
    header.className = 'flex items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700';
    header.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="text-lg font-semibold text-blue-600 dark:text-blue-400">Structure de votre année</h3>
    `;
    previewContainer.appendChild(header);
    
    // Récupérer les matières configurées (si elles existent)
    const subjects = config.subjects || [];
    
    // Si l'organisation est par semestre, afficher d'abord les semestres
    if (config.hasSemesters && config.semesters && config.semesters.length > 0) {
        const semestersContainer = document.createElement('div');
        semestersContainer.className = 'space-y-6 mb-4';
        
        config.semesters.forEach(semester => {
            // Section semestre
            const semesterSection = document.createElement('div');
            semesterSection.className = 'border border-purple-100 dark:border-purple-900 rounded-lg overflow-hidden';
            
            // En-tête du semestre
            const semesterHeader = document.createElement('div');
            semesterHeader.className = 'bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-3 border-b border-purple-100 dark:border-purple-800 flex justify-between items-center';
            
            // Matières du semestre
            const semesterSubjects = subjects.filter(s => s.semesterId === semester.id);
            
            semesterHeader.innerHTML = `
                <h4 class="font-semibold text-purple-700 dark:text-purple-300 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    ${semester.name}
                </h4>
                <span class="bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full">
                    ${semesterSubjects.length} matière${semesterSubjects.length !== 1 ? 's' : ''}
                </span>
            `;
            
            semesterSection.appendChild(semesterHeader);
            
            // Blocs dans ce semestre
            const semesterContent = document.createElement('div');
            semesterContent.className = 'p-3';
            
            // Collecter les blocs associés à ce semestre
            let semesterBlocks = [];
            
            if (config.hasBlocks && config.blocks) {
                // Option 1: Blocs explicitement associés au semestre
                semesterBlocks = config.blocks.filter(b => b.semesterId === semester.id);
                
                // Option 2: Si aucun bloc n'est explicitement associé, chercher les blocs qui contiennent des matières du semestre
                if (semesterBlocks.length === 0) {
                    const semesterSubjectsIds = semesterSubjects.map(s => s.id);
                    
                    config.blocks.forEach(block => {
                        // Vérifier si ce bloc contient des matières de ce semestre
                        const blockSubjects = subjects.filter(s => s.blockId === block.id);
                        const hasSubjectsInSemester = blockSubjects.some(s => s.semesterId === semester.id);
                        
                        if (hasSubjectsInSemester) {
                            // Ne pas ajouter de doublons
                            if (!semesterBlocks.some(b => b.id === block.id)) {
                                semesterBlocks.push(block);
                            }
                        }
                    });
                }
            }
            
            if (semesterBlocks.length > 0) {
                // Créer une grille pour les blocs
                const blocksGrid = document.createElement('div');
                blocksGrid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2';
                
                // Afficher chaque bloc du semestre
                semesterBlocks.forEach(block => {
                    // Matières de ce bloc dans ce semestre
                    const blockSubjectsInSemester = subjects.filter(s => 
                        s.blockId === block.id && s.semesterId === semester.id
                    );
                    
                    // Créer la carte de bloc
                    const blockCard = document.createElement('div');
                    blockCard.className = 'bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 shadow-sm border border-blue-100 dark:border-blue-800';
                    
                    // En-tête du bloc avec nombre de matières
                    const blockHeader = document.createElement('div');
                    blockHeader.className = 'flex justify-between items-center mb-2';
                    blockHeader.innerHTML = `
                        <h5 class="font-medium text-blue-700 dark:text-blue-300">${block.name}</h5>
                        <span class="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
                            ${blockSubjectsInSemester.length} matière${blockSubjectsInSemester.length !== 1 ? 's' : ''}
                        </span>
                    `;
                    blockCard.appendChild(blockHeader);
                    
                    // Liste des matières de ce bloc dans ce semestre
                    if (blockSubjectsInSemester.length > 0) {
                        const subjectsList = document.createElement('div');
                        subjectsList.className = 'space-y-1.5';
                        
                        blockSubjectsInSemester.forEach((subject, index) => {
                            const subjectItem = document.createElement('div');
                            subjectItem.className = 'flex items-center p-1.5 bg-white dark:bg-gray-700 rounded border-l-3 border-indigo-400';
                            
                            subjectItem.innerHTML = `
                                <span class="w-5 h-5 flex items-center justify-center bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded-full text-xs font-medium mr-2">${index + 1}</span>
                                <span class="text-sm">${subject.name}</span>
                                <span class="ml-auto text-xs text-gray-500 dark:text-gray-400">Coef. ${subject.weight}</span>
                            `;
                            
                            subjectsList.appendChild(subjectItem);
                        });
                        
                        blockCard.appendChild(subjectsList);
                    } else {
                        // Afficher un message si le bloc n'a pas de matières dans ce semestre
                        const emptyMessage = document.createElement('div');
                        emptyMessage.className = 'text-center text-sm text-gray-500 dark:text-gray-400 py-2';
                        emptyMessage.textContent = 'Aucune matière dans ce semestre';
                        blockCard.appendChild(emptyMessage);
                    }
                    
                    blocksGrid.appendChild(blockCard);
                });
                
                semesterContent.appendChild(blocksGrid);
            } else if (semesterSubjects.length > 0) {
                // S'il n'y a pas de blocs mais des matières, les afficher directement
                const subjectsList = document.createElement('div');
                subjectsList.className = 'space-y-2';
                
                semesterSubjects.forEach((subject, index) => {
                    const subjectItem = document.createElement('div');
                    subjectItem.className = 'flex items-center p-2 bg-white dark:bg-gray-700 rounded-md border-l-4 border-purple-400';
                    
                    subjectItem.innerHTML = `
                        <span class="w-6 h-6 flex items-center justify-center bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 rounded-full text-xs font-medium mr-3">${index + 1}</span>
                        <span class="text-sm">${subject.name}</span>
                        <span class="ml-auto text-xs text-gray-500 dark:text-gray-400">Coef. ${subject.weight}</span>
                    `;
                    
                    subjectsList.appendChild(subjectItem);
                });
                
                semesterContent.appendChild(subjectsList);
            } else {
                // Message si aucune matière n'est associée à ce semestre
                const emptyState = document.createElement('div');
                emptyState.className = 'flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-500 dark:text-gray-400 text-sm';
                emptyState.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span>Aucune matière dans ce semestre</span>
                `;
                semesterContent.appendChild(emptyState);
            }
            
            semesterSection.appendChild(semesterContent);
            semestersContainer.appendChild(semesterSection);
        });
        
        previewContainer.appendChild(semestersContainer);
    }
    
    // Si les blocs sont activés, afficher également une vue uniquement par blocs
    if (config.hasBlocks && config.blocks && config.blocks.length > 0 && !config.hasSemesters) {
        // Section blocs avec style carte
        const blocksTitle = document.createElement('h4');
        blocksTitle.className = 'font-medium text-gray-700 dark:text-gray-300 mb-3';
        blocksTitle.textContent = 'Organisation par blocs';
        previewContainer.appendChild(blocksTitle);
        
        const blocksGrid = document.createElement('div');
        blocksGrid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4';
        
        config.blocks.forEach(block => {
            // Chercher les matières associées à ce bloc
            const blockSubjects = subjects.filter(s => s.blockId === block.id);
            const subjectCount = blockSubjects.length;
            
            // Créer la carte de bloc
            const blockCard = document.createElement('div');
            blockCard.className = 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-blue-800 transition-all hover:shadow-md';
            
            // En-tête du bloc avec compteur de matières
            const blockHeader = document.createElement('div');
            blockHeader.className = 'flex justify-between items-center mb-3';
            blockHeader.innerHTML = `
                <h4 class="font-semibold text-blue-800 dark:text-blue-300">${block.name}</h4>
                <span class="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full">${subjectCount} matière${subjectCount !== 1 ? 's' : ''}</span>
            `;
            blockCard.appendChild(blockHeader);
            
            // Si des matières sont associées à ce bloc, les afficher avec un style amélioré
            if (blockSubjects && blockSubjects.length > 0) {
                const subjectsContainer = document.createElement('div');
                subjectsContainer.className = 'space-y-2';
                
                blockSubjects.forEach((subject, index) => {
                    const subjectItem = document.createElement('div');
                    subjectItem.className = 'flex items-center p-2 bg-white dark:bg-gray-700 rounded-md border-l-4 border-indigo-400';
                    
                    // Ajouter un numéro et le nom de la matière
                    subjectItem.innerHTML = `
                        <span class="w-6 h-6 flex items-center justify-center bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-medium mr-3">${index + 1}</span>
                        <span class="text-sm">${subject.name}</span>
                        <span class="ml-auto text-xs text-gray-500 dark:text-gray-400">Coef. ${subject.weight}</span>
                    `;
                    
                    subjectsContainer.appendChild(subjectItem);
                });
                
                blockCard.appendChild(subjectsContainer);
            } else {
                // Message si aucune matière n'est associée
                const emptyState = document.createElement('div');
                emptyState.className = 'flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-500 dark:text-gray-400 text-sm';
                emptyState.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span>Aucune matière associée</span>
                `;
                blockCard.appendChild(emptyState);
            }
            
            blocksGrid.appendChild(blockCard);
        });
        
        previewContainer.appendChild(blocksGrid);
    }
    
    // Ajouter une légende ou une note informative
    if (config.validationThreshold) {
        const note = document.createElement('div');
        note.className = 'mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center';
        note.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Seuil de validation: ${config.validationThreshold}/20 · 
            ${config.compensationBetweenBlocks ? 'Compensation entre blocs activée' : 'Pas de compensation entre blocs'}
        `;
        previewContainer.appendChild(note);
    }
}

/**
 * Configure les écouteurs d'événements pour les boutons d'exportation
 */
function setupExportButtons() {
    // Exportation au format CSV
    document.getElementById('exportCSV')?.addEventListener('click', () => {
        if (!detailedData) {
            showError("Aucune donnée à exporter");
            return;
        }
        synchronizeData();
        exportToCSV(detailedData, 'releve-notes.csv');
    });
    
    // Exportation au format JSON
    document.getElementById('exportJSON')?.addEventListener('click', () => {
        if (!detailedData) {
            showError("Aucune donnée à exporter");
            return;
        }
        synchronizeData();
        exportToJSON(detailedData, 'releve-notes.json');
    });
    
    // Exportation au format PDF
    document.getElementById('exportPDF')?.addEventListener('click', () => {
        if (!detailedData) {
            showError("Aucune donnée à exporter");
            return;
        }
        synchronizeData();
        // Mettre à jour le contenu pour l'export PDF
        document.getElementById('pdfAverage').textContent = 
            `${detailedData.overall?.average?.toFixed(2) || detailedData.averageTotal?.toFixed(2) || '?'}/20`;
        
        // Créer une copie du tableau détaillé pour le PDF
        const pdfTable = document.getElementById('detailedTable').cloneNode(true);
        document.getElementById('pdfTable').innerHTML = '';
        document.getElementById('pdfTable').appendChild(pdfTable);
        
        // Exporter en PDF
        exportToPDF(detailedData, 'releve-notes.pdf');
    });
}


/**
 * Réinitialise l'interface utilisateur de configuration
 */
function resetConfigurationUI() {
    // Réinitialiser les cases à cocher
    document.getElementById('hasSemesters').checked = false;
    document.getElementById('hasBlocks').checked = false;
    document.getElementById('compensationSubjects').checked = true;
    document.getElementById('compensationBlocks').checked = false;
    
    // Masquer les sections blocs et semestres
    document.getElementById('semestersConfig').classList.add('hidden');
    document.getElementById('blocksConfig').classList.add('hidden');
    document.getElementById('blockCompensationContainer').classList.add('hidden');
    
    // Réinitialiser le seuil de validation
    document.getElementById('validationThreshold').value = 10;
    
    // Vider les conteneurs de blocs et semestres
    document.getElementById('blocksContainer').innerHTML = '';
    document.getElementById('semestersContainer').innerHTML = '';
}


/**
 * Synchronise les données entre le localStorage et l'état actuel de l'application
 * À appeler avant d'afficher ou de calculer les résultats
 */
function synchronizeData() {
    // Récupérer la configuration actuelle
    const config = loadData();
    if (!config) return null;
    
    // Récupérer les données actuelles des matières
    const currentSubjects = [];
    
    document.querySelectorAll('.subject-card').forEach((card, index) => {
        const subject = {
            id: parseInt(card.dataset.subjectId) || (index + 1),
            name: card.querySelector('.subject-name').value,
            weight: parseFloat(card.querySelector('.subject-weight').value) || 1,
            exams: []
        };
        
        // Récupérer le bloc si présent
        if (config.hasBlocks) {
            const blockSelect = card.querySelector('.subject-block');
            if (blockSelect) {
                subject.blockId = parseInt(blockSelect.value);
            }
        }
        
        // Récupérer le semestre si présent
        if (config.hasSemesters) {
            const semesterSelect = card.querySelector('.subject-semester');
            if (semesterSelect) {
                subject.semesterId = parseInt(semesterSelect.value);
            }
        }
        
        // Récupérer les examens - CORRECTION ICI
        card.querySelectorAll('.exam-item').forEach(exam => {
            const gradeInput = exam.querySelector('input.exam-grade');
            const percentageInput = exam.querySelector('input.exam-percentage');
            
            if (gradeInput && percentageInput) {
                const grade = parseFloat(gradeInput.value);
                const percentage = parseFloat(percentageInput.value);
                
                if (!isNaN(grade) && !isNaN(percentage)) {
                    subject.exams.push({ grade, percentage });
                }
            }
        });
        
        currentSubjects.push(subject);
    });
    
    // Mettre à jour la configuration
    config.subjects = currentSubjects;
    
    // Sauvegarder les modifications
    saveData(config);
    
    return config;
}

// Initialiser l'application lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', initApp);