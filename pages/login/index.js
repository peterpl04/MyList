/*document.addEventListener('DOMContentLoaded', () => {
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
*/
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const loginTexto = document.getElementById('login-texto');
    const loginLoader = document.getElementById('login-loader');
    const inputEmail = document.querySelector('input[type="text"]');
    const inputSenha = document.querySelector('input[type="password"]');

    const modalErroLogin = document.getElementById('modal-login-erro');
    const btnFecharErroLogin = document.getElementById('btn-fechar-login-erro');
    const mensagemErroLogin = document.getElementById('mensagem-erro-login'); // Adicionado para exibir mensagens de erro específicas

    // Função para mostrar mensagem de erro no modal de login
    function mostrarErroLogin(msg) {
        mensagemErroLogin.textContent = msg;
        modalErroLogin.style.display = 'block';
    }

    loginBtn.addEventListener('click', async () => {
        const email = inputEmail.value.trim();
        const senha = inputSenha.value.trim();

        // Validação básica dos campos
        if (!email || !senha) {
            mostrarErroLogin('Preencha o email e a senha.');
            return;
        }

        // Ativa o loader e desabilita o botão
        loginTexto.textContent = 'Entrando...';
        loginLoader.style.display = 'inline-block';
        loginBtn.disabled = true;

        try {
            // Requisição GET para o endpoint de usuário por email
            const res = await fetch(`http://localhost:3000/usuarios/${email}`);

            if (res.ok) {
                const usuario = await res.json();

                // Verifica se a senha fornecida corresponde à senha armazenada (em um cenário real, você usaria hash de senha)
                if (usuario.senha === senha) {
                    // Armazena informações do usuário no localStorage
                    localStorage.setItem('nomeUsuario', usuario.nome);
                    localStorage.setItem('usuarioMyList', JSON.stringify({
                        nome: usuario.nome,
                        email: usuario.email
                    }));

                    // Redireciona para a página de tarefas após um pequeno atraso para a UX
                    setTimeout(() => {
                        window.location.href = '../tarefas/tarefas.html';
                    }, 1000);
                } else {
                    mostrarErroLogin('Email ou senha incorretos.');
                    // Reseta o estado do botão e loader em caso de erro
                    loginTexto.textContent = 'Login';
                    loginLoader.style.display = 'none';
                    loginBtn.disabled = false;
                }
            } else if (res.status === 404) {
                mostrarErroLogin('Email não cadastrado.');
                // Reseta o estado do botão e loader em caso de erro
                loginTexto.textContent = 'Login';
                loginLoader.style.display = 'none';
                loginBtn.disabled = false;
            } else {
                const erro = await res.json();
                mostrarErroLogin(erro.erro || 'Erro ao fazer login. Tente novamente.');
                // Reseta o estado do botão e loader em caso de erro
                loginTexto.textContent = 'Login';
                loginLoader.style.display = 'none';
                loginBtn.disabled = false;
            }
        } catch (err) {
            mostrarErroLogin('Erro ao conectar com o servidor. Verifique sua conexão.');
            console.error(err);
            // Reseta o estado do botão e loader em caso de erro
            loginTexto.textContent = 'Login';
            loginLoader.style.display = 'none';
            loginBtn.disabled = false;
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