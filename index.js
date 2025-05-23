//CRUDS e Conexão com Banco

// Login de usuário padrão

document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.querySelector(".botao-bonito");
  const usernameInput = document.querySelector("input[type='text']");
  const passwordInput = document.querySelector("input[type='password']");

  if (loginButton && usernameInput && passwordInput) {
    loginButton.addEventListener("click", () => {
      const username = usernameInput.value.trim();
      const password = passwordInput.value;

      if (username === "web" && password === "123") {
        showLoadingAndRedirect();
      } else {
        alert("Usuário ou senha incorretos.");
      }
    });
  }
});

function showLoadingAndRedirect() {
  const main = document.querySelector("main");
  if (!main) return;

  main.innerHTML = `
    <div style="text-align:center;">
      <div class="loader"></div>
      <p style="margin-top: 15px; font-weight: bold;">Carregando suas tarefas...</p>
    </div>
  `;

  setTimeout(() => {
    window.location.href = "../tarefas/tarefas.html";
  }, 2000);
}
