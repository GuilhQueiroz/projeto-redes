async function loadComponent(name, containerId) {
    // Detecta se está em /pages/ para ajustar o caminho
    const base = location.pathname.includes('/pages/') ? '../components/' : './components/';
    const response = await fetch(`${base}${name}.html`);
    const html = await response.text();
    document.getElementById(containerId).innerHTML = html;
}

function updateHeaderAuth() {
    const headerRight = document.getElementById('header-right');
    if (!headerRight) return;
    const token = localStorage.getItem('blogToken');
    if (token) {
        headerRight.innerHTML = `
            <button class="login-button" onclick="logout()">Logout</button>
        `;
    } else {
        headerRight.innerHTML = `
            <button class="login-button" onclick="navigateTo('register')">Login</button>
        `;
    }
}

function updateSidebarUserName() {
    const userName = localStorage.getItem('userName');
    const sidebarUserName = document.getElementById('sidebar-user-name');
    if (sidebarUserName && userName) {
        sidebarUserName.textContent = userName;
    }
}