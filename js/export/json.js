/**
 * Module d'export vers JSON
 */

import { showMessage } from '../ui/notifications.js';

/**
 * Exporte les données au format JSON
 * @param {Object} data - Données à exporter
 * @param {string} filename - Nom du fichier à générer
 */
export function exportToJSON(data, filename) {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Afficher un message de succès
    showMessage('Le fichier JSON a été généré avec succès', 'success');
}