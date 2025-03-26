// js/ui/components.js

/**
 * Composants UI réutilisables
 */

export function createSubjectCard(subjectNumber, subjectTemplate, examTemplate, subjectsContainer, updatePercentageTotal) {
    const subjectClone = document.importNode(subjectTemplate.content, true);
    const subjectCard = subjectClone.querySelector('.subject-card');
    
    // Ajouter un data-id pour identifier cette matière
    subjectCard.dataset.subjectId = subjectNumber;
    
    // Récupérer l'input de nom et lui donner une valeur par défaut
    const nameInput = subjectCard.querySelector('.subject-name');
    nameInput.value = `Matière ${subjectNumber}`;
    nameInput.placeholder = `Matière ${subjectNumber}`;
    
    // Ajouter une première épreuve par défaut
    addExam(subjectCard.querySelector('.exams-container'), examTemplate, updatePercentageTotal);
    
    // Gérer l'ajout de nouvelles épreuves
    subjectCard.querySelector('.add-exam').addEventListener('click', (e) => {
        const examsContainer = e.target.closest('.subject-card').querySelector('.exams-container');
        addExam(examsContainer, examTemplate, updatePercentageTotal);
        updatePercentageTotal(e.target.closest('.subject-card'));
    });
    
    // Ajouter l'événement pour mettre à jour le total des pourcentages
    subjectCard.addEventListener('input', (e) => {
        if (e.target.classList.contains('exam-percentage')) {
            updatePercentageTotal(e.target.closest('.subject-card'));
        }
    });
    
    // Ajouter la carte au container
    subjectsContainer.appendChild(subjectCard);
    
    // Initialiser le pourcentage total
    updatePercentageTotal(subjectCard);
}

export function addExam(examsContainer, examTemplate, updatePercentageTotal) {
    const examClone = document.importNode(examTemplate.content, true);
    const examItem = examClone.querySelector('.exam-item');
    
    // Définir des valeurs par défaut
    examItem.querySelector('.exam-grade').value = '';
    examItem.querySelector('.exam-percentage').value = '100';
    
    // Gérer la suppression d'épreuves
    examItem.querySelector('.remove-exam').addEventListener('click', (e) => {
        const subjectCard = e.target.closest('.subject-card');
        e.target.closest('.exam-item').remove();
        updatePercentageTotal(subjectCard);
    });
    
    examsContainer.appendChild(examItem);
}

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