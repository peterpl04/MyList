document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const loginTexto = document.getElementById('login-texto');
  const loginLoader = document.getElementById('login-loader');
  const inputUsuario = document.querySelector('input[type="text"]');
  const inputSenha = document.querySelector('input[type="password"]');

  const usuarioFixo = 'web';
  const senhaFixo = '123';

  loginBtn.addEventListener('click', () => {
    const usuario = inputUsuario.value.trim();
    const senha = inputSenha.value.trim();

    if (usuario === usuarioFixo && senha === senhaFixo) {
      loginTexto.textContent = 'Entrando...';
      loginLoader.style.display = 'inline-block';
      loginBtn.disabled = true;

      setTimeout(() => {
        window.location.href = '../tarefas/tarefas.html';
      }, 2500);
    } else {
      alert('Usuário ou senha incorretos!');
    }
  });
});
