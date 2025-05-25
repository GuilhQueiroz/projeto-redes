document.addEventListener('DOMContentLoaded', loadMyPosts);

function showNotification(message, type = 'info') {
    // Remove notificações antigas
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

async function loadMyPosts() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        document.getElementById('my-posts-container').innerHTML = "<p>Faça login para ver seus posts.</p>";
        return;
    }
    const response = await fetch(`http://localhost:3000/api/users/${userId}/posts`);
    const posts = await response.json();
    renderMyPosts(posts);
}

function renderMyPosts(posts) {
    const container = document.getElementById('my-posts-container');
    if (!container) return; // Evita erro se o container não existir

    if (!posts.length) {
        container.innerHTML = "<p>Você ainda não criou nenhum post.</p>";
        return;
    }
    container.innerHTML = posts.map(post => `
        <div class="post-card">
            <h3>${post.title}</h3>
            <div class="post-actions">
                <button class="create-post-button" onclick="editPost(${post.id})">Editar</button>
                <button class="create-post-button" onclick="viewPost(${post.id})">Ver</button>
                <button class="create-post-button" onclick="deleteMyPost(${post.id})">Excluir</button>
            </div>
        </div>
    `).join('');
}

function editPost(postId) {
    window.location.href = `edit-post.html?id=${postId}`;
}

function viewPost(postId) {
    window.location.href = `post.html?id=${postId}`;
}

window.deleteMyPost = async function(postId) {
    showConfirm('Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.', async () => {
        const token = localStorage.getItem('blogToken');
        const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        if (response.status === 204) {
            showNotification('Post excluído com sucesso!', 'success');
            loadMyPosts();
        } else {
            showNotification('Erro ao excluir post.', 'error');
        }
    });
}

function showConfirm(message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    document.getElementById('confirm-modal-message').textContent = message;
    modal.style.display = 'flex';

    const yesBtn = document.getElementById('confirm-modal-yes');
    const noBtn = document.getElementById('confirm-modal-no');

    function cleanup() {
        modal.style.display = 'none';
        yesBtn.removeEventListener('click', onYes);
        noBtn.removeEventListener('click', onNo);
    }

    function onYes() {
        cleanup();
        onConfirm();
    }
    function onNo() {
        cleanup();
    }

    yesBtn.addEventListener('click', onYes);
    noBtn.addEventListener('click', onNo);
}