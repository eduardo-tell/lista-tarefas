import { Tarefa } from './criaTarefa.js'

export const criaData = (data) => {
    const tarefas = JSON.parse(localStorage.getItem('tarefas'))||[];
    const dataMoment = moment(data, 'DD/MM/YYYY');
    const secaoPorData = document.createElement('ul');
    secaoPorData.classList.add('list-unstyled');
    const conteudo = `<h3 class="content-data">${dataMoment.format('DD/MM/YYYY')}</h3>`;

    secaoPorData.innerHTML = conteudo;

    tarefas.forEach(((tarefa, id) => { 
        const dia = moment(tarefa.dataFormatada, 'DD/MM/YYYY');
        const diff = dataMoment.diff(dia);

        if (diff === 0) {
            secaoPorData.appendChild(Tarefa(tarefa, id));
        }
    }));

    return secaoPorData;
}