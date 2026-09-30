// Campo de formulário acessível.
// O host <app-input> NÃO recebe o id do label: o input interno recebe,
// para o <label for="..."> nativo funcionar de verdade.

import { mesclarClasses } from './mesclar-classes.js';
import { TITULO_MAXIMO } from '../../domain/tarefa.js';

class AppInput extends HTMLElement {
    static get observedAttributes() {
        return ['type', 'placeholder', 'input-id', 'required', 'class', 'describedby'];
    }

    constructor() {
        super();
        this._input = null;
        this._feedback = null;
        this._invalido = false;
        this._mensagem = '';
        this._aoDigitar = this._limparErroAoDigitar.bind(this);
    }

    connectedCallback() {
        this._render();
        this._input.addEventListener('input', this._aoDigitar);
    }

    disconnectedCallback() {
        this._input?.removeEventListener('input', this._aoDigitar);
    }

    attributeChangedCallback(nome, antigo, novo) {
        if (antigo === novo || !this.isConnected) {
            return;
        }
        this._render();
    }

    // Expõe o valor para o formulário ler sem conhecer o DOM interno.
    get value() {
        return this._input?.value ?? '';
    }

    // Permite limpar o campo depois de salvar.
    set value(valor) {
        if (this._input) {
            this._input.value = valor;
        }
    }

    // Devolve o input nativo para o formulário devolver o foco.
    get nativeControl() {
        return this._input;
    }

    // Marca o campo como inválido, anuncia o erro e devolve o foco.
    setInvalid(mensagem) {
        this._invalido = true;
        this._mensagem = mensagem;
        this.classList.add('is-invalid');
        this._render();
        this._tremer();
        this._input?.focus();
    }

    // Remove o estado de erro quando o usuário corrige.
    clearInvalid() {
        if (!this._invalido) {
            return;
        }
        this._invalido = false;
        this._mensagem = '';
        this.classList.remove('is-invalid');
        this._render();
    }

    _limparErroAoDigitar() {
        if (this._invalido) {
            this.clearInvalid();
        }
    }

    // Animação de shake só se o usuário não pediu movimento reduzido.
    _tremer() {
        const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduzMovimento) {
            return;
        }
        this.classList.remove('input-shake');
        // Lê offsetWidth para forçar o browser a reiniciar a animação.
        void this.offsetWidth;
        this.classList.add('input-shake');
        this.addEventListener('animationend', () => {
            this.classList.remove('input-shake');
        }, { once: true });
    }

    _render() {
        const type = this.getAttribute('type') || 'text';
        const inputId = this.getAttribute('input-id') || 'campo';
        const placeholder = this.getAttribute('placeholder') || '';
        const describedby = this.getAttribute('describedby') || '';
        const obrigatorio = this.hasAttribute('required');

        if (!this._input) {
            this._input = document.createElement('input');
            this.appendChild(this._input);
        }

        if (!this._feedback) {
            this._feedback = document.createElement('p');
            this._feedback.className = 'campo-erro';
            this._feedback.id = `${inputId}-erro`;
            this._feedback.setAttribute('role', 'alert');
            this.appendChild(this._feedback);
        }

        this._input.type = type;
        this._input.id = inputId;
        this._input.placeholder = placeholder;
        this._input.required = obrigatorio;
        this._input.autocomplete = type === 'text' ? 'off' : 'off';
        this._input.setAttribute('aria-invalid', this._invalido ? 'true' : 'false');
        this._input.setAttribute('aria-required', obrigatorio ? 'true' : 'false');

        // Junta ajuda visível + mensagem de erro para o leitor de tela.
        const descritos = [
            describedby,
            this._invalido ? this._feedback.id : ''
        ].filter(Boolean).join(' ');

        if (descritos) {
            this._input.setAttribute('aria-describedby', descritos);
        } else {
            this._input.removeAttribute('aria-describedby');
        }

        // Limite só no título: data não tem maxlength útil.
        if (type === 'text') {
            this._input.maxLength = TITULO_MAXIMO;
        }

        const borda = this._invalido ? 'border-danger' : 'border-primary';
        this._input.className = mesclarClasses(
            this,
            'form-control border border-2 rounded-3',
            borda
        );

        this._feedback.textContent = this._mensagem;
        this._feedback.hidden = !this._invalido;
    }
}

customElements.define('app-input', AppInput);
