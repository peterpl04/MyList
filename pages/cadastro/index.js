document.addEventListener('DOMContentLoaded', () => {
  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const confirmarInput = document.getElementById('confirmar');
  const btnCadastrar = document.getElementById('btn-cadastrar');

  const modalSucesso = document.getElementById('modal-sucesso');
  const modalErro = document.getElementById('modal-erro');
  const btnOkSucesso = document.getElementById('btn-ok-sucesso');
  const btnOkErro = document.getElementById('btn-ok-erro');
  const mensagemErro = document.getElementById('mensagem-erro');

  function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function mostrarErro(msg) {
    mensagemErro.textContent = msg;
    modalErro.style.display = 'block';
  }

  btnCadastrar.addEventListener('click', () => {
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();
    const confirmar = confirmarInput.value.trim();

    const usuarioExistente = JSON.parse(localStorage.getItem('usuarioMyList'));

    if (!nome || !email || !senha || !confirmar) {
      mostrarErro('Preencha todos os campos.');
      return;
    }

    if (!emailValido(email)) {
      mostrarErro('Digite um email válido.');
      return;
    }

    if (usuarioExistente && usuarioExistente.email === email) {
      mostrarErro('Este email já está cadastrado.');
      return;
    }

    if (senha !== confirmar) {
      mostrarErro('As senhas não coincidem.');
      return;
    }

    localStorage.setItem('nomeUsuario', nome);
    localStorage.setItem('usuarioMyList', JSON.stringify({ nome, email, senha }));

    modalSucesso.style.display = 'block';
  });


  btnOkSucesso.addEventListener('click', () => {
    modalSucesso.style.display = 'none';
    window.location.href = '../login/login.html';
  });

  btnOkErro.addEventListener('click', () => {
    modalErro.style.display = 'none';
  });
});
