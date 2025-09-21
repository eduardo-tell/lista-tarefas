import { carregaTarefa } from './carregaTarefa.js'
import concluirTarefa from './concluiTarefa.js'
import deletarTarefa from './deletaTarefa.js'

export const handleNovoItem = (evento) => {
    evento.preventDefault()
    const tarefas = JSON.parse(localStorage.getItem('tarefas'))||[]
    const input = document.querySelector('.title-task input')
    const titulo = input.value

    const calendario = document.querySelector('.date-task input')
    const data = moment(calendario.value)

    const dataFormatada = data.format('DD/MM/YYYY')

    const concluida = false;

    const dados = { 
        titulo,
        dataFormatada,
        concluida
    }

    const tarefasAtualizadas = [...tarefas, dados];

    localStorage.setItem('tarefas', JSON.stringify(tarefasAtualizadas));
    input.value = " ";

    carregaTarefa();
}

export const Tarefa = ({ titulo, dataFormatada, concluida }, id) => {
    const tarefa = document.createElement('li');
    tarefa.classList.add('list-group-item');

    if (concluida) {
        tarefa.classList.add('active');
    }

    const conteudoWrapper = document.createElement('div');
    conteudoWrapper.classList.add('card', 'shadow-sm', 'mb-3');

    const cardCorpo = document.createElement('div');
    cardCorpo.classList.add('card-body');

    const row = document.createElement('div');
    row.classList.add('row', 'align-items-center');

    const colInfo = document.createElement('div');
    colInfo.classList.add('col');

    const elTitulo = document.createElement('h5');
    elTitulo.classList.add('card-title', 'mb-1');
    elTitulo.textContent = titulo;

    const elDataFormatada = document.createElement('p');
    elDataFormatada.classList.add('card-text', 'text-muted', 'mb-0');
    elDataFormatada.textContent = `Para: ${dataFormatada}`;

    if (!concluida) {
        const badge = document.createElement('span')
        badge.classList.add('badge', 'bg-danger', 'ms-2');
        badge.textContent = 'Pendente';
        elDataFormatada.appendChild(badge);
    }

    colInfo.appendChild(elTitulo);
    colInfo.appendChild(elDataFormatada);

    const colAcoes = document.createElement('div');
    colAcoes.classList.add('col-auto');

    const elBotaoConcluir = document.createElement('button');
    elBotaoConcluir.classList.add('btn', 'btn-sm', 'btn-outline-success', 'me-2');
    elBotaoConcluir.textContent = 'Concluir';
    elBotaoConcluir.addEventListener('click', () => concluirTarefa(carregaTarefa, id));

    const elBotaoDeletar = document.createElement('button');
    elBotaoDeletar.classList.add('btn', 'btn-sm', 'btn-outline-danger');
    elBotaoDeletar.textContent = 'Deletar';
    elBotaoDeletar.addEventListener('click', () => deletarTarefa(carregaTarefa, id));

    colAcoes.appendChild(elBotaoConcluir);
    colAcoes.appendChild(elBotaoDeletar);

    row.appendChild(colInfo);
    row.appendChild(colAcoes);

    cardCorpo.appendChild(row);
    conteudoWrapper.appendChild(cardCorpo);
    tarefa.appendChild(conteudoWrapper);

    return tarefa
}
