initTheme();
initPasswordToggle('senha', 'toggleLogin');

// Se já estiver logado, manda pro dashboard
if (isLogged()) {
    window.location.href = 'index2.html';
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value;

    if (!usuario || !senha) {
        showMessage('Usuário e senha são obrigatórios!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userFound = users.find(u => u.usuario === usuario && u.senha === senha);

    if (userFound) {
        localStorage.setItem('loggedUser', usuario);
        window.location.href = 'index2.html';
    } else {
        showMessage('Usuário ou senha incorretos.');
    }
});
