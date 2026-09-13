import { mesclarClasses } from './encaminhaClasses.js'

class BasicInput extends HTMLElement {
    static get observedAttributes() {
        return ['type', 'placeholder', 'class'];
    }

    constructor() {
        super();
        this._input = null;
        this._feedback = null;
        this._invalid = false;
        this._errorMessage = 'Este campo é obrigatório';
        this._boundInputHandler = this._handleInput.bind(this);
    }

    connectedCallback() {
        this._render();
        this._input.addEventListener('input', this._boundInputHandler);
    }

    disconnectedCallback() {
        this._input?.removeEventListener('input', this._boundInputHandler);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue || !this.isConnected) return;
        this._render();
    }

    get value() {
        return this._input?.value ?? '';
    }

    set value(valor) {
        if (this._input) this._input.value = valor;
    }

    setInvalid(message = 'Este campo é obrigatório') {
        this._invalid = true;
        this._errorMessage = message;
        this.classList.add('is-invalid');
        this._render();
        this._shake();
        this._input?.focus();
    }

    clearInvalid() {
        if (!this._invalid && !this.classList.contains('is-invalid')) return;
        this._invalid = false;
        this.classList.remove('is-invalid');
        this._render();
    }

    _handleInput() {
        if (this._invalid) this.clearInvalid();
    }

    _shake() {
        this.classList.remove('input-shake');
        void this.offsetWidth;
        this.classList.add('input-shake');
        this.addEventListener('animationend', () => {
            this.classList.remove('input-shake');
        }, { once: true });
    }

    _render() {
        const type = this.getAttribute('type') || 'text';
        const id = this.getAttribute('id') || 'input';
        const placeholder = this.getAttribute('placeholder') || 'Descrição padrão';
        const style = this.getAttribute('style') || 'input';

        if (!this._input) {
            this._input = document.createElement('input');
            this.appendChild(this._input);
        }

        if (!this._feedback) {
            this._feedback = document.createElement('div');
            this._feedback.className = 'campo-erro';
            this._feedback.id = `${id}-erro`;
            this._feedback.setAttribute('role', 'alert');
            this.appendChild(this._feedback);
        }

        this._input.type = type;
        this._input.id = id;
        this._input.placeholder = placeholder;
        this._input.setAttribute('aria-invalid', this._invalid ? 'true' : 'false');
        this._input.setAttribute(
            'aria-describedby',
            this._invalid ? this._feedback.id : placeholder
        );

        const estadoBorda = this._invalid ? 'border-danger' : 'border-primary';
        this._input.className = mesclarClasses(
            this,
            'form-control border border-2 rounded-2',
            estadoBorda,
            style
        );

        this._feedback.textContent = this._errorMessage;
        this._feedback.hidden = !this._invalid;
    }
}

customElements.define('basic-input', BasicInput);
