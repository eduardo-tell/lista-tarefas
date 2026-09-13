import { carregaTarefa, inserirTarefaNaLista } from './carregaTarefa.js';
import { concluirTarefa } from './concluiTarefa.js';
import { deletarTarefa } from './deletaTarefa.js';

export const handleNovoItem = (evento) => {
    evento.preventDefault();

    const campoTitulo = document.querySelector('#title-task');
    const titulo = campoTitulo.value.trim();

    if (!titulo) {
        campoTitulo.setInvalid('Este campo é obrigatório');
        return;
    }

    campoTitulo.clearInvalid();

    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const calendario = document.querySelector('#dateTask input');
    const date = calendario.value
        ? moment(calendario.value, 'YYYY-MM-DD').format('DD/MM/YYYY')
        : moment().format('DD/MM/YYYY');

    const dados = {
        id: crypto.randomUUID(),
        titulo,
        date,
        concluida: false
    };

    localStorage.setItem('tarefas', JSON.stringify([dados, ...tarefas]));
    campoTitulo.value = '';
    calendario.value = '';

    inserirTarefaNaLista(dados);
}

export const Tarefa = (tarefa) => {
    const { titulo, date, concluida, id } = tarefa;
    const elTarefa = document.createElement('li');
    elTarefa.dataset.taskId = id;

    if (concluida) {
        elTarefa.classList.add('active');
    }

    const conteudoWrapper = document.createElement('div');
    conteudoWrapper.classList.add('border-bottom', 'mb-sm-3', 'py-sm-4', 'mb-3', 'pb-3');
    conteudoWrapper.classList.add(`card-effect`, `card--${concluida ? 'completed' : 'pending'}`);

    const cardCorpo = document.createElement('div');
    cardCorpo.classList.add('card-body');
    const row = document.createElement('div');
    row.classList.add('row', 'align-items-center');

    const colInfo = document.createElement('div');
    colInfo.classList.add('col');

    const elTitulo = document.createElement('h5');
    elTitulo.classList.add('card-title', 'mb-1');
    elTitulo.textContent = titulo;

    const elDate = document.createElement('p');
    elDate.classList.add('card-text', 'text-muted', 'mb-0');
    elDate.textContent = `${date}`;

    colInfo.appendChild(elTitulo);
    colInfo.appendChild(elDate);

    const colAcoes = document.createElement('div');
    colAcoes.classList.add('d-flex', 'col-auto', 'gap-2');

    const elBotaoConcluir = document.createElement('button');

    if (concluida) {
        elBotaoConcluir.textContent = 'Concluído';
        elBotaoConcluir.classList.add('text-white', 'bg-primary');
    } else {
        elBotaoConcluir.classList.add('text-primary', 'text-white-hover', 'bg-primary-hover');
        elBotaoConcluir.textContent = 'Concluir';
    }

    elBotaoConcluir.classList.add('btn', 'border-primary');
    elBotaoConcluir.addEventListener('click', () => concluirTarefa(carregaTarefa, id));

    const elBotaoDeletar = document.createElement('button');
    elBotaoDeletar.classList.add('btn', 'btn-outline-danger');
    elBotaoDeletar.textContent = 'Deletar';
    elBotaoDeletar.addEventListener('click', () => deletarTarefa(id));

    colAcoes.appendChild(elBotaoConcluir);
    colAcoes.appendChild(elBotaoDeletar);

    row.appendChild(colInfo);
    row.appendChild(colAcoes);

    cardCorpo.appendChild(row);
    conteudoWrapper.appendChild(cardCorpo);
    elTarefa.appendChild(conteudoWrapper);

    return elTarefa;
}
