function initSearchBar() {
    const input = document.getElementById('search-input');
    const suggestions = document.getElementById('search-suggestions');
    const searchBtn = document.getElementById('search-btn');
    if (!input || !suggestions || !searchBtn) return;

    let posts = [];
    let selectedIndex = -1;

    // Carrega todos os posts para busca local
    fetch('http://localhost:3000/api/posts')
        .then(res => res.json())
        .then(data => posts = data);

    input.addEventListener('input', () => {
        const value = input.value.trim().toLowerCase();
        if (!value) {
            suggestions.innerHTML = '';
            suggestions.style.display = 'none';
            return;
        }
        const filtered = posts.filter(post => post.title.toLowerCase().includes(value));
        if (filtered.length === 0) {
            suggestions.innerHTML = '<li style="color:#aaa;">Nenhum resultado</li>';
            suggestions.style.display = 'block';
            return;
        }
        suggestions.innerHTML = filtered.map((post, i) =>
            `<li data-id="${post.id}" ${i === 0 ? 'class="active"' : ''}>${post.title}</li>`
        ).join('');
        suggestions.style.display = 'block';
        selectedIndex = 0;
    });

    // Clique em sugestão
    suggestions.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'LI' && e.target.dataset.id) {
            input.value = e.target.textContent;
            suggestions.innerHTML = '';
            suggestions.style.display = 'none';
            goToPost(e.target.dataset.id);
        }
    });

    // Clique no botão de lupa
    searchBtn.addEventListener('click', () => {
        const value = input.value.trim().toLowerCase();
        const found = posts.find(post => post.title.toLowerCase() === value);
        if (found) {
            goToPost(found.id);
        } else {
            const filtered = posts.filter(post => post.title.toLowerCase().includes(value));
            if (filtered.length > 0) {
                goToPost(filtered[0].id);
            }
        }
    });

    // Enter/autocomplete com teclado
    input.addEventListener('keydown', (e) => {
        const items = suggestions.querySelectorAll('li[data-id]');
        if (e.key === 'ArrowDown') {
            if (items.length) {
                selectedIndex = (selectedIndex + 1) % items.length;
                updateActive(items);
            }
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            if (items.length) {
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                updateActive(items);
            }
            e.preventDefault();
        } else if (e.key === 'Enter') {
            if (items.length && selectedIndex >= 0) {
                input.value = items[selectedIndex].textContent;
                suggestions.innerHTML = '';
                suggestions.style.display = 'none';
                goToPost(items[selectedIndex].dataset.id);
            }
        }
    });

    function updateActive(items) {
        items.forEach((li, i) => {
            li.classList.toggle('active', i === selectedIndex);
        });
    }

    function goToPost(postId) {
        if (window.location.pathname.includes('/pages/')) {
            window.location.href = `post.html?id=${postId}`;
        } else {
            window.location.href = `pages/post.html?id=${postId}`;
        }
    }
}