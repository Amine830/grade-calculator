// js/ui/notification.js

/**
 * Gestion des notifications et messages d'erreur
 */

/**
 * Affiche un message d'erreur stylisé
 * @param {string} message - Le message d'erreur à afficher
 */
export function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    const errorElement = document.createElement('div');
    
    // Appliquer les styles Tailwind
    errorElement.className = 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg shadow-md border-l-4 border-red-500 flex items-start';
    
    errorElement.innerHTML = `
        <div class="flex-shrink-0 mr-3">
            <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
        </div>
        <div class="flex-1">${message}</div>
        <button class="ml-auto flex-shrink-0 text-red-500 hover:text-red-700 transition-colors">
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
        </button>
    `;
    
    // Ajouter au conteneur
    errorContainer.appendChild(errorElement);
    
    // Configurer le bouton de fermeture
    const closeButton = errorElement.querySelector('button');
    closeButton.addEventListener('click', () => {
        errorElement.remove();
    });
    
    // Faire disparaître le message après 5 secondes
    setTimeout(() => {
        errorElement.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => errorElement.remove(), 300);
    }, 5000);
}

/**
 * Affiche un message d'information, de succès ou d'avertissement
 * @param {string} message - Le message à afficher
 * @param {string} type - Type du message ('success', 'info', ou 'warning')
 * @returns {HTMLElement} - L'élément créé
 */
export function showMessage(message, type = 'success') {
    const errorContainer = document.getElementById('errorContainer');
    const messageElement = document.createElement('div');
    
    let bgClass, textClass, iconPath, borderClass;
    
    if (type === 'success') {
        bgClass = 'bg-green-100 dark:bg-green-900';
        textClass = 'text-green-800 dark:text-green-200';
        borderClass = 'border-green-500';
        iconPath = 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z';
    } else if (type === 'info') {
        bgClass = 'bg-blue-100 dark:bg-blue-900';
        textClass = 'text-blue-800 dark:text-blue-200';
        borderClass = 'border-blue-500';
        iconPath = 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z';
    } else {
        bgClass = 'bg-yellow-100 dark:bg-yellow-900';
        textClass = 'text-yellow-800 dark:text-yellow-200';
        borderClass = 'border-yellow-500';
        iconPath = 'M10 18a8 8 0 100-16 8 8 0 000 16zm0-7a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm0-4a1 1 0 100 2 1 1 0 000-2z';
    }
    
    // Appliquer les styles Tailwind
    messageElement.className = `${bgClass} ${textClass} px-4 py-3 rounded-lg shadow-md border-l-4 ${borderClass} flex items-start`;
    
    messageElement.innerHTML = `
        <div class="flex-shrink-0 mr-3">
            <svg class="h-5 w-5 ${type === 'success' ? 'text-green-500' : (type === 'info' ? 'text-blue-500' : 'text-yellow-500')}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="${iconPath}" clip-rule="evenodd" />
            </svg>
        </div>
        <div class="flex-1">${message}</div>
        <button class="ml-auto flex-shrink-0 ${type === 'success' ? 'text-green-500 hover:text-green-700' : (type === 'info' ? 'text-blue-500 hover:text-blue-700' : 'text-yellow-500 hover:text-yellow-700')} transition-colors">
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
        </button>
    `;
    
    // Ajouter au conteneur
    errorContainer.appendChild(messageElement);
    
    // Configurer le bouton de fermeture
    const closeButton = messageElement.querySelector('button');
    closeButton.addEventListener('click', () => {
        messageElement.remove();
    });
    
    // Faire disparaître le message après 5 secondes sauf si c'est un message d'info de génération en cours
    if (type !== 'info' || !message.includes('en cours')) {
        setTimeout(() => {
            messageElement.classList.add('opacity-0', 'transition-opacity', 'duration-300');
            setTimeout(() => messageElement.remove(), 300);
        }, 5000);
    }
    
    return messageElement; // Retourne l'élément pour permettre sa suppression ultérieure
}