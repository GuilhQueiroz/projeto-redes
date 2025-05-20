// scripts/theme.js
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const darkTheme = document.getElementById('dark-theme');
    const body = document.body;
    
    // Verifica preferência salva ou do sistema
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        enableDarkTheme();
    }
    
    // Configura o botão de toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    function toggleTheme() {
        if (body.classList.contains('dark-mode')) {
            disableDarkTheme();
        } else {
            enableDarkTheme();
        }
    }
    
    function enableDarkTheme() {
        body.classList.add('dark-mode');
        darkTheme.disabled = false;
        localStorage.setItem('theme', 'dark');
        if (themeToggle) themeToggle.textContent = '☀️';
    }
    
    function disableDarkTheme() {
        body.classList.remove('dark-mode');
        darkTheme.disabled = true;
        localStorage.setItem('theme', 'light');
        if (themeToggle) themeToggle.textContent = '🌙';
    }
    
    // Torna as funções disponíveis globalmente se necessário
    window.toggleTheme = toggleTheme;
});