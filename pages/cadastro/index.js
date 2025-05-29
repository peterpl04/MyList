/*document.addEventListener('DOMContentLoaded', () => {
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

*/

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

  // Função auxiliar para validar o formato de email
  function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Função para mostrar mensagem de erro no modal
  function mostrarErro(msg) {
    mensagemErro.textContent = msg;
    modalErro.style.display = 'block';
  }

  btnCadastrar.addEventListener('click', async () => {
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();
    const confirmar = confirmarInput.value.trim();

    // Validações locais
    if (!nome || !email || !senha || !confirmar) {
      mostrarErro('Preencha todos os campos.');
      return;
    }

    if (!emailValido(email)) {
      mostrarErro('Digite um email válido.');
      return;
    }

    if (senha !== confirmar) {
      mostrarErro('As senhas não coincidem.');
      return;
    }

    // 🔽 INTEGRAÇÃO COM BACKEND 🔽
    try {
      const res = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      if (res.ok) {
        const dados = await res.json();

        // Salva nome e usuário no localStorage
        localStorage.setItem('nomeUsuario', dados.nome);
        localStorage.setItem('usuarioMyList', JSON.stringify({
          nome: dados.nome,
          email: dados.email,
        }));

        // Mostra modal de sucesso e redireciona
        modalSucesso.style.display = 'block';
      } else {
        const erro = await res.json();
        mostrarErro(erro.erro || 'Erro ao cadastrar. Tente novamente.');
      }
    } catch (err) {
      mostrarErro('Erro ao conectar com o servidor.');
      console.error(err);
    }
  });

  // Botão de OK no modal de sucesso
  btnOkSucesso.addEventListener('click', () => {
    modalSucesso.style.display = 'none';
    window.location.href = '../login/login.html'; // Redireciona para login
  });

  // Botão de OK no modal de erro
  btnOkErro.addEventListener('click', () => {
    modalErro.style.display = 'none';
  });
});
