// Filtros da lista. Cada botão é um toggle acessível com aria-pressed.

import { EVENTOS, emitir, ouvir } from '../events.js';
import { FILTROS_NA_TELA } from '../../domain/filtro.js';

class AppTaskFilters extends HTMLElement {
    constructor() {
        super();
        this._botoes = [];
    }

    connectedCallback() {
        this._montar();
        ouvir(EVENTOS.ESTADO, (evento) => {
            this._sincronizar(evento.detail.filtro);
        });
    }

    _montar() {
        const grupo = document.createElement('div');
        grupo.className = 'filter-bar d-flex flex-wrap gap-1 gap-md-2 px-3 px-md-0';
        grupo.setAttribute('role', 'group');
        grupo.setAttribute('aria-label', 'Filtrar tarefas por status');

        FILTROS_NA_TELA.forEach((filtro) => {
            const botao = document.createElement('app-button');
            botao.setAttribute('label', filtro.rotulo);
            botao.setAttribute('variant', 'outline');
            botao.dataset.filtro = filtro.id;
            botao.addEventListener('click', () => {
                emitir(EVENTOS.FILTRAR, { filtro: filtro.id });
            });
            grupo.appendChild(botao);
            this._botoes.push(botao);
        });

        this.appendChild(grupo);
    }

    _sincronizar(filtroAtual) {
        this._botoes.forEach((botao) => {
            const ativo = botao.dataset.filtro === filtroAtual;
            botao.setAttribute('pressed', ativo ? 'true' : 'false');
            botao.setAttribute('variant', ativo ? 'primary' : 'outline');
        });
    }
}

customElements.define('app-task-filters', AppTaskFilters);
