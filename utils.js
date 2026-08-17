// Dark Mode
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '◑';
    }

    themeToggle.addEventListener('click', () => {
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.textContent = '◐';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '◑';
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Toggle senha
function initPasswordToggle(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    if (!input || !toggle) return;

    toggle.addEventListener('click', () => {
        if (input.type === 'password') {
            input.type = 'text';
            toggle.textContent = 'Ocultar';
        } else {
            input.type = 'password';
            toggle.textContent = 'Mostrar';
        }
    });
}

// Mostrar mensagem
function showMessage(text, type = 'error') {
    let msg = document.getElementById('message');
    if (!msg) {
        msg = document.createElement('div');
        msg.id = 'message';
        msg.className = 'message';
        const form = document.querySelector('form');
        if (form && form.parentNode) {
            form.parentNode.insertBefore(msg, form);
        }
    }
    msg.textContent = text;
    msg.className = 'message ' + type;
    msg.style.display = 'block';
}

// Verificar se está logado
function isLogged() {
    return !!localStorage.getItem('loggedUser');
}

// Proteger página (redireciona se não logado)
function protectPage() {
    if (!isLogged()) {
        window.location.href = 'index1.html';
    }
}

// Sair
function logout() {
    localStorage.removeItem('loggedUser');
    window.location.href = 'index1.html';
}
