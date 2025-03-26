// js/export/csv.js

/**
 * Module d'export vers CSV
 */

import { showMessage } from '../ui/notifications.js';

/**
 * Exporte les données au format CSV
 * @param {Object} data - Données à exporter
 * @param {string} filename - Nom du fichier à générer
 */
export function exportToCSV(data, filename) {
    // Ajouter le BOM UTF-8 pour que Excel reconnaisse correctement l'encodage
    let csvContent = '\uFEFF';

    // En-tête du CSV
    csvContent += "Matière,Coefficient,Épreuve,Note (/20),Pourcentage (%),Moyenne matière (/20)\n";

    // Ajouter les données pour chaque matière
    data.subjects.forEach(subject => {
        const escapedName = subject.name.replace(/"/g, '""');
        const coefficient = subject.weight;
        const moyenneMatiere = subject.average.toFixed(2);

        // Ajouter chaque épreuve
        subject.exams.forEach((exam, index) => {
            const examGrade = exam.grade.toFixed(2);
            const examPercentage = exam.percentage.toFixed(2);

            // Ajouter une ligne pour chaque épreuve
            csvContent += `"${escapedName}",${coefficient},"Épreuve ${index + 1}",${examGrade},${examPercentage},${index === 0 ? moyenneMatiere : ""}\n`;
        });
    });

    // Ajouter la moyenne générale
    csvContent += `"Moyenne générale",,,,,${data.averageTotal.toFixed(2)}\n`;

    // Créer un lien pour télécharger avec l'encodage UTF-8
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Afficher un message de succès
    showMessage('Le fichier CSV a été généré avec succès', 'success');
}