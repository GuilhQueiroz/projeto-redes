// Listar comentários de um post
async function loadComments(postId) {
    const response = await fetch(`http://localhost:3000/api/comments/post/${postId}`);
    const comments = await response.json();
    const tree = buildCommentTree(comments);
    renderComments(tree);
}

function buildCommentTree(comments) {
    const map = {};
    comments.forEach(c => map[c.id] = { ...c, replies: [] });
    const tree = [];
    comments.forEach(c => {
        if (c.parentId) {
            map[c.parentId]?.replies.push(map[c.id]);
        } else {
            tree.push(map[c.id]);
        }
    });
    return tree;
}

function renderComments(comments, container = null, level = 0) {
    if (!container) {
        container = document.getElementById('comments-list');
        container.innerHTML = '';
    }
    comments.forEach(comment => {
        const div = document.createElement('div');
        div.className = 'comment-box';
        div.style.marginLeft = `${level * 24}px`;
        div.innerHTML = `
            <span class="comment-author">${comment.author && comment.author.name ? comment.author.name : 'Usuário'}</span>
            <div class="comment-date">${new Date(comment.createdAt).toLocaleString('pt-BR')}</div>
            <div class="comment-content">${comment.content}</div>
            <button class="reply-btn" onclick="replyToComment(${comment.id})">Responder</button>
        `;
        container.appendChild(div);

        if (comment.replies && comment.replies.length) {
            renderRepliesWithLimit(comment.replies, container, level + 1);
        }
    });
}

function renderRepliesWithLimit(replies, container, level) {
    const maxToShow = 5;
    replies.slice(0, maxToShow).forEach(reply => {
        renderComments([reply], container, level);
    });
    if (replies.length > maxToShow) {
        const btn = document.createElement('button');
        btn.textContent = 'Ver mais respostas';
        btn.className = 'see-more-btn';
        btn.onclick = () => {
            replies.slice(maxToShow).forEach(reply => {
                renderComments([reply], container, level);
            });
            btn.remove();
        };
        container.appendChild(btn);
    }
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

window.postHandler = window.postHandler || {};

window.postHandler.showCommentForm = function() {
    const form = document.getElementById('add-comment-form');
    // Evita adicionar mais de uma textarea
    if (document.getElementById('comment-text')) return;

    const textarea = document.createElement('textarea');
    textarea.id = 'comment-text';
    textarea.placeholder = 'Escreva um comentário...';
    textarea.required = true;
    textarea.style.width = '100%';
    textarea.style.margin = '12px 0';

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'add-comment-btn';
    submitBtn.textContent = 'Comentar';

    // Remove o botão antigo ao mostrar o form
    form.innerHTML = '';
    form.appendChild(textarea);
    form.appendChild(submitBtn);
};

