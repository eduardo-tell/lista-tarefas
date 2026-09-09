import { Tarefa } from './criaTarefa.js'

export const criaData = (date) => {
    const tarefas = JSON.parse(localStorage.getItem('tarefas'))||[];
    console.log(date);
    
    const dataMoment = moment(date, 'DD/MM/YYYY');
    const secaoPorData = document.createElement('ul');
    secaoPorData.classList.add('list-unstyled');
    const conteudo = `<h3 class="card-title text-primary fs-4 mb-3">${dataMoment.format('DD/MM/YYYY') == moment().format('DD/MM/YYYY') ? 'Hoje' : dataMoment.format('DD/MM/YYYY')}</h3>`;

    secaoPorData.innerHTML = conteudo;

    tarefas.forEach(((tarefa, id) => { 
        const dia = moment(tarefa.date, 'DD/MM/YYYY');
        const diff = dataMoment.diff(dia);

        if (diff === 0) {
            secaoPorData.appendChild(Tarefa(tarefa, id));
        }
    }));

    return secaoPorData;
}