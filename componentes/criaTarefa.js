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
    elBotaoDeletar.type = 'button';
    elBotaoDeletar.classList.add('btn', 'btn-outline-danger', 'p-1', 'd-inline-flex', 'align-items-center', 'justify-content-center');
    elBotaoDeletar.setAttribute('aria-label', 'Deletar');
    elBotaoDeletar.innerHTML = `<svg width="16" height="17" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 9.16692C3 8.43122 3.61333 7.83384 4.37067 7.83384H9.10844C10.0489 7.80952 10.8791 7.22734 11.1991 6.367L11.2524 6.21499L11.4569 5.62065C11.5813 5.25584 11.6898 4.93663 11.8427 4.65238C12.4436 3.52907 13.5564 2.74929 14.8418 2.55016C15.1689 2.5 15.5138 2.5 15.9084 2.5H22.0916C22.488 2.5 22.8329 2.5 23.1582 2.55016C24.4436 2.74929 25.5582 3.52907 26.1573 4.65238C26.3102 4.93663 26.4187 5.25432 26.5449 5.62065L26.7476 6.21499L26.8009 6.367C27.1209 7.22734 28.1164 7.81104 29.0587 7.83384H33.6276C34.3867 7.83384 35 8.43122 35 9.16692C35 9.90262 34.3867 10.5 33.6293 10.5H4.36889C3.61333 10.5 3 9.90262 3 9.16692Z" fill="#C56868"/><path fill-rule="evenodd" clip-rule="evenodd" d="M18.1924 36.5H19.8085C25.3747 36.5 28.1568 36.5 29.9688 34.9461C31.7769 33.3921 31.9609 30.8438 32.3309 25.747L32.865 18.4018C33.065 15.6359 33.165 14.2521 32.2589 13.3769C31.3509 12.5 29.8188 12.5 26.7527 12.5H11.2482C8.18204 12.5 6.64799 12.5 5.74195 13.3769C4.83592 14.2539 4.93392 15.6359 5.13593 18.4018L5.66995 25.747C6.03996 30.8438 6.22397 33.3939 8.03404 34.9461C9.8441 36.5 12.6262 36.5 18.1924 36.5ZM15.4923 19.2928C15.4123 18.5316 14.6763 17.9773 13.8523 18.0528C13.0262 18.1282 12.4262 18.8069 12.5082 19.5681L13.5082 28.7987C13.5882 29.5599 14.3243 30.1141 15.1483 30.0387C15.9743 29.9633 16.5744 29.2846 16.4923 28.5234L15.4923 19.2928ZM24.1506 18.0528C24.9747 18.1282 25.5767 18.8069 25.4927 19.5681L24.4926 28.7987C24.4126 29.5599 23.6746 30.1141 22.8526 30.0387C22.0266 29.9633 21.4265 29.2846 21.5085 28.5234L22.5086 19.2928C22.5886 18.5316 23.3286 17.9773 24.1506 18.0528Z" fill="#C56868"/></svg>`;
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
