document.addEventListener('DOMContentLoaded', () => {
  const saudacao = document.getElementById('saudacao');
  const nomeCompleto = localStorage.getItem('nomeUsuario');
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioMyList'));

  if (!usuarioLogado || !usuarioLogado.email) {
    window.location.href = '../login/login.html';
    return;
  }

  if (nomeCompleto) {
    const primeiroNome = nomeCompleto.split(' ')[0];
    saudacao.textContent = `Olá, ${primeiroNome}! 👋`;
  }

  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task');
  const taskList = document.getElementById('task-list');
  const filtroBotoes = document.querySelectorAll('.filtros button');

  const modalPrioridade = document.getElementById('modal-prioridade');
  const btnPrioridadeAlta = modalPrioridade.querySelector('[data-prioridade="Alta"]');
  const btnPrioridadeMedia = modalPrioridade.querySelector('[data-prioridade="Média"]');
  const btnPrioridadeBaixa = modalPrioridade.querySelector('[data-prioridade="Baixa"]');

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
  const prioridadeBotoesEditar = document.querySelectorAll('.botao-bonito-prioridade');

  let tarefaEditandoId = null;
  let tarefas = [];
  let filtroAtual = null;
  let prioridadeSelecionada = '';
  let prioridadeEditandoSelecionada = '';

  function getPrioridadesLocais() {
    return JSON.parse(localStorage.getItem('prioridadesLocal')) || {};
  }

  function salvarPrioridadeLocal(id, prioridade) {
    const prioridades = getPrioridadesLocais();
    prioridades[id] = prioridade;
    localStorage.setItem('prioridadesLocal', JSON.stringify(prioridades));
  }

  function getPrioridadeEmoji(prioridade) {
    if (prioridade === 'Alta') return '🔴';
    if (prioridade === 'Média') return '🟡';
    if (prioridade === 'Baixa') return '🟢';
    return '';
  }

  async function carregarTarefas() {
    try {
      const res = await fetch(`http://localhost:3000/listas/${usuarioLogado.email}`);
      if (res.ok) {
        tarefas = await res.json();
        renderizarTarefas();
      } else {
        console.error('Erro ao carregar tarefas:', await res.json());
        alert('Erro ao carregar suas tarefas. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro de conexão ao carregar tarefas:', err);
      alert('Não foi possível conectar ao servidor para carregar suas tarefas.');
    }
  }

  function renderizarTarefas() {
    taskList.innerHTML = '';
    const prioridades = getPrioridadesLocais();

    const tarefasFiltradas = tarefas.filter(tarefa => {
      if (filtroAtual === 'ativas') return !tarefa.status;
      if (filtroAtual === 'concluidas') return tarefa.status;
      return true;
    });

    tarefasFiltradas.sort((a, b) => {
      const prioridades = getPrioridadesLocais();

      const prioridadeValor = {
        'Alta': 1,
        'Média': 2,
        'Baixa': 3,
        '': 4,
        undefined: 4,
        null: 4,
      };

      const prioridadeA = prioridadeValor[prioridades[a.id]];
      const prioridadeB = prioridadeValor[prioridades[b.id]];

      return prioridadeA - prioridadeB;
    });

    tarefasFiltradas.forEach((tarefa) => {
      const prioridade = prioridades[tarefa.id];
      const emoji = getPrioridadeEmoji(prioridade);
      const descricaoIcon = tarefa.descricao
        ? `<span class="icon-descricao" onclick="mostrarDescricao('${tarefa.id}')">📄</span>`
        : '';

      const li = document.createElement('li');
      li.innerHTML = `
        <input type="checkbox" ${tarefa.status ? 'checked' : ''} onchange="alternarConcluida('${tarefa.id}')">
        <span class="${tarefa.status ? 'tarefa-concluida' : ''}">
          ${emoji ? emoji + ' ' : ''}${tarefa.titulo}
        </span>
        ${descricaoIcon}
        <button onclick="editarTarefaModal('${tarefa.id}')">📝</button>
        <button onclick="deletarTarefa('${tarefa.id}')">🗑️</button>
      `;
      li.style.animation = 'fadeInSlide 0.3s ease forwards';
      taskList.appendChild(li);
    });
  }

  window.deletarTarefa = async function (id) {
    const li = document.querySelector(`li input[onchange="alternarConcluida('${id}')"]`).closest('li');
    li.style.animation = 'fadeOut 0.4s forwards';

    try {
      const res = await fetch(`http://localhost:3000/listas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const prioridades = getPrioridadesLocais();
        delete prioridades[id];
        localStorage.setItem('prioridadesLocal', JSON.stringify(prioridades));
        setTimeout(() => carregarTarefas(), 400);
      } else {
        alert('Erro ao deletar tarefa.');
        li.style.animation = '';
      }
    } catch {
      alert('Erro de conexão ao deletar tarefa.');
      li.style.animation = '';
    }
  };

  window.alternarConcluida = async function (id) {
    const tarefa = tarefas.find(t => t.id == id);
    if (!tarefa) return;

    try {
      const res = await fetch(`http://localhost:3000/listas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: !tarefa.status })
      });
      if (res.ok) carregarTarefas();
    } catch {
      alert('Erro ao atualizar status da tarefa.');
    }
  };

  window.mostrarDescricao = function (id) {
    const tarefa = tarefas.find(t => t.id == id);
    if (tarefa) {
      descricaoConteudo.textContent = tarefa.descricao;
      visualizarModal.style.display = 'block';
    }
  };

  window.editarTarefaModal = function (id) {
    tarefaEditandoId = id;
    const tarefa = tarefas.find(t => t.id == id);
    if (tarefa) {
      editarTitulo.value = tarefa.titulo;
      editarDescricao.value = tarefa.descricao;

      const prioridades = getPrioridadesLocais();
      prioridadeEditandoSelecionada = prioridades[id] || '';

      prioridadeBotoesEditar.forEach(btn => {
        if (btn.dataset.prioridade === prioridadeEditandoSelecionada) {
          btn.classList.add('selecionado');
        } else {
          btn.classList.remove('selecionado');
        }
      });

      modalEditar.style.display = 'block';
    }
  };

  prioridadeBotoesEditar.forEach(btn => {
    btn.addEventListener('click', () => {
      prioridadeEditandoSelecionada = btn.dataset.prioridade;
      prioridadeBotoesEditar.forEach(b => b.classList.remove('selecionado'));
      btn.classList.add('selecionado');
    });
  });

  salvarEdicao.onclick = async () => {
    if (tarefaEditandoId !== null) {
      const novoTitulo = editarTitulo.value.trim();
      const novaDescricao = editarDescricao.value.trim();
      if (!novoTitulo) return alert('Título não pode ser vazio.');

      try {
        const res = await fetch(`http://localhost:3000/listas/atualizar/${tarefaEditandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ titulo: novoTitulo, descricao: novaDescricao })
        });
        if (res.ok) {
          if (prioridadeEditandoSelecionada) {
            salvarPrioridadeLocal(tarefaEditandoId, prioridadeEditandoSelecionada);
          }
          await carregarTarefas();
          modalEditar.style.display = 'none';
          tarefaEditandoId = null;
        }
      } catch {
        alert('Erro ao salvar tarefa.');
      }
    }
  };

  fecharDescricaoBtn.onclick = () => visualizarModal.style.display = 'none';
  fecharEdicao.onclick = () => {
    modalEditar.style.display = 'none';
    tarefaEditandoId = null;
  };

  window.onclick = (event) => {
    if ([modal, visualizarModal, modalEditar, modalDecisao, modalPrioridade].includes(event.target)) {
      modal.style.display = 'none';
      visualizarModal.style.display = 'none';
      modalEditar.style.display = 'none';
      modalDecisao.style.display = 'none';
      modalPrioridade.style.display = 'none';
      tarefaEditandoId = null;
      prioridadeSelecionada = '';
    }
  };

  async function adicionarTarefa(tarefa) {
    try {
      const res = await fetch('http://localhost:3000/listas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuarioLogado.email,
          titulo: tarefa.titulo,
          descricao: tarefa.descricao,
          status: tarefa.status
        })
      });

      if (res.ok) {
        const novaTarefa = await res.json();
        if (tarefa.prioridade) {
          salvarPrioridadeLocal(novaTarefa.id, tarefa.prioridade);
        }
        taskInput.value = '';
        descModalInput.value = '';
        prioridadeSelecionada = '';
        await carregarTarefas();
      }
    } catch {
      alert('Erro ao adicionar tarefa.');
    }
  }

  addTaskBtn.addEventListener('click', () => {
    const titulo = taskInput.value.trim();
    if (!titulo) return alert('Digite um título.');
    modalPrioridade.style.display = 'block';
  });

  [btnPrioridadeAlta, btnPrioridadeMedia, btnPrioridadeBaixa].forEach(btn => {
    btn.onclick = () => {
      prioridadeSelecionada = btn.dataset.prioridade;
      modalPrioridade.style.display = 'none';
      modalDecisao.style.display = 'block';
    };
  });

  btnDecisaoSim.onclick = () => {
    modalDecisao.style.display = 'none';
    modal.style.display = 'block';
  };

  btnDecisaoNao.onclick = () => {
    const titulo = taskInput.value.trim();
    if (!titulo) return;
    adicionarTarefa({ titulo, descricao: '', status: false, prioridade: prioridadeSelecionada });
    modalDecisao.style.display = 'none';
  };

  confirmarDescBtn.addEventListener('click', () => {
    const titulo = taskInput.value.trim();
    const descricao = descModalInput.value.trim();
    if (!titulo) return alert('Digite um título.');
    adicionarTarefa({ titulo, descricao, status: false, prioridade: prioridadeSelecionada });
    modal.style.display = 'none';
  });

  cancelarDescBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    descModalInput.value = '';
    prioridadeSelecionada = '';
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

  carregarTarefas();
});
