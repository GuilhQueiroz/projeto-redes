// Buscar perfil
async function loadProfile() {
    const response = await fetchAuth('http://localhost:3000/api/users/me');
    const user = await response.json();
    console.log('Perfil carregado:', user); // <-- Adicione esta linha
    renderProfile(user);
}

function renderProfile(user) {
    document.getElementById('profile-name').value = user.name || '';
    document.getElementById('profile-surname').value = user.surname || '';
    document.getElementById('profile-bio').value = user.bio || '';
    // Se tiver avatar:
    if (user.avatar) {
        document.getElementById('profile-avatar').src = user.avatar;
    }
}

// Atualizar perfil
async function updateProfile(data) {
    const token = localStorage.getItem('blogToken');
    const response = await fetch('http://localhost:3000/api/users/me', {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + token },
        body: data // Use FormData se for enviar arquivo/avatar
    });
    return await response.json();
}

// Exemplo de uso em formulário:
document.getElementById('profile-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const feedback = document.getElementById('profile-feedback');
    feedback.textContent = "Salvando...";

    // Pegue os valores dos campos
    const name = document.getElementById('profile-name').value;
    const surname = document.getElementById('profile-surname').value;
    const bio = document.getElementById('profile-bio').value;

    // Use FormData para enviar (mesmo sem avatar)
    const formData = new FormData();
    formData.append('name', name);
    formData.append('surname', surname);
    formData.append('bio', bio);

    // Se quiser enviar avatar futuramente:
    // const avatarFile = document.getElementById('profile-avatar-input').files[0];
    // if (avatarFile) formData.append('avatar', avatarFile);

    const token = localStorage.getItem('blogToken');
    const response = await fetch('http://localhost:3000/api/users/me', {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + token },
        body: formData
    });
    const result = await response.json();

    if (result.error) {
        feedback.style.color = "#ff4500";
        feedback.textContent = result.error;
    } else {
        feedback.style.color = "green";
        feedback.textContent = "Perfil atualizado com sucesso!";
        // Atualize o nome salvo no localStorage
        localStorage.setItem('userName', name);
        // Atualize a sidebar imediatamente
        if (typeof updateSidebarUserName === 'function') {
            updateSidebarUserName();
        }
        setTimeout(() => feedback.textContent = "", 2000);
    }
});