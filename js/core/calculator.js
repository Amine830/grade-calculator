// js/core/calculator.js

/**
 * Fonctions de calcul des moyennes
 */

import { showError } from '../ui/notifications.js';

/**
 * Évalue le niveau de performance basé sur la moyenne
 * @param {number} average - La moyenne à évaluer
 * @returns {Object} - Message et classe de couleur correspondants
 */
export function getEvaluationMessage(average) {
    let message = '';
    let colorClass = '';
    
    if (average >= 18) {
        message = "Génie absolu ! Vous êtes un véritable maître dans votre domaine. 🎓✨";
        colorClass = "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
    } else if (average >= 16) {
        message = "Excellent ! Vous brillez comme une étoile dans le ciel académique. 🌟";
        colorClass = "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
    } else if (average >= 14) {
        message = "Très bien ! Vous êtes sur la bonne voie pour conquérir le monde. 🚀";
        colorClass = "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
    } else if (average >= 12) {
        message = "Bien joué ! Vous avancez avec confiance et style. 💪😎";
        colorClass = "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
    } else if (average >= 10) {
        message = "Pas mal ! Vous avez franchi la ligne d'arrivée avec succès. 🏁";
        colorClass = "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
    } else if (average >= 8) {
        message = "Hmm, passable. Un petit coup de turbo et vous serez au top ! 🏎️💨";
        colorClass = "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
    } else if (average >= 6) {
        message = "Oups ! Il est temps de retrousser vos manches et de foncer. 🛠️📚";
        colorClass = "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
    } else if (average >= 4) {
        message = "Aïe ! Vous êtes dans la zone rouge, mais tout n'est pas perdu. 🔴💡";
        colorClass = "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
    } else {
        message = "Catastrophe ! Mais ne désespérez pas, chaque échec est une leçon. 🌪️📖";
        colorClass = "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
    }
    
    return { message, colorClass };
}

/**
 * Calcule la moyenne pour une matière
 * @param {HTMLElement} subject - Élément DOM représentant une matière
 * @returns {Object} - Données de la matière avec sa moyenne
 */
export function calculateSubjectAverage(subject) {
    const subjectName = subject.querySelector('.subject-name').value || 'Matière sans nom';
    const subjectWeight = parseFloat(subject.querySelector('.subject-weight').value) || 0;
    
    // Vérifier que le poids est valide
    if (subjectWeight <= 0) {
        showError(`Le coefficient de "${subjectName}" doit être supérieur à 0.`);
        return null;
    }
    
    const exams = subject.querySelectorAll('.exam-item');
    let subjectAverage = 0;
    let totalPercentage = 0;
    const examList = [];
    
    // Calculer la moyenne de la matière
    for (let exam of exams) {
        const grade = parseFloat(exam.querySelector('.exam-grade').value);
        const percentage = parseFloat(exam.querySelector('.exam-percentage').value);
        
        // Vérifier que la note et le pourcentage sont valides
        if (isNaN(grade) || grade < 0 || grade > 20) {
            showError(`La note pour une épreuve de "${subjectName}" doit être comprise entre 0 et 20.`);
            return null;
        }
        
        if (isNaN(percentage) || percentage <= 0) {
            showError(`Le pourcentage pour une épreuve de "${subjectName}" doit être supérieur à 0.`);
            return null;
        }
        
        subjectAverage += grade * (percentage / 100);
        totalPercentage += percentage;
        
        // Ajouter les détails de cette épreuve
        examList.push({
            grade: grade,
            percentage: percentage
        });
    }
    
    // Vérifier que le total des pourcentages est 100%
    if (Math.abs(totalPercentage - 100) > 0.001) {
        showError(`Le total des pourcentages pour "${subjectName}" doit être égal à 100%. Actuellement: ${totalPercentage}%`);
        return null;
    }
    
    return {
        name: subjectName,
        weight: subjectWeight,
        exams: examList,
        average: subjectAverage
    };
}

/**
 * Calcule la moyenne générale
 * @param {NodeList} subjects - Liste des éléments matières
 * @returns {Object} - Données complètes et moyenne générale
 */
export function calculateGeneralAverage(subjects) {
    let totalWeightedAverage = 0;
    let totalWeight = 0;
    const subjectsList = [];
    
    // Pour chaque matière
    for (let subject of subjects) {
        const subjectData = calculateSubjectAverage(subject);
        
        if (!subjectData) {
            return null; // Une erreur s'est produite
        }
        
        totalWeightedAverage += subjectData.average * subjectData.weight;
        totalWeight += subjectData.weight;
        subjectsList.push(subjectData);
    }
    
    // Calculer la moyenne générale
    const averageTotal = totalWeight > 0 ? totalWeightedAverage / totalWeight : 0;
    
    return {
        subjects: subjectsList,
        averageTotal: averageTotal
    };
}