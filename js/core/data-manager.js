/**
 * Gère la conversion des données lors des changements de structure
 */
export function convertData(oldData, newConfig) {
    // Vérifications strictes des paramètres
    if (!oldData) {
        throw new Error("Les données existantes sont invalides");
    }
    
    if (!newConfig) {
        throw new Error("La nouvelle configuration est invalide");
    }
    
    // Copie profonde des données existantes
    const newData = JSON.parse(JSON.stringify(oldData));
    
    // S'assurer que la propriété subjects existe
    if (!newData.subjects) {
        newData.subjects = [];
    }
    
    // Configuration de base
    newData.hasBlocks = newConfig.hasBlocks;
    newData.hasSemesters = newConfig.hasSemesters;
    newData.compensationBetweenSubjects = newConfig.compensationBetweenSubjects;
    newData.compensationBetweenBlocks = newConfig.compensationBetweenBlocks;
    newData.validationThreshold = newConfig.validationThreshold;
    
    // IMPORTANT : Il faut utiliser les blocs définis dans la nouvelle configuration
    if (newConfig.hasBlocks) {
        // Vérifier que les blocs sont définis dans la nouvelle configuration
        if (!newConfig.blocks || !Array.isArray(newConfig.blocks) || newConfig.blocks.length === 0) {
            throw new Error("La configuration nécessite des blocs, mais aucun bloc n'est défini");
        }
        
        // il faut utiliser explicitement les blocs de la nouvelle configuration
        newData.blocks = JSON.parse(JSON.stringify(newConfig.blocks));
        
        // On vérifie l'attribution des blocs aux matières existantes
        if (newData.subjects.length > 0) {
            newData.subjects.forEach((subject, index) => {
                if (!subject.blockId) {
                    // Signaler le problème mais ne pas attribuer de valeur par défaut
                    console.error(`La matière ${subject.name || 'à l\'index ' + index} n'a pas de bloc associé`);
                }
            });
        }
    }
    
    // Gestion similaire pour les semestres
    if (newConfig.hasSemesters) {
        if (!newConfig.semesters || !Array.isArray(newConfig.semesters) || newConfig.semesters.length === 0) {
            throw new Error("La configuration nécessite des semestres, mais aucun semestre n'est défini");
        }
        
        newData.semesters = JSON.parse(JSON.stringify(newConfig.semesters));
        
        // On vérifie les associations matière-semestre
        if (newData.subjects.length > 0) {
            newData.subjects.forEach((subject, index) => {
                if (!subject.semesterId) {
                    console.error(`La matière ${subject.name || 'à l\'index ' + index} n'a pas de semestre associé`);
                }
            });
        }
    }
    
    // Suppression des données inutiles
    if (!newConfig.hasSemesters) {
        delete newData.semesters;
        if (newData.subjects.length > 0) {
            newData.subjects.forEach(subject => {
                delete subject.semesterId;
            });
        }
    }
    
    if (!newConfig.hasBlocks) {
        delete newData.blocks;
        if (newData.subjects.length > 0) {
            newData.subjects.forEach(subject => {
                delete subject.blockId;
            });
        }
    }
    
    return newData;
}

/** 
 * Enregistre les données dans le localStorage
 * @param {Object} data - Les données à enregistrer
 */
export function saveData(data) {
    localStorage.setItem('gradeCalculatorData', JSON.stringify(data));
}

  
/**
 * Charge les données depuis le localStorage
 * @returns {Object|null} - Les données chargées ou null si aucune donnée n'est trouvée
*/
export function loadData() {
    const savedData = localStorage.getItem('gradeCalculatorData');
    return savedData ? JSON.parse(savedData) : null;
}


/**
 * Réinitialise complètement les données de l'application
*/
export function resetAllData() {
    localStorage.removeItem('gradeCalculatorData');
}