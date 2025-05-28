async function loadComponent(name, containerId) {
    // Detecta se está em /pages/ para ajustar o caminho
    const base = location.pathname.includes('/pages/') ? '../components/' : './components/';
    const response = await fetch(`${base}${name}.html`);
    const html = await response.text();
    document.getElementById(containerId).innerHTML = html;
    setupMobileMenu();
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

// Função para configurar o menu mobile
function setupMobileMenu() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const sidebarLeft = document.querySelector('.sidebar-left');

    if (!mobileNavToggle || !sidebarLeft) return;

    // Fecha o menu ao clicar fora
    const closeOnClickOutside = (e) => {
        if (!sidebarLeft.contains(e.target) && e.target !== mobileNavToggle) {
            closeMobileMenu();
        }
    };

    // Fecha o menu ao clicar em um link/item
    const closeOnItemClick = () => closeMobileMenu();

    // Função para abrir/fechar o menu
    const toggleMobileMenu = () => {
        const isOpening = !sidebarLeft.classList.contains('active');
        
        mobileNavToggle.classList.toggle('active');
        sidebarLeft.classList.toggle('active');
        mobileNavToggle.setAttribute('aria-expanded', isOpening);

        if (isOpening) {
            document.addEventListener('click', closeOnClickOutside);
            document.querySelectorAll('.sidebar-item a, .sidebar-item button').forEach(item => {
                item.addEventListener('click', closeOnItemClick);
            });
        } else {
            document.removeEventListener('click', closeOnClickOutside);
        }
    };

    // Função para fechar o menu
    const closeMobileMenu = () => {
        mobileNavToggle.classList.remove('active');
        sidebarLeft.classList.remove('active');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', closeOnClickOutside);
    };

    // Adiciona os event listeners
    mobileNavToggle.addEventListener('click', toggleMobileMenu);

    // Fecha o menu se a janela for redimensionada para um tamanho maior
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && sidebarLeft.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// Inicializa tudo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('SidebarLeft', 'sidebar-left-container').then(() => {
        loadRecentActivities();
        updateSidebarUserName();
        updateHeaderAuth();
        setupMobileMenu(); // Configura o menu mobile
    });
});