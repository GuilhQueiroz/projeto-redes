// Retorna o token JWT salvo
function getToken() {
    return localStorage.getItem('blogToken');
}

// Faz fetch autenticado
async function fetchAuth(url, options = {}) {
    const token = getToken();
    options.headers = options.headers || {};
    options.headers['Authorization'] = 'Bearer ' + token;
    return fetch(url, options);
}

// Exemplo de uso:
// const response = await fetchAuth('http://localhost:3000/api/posts');

// Navega para uma página específica
function navigateTo(page) {
    if (page === 'home') {
        // Se já está na home, só recarrega
        if (window.location.pathname.endsWith('/index.html')) {
            window.location.href = 'index.html#';
        } else {
            // Se está em /frontend/pages/, volta para /frontend/index.html
            window.location.href = '../index.html#';
        }
    } else {
        // Se está em /frontend/index.html, navega para pages/...
        if (window.location.pathname.endsWith('/index.html')) {
            window.location.href = `pages/${page}.html`;
        } else {
            // Se já está em /frontend/pages/, navega normalmente
            window.location.href = `${page}.html`;
        }
    }
}