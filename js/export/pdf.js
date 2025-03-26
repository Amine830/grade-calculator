// js/export/pdf.js

/**
 * Module d'export vers PDF
 */

import { showMessage, showError } from '../ui/notifications.js';

/**
 * Exporte les données au format PDF
 * @param {Object} data - Données à exporter
 * @param {string} filename - Nom du fichier à générer
 */
export function exportToPDF(data, filename) {
    showMessage('Génération du PDF en cours...', 'info');
    
    try {
        // Vérifier que les bibliothèques nécessaires sont chargées
        if (!window.jspdf || !window.jspdf.jsPDF) {
            throw new Error("La bibliothèque jsPDF n'est pas chargée.");
        }

        // Créer une instance de jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Vérifier que le plugin autoTable est disponible
        if (typeof doc.autoTable !== 'function') {
            throw new Error("Le plugin jsPDF-AutoTable n'est pas chargé.");
        }

        // Définir les marges et dimensions
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;

        // Variables pour suivre la position Y actuelle
        let yPos = margin;

        // Ajouter le titre
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('Relevé de notes', pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;

        // Ajouter la moyenne générale
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(`Moyenne générale: ${data.averageTotal.toFixed(2)}/20`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 15;

        // Définir les colonnes du tableau
        const columns = [
            { header: 'Matière', dataKey: 'name' },
            { header: 'Coefficient', dataKey: 'weight' },
            { header: 'Moyenne', dataKey: 'average' }
        ];

        // Préparer les données pour le tableau principal
        const tableData = data.subjects.map(subject => ({
            name: subject.name,
            weight: subject.weight,
            average: subject.average.toFixed(2) + '/20'
        }));

        // Ajouter le tableau principal
        doc.autoTable({
            head: [columns.map(col => col.header)],
            body: tableData.map(row => columns.map(col => row[col.dataKey])),
            startY: yPos,
            margin: { left: margin, right: margin },
            styles: { fontSize: 10 },
            headStyles: { fillColor: [93, 92, 222], textColor: [255, 255, 255], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [240, 240, 240] }
        });

        // Mettre à jour la position Y
        yPos = doc.lastAutoTable.finalY + 10;

        // Ajouter le détail des épreuves pour chaque matière
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Détail des épreuves par matière:', margin, yPos);
        yPos += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        // Pour chaque matière
        data.subjects.forEach(subject => {
            // Vérifier s'il faut ajouter une nouvelle page
            if (yPos > pageHeight - 40) {
                doc.addPage();
                yPos = margin;
            }
            
            doc.setFont('helvetica', 'bold');
            doc.text(`${subject.name} (coefficient ${subject.weight}) - Moyenne: ${subject.average.toFixed(2)}/20`, margin, yPos);
            yPos += 6;
            
            doc.setFont('helvetica', 'normal');
            // Pour chaque épreuve
            subject.exams.forEach((exam, index) => {
                doc.text(`Épreuve ${index + 1}: ${exam.grade}/20 (${exam.percentage}%)`, margin + 5, yPos);
                yPos += 5;
            });
            
            yPos += 3; // Espace entre les matières
        });

        // Ajouter la date en bas de page
        yPos = pageHeight - 10;
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, pageWidth / 2, yPos, { align: 'center' });

        // Enregistrer le PDF
        doc.save(filename);

        // Supprimer le message "en cours..." et montrer le message de succès
        const infoMessages = document.querySelectorAll('#errorContainer > div');
        infoMessages.forEach(msg => {
            if (msg.textContent.includes('en cours')) {
                msg.remove();
            }
        });

        showMessage('Le PDF a été généré avec succès', 'success');
    } catch (error) {
        showError(`Erreur lors de la génération du PDF: ${error.message}`);
    }
}