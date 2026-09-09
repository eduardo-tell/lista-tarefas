import { mesclarClasses } from './encaminhaClasses.js'

class BasicInput extends HTMLElement {
    static get observedAttributes() {
        return ['type', 'placeholder', 'class'];
    }

    constructor() {
        super();
        this._input = null;
    }

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue || !this.isConnected) return;
        this._render();
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

        this._input.type = type;
        this._input.id = id;
        this._input.placeholder = placeholder;
        this._input.setAttribute('aria-describedby', placeholder);
        this._input.className = mesclarClasses(
            this,
            'form-control border border-2 border-primary rounded-2',
            style
        );
    }
}

customElements.define('basic-input', BasicInput);