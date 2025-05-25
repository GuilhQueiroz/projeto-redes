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

async function loadRecentActivities() {
    const list = document.getElementById('recent-activities-list');
    if (!list) return;
    const recent = JSON.parse(localStorage.getItem('recentPosts') || '[]');
    if (!recent.length) {
        list.innerHTML = '<li style="color:#aaa;">Nenhuma atividade recente</li>';
        return;
    }
    // Busca títulos dos posts
    const items = await Promise.all(recent.map(async postId => {
        try {
            const res = await fetch(`http://localhost:3000/api/posts/${postId}`);
            if (!res.ok) return null;
            const post = await res.json();
            // Aqui entra o seu trecho:
            return `<li title="${post.title}" class="recent-activity-item" onclick="navigateToPost(${post.id})">
                <span>${post.title}</span>
            </li>`;
        } catch {
            return null;
        }
    }));
    list.innerHTML = items.filter(Boolean).join('');
}

// Chame isso ao carregar a sidebar:
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('SidebarLeft', 'sidebar-left-container').then(() => {
        loadRecentActivities();
    });
});