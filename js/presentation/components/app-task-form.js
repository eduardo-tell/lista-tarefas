// Formulário de nova tarefa.
// Só coleta, valida na borda da UI e emite um evento. Não grava no storage.

import { EVENTOS, emitir } from '../events.js';
import { TITULO_MAXIMO } from '../../domain/tarefa.js';

class AppTaskForm extends HTMLElement {
    constructor() {
        super();
        this._form = null;
        this._titulo = null;
        this._data = null;
        this._aoEnviar = this._enviar.bind(this);
    }

    connectedCallback() {
        this._montar();
        this._form.addEventListener('submit', this._aoEnviar);
    }

    disconnectedCallback() {
        this._form?.removeEventListener('submit', this._aoEnviar);
    }

    _montar() {
        this.innerHTML = `
            <section class="panel-card rounded-0 rounded-md-4 p-2 p-md-4" aria-labelledby="titulo-formulario">
                <h2 id="titulo-formulario" class="h5 mb-2 mb-md-3">Nova tarefa</h2>
                <form id="form-nova-tarefa" class="task-form-grid" novalidate>
                    <label class="form-label fw-semibold task-form-grid__label-title" for="campo-titulo">Título</label>
                    <app-input
                        class="task-form-grid__input-title"
                        type="text"
                        input-id="campo-titulo"
                        placeholder="Ex.: Revisar o relatório"
                        describedby="ajuda-titulo"
                        required
                    ></app-input>
                    <p id="ajuda-titulo" class="form-text small mb-0 d-none d-md-block task-form-grid__help-title">
                        Obrigatório. Até ${TITULO_MAXIMO} caracteres.
                    </p>

                    <label class="form-label fw-semibold task-form-grid__label-date" for="campo-data">Data</label>
                    <app-input
                        class="task-form-grid__input-date"
                        type="date"
                        input-id="campo-data"
                        describedby="ajuda-data"
                    ></app-input>
                    <p id="ajuda-data" class="form-text small mb-0 d-none d-md-block task-form-grid__help-date">
                        Opcional. Vazio usa a data de hoje.
                    </p>

                    <app-button
                        class="w-100 task-form-grid__action"
                        label="Adicionar"
                        type="submit"
                        variant="primary"
                    ></app-button>
                </form>
            </section>
        `;

        this._form = this.querySelector('#form-nova-tarefa');
        this._titulo = this.querySelector('[input-id="campo-titulo"]');
        this._data = this.querySelector('[input-id="campo-data"]');
    }

    _enviar(evento) {
        // Impede o reload clássico do <form>.
        evento.preventDefault();

        const titulo = this._titulo.value.trim();

        if (!titulo) {
            this._titulo.setInvalid('Informe um título para a tarefa.');
            return;
        }

        if (titulo.length > TITULO_MAXIMO) {
            this._titulo.setInvalid(`Use no máximo ${TITULO_MAXIMO} caracteres.`);
            return;
        }

        this._titulo.clearInvalid();

        emitir(EVENTOS.CRIAR, {
            titulo,
            date: this._data.value
        });

        this._titulo.value = '';
        this._data.value = '';
        // Devolve o foco ao título para cadastrar a próxima sem o mouse.
        this._titulo.nativeControl?.focus();
    }
}

customElements.define('app-task-form', AppTaskForm);
