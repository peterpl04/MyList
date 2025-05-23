document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task');
  const taskList = document.getElementById('task-list');
  const filtroBotoes = document.querySelectorAll('.filtros button');

  const modalDecisao = document.getElementById('modal-decisao');
  const btnDecisaoSim = document.getElementById('decisao-sim');
  const btnDecisaoNao = document.getElementById('decisao-nao');

  const modal = document.getElementById('modal-descricao');
  const confirmarDescBtn = document.getElementById('confirmar-desc');
  const cancelarDescBtn = document.getElementById('cancelar-desc');
  const descModalInput = document.getElementById('descricao-modal');

  const visualizarModal = document.getElementById('visualizar-descricao-modal');
  const fecharDescricaoBtn = document.getElementById('fechar-descricao');
  const descricaoConteudo = document.getElementById('descricao-conteudo');

  const modalEditar = document.getElementById('modal-editar');
  const fecharEdicao = document.getElementById('fechar-edicao');
  const editarTitulo = document.getElementById('editar-titulo');
  const editarDescricao = document.getElementById('editar-descricao');
  const salvarEdicao = document.getElementById('salvar-edicao');
  let tarefaEditandoIndex = null;

  let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  let filtroAtual = null;

  function salvarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    renderizarTarefas();
  }

  function renderizarTarefas() {
    taskList.innerHTML = '';

    // const filtroContainer = document.getElementById('filtro-container');
    // if (tarefas.length === 0) {
    //   filtroContainer.style.display = 'none';
    // } else {
    //   filtroContainer.style.display = 'flex';
    // }

    const tarefasFiltradas = tarefas.filter(tarefa => {
      if (filtroAtual === 'ativas') return !tarefa.concluida;
      if (filtroAtual === 'concluidas') return tarefa.concluida;
      return true;
    });

    tarefasFiltradas.forEach((tarefa, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <input type="checkbox" ${tarefa.concluida ? 'checked' : ''} onchange="alternarConcluida(${index})">
        <span class="${tarefa.concluida ? 'tarefa-concluida' : ''}">
          ${tarefa.texto}
        </span>
        ${tarefa.descricao ? `<span class="icon-descricao" onclick="mostrarDescricao(${index})">📄</span>` : ''}
        <button onclick="editarTarefaModal(${index})">📝</button>
        <button onclick="deletarTarefa(${index})">🗑️</button>
      `;
      li.style.animation = 'fadeInSlide 0.3s ease forwards';
      taskList.appendChild(li);
    });
  }

  window.editarTarefa = function (index, novoTexto) {
    tarefas[index].texto = novoTexto.trim();
    salvarTarefas();
  };

  window.deletarTarefa = function (index) {
    const li = taskList.children[index];
    li.style.animation = 'fadeOut 0.4s forwards';
    setTimeout(() => {
      tarefas.splice(index, 1);
      salvarTarefas();
    }, 400);
  };

  window.alternarConcluida = function (index) {
    tarefas[index].concluida = !tarefas[index].concluida;
    salvarTarefas();
  };

  window.mostrarDescricao = function (index) {
    descricaoConteudo.textContent = tarefas[index].descricao;
    visualizarModal.style.display = 'block';
  };

  window.editarTarefaModal = function (index) {
    tarefaEditandoIndex = index;
    editarTitulo.value = tarefas[index].texto;
    editarDescricao.value = tarefas[index].descricao;
    modalEditar.style.display = 'block';
  };

  salvarEdicao.onclick = () => {
    if (tarefaEditandoIndex !== null) {
      tarefas[tarefaEditandoIndex].texto = editarTitulo.value.trim();
      tarefas[tarefaEditandoIndex].descricao = editarDescricao.value.trim();
      salvarTarefas();
      modalEditar.style.display = 'none';
      tarefaEditandoIndex = null;
    }
  };

  fecharDescricaoBtn.onclick = () => {
    visualizarModal.style.display = 'none';
  };

  fecharEdicao.onclick = () => {
    modalEditar.style.display = 'none';
    tarefaEditandoIndex = null;
  };

  window.onclick = (event) => {
    if (
      event.target === modal ||
      event.target === visualizarModal ||
      event.target === modalEditar ||
      event.target === modalDecisao
    ) {
      modal.style.display = 'none';
      visualizarModal.style.display = 'none';
      modalEditar.style.display = 'none';
      modalDecisao.style.display = 'none';
      tarefaEditandoIndex = null;
    }
  };

  function adicionarTarefa(tarefa) {
    tarefas.push(tarefa);
    taskInput.value = '';
    descModalInput.value = '';
    salvarTarefas();
  }

  addTaskBtn.addEventListener('click', () => {
    const texto = taskInput.value.trim();
    if (!texto) return;

    modalDecisao.style.display = 'block';
  });

  btnDecisaoSim.onclick = () => {
    modalDecisao.style.display = 'none';
    modal.style.display = 'block';
  };

  btnDecisaoNao.onclick = () => {
    const texto = taskInput.value.trim();
    adicionarTarefa({ texto, descricao: '', concluida: false });
    modalDecisao.style.display = 'none';
  };

  confirmarDescBtn.addEventListener('click', () => {
    const texto = taskInput.value.trim();
    const descricao = descModalInput.value.trim();
    adicionarTarefa({ texto, descricao, concluida: false });
    modal.style.display = 'none';
  });

  cancelarDescBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    descModalInput.value = '';
  });

  filtroBotoes.forEach(btn => {
    btn.addEventListener('click', () => {
      const valorFiltro = btn.dataset.filtro;
      if (filtroAtual === valorFiltro) {
        filtroAtual = null;
        filtroBotoes.forEach(b => b.classList.remove('filtro-ativo'));
      } else {
        filtroAtual = valorFiltro;
        filtroBotoes.forEach(b => b.classList.remove('filtro-ativo'));
        btn.classList.add('filtro-ativo');
      }
      renderizarTarefas();
    });
  });

  renderizarTarefas();
});
