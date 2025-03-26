// js/core/validation.js

/**
 * Fonctions de validation des entrées utilisateur
 */

/**
 * Valide le nombre de matières
 * @param {number} value - Nombre de matières saisi
 * @returns {Object} - Résultat de la validation
 */
export function validateNumberOfSubjects(value) {
    const numSubjects = parseInt(value);
    
    if (isNaN(numSubjects)) {
        return { isValid: false, message: 'Veuillez entrer un nombre valide pour le nombre de matières' };
    }
    
    if (numSubjects < 1) {
        return { isValid: false, message: 'Le nombre de matières doit être au moins de 1' };
    }
    
    if (numSubjects > 50) {
        return { isValid: false, message: 'Le nombre de matières ne peut pas dépasser 50 pour des raisons de performance' };
    }
    
    return { isValid: true };
}

/**
 * Valide les pourcentages pour une matière
 * @param {HTMLElement} subjectCard - Élément DOM de la matière
 * @returns {boolean} - True si les pourcentages sont valides
 */
export function validatePercentages(subjectCard) {
    const percentageInputs = subjectCard.querySelectorAll('.exam-percentage');
    let total = 0;
    
    percentageInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        total += value;
    });
    
    return Math.abs(total - 100) < 0.001;
}

/**
 * Valide un examen
 * @param {HTMLElement} examItem - Élément DOM de l'examen
 * @param {string} subjectName - Nom de la matière pour le message d'erreur
 * @returns {Object} - Résultat de la validation
 */
export function validateExam(examItem, subjectName) {
    const grade = parseFloat(examItem.querySelector('.exam-grade').value);
    const percentage = parseFloat(examItem.querySelector('.exam-percentage').value);
    
    if (isNaN(grade) || grade < 0 || grade > 20) {
        return { 
            isValid: false, 
            message: `La note pour une épreuve de "${subjectName}" doit être comprise entre 0 et 20.` 
        };
    }
    
    if (isNaN(percentage) || percentage <= 0) {
        return { 
            isValid: false, 
            message: `Le pourcentage pour une épreuve de "${subjectName}" doit être supérieur à 0.` 
        };
    }
    
    return { isValid: true };
}