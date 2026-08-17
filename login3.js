initTheme();
initPasswordToggle('senha', 'toggleSenha');
initPasswordToggle('repetirSenha', 'toggleRepetir');

document.getElementById('cadastroForm').addEventListener('submit', function(e) {
 e.preventDefault();
 
 const usuario = document.getElementById('usuario').value.trim();
 const senha = document.getElementById('senha').value;
 const repetirSenha = document.getElementById('repetirSenha').value;
 
 // Limpa mensagem anterior
 const msg = document.getElementById('message');
 if (msg) msg.style.display = 'none';
 
 if (!usuario || !senha || !repetirSenha) {
  showMessage('Todos os campos são obrigatórios!');
  return;
 }
 
 if (senha.length < 6) {
  showMessage('A senha deve ter no mínimo 6 caracteres.');
  return;
 }
 
 if (senha !== repetirSenha) {
  showMessage('As senhas não coincidem!');
  return;
 }
 
 let users = JSON.parse(localStorage.getItem('users')) || [];
 
 if (users.some(u => u.usuario === usuario)) {
  showMessage('Este usuário já está cadastrado!');
  return;
 }
 
 users.push({
  usuario: usuario,
  senha: senha
 });
 
 localStorage.setItem('users', JSON.stringify(users));
 showMessage('Cadastro realizado com sucesso!', 'success');
 
 setTimeout(() => {
  window.location.href = 'index1.html';
 }, 1200);
});