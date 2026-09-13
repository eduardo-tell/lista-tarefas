import { garantirIds, ordenaDatas, removeDatasRepetidas } from "../service/data.js"
import { criaData } from "./criaData.js"
import { contadorTarefa } from "./contadorTarefa.js"
import { Tarefa } from "./criaTarefa.js"

const obterTarefas = () => garantirIds(JSON.parse(localStorage.getItem('tarefas')) || []);

const elementosAnimaveis = (lista) => [...lista.querySelectorAll('[data-task-id], [data-date] > h3')];

export const carregaTarefa = () => { 
    const lista = document.querySelector('[data-list]');
    const tarefasCadastradas = obterTarefas();

    lista.innerHTML = " ";
    const dataUnicas = removeDatasRepetidas(tarefasCadastradas);

    ordenaDatas(dataUnicas);

    dataUnicas.forEach((dia) => {
        lista.appendChild(criaData(dia));
    });

    contadorTarefa();
};

export const inserirTarefaNaLista = (tarefa) => {
    const lista = document.querySelector('[data-list]');
    const form = document.getElementById('taskForm');
    const posicoesAntes = new Map(
        elementosAnimaveis(lista).map((el) => [el, el.getBoundingClientRect().top])
    );

    let secao = lista.querySelector(`[data-date="${tarefa.date}"]`);

    if (!secao) {
        secao = criaData(tarefa.date);
        inserirSecaoOrdenada(lista, secao, tarefa.date);
    } else {
        const tituloSecao = secao.querySelector('h3');
        secao.insertBefore(Tarefa(tarefa), tituloSecao.nextSibling);
    }

    const novaTarefa = secao.querySelector(`[data-task-id="${tarefa.id}"]`);
    animarInsercao(lista, form, novaTarefa, posicoesAntes);
    contadorTarefa();
};

const inserirSecaoOrdenada = (lista, secao, date) => {
    const novaData = moment(date, 'DD/MM/YYYY');
    const secoes = [...lista.querySelectorAll('[data-date]')];
    const posterior = secoes.find((item) => (
        moment(item.dataset.date, 'DD/MM/YYYY').diff(novaData) > 0
    ));

    if (posterior) {
        lista.insertBefore(secao, posterior);
        return;
    }

    lista.appendChild(secao);
};

const animarInsercao = (lista, form, novaTarefa, posicoesAntes) => {
    const duracao = 480;
    const easing = 'cubic-bezier(0.22, 1, 0.36, 1)';

    elementosAnimaveis(lista).forEach((el) => {
        if (el === novaTarefa) return;

        const topoAnterior = posicoesAntes.get(el);
        if (topoAnterior == null) return;

        const delta = topoAnterior - el.getBoundingClientRect().top;
        if (Math.abs(delta) < 1) return;

        el.animate(
            [
                { transform: `translateY(${delta}px)` },
                { transform: 'translateY(0)' }
            ],
            { duration: duracao, easing }
        );
    });

    if (!novaTarefa) return;

    const destino = novaTarefa.getBoundingClientRect();
    const origem = form ? form.getBoundingClientRect().bottom : destino.top - 40;
    const deltaY = origem - destino.top;

    novaTarefa.style.zIndex = '2';
    novaTarefa.animate(
        [
            { transform: `translateY(${deltaY}px)`, opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 }
        ],
        { duration: duracao, easing, fill: 'backwards' }
    ).finished.then(() => {
        novaTarefa.style.zIndex = '';
    }).catch(() => {
        novaTarefa.style.zIndex = '';
    });
};
