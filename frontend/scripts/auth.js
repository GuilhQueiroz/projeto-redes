// Cadastro
async function register(name, email, password) {
    const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    return await response.json();
}

// Login
async function login(email, password) {
    const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.token) {
        localStorage.setItem('blogToken', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userName', data.user.name);
    }
    return data;
}

// Logout
function logout() {
    localStorage.removeItem('blogToken');
    localStorage.removeItem('userName');
    // Use navigateTo para garantir o caminho correto
    if (typeof navigateTo === 'function') {
        navigateTo('login');
    } else {
        window.location.href = '../pages/login.html';
    }
}

// Exemplo de uso em formulário:
document.getElementById('login-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const feedback = document.getElementById('login-feedback');
    feedback.textContent = "Processando...";

    const result = await login(email, password);
    if (result.token) {
        localStorage.setItem('userName', result.user?.name || 'Perfil');
        feedback.style.color = "green";
        feedback.textContent = "Login realizado! Redirecionando...";
        setTimeout(() => {
            navigateTo('home');
            // Atualize header e sidebar após login
            updateHeaderAuth();
            updateSidebarUserName();
        }, 1000);
    } else {
        feedback.style.color = "#ff4500";
        feedback.textContent = result.error || "Erro ao fazer login";
    }
});