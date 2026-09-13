import { garantirIds } from '../service/data.js'
import { Tarefa } from './criaTarefa.js'

export const criaData = (date) => {
    const tarefas = garantirIds(JSON.parse(localStorage.getItem('tarefas')) || []);
    const dataMoment = moment(date, 'DD/MM/YYYY');
    const secaoPorData = document.createElement('ul');
    secaoPorData.classList.add('list-unstyled');
    secaoPorData.dataset.date = date;

    const titulo = document.createElement('h3');
    titulo.className = 'card-title text-primary fs-4 mb-3';
    titulo.textContent = dataMoment.format('DD/MM/YYYY') === moment().format('DD/MM/YYYY')
        ? 'Hoje'
        : dataMoment.format('DD/MM/YYYY');
    secaoPorData.appendChild(titulo);

    tarefas.forEach((tarefa) => {
        const dia = moment(tarefa.date, 'DD/MM/YYYY');

        if (dataMoment.diff(dia) === 0) {
            secaoPorData.appendChild(Tarefa(tarefa));
        }
    });

    return secaoPorData;
}
