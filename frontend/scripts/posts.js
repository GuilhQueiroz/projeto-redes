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
    // ...código para abrir o post...
    saveRecentActivity(id);
    window.location.href = `pages/post.html?id=${id}`;
}

function saveRecentActivity(postId) {
    let recent = JSON.parse(localStorage.getItem('recentPosts') || '[]');
    // Evita duplicados
    recent = recent.filter(pid => pid !== postId);
    recent.unshift(postId);
    // Limita a 5 itens
    if (recent.length > 5) recent = recent.slice(0, 5);
    localStorage.setItem('recentPosts', JSON.stringify(recent));
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

// Função para extrair ID do post da URL
function getPostIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Função para carregar um post específico
async function loadSinglePost(postId) {
    try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}`);
        if (!response.ok) {
            throw new Error('Post não encontrado');
        }
        const post = await response.json();
        renderSinglePost(post);
        // Carregar comentários do post
        loadComments(postId);
    } catch (error) {
        console.error('Erro ao carregar post:', error);
        document.getElementById('posts-container').innerHTML = `
            <div class="error-message">
                <h3>Post não encontrado</h3>
                <p>O post que você está procurando não existe ou foi removido.</p>
                <a href="../index.html">Voltar para a página inicial</a>
            </div>
        `;
    }
}

// Função para renderizar um post individual
function renderSinglePost(post) {
    const container = document.getElementById('posts-container');
    const userId = localStorage.getItem('userId');
    const isOwner = post.author && String(post.author.id) === String(userId);

    // Usa a foto do usuário se existir, senão usa o SVG padrão
    const avatar = post.author?.avatar
        ? post.author.avatar
        : '/frontend/assets/do-utilizador.svg';
    const authorName = post.author?.name || 'Usuário';
    
    container.innerHTML = `
        <div class="post-card single-post">
            <div class="post-meta">
                <img src="${avatar}" alt="Usuário" class="post-user-icon">
                <span class="post-author">${authorName}</span>
                <span class="post-date">${new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
            <h1 class="post-title">${post.title}</h1>
            <div class="post-content">
                <p>${post.content || post.desc || ''}</p>
            </div>
            <div class="post-actions">
                <button class="vote-btn upvote" onclick="votePost(this, 'up', ${post.id})">👍</button>
                <span class="vote-count">${post.votes ?? 0}</span>
                <button class="vote-btn downvote" onclick="votePost(this, 'down', ${post.id})">👎</button>
                <span class="comment-count">💬 ${post.commentsCount ?? 0} comentários</span>
                ${isOwner ? `<button class="delete-post-btn" onclick="deletePost(${post.id})">Excluir</button>` : ''}
            </div>
        </div>
    `;
}

async function deletePost(postId) {
    console.log('clicou', postId);
    if (!confirm('Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.')) return;
    const token = localStorage.getItem('blogToken');
    const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    if (response.status === 204) {
        alert('Post excluído com sucesso!');
        window.location.href = '../index.html';
    } else {
        alert('Erro ao excluir post.');
    }
}