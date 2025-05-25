// post-handler.js - Sistema completo para posts individuais e comentários

class PostHandler {
    constructor() {
        this.currentPostId = null;
        this.currentFilter = 'best';
        this.comments = [];
        this.init();
    }

    init() {
        console.log('PostHandler iniciado');
        this.currentPostId = this.getPostIdFromUrl();
        console.log('Post ID da URL:', this.currentPostId);
        
        if (this.currentPostId) {
            console.log('Carregando post...');
            this.loadPost();
        } else {
            console.error('ID do post não encontrado na URL');
            this.showError('ID do post não encontrado na URL');
        }
        this.setupEventListeners();
    }

    // Utilitários
    getPostIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async fetchAuth(url, options = {}) {
        const token = localStorage.getItem('blogToken');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return fetch(url, {
            ...options,
            headers
        });
    }

    // Carregamento do Post
    async loadPost() {
        try {
            console.log('Iniciando carregamento do post ID:', this.currentPostId);
            this.showLoading('Carregando post...');
            
            const url = `http://localhost:3000/api/posts/${this.currentPostId}`;
            console.log('URL da requisição:', url);
            
            const response = await fetch(url);
            console.log('Status da resposta:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro na resposta:', errorText);
                throw new Error(`Erro ${response.status}: Post não encontrado`);
            }
            
            const post = await response.json();
            console.log('Post carregado:', post);
            
            this.renderPost(post);
            await this.loadComments();
            
        } catch (error) {
            console.error('Erro ao carregar post:', error);
            this.showError('Post não encontrado', 'O post que você está procurando não existe ou foi removido.');
        }
    }

    renderPost(post) {
        const container = document.getElementById('posts-container');
        
        // O backend não está incluindo o author no getPostById, então vamos tratar isso
        const avatar = (post.author?.avatar) || '/frontend/assets/do-utilizador.svg';
        const authorName = (post.author?.name) || 'Usuário';
        const formattedDate = new Date(post.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        container.innerHTML = `
            <div class="post-card single-post">
                <div class="post-meta">
                    <img src="${avatar}" alt="${authorName}" class="post-user-icon">
                    <div class="post-author-info">
                        <span class="post-author">${authorName}</span>
                        <span class="post-date">${formattedDate}</span>
                    </div>
                </div>
                <h1 class="post-title">${post.title}</h1>
                <div class="post-content">
                    <p>${post.content || ''}</p>
                </div>
                <div class="post-actions">
                    <div class="vote-section">
                        <button class="vote-btn upvote" onclick="postHandler.votePost('${post.id}', ('up')">
                            👍
                        </button>
                        <span class="vote-count">0</span>
                        <button class="vote-btn downvote" onclick="postHandler.votePost('${post.id}', ('down')">
                            👎
                        </button>
                    </div>
                    <div class="comment-section-info">
                        <span class="comment-count">💬 <span id="comment-count">0</span> comentários</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Sistema de Votação - Corrigido para usar a rota correta
    async votePost(type) {
        try {
            const value = type === 'up' ? 1 : -1;
            // Corrigindo a URL da rota de votação baseada no seu backend
            const response = await this.fetchAuth(`http://localhost:3000/api/posts/posts/${this.currentPostId}/vote`, {
                method: 'POST',
                body: JSON.stringify({ type }) // Backend espera 'type', não 'value'
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Voto registrado:', result);
                this.showNotification('Voto registrado!', 'success');
            } else {
                throw new Error('Erro ao votar');
            }
        } catch (error) {
            console.error('Erro ao votar:', error);
            this.showNotification('Erro ao registrar voto', 'error');
        }
    }

    // Sistema de Comentários - Corrigido para usar as rotas corretas
    async loadComments() {
        try {
            console.log('Carregando comentários para post:', this.currentPostId);
            const response = await fetch(`http://localhost:3000/api/comments/post/${this.currentPostId}`);
            
            if (!response.ok) {
                throw new Error('Erro ao carregar comentários');
            }
            
            this.comments = await response.json();
            console.log('Comentários carregados:', this.comments);
            
            // Atualizar contagem de comentários
            const commentCountEl = document.getElementById('comment-count');
            if (commentCountEl) {
                commentCountEl.textContent = this.comments.length;
            }
            
            this.filterAndRenderComments();
            
        } catch (error) {
            console.error('Erro ao carregar comentários:', error);
            document.getElementById('comments-list').innerHTML = `
                <div class="error-message">
                    <p>Erro ao carregar comentários</p>
                </div>
            `;
        }
    }

    filterComments(filter) {
        this.currentFilter = filter;
        this.updateFilterButtons();
        this.filterAndRenderComments();
    }

    updateFilterButtons() {
        document.querySelectorAll('.comments-filter button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Encontrar o botão correto baseado no filtro
        let buttonText = '';
        switch(this.currentFilter) {
            case 'best': buttonText = 'Melhores'; break;
            case 'new': buttonText = 'Mais novos'; break;
            case 'old': buttonText = 'Antigos'; break;
        }
        
        const targetButton = Array.from(document.querySelectorAll('.comments-filter button'))
            .find(btn => btn.textContent.trim() === buttonText);
        if (targetButton) {
            targetButton.classList.add('active');
        }
    }

    filterAndRenderComments() {
        let sortedComments = [...this.comments];
        
        switch (this.currentFilter) {
            case 'best':
                // Como não temos sistema de votação ainda, ordenar por data mais recente
                sortedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'new':
                sortedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'old':
                sortedComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
        }
        
        this.renderComments(sortedComments);
    }

    renderComments(comments) {
        const container = document.getElementById('comments-list');
        
        if (comments.length === 0) {
            container.innerHTML = `
                <div class="no-comments">
                    <p>Seja o primeiro a comentar!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = comments.map(comment => {
            // Backend não está incluindo author nos comentários, vamos tratar
            const avatar = '/frontend/assets/do-utilizador.svg';
            const authorName = 'Usuário';
            const formattedDate = new Date(comment.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            return `
                <div class="comment-box" data-comment-id="${comment.id}">
                    <div class="comment-header">
                        <img src="${avatar}" alt="${authorName}" class="comment-user-icon">
                        <div class="comment-meta">
                            <span class="comment-author">${authorName}</span>
                            <span class="comment-date">${formattedDate}</span>
                        </div>
                    </div>
                    <div class="comment-content">
                        <p>${comment.content}</p>
                    </div>
                    <div class="comment-actions">
                        <button class="vote-btn comment-upvote" onclick="postHandler.voteComment(${comment.id}, 'up')">
                            👍 <span>0</span>
                        </button>
                        <button class="vote-btn comment-downvote" onclick="postHandler.voteComment(${comment.id}, 'down')">
                            👎 <span>0</span>
                        </button>
                        <button class="reply-btn" onclick="postHandler.toggleReplyForm(${comment.id})">
                            Responder
                        </button>
                    </div>
                    <div class="reply-form" id="reply-form-${comment.id}" style="display: none;">
                        <textarea placeholder="Escreva sua resposta..." rows="3"></textarea>
                        <div class="reply-form-actions">
                            <button onclick="postHandler.submitReply(${comment.id})">Responder</button>
                            <button onclick="postHandler.cancelReply(${comment.id})">Cancelar</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Votação de Comentários (ainda não implementada no backend)
    async voteComment(commentId, type) {
        try {
            // Por enquanto, apenas mostrar mensagem já que não está implementado
            this.showNotification('Sistema de votação em comentários será implementado em breve', 'info');
        } catch (error) {
            console.error('Erro ao votar no comentário:', error);
            this.showNotification('Erro ao registrar voto', 'error');
        }
    }

    // Criação de Comentários
    async createComment(content) {
        try {
            const response = await this.fetchAuth(`http://localhost:3000/api/comments/post/${this.currentPostId}`, {
                method: 'POST',
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                const newComment = await response.json();
                console.log('Comentário criado:', newComment);
                await this.loadComments(); // Recarregar comentários
                this.showNotification('Comentário adicionado com sucesso!', 'success');
                return true;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao criar comentário');
            }
        } catch (error) {
            console.error('Erro ao criar comentário:', error);
            this.showNotification('Erro ao adicionar comentário: ' + error.message, 'error');
            return false;
        }
    }

    // Interface de Comentários
    showCommentForm() {
        const token = localStorage.getItem('blogToken');
        if (!token) {
            this.showNotification('Você precisa estar logado para comentar', 'warning');
            return;
        }

        const form = document.getElementById('add-comment-form');
        form.innerHTML = `
            <div class="comment-form">
                <textarea id="comment-text" placeholder="O que você pensa sobre isso?" rows="4" required></textarea>
                <div class="comment-form-actions">
                    <button type="submit">Comentar</button>
                    <button type="button" onclick="postHandler.hideCommentForm()">Cancelar</button>
                </div>
            </div>
        `;
        
        // Focar no textarea
        document.getElementById('comment-text').focus();
    }

    hideCommentForm() {
        const form = document.getElementById('add-comment-form');
        form.innerHTML = `
            <button class="add-comment-btn" onclick="postHandler.showCommentForm()">+ Adicione um comentário</button>
        `;
    }

    // Respostas a Comentários
    toggleReplyForm(commentId) {
        const token = localStorage.getItem('blogToken');
        if (!token) {
            this.showNotification('Você precisa estar logado para responder', 'warning');
            return;
        }

        const replyForm = document.getElementById(`reply-form-${commentId}`);
        const isVisible = replyForm.style.display !== 'none';
        
        // Esconder todos os outros formulários de resposta
        document.querySelectorAll('.reply-form').forEach(form => {
            form.style.display = 'none';
        });
        
        if (!isVisible) {
            replyForm.style.display = 'block';
            replyForm.querySelector('textarea').focus();
        }
    }

    async submitReply(commentId) {
        const replyForm = document.getElementById(`reply-form-${commentId}`);
        const textarea = replyForm.querySelector('textarea');
        const content = textarea.value.trim();
        
        if (!content) {
            this.showNotification('Digite uma resposta', 'warning');
            return;
        }

        try {
            const response = await this.fetchAuth(`http://localhost:3000/api/comments/reply/${commentId}`, {
                method: 'POST',
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                const reply = await response.json();
                console.log('Resposta criada:', reply);
                await this.loadComments();
                this.showNotification('Resposta adicionada!', 'success');
                textarea.value = '';
                replyForm.style.display = 'none';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao responder comentário');
            }
        } catch (error) {
            console.error('Erro ao responder:', error);
            this.showNotification('Erro ao enviar resposta: ' + error.message, 'error');
        }
    }

    cancelReply(commentId) {
        const replyForm = document.getElementById(`reply-form-${commentId}`);
        replyForm.style.display = 'none';
        replyForm.querySelector('textarea').value = '';
    }

    // Event Listeners
    setupEventListeners() {
        // Formulário de comentário
        document.addEventListener('submit', async (e) => {
            if (e.target.id === 'add-comment-form') {
                e.preventDefault();
                const textarea = document.getElementById('comment-text');
                if (textarea) {
                    const content = textarea.value.trim();
                    if (content) {
                        const success = await this.createComment(content);
                        if (success) {
                            textarea.value = '';
                            this.hideCommentForm();
                        }
                    }
                }
            }
        });

        // Configurar filtros de comentários
        setTimeout(() => {
            this.setupCommentFilters();
        }, 100);
    }

    setupCommentFilters() {
        const filterButtons = document.querySelectorAll('.comments-filter button');
        filterButtons.forEach(btn => {
            const text = btn.textContent.trim();
            let filter = 'best';
            
            if (text.includes('novos')) filter = 'new';
            else if (text.includes('Antigos')) filter = 'old';
            
            btn.onclick = () => this.filterComments(filter);
        });
    }

    // Utilitários de UI
    showLoading(message = 'Carregando...') {
        document.getElementById('posts-container').innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
    }

    showError(title, message = '') {
        document.getElementById('posts-container').innerHTML = `
            <div class="error-message">
                <h3>${title}</h3>
                ${message ? `<p>${message}</p>` : ''}
                <a href="../index.html">← Voltar para a página inicial</a>
            </div>
        `;
    }

    showNotification(message, type = 'info') {
        // Remover notificações existentes
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        // Criar elemento de notificação
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
        `;
        
        // Cores baseadas no tipo
        const colors = {
            success: '#10b981',
            error: '#ef4444', 
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Remover após 4 segundos
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// Funções globais para compatibilidade com HTML existente
function filterComments(filter) {
    if (window.postHandler) {
        window.postHandler.filterComments(filter);
    }
}

function votePost(btn, type, postId) {
    if (window.postHandler) {
        window.postHandler.votePost(type);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    
    console.log('DOM carregado');
    console.log('URL atual:', window.location.href);
    console.log('Pathname:', window.location.pathname);
    
    // Verificar se estamos na página de post individual
    if (window.location.pathname.includes('post.html') || window.location.search.includes('id=')) {
        console.log('Detectada página de post individual');
        window.postHandler = new PostHandler();
    } else {
        console.log('Não é uma página de post individual');
    }
});

function loadPartial(url, containerId) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Falha ao carregar ' + url);
      return response.text();
    })
    .then(html => {
      document.getElementById(containerId).innerHTML = html;
    })
    .catch(err => {
      console.error(err);
      // Opcional: colocar mensagem de erro no container
      document.getElementById(containerId).innerHTML = '<p>Erro ao carregar conteúdo.</p>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
        loadComponent('Header', 'header-container').then(updateHeaderAuth);
        loadComponent('SidebarLeft', 'sidebar-left-container').then(updateSidebarUserName);
        loadComponent('SideBarRight', 'sidebar-right-container');
});



// Exportar para uso em outros arquivos se necessário
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PostHandler;
}