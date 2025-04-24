import { showMessage } from "../ui/notifications.js";

/**
 * Crée une carte matière avec un modèle donné
 * @param {number} subjectNumber - Numéro de la matière
 * @param {HTMLTemplateElement} subjectTemplate - Modèle de la carte matière
 * @param {HTMLTemplateElement} examTemplate - Modèle de l'épreuve
 * @param {HTMLElement} subjectsContainer - Conteneur pour les cartes matières
 * @param {Function} updatePercentageTotal - Fonction pour mettre à jour le total des pourcentages
 */ 
export function createSubjectCard(subjectNumber, subjectTemplate, examTemplate, subjectsContainer, updatePercentageTotal) {
    const subjectClone = document.importNode(subjectTemplate.content, true);
    const subjectCard = subjectClone.querySelector('.subject-card');
    
    // Data-id pour identifier cette matière
    subjectCard.dataset.subjectId = subjectNumber;
    
    // Récupérer l'input de nom et lui donner une valeur par défaut
    const nameInput = subjectCard.querySelector('.subject-name');
    nameInput.value = `Matière ${subjectNumber}`;
    nameInput.placeholder = `Matière ${subjectNumber}`;
    
    // Slecteurs de bloc et semestre si nécessaire
    addBlockAndSemesterSelectors(subjectCard);
    
    // Une première épreuve par défaut
    addExam(subjectCard.querySelector('.exams-container'), examTemplate, updatePercentageTotal);
    
    // Pour gérer l'ajout de nouvelles épreuves
    subjectCard.querySelector('.add-exam').addEventListener('click', (e) => {
        const examsContainer = e.target.closest('.subject-card').querySelector('.exams-container');
        addExam(examsContainer, examTemplate, updatePercentageTotal);
        updatePercentageTotal(e.target.closest('.subject-card'));
    });
    
    // Evénement pour mettre à jour le total des pourcentages
    subjectCard.addEventListener('input', (e) => {
        if (e.target.classList.contains('exam-percentage')) {
            updatePercentageTotal(e.target.closest('.subject-card'));
        }
    });
    
    // Pour ajouter la carte au container
    subjectsContainer.appendChild(subjectCard);
    
    // Initialiser le pourcentage total
    updatePercentageTotal(subjectCard);
}

/**
 * Ajoute les sélecteurs de bloc et semestre à une carte matière
 * @param {HTMLElement} subjectCard - La carte matière à compléter
 */
function addBlockAndSemesterSelectors(subjectCard) {
    // Récupérer la configuration depuis le localStorage
    let config;
    try {
        const savedData = localStorage.getItem('gradeCalculatorData');
        config = savedData ? JSON.parse(savedData) : null;
    } catch (e) {
        console.error("Erreur lors du chargement des données:", e);
        return;
    }
    
    if (!config) return;
    
    // Pour créer le conteneur pour les sélecteurs s'il n'existe pas déjà
    let selectorContainer = subjectCard.querySelector('.selector-container');
    if (!selectorContainer) {
        selectorContainer = document.createElement('div');
        selectorContainer.className = 'mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 selector-container';
        
        // Insérer après la div qui contient le nom et le coefficient
        const firstSection = subjectCard.querySelector('.mb-4');
        if (firstSection) {
            firstSection.insertAdjacentElement('afterend', selectorContainer);
        } else {
            subjectCard.prepend(selectorContainer);
        }
    } else {
        selectorContainer.innerHTML = '';
    }
    
    // On ajoute le sélecteur de bloc si nécessaire
    if (config.hasBlocks && config.blocks && config.blocks.length > 0) {
        const blockSelector = document.createElement('div');
        let blocksOptions = '';
        
        // Pour générer les options pour tous les blocs
        config.blocks.forEach(block => {
            blocksOptions += `<option value="${block.id}">${block.name}</option>`;
        });
        
        blockSelector.innerHTML = `
            <label class="block mb-2">Bloc</label>
            <select class="subject-block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-base">
                ${blocksOptions}
            </select>
        `;
        selectorContainer.appendChild(blockSelector);
    }
    
    // On ajouter le sélecteur de semestre si nécessaire
    if (config.hasSemesters && config.semesters && config.semesters.length > 0) {
        const semesterSelector = document.createElement('div');
        let semestersOptions = '';
        
        // Pour générer les options pour tous les semestres
        config.semesters.forEach(semester => {
            semestersOptions += `<option value="${semester.id}">${semester.name}</option>`;
        });
        
        semesterSelector.innerHTML = `
            <label class="block mb-2">Semestre</label>
            <select class="subject-semester w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-base">
                ${semestersOptions}
            </select>
        `;
        selectorContainer.appendChild(semesterSelector);
    }
}

export { addBlockAndSemesterSelectors };


/**
 * Ajoute une nouvelle épreuve à une matière
 * @param {HTMLElement} examsContainer - Le conteneur d'épreuves
 * @param {HTMLTemplateElement} examTemplate - Le modèle d'épreuve
 * @param {Function} updatePercentageTotal - Fonction pour mettre à jour le total des pourcentages
 */
export function addExam(examsContainer, examTemplate, updatePercentageTotal) {
    const examClone = document.importNode(examTemplate.content, true);
    const examItem = examClone.querySelector('.exam-item');
    
    // Pour définir des valeurs par défaut
    examItem.querySelector('.exam-grade').value = '';
    examItem.querySelector('.exam-percentage').value = '100';
    
    // Pour gérer la suppression d'épreuves
    examItem.querySelector('.remove-exam').addEventListener('click', (e) => {
        const subjectCard = e.target.closest('.subject-card');
        e.target.closest('.exam-item').remove();
        updatePercentageTotal(subjectCard);
    });
    
    examsContainer.appendChild(examItem);

    // Notifier l'utilisateur
    const subjectCard = examsContainer.closest('.subject-card');
    const subjectName = subjectCard?.querySelector('.subject-name')?.value || 'cette matière';
    showMessage(`Nouvelle épreuve ajoutée pour ${subjectName}`, "info");     
}


/**
 * Met à jour le total des pourcentages d'une matière
 * @param {HTMLElement} subjectCard - La carte matière
 */
export function updatePercentageTotal(subjectCard) {
    const percentageInputs = subjectCard.querySelectorAll('.exam-percentage');
    let total = 0;
    
    percentageInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        total += value;
    });
    
    const totalElement = subjectCard.querySelector('.percentage-total');
    totalElement.textContent = `Total: ${total}%`;
    
    // Changer la couleur si le total n'est pas 100%
    if (Math.abs(total - 100) < 0.001) {
        totalElement.classList.remove('text-red-500');
        totalElement.classList.add('text-green-500');
    } else {
        totalElement.classList.remove('text-green-500');
        totalElement.classList.add('text-red-500');
    }
}