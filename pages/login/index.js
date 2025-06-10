document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const loginTexto = document.getElementById('login-texto');
    const loginLoader = document.getElementById('login-loader');
    const inputEmail = document.querySelector('input[type="text"]');
    const inputSenha = document.querySelector('input[type="password"]');

    const modalErroLogin = document.getElementById('modal-login-erro');
    const btnFecharErroLogin = document.getElementById('btn-fechar-login-erro');
    const mensagemErroLogin = document.getElementById('mensagem-erro-login'); // Adicionado para exibir mensagens de erro específicas

    function mostrarErroLogin(msg) {
        mensagemErroLogin.textContent = msg;
        modalErroLogin.style.display = 'block';
    }

    loginBtn.addEventListener('click', async () => {
        const email = inputEmail.value.trim();
        const senha = inputSenha.value.trim();

        if (!email || !senha) {
            mostrarErroLogin('Preencha o email e a senha.');
            return;
        }

        loginTexto.textContent = 'Entrando...';
        loginLoader.style.display = 'inline-block';
        loginBtn.disabled = true;

        try {
            const res = await fetch(`http://localhost:3000/usuarios/${email}`);

            if (res.ok) {
                const usuario = await res.json();

                if (usuario.senha === senha) {
                    localStorage.setItem('nomeUsuario', usuario.nome);
                    localStorage.setItem('usuarioMyList', JSON.stringify({
                        nome: usuario.nome,
                        email: usuario.email
                    }));

                    setTimeout(() => {
                        window.location.href = '../tarefas/tarefas.html';
                    }, 1000);
                } else {
                    mostrarErroLogin('Email ou senha incorretos.');
                    loginTexto.textContent = 'Login';
                    loginLoader.style.display = 'none';
                    loginBtn.disabled = false;
                }
            } else if (res.status === 404) {
                mostrarErroLogin('Email não cadastrado.');
                loginTexto.textContent = 'Login';
                loginLoader.style.display = 'none';
                loginBtn.disabled = false;
            } else {
                const erro = await res.json();
                mostrarErroLogin(erro.erro || 'Erro ao fazer login. Tente novamente.');
                loginTexto.textContent = 'Login';
                loginLoader.style.display = 'none';
                loginBtn.disabled = false;
            }
        } catch (err) {
            mostrarErroLogin('Erro ao conectar com o servidor. Verifique sua conexão.');
            console.error(err);
            loginTexto.textContent = 'Login';
            loginLoader.style.display = 'none';
            loginBtn.disabled = false;
        }
    });

    btnFecharErroLogin.addEventListener('click', () => {
        modalErroLogin.style.display = 'none';
    });

    window.onclick = (event) => {
        if (event.target === modalErroLogin) {
            modalErroLogin.style.display = 'none';
        }
    };
});
