// Cabeçalho com título e contadores.
// Escuta o estado global; não lê localStorage (DIP).

import { EVENTOS, ouvir } from '../events.js';

class AppHeader extends HTMLElement {
    constructor() {
        super();
        this._todas = null;
        this._concluidas = null;
        this._pendentes = null;
    }

    connectedCallback() {
        this._montar();
        ouvir(EVENTOS.ESTADO, (evento) => {
            this._atualizar(evento.detail.contadores);
        });
    }

    _montar() {
        this.innerHTML = `
            <div class="hero-card rounded-0 rounded-md-4 p-2 p-md-5">
                <p class="hero-kicker mb-2 d-none d-md-block">Organização do dia</p>
                <h1 class="hero-title text-white mb-3 mb-md-4">Lista de tarefas</h1>
                <ul class="stats-grid list-unstyled mb-0" aria-label="Resumo das tarefas">
                    <li>
                        <div class="stat-chip" id="chip-todas">
                            <span class="stat-number" data-stat="todas">0</span>
                            <span class="stat-label">Todas</span>
                        </div>
                    </li>
                    <li>
                        <div class="stat-chip" id="chip-concluidas">
                            <span class="stat-number" data-stat="concluidas">0</span>
                            <span class="stat-label">Concluídas</span>
                        </div>
                    </li>
                    <li>
                        <div class="stat-chip" id="chip-pendentes">
                            <span class="stat-number" data-stat="pendentes">0</span>
                            <span class="stat-label">Pendentes</span>
                        </div>
                    </li>
                </ul>
            </div>
        `;

        this._todas = this.querySelector('[data-stat="todas"]');
        this._concluidas = this.querySelector('[data-stat="concluidas"]');
        this._pendentes = this.querySelector('[data-stat="pendentes"]');
    }

    _atualizar(contadores) {
        this._todas.textContent = String(contadores.todas);
        this._concluidas.textContent = String(contadores.concluidas);
        this._pendentes.textContent = String(contadores.pendentes);

        // Nomes no singular/plural para o leitor de tela não falar "1 tarefas".
        this._todas.parentElement.setAttribute(
            'aria-label',
            `${contadores.todas} ${contadores.todas === 1 ? 'tarefa' : 'tarefas'} no total`
        );
        this._concluidas.parentElement.setAttribute(
            'aria-label',
            `${contadores.concluidas} ${contadores.concluidas === 1 ? 'concluída' : 'concluídas'}`
        );
        this._pendentes.parentElement.setAttribute(
            'aria-label',
            `${contadores.pendentes} ${contadores.pendentes === 1 ? 'pendente' : 'pendentes'}`
        );
    }
}

customElements.define('app-header', AppHeader);
