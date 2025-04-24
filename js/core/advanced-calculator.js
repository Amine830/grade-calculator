/**
 * Calcule les résultats avec un système de blocs et semestres
 */
export function calculateAdvancedResults(data) {
    const results = {
        subjects: [],
        blocks: [],
        semesters: [],
        overall: {
            average: 0,
            validated: false
        },
        validationThreshold: data.validationThreshold
    };
    
    // 1. Calcul des moyennes par matière
    data.subjects.forEach(subject => {
        // Calculer la moyenne de la matière
        let totalPercentage = 0;
        let weightedSum = 0;
        
        // Vérifier si des examens existent
        if (subject.exams && subject.exams.length > 0) {
            subject.exams.forEach(exam => {
                weightedSum += exam.grade * (exam.percentage / 100);
                totalPercentage += exam.percentage;
            });
        }
        
        const average = totalPercentage > 0 ? weightedSum : 0;
        
        results.subjects.push({
            id: subject.id,
            name: subject.name,
            weight: subject.weight,
            exams: subject.exams,
            average: average,
            blockId: subject.blockId,
            semesterId: subject.semesterId,
            validationThreshold: subject.validationThreshold
        });
    });
    
    // 2. Calcul des moyennes par bloc
    if (data.hasBlocks && data.blocks) {
        data.blocks.forEach(block => {
            // Trouver toutes les matières du bloc, quel que soit leur semestre
            const blockSubjects = results.subjects.filter(s => s.blockId === block.id);
            
            // Si le bloc contient des matières
            if (blockSubjects.length > 0) {
                // Calculer la moyenne pondérée du bloc
                let totalWeight = 0;
                let weightedSum = 0;
                
                blockSubjects.forEach(subject => {
                    weightedSum += subject.average * subject.weight;
                    totalWeight += subject.weight;
                });
                
                const blockAverage = totalWeight > 0 ? weightedSum / totalWeight : 0;
                
                // Un bloc est validé si sa moyenne est >= au seuil de validation
                const isValidated = blockAverage >= data.validationThreshold;
                
                results.blocks.push({
                    id: block.id,
                    name: block.name,
                    average: blockAverage,
                    validated: isValidated,
                    subjects: blockSubjects
                }); 
            }
            else {
                // Ajouter quand même le bloc pour l'affichage
                results.blocks.push({
                    id: block.id,
                    name: block.name,
                    average: 0,
                    validated: false,
                    subjects: []
                });
                console.warn(`Le bloc ${block.name} ne contient aucune matière.`);
            }
        });
    }
        
    // 3. Calcul des moyennes par semestre (juste informatif)
    if (data.hasSemesters && data.semesters) {
        data.semesters.forEach(semester => {
            const semesterSubjects = results.subjects.filter(s => s.semesterId === semester.id);
            
            if (semesterSubjects.length > 0) {
                let totalWeight = 0;
                let weightedSum = 0;
                
                semesterSubjects.forEach(subject => {
                    weightedSum += subject.average * subject.weight;
                    totalWeight += subject.weight;
                });
                
                const semesterAverage = totalWeight > 0 ? weightedSum / totalWeight : 0;
                
                results.semesters.push({
                    id: semester.id,
                    name: semester.name,
                    average: semesterAverage,
                    subjects: semesterSubjects
                });
            } else {
                // Ajouter quand même le semestre pour l'affichage
                results.semesters.push({
                    id: semester.id,
                    name: semester.name,
                    average: 0,
                    subjects: []
                });
            }
        });
    }
    
    // 4. Calcul de la moyenne générale et validation
    const allSubjectsAverage = calculateWeightedAverage(results.subjects);
    results.overall.average = allSubjectsAverage;
    
    // Pour valider l'année, tous les blocs doivent être validés (si mode blocs est activé)
    if (data.hasBlocks && results.blocks.length > 0) {
        results.overall.validated = results.blocks.every(block => block.validated);
    } else {
        // Sans blocs, on valide si la moyenne générale est >= au seuil
        results.overall.validated = allSubjectsAverage >= data.validationThreshold;
    }

    // S'assurer que la propriété average est bien définie
    if (typeof results.overall.average === 'undefined') {
        results.overall.average = calculateWeightedAverage(results.subjects);
    }
    // Ajouter la propriété averageTotal pour compatibilité
    results.averageTotal = results.overall.average;
    
    return results;
}

// Fonction utilitaire pour calculer une moyenne pondérée
function calculateWeightedAverage(items) {
    if (!items || items.length === 0) return 0;
    
    let totalWeight = 0;
    let weightedSum = 0;
    
    items.forEach(item => {
        weightedSum += item.average * item.weight;
        totalWeight += item.weight;
    });
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
}
