/*document.addEventListener('DOMContentLoaded', () => {

  const saudacao = document.getElementById('saudacao');
  const nomeCompleto = localStorage.getItem('nomeUsuario');

  if (nomeCompleto) {
    const primeiroNome = nomeCompleto.split(' ')[0];
    saudacao.textContent = `Olá, ${primeiroNome}! 👋`;
  }

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
*/
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
    let tarefaEditandoId = null;

    let tarefas = [];
    let filtroAtual = null;

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

        const tarefasFiltradas = tarefas.filter(tarefa => {
            if (filtroAtual === 'ativas') return !tarefa.status; // status false (pendente)
            if (filtroAtual === 'concluidas') return tarefa.status; // status true (concluida)
            return true;
        });

        tarefasFiltradas.forEach((tarefa) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" ${tarefa.status ? 'checked' : ''} onchange="alternarConcluida('${tarefa.id}')">
                <span class="${tarefa.status ? 'tarefa-concluida' : ''}">
                    ${tarefa.titulo}
                </span>
                ${tarefa.descricao ? `<span class="icon-descricao" onclick="mostrarDescricao('${tarefa.id}')">📄</span>` : ''}
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
            const res = await fetch(`http://localhost:3000/listas/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setTimeout(() => {
                    carregarTarefas();
                }, 400);
            } else {
                console.error('Erro ao deletar tarefa:', await res.json());
                alert('Erro ao deletar tarefa. Tente novamente.');
                li.style.animation = '';
            }
        } catch (err) {
            console.error('Erro de conexão ao deletar tarefa:', err);
            alert('Não foi possível conectar ao servidor para deletar a tarefa.');
            li.style.animation = '';
        }
    };

    window.alternarConcluida = async function (id) {
        const tarefa = tarefas.find(t => t.id == id);
        if (!tarefa) return;

        const novoStatus = !tarefa.status; // Alterna entre true e false

        try {
            const res = await fetch(`http://localhost:3000/listas/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: novoStatus }) // Envia true/false
            });
            if (res.ok) {
                carregarTarefas();
            } else {
                console.error('Erro ao alternar status:', await res.json());
                alert('Erro ao atualizar o status da tarefa. Tente novamente.');
            }
        } catch (err) {
            console.error('Erro de conexão ao alternar status:', err);
            alert('Não foi possível conectar ao servidor para atualizar a tarefa.');
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
            modalEditar.style.display = 'block';
        }
    };

    salvarEdicao.onclick = async () => {
        if (tarefaEditandoId !== null) {
            const novoTitulo = editarTitulo.value.trim();
            const novaDescricao = editarDescricao.value.trim();

            if (!novoTitulo) {
                alert('O título da tarefa não pode ser vazio.');
                return;
            }

            try {
                const res = await fetch(`http://localhost:3000/listas/atualizar/${tarefaEditandoId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ titulo: novoTitulo, descricao: novaDescricao })
                });

                if (res.ok) {
                    await carregarTarefas();
                    modalEditar.style.display = 'none';
                    tarefaEditandoId = null;
                } else {
                    console.error('Erro ao salvar edição:', await res.json());
                    alert('Erro ao salvar as alterações da tarefa. Tente novamente.');
                }
            } catch (err) {
                console.error('Erro de conexão ao salvar edição:', err);
                alert('Não foi possível conectar ao servidor para salvar a tarefa.');
            }
        }
    };

    fecharDescricaoBtn.onclick = () => {
        visualizarModal.style.display = 'none';
    };

    fecharEdicao.onclick = () => {
        modalEditar.style.display = 'none';
        tarefaEditandoId = null;
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
            tarefaEditandoId = null;
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
                taskInput.value = '';
                descModalInput.value = '';
                await carregarTarefas();
            } else {
                console.error('Erro ao adicionar tarefa:', await res.json());
                alert('Erro ao adicionar tarefa. Tente novamente.');
            }
        } catch (err) {
            console.error('Erro de conexão ao adicionar tarefa:', err);
            alert('Não foi possível conectar ao servidor para adicionar a tarefa.');
        }
    }

    addTaskBtn.addEventListener('click', () => {
        const titulo = taskInput.value.trim();
        if (!titulo) {
            alert('Por favor, digite um título para a tarefa.');
            return;
        }
        modalDecisao.style.display = 'block';
    });

    btnDecisaoSim.onclick = () => {
        modalDecisao.style.display = 'none';
        modal.style.display = 'block';
    };

    btnDecisaoNao.onclick = () => {
        const titulo = taskInput.value.trim();
        if (!titulo) return;
        adicionarTarefa({ titulo, descricao: '', status: false }); // Status inicial é false (pendente)
        modalDecisao.style.display = 'none';
    };

    confirmarDescBtn.addEventListener('click', () => {
        const titulo = taskInput.value.trim();
        const descricao = descModalInput.value.trim();
        if (!titulo) {
            alert('Por favor, digite um título para a tarefa.');
            return;
        }
        adicionarTarefa({ titulo, descricao, status: false }); // Status inicial é false (pendente)
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

    carregarTarefas();
});