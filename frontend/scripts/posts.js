// Listar posts
async function loadPosts() {
    const response = await fetch('http://localhost:3000/api/posts');
    const posts = await response.json();
    renderPosts(posts);
}

function renderPosts(posts) {
    const container = document.getElementById('posts-container');
    container.innerHTML = posts.map(post => {
        // Usa a foto do usuário se existir, senão usa o SVG padrão
        const avatar = post.author?.avatar
            ? post.author.avatar
            : '/frontend/assets/do-utilizador.svg';
        const authorName = post.author?.name || 'Usuário';

        return `
        <div class="post-card">
            <div class="post-meta">
                <img src="${avatar}" alt="Usuário" class="post-user-icon">
                <span class="post-author">${authorName}</span>
                <span class="post-date">${new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
            <h3 class="post-title">
                <a href="#" onclick="viewPost(${post.id});return false;">${post.title}</a>
            </h3>
            <div class="post-actions">
                <button class="vote-btn upvote" onclick="votePost(this, 'up', ${post.id})">👍</button>
                <span class="vote-count">${post.votes ?? 0}</span>
                <button class="vote-btn downvote" onclick="votePost(this, 'down', ${post.id})">👎</button>
                <button class="comment-btn" onclick="viewPost(${post.id})">💬 <span>${post.commentsCount ?? 0}</span></button>
            </div>
        </div>
        `;
    }).join('');
}

function viewPost(id) {
    window.location.href = "pages/post.html?id=" + id;
}

// Criar post
async function createPost(title, content) {
    const token = localStorage.getItem('blogToken');
    const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ title, content })
    });
    return await response.json();
}

function openCreatePostModal() {
    // Código para abrir o modal de criar post
    document.getElementById('create-post-modal').style.display = 'block';
}

function closeCreatePostModal() {
    document.getElementById('create-post-modal').style.display = 'none';
}

// Exemplo de uso em formulário:
document.getElementById('create-post-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-desc').value;
    await createPost(title, content);
    await loadPosts(); // Atualiza o feed após criar
    e.target.reset();  // Limpa o formulário
    closeCreatePostModal(); // Fecha o modal automaticamente
});

function votePost(btn, type, postId) {
    // Exemplo simples: envie para o backend e atualize o contador
    fetchAuth(`http://localhost:3000/api/interactions/post/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: type === 'up' ? 1 : -1 })
    }).then(() => {
        // Opcional: recarregue os posts ou atualize o contador na tela
        loadPosts && loadPosts();
    });
}