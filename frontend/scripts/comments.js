// Listar comentários de um post
async function loadComments(postId) {
    const response = await fetch(`http://localhost:3000/api/comments/post/${postId}`);
    const comments = await response.json();
    renderComments(comments);
}

function renderComments(comments) {
    const container = document.getElementById('comments-list');
    container.innerHTML = comments.map(comment => `
        <div class="comment-box">
            <strong>${comment.author?.name || 'Usuário'}</strong>
            <p>${comment.content}</p>
        </div>
    `).join('');
}

// Criar comentário
async function createComment(postId, content) {
    const token = localStorage.getItem('blogToken');
    const response = await fetch(`http://localhost:3000/api/comments/post/${postId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ content })
    });
    return await response.json();
}

// Exemplo de uso em formulário:
document.getElementById('add-comment-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const postId = getPostIdFromUrl();
    const content = document.getElementById('comment-text').value;
    await createComment(postId, content);
    loadComments(postId);
});

