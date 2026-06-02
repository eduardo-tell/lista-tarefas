import { ordenaDatas, removeDatasRepetidas } from "../service/data.js"
import { criaData } from "./criaData.js"
import { contadorTarefa } from "./contadorTarefa.js"
import { filtraTarefa } from "./filtraTarefa.js"

export const carregaTarefa = () => { 
    const lista = document.querySelector('[data-list]');

    const tarefasCadastradas = JSON.parse(localStorage.getItem('tarefas'))||[];
    lista.innerHTML = " ";
    const dataUnicas = removeDatasRepetidas(tarefasCadastradas);

    ordenaDatas(dataUnicas);

    dataUnicas.forEach((dia) => {
        lista.appendChild(criaData(dia));
    });

    contadorTarefa();
    filtraTarefa();
};