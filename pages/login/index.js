document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const loginTexto = document.getElementById('login-texto');
  const loginLoader = document.getElementById('login-loader');
  const inputEmail = document.querySelector('input[type="text"]');
  const inputSenha = document.querySelector('input[type="password"]');

  const modalErroLogin = document.getElementById('modal-login-erro');
  const btnFecharErroLogin = document.getElementById('btn-fechar-login-erro');

  loginBtn.addEventListener('click', () => {
    const email = inputEmail.value.trim();
    const senha = inputSenha.value.trim();

    const usuarioSalvo = JSON.parse(localStorage.getItem('usuarioMyList'));

    if (
      usuarioSalvo &&
      email === usuarioSalvo.email &&
      senha === usuarioSalvo.senha
    ) {
      loginTexto.textContent = 'Entrando...';
      loginLoader.style.display = 'inline-block';
      loginBtn.disabled = true;

      setTimeout(() => {
        window.location.href = '../tarefas/tarefas.html';
      }, 1000);
    } else {
      modalErroLogin.style.display = 'block';
    }
  });

  btnFecharErroLogin.addEventListener('click', () => {
    modalErroLogin.style.display = 'none';
  });

  // Fecha o modal ao clicar fora dele
  window.onclick = (event) => {
    if (event.target === modalErroLogin) {
      modalErroLogin.style.display = 'none';
    }
  };
});
