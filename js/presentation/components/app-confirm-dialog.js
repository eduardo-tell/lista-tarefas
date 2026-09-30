// Diálogo de confirmação acessível usando <dialog> nativo.
// O elemento nativo já faz foco inicial, trap de Tab e fecha com Escape.

import { EVENTOS, emitir, ouvir } from '../events.js';

class AppConfirmDialog extends HTMLElement {
    constructor() {
        super();
        this._dialog = null;
        this._titulo = null;
        this._idPendente = null;
        this._elementoAnterior = null;
        this._aoConfirmar = this._confirmar.bind(this);
        this._aoCancelar = this._cancelar.bind(this);
        this._aoFechar = this._restaurarFoco.bind(this);
    }

    connectedCallback() {
        this._montar();
        ouvir(EVENTOS.PEDIR_EXCLUSAO, (evento) => {
            this._abrir(evento.detail);
        });
    }

    _montar() {
        // <dialog> nativo: acessibilidade de modal sem biblioteca.
        this._dialog = document.createElement('dialog');
        this._dialog.className = 'confirm-dialog border-0 rounded-4 p-4';
        this._dialog.setAttribute('aria-labelledby', 'titulo-dialogo-exclusao');
        this._dialog.setAttribute('aria-describedby', 'texto-dialogo-exclusao');

        const titulo = document.createElement('h2');
        titulo.id = 'titulo-dialogo-exclusao';
        titulo.className = 'h4 text-body mb-3';
        titulo.textContent = 'Excluir tarefa';
        this._dialog.appendChild(titulo);

        const texto = document.createElement('p');
        texto.id = 'texto-dialogo-exclusao';
        texto.className = 'mb-4';
        this._titulo = texto;
        this._dialog.appendChild(texto);

        const acoes = document.createElement('div');
        acoes.className = 'd-flex gap-2 justify-content-end';

        const cancelar = document.createElement('button');
        cancelar.type = 'button';
        cancelar.className = 'btn border-primary text-primary';
        cancelar.textContent = 'Cancelar';
        cancelar.addEventListener('click', this._aoCancelar);

        const confirmar = document.createElement('button');
        confirmar.type = 'button';
        confirmar.className = 'btn bg-danger text-white';
        confirmar.textContent = 'Excluir';
        confirmar.addEventListener('click', this._aoConfirmar);

        acoes.appendChild(cancelar);
        acoes.appendChild(confirmar);
        this._dialog.appendChild(acoes);

        // close dispara tanto no botão Cancelar quanto no Escape nativo.
        this._dialog.addEventListener('close', this._aoFechar);
        this.appendChild(this._dialog);
    }

    _abrir({ id, titulo }) {
        this._idPendente = id;
        // Guarda quem tinha foco para devolver depois, requisito WCAG 2.4.3.
        this._elementoAnterior = document.activeElement;
        this._titulo.textContent = `A tarefa "${titulo}" será removida. Essa ação não pode ser desfeita.`;
        this._dialog.showModal();
    }

    _confirmar() {
        const id = this._idPendente;
        this._dialog.close();
        if (id) {
            emitir(EVENTOS.CONFIRMAR_EXCLUSAO, { id });
        }
    }

    _cancelar() {
        this._dialog.close();
    }

    _restaurarFoco() {
        this._idPendente = null;
        const anterior = this._elementoAnterior;
        this._elementoAnterior = null;

        // Se o item foi excluído, o botão que abriu o diálogo não existe mais.
        // Nesse caso o foco vai para o main, que tem tabindex="-1".
        if (anterior && document.contains(anterior)) {
            anterior.focus();
            return;
        }

        document.getElementById('conteudo')?.focus();
    }
}

customElements.define('app-confirm-dialog', AppConfirmDialog);
