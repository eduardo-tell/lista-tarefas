// Lista agrupada por data, estado vazio e região viva.
// Único componente que monta <app-task-item>.

import { EVENTOS, ouvir } from '../events.js';
import { rotuloDoGrupo, dataPorExtenso } from '../../infrastructure/date.js';
import { FILTROS } from '../../domain/filtro.js';

const MENSAGENS_VAZIAS = {
    [FILTROS.TODAS]: 'Nenhuma tarefa cadastrada ainda. Use o formulário acima para criar a primeira.',
    [FILTROS.PENDENTES]: 'Não há tarefas pendentes neste filtro.',
    [FILTROS.CONCLUIDAS]: 'Não há tarefas concluídas neste filtro.'
};

class AppTaskList extends HTMLElement {
    connectedCallback() {
        this.setAttribute('aria-live', 'polite');
        this.setAttribute('aria-relevant', 'additions removals');
        this.classList.add('px-3', 'px-md-0');
        ouvir(EVENTOS.ESTADO, (evento) => {
            this._render(evento.detail);
        });
    }

    _render({ grupos, filtro, contadores }) {
        this.innerHTML = '';

        const visiveis = grupos.reduce((total, grupo) => total + grupo.tarefas.length, 0);

        if (visiveis === 0) {
            this._renderVazio(filtro, contadores.todas);
            return;
        }

        grupos.forEach((grupo) => {
            const secao = document.createElement('section');
            secao.className = 'date-group';
            secao.setAttribute('aria-labelledby', `grupo-${grupo.date.replaceAll('/', '-')}`);

            const cabecalho = document.createElement('h2');
            cabecalho.id = `grupo-${grupo.date.replaceAll('/', '-')}`;
            cabecalho.className = 'date-heading h4 text-primary';
            cabecalho.innerHTML = `
                <span aria-hidden="true" class="date-dot"></span>
                <span>${rotuloDoGrupo(grupo.date)}</span>
                <span class="visually-hidden">, ${dataPorExtenso(grupo.date)}, ${grupo.tarefas.length} ${grupo.tarefas.length === 1 ? 'tarefa' : 'tarefas'}</span>
            `;

            const lista = document.createElement('ul');
            lista.className = 'list-unstyled date-group-list mb-0';

            grupo.tarefas.forEach((tarefa) => {
                const li = document.createElement('li');
                const item = document.createElement('app-task-item');
                item.tarefa = tarefa;
                li.appendChild(item);
                lista.appendChild(li);
            });

            secao.appendChild(cabecalho);
            secao.appendChild(lista);
            this.appendChild(secao);
        });
    }

    _renderVazio(filtro, total) {
        const vazio = document.createElement('div');
        vazio.className = 'empty-state rounded-3 p-3 p-md-4 text-center';
        vazio.setAttribute('role', 'status');

        const titulo = document.createElement('p');
        titulo.className = 'h5 mb-2';
        titulo.textContent = total === 0 ? 'Sua lista está vazia' : 'Nada para mostrar';

        const texto = document.createElement('p');
        texto.className = 'mb-0';
        texto.textContent = MENSAGENS_VAZIAS[filtro] || MENSAGENS_VAZIAS[FILTROS.TODAS];

        vazio.appendChild(titulo);
        vazio.appendChild(texto);
        this.appendChild(vazio);
    }
}

customElements.define('app-task-list', AppTaskList);
