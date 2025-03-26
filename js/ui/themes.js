// js/ui/themes.js

/**
 * Gestion du thème clair/sombre de l'application
 */

export function initThemeSystem() {
    // Détection du thème système
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    }
    
    // Écouter les changements de préférence système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (event.matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });

    // Charger la préférence utilisateur
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
    }

    // Configurer le bouton de changement de thème
    setupThemeToggle();
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', () => {
        // Toggle du thème
        const isDarkMode = document.documentElement.classList.toggle('dark');
        
        // Sauvegarder la préférence de l'utilisateur
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // Animation de rotation
        themeToggle.classList.add('rotate-180');
        setTimeout(() => {
            themeToggle.classList.remove('rotate-180');
        }, 200);
        
        // Afficher un message de confirmation
        if (window.showExportMessage) {
            window.showExportMessage(
                `Thème ${isDarkMode ? 'sombre' : 'clair'} activé`,
                'info'
            );
        }
    });
}