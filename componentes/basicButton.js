import { handleNovoItem } from './criaTarefa.js'

class BasicButton extends HTMLElement {
    static get observedAttributes() {
        return ['title', 'action', 'disabled', 'variant', 'styleClass'];
    }

    constructor() {
        super();
        this._button = null;
        this._boundClickHandler = this._handleClick.bind(this);
    }

    connectedCallback() {
        this._render();
        this._button.addEventListener('click', this._boundClickHandler);
    }

    disconnectedCallback() {
        this._button?.removeEventListener('click', this._boundClickHandler);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this._render();
    }

    _getTitle() {
        return this.getAttribute('title') || 'Botão';
    }

    _getAction() {
        return this.getAttribute('action') || '';
    }

    _isDisabled() {
        return this.hasAttribute('disabled');
    }

    _getVariantClass() {
        const variant = this.getAttribute('variant') || 'primary';
        const classMap = {
            primary: 'bg-tertiary bg-primary-hover text-default-hover',
            secondary: 'bg-secundary bg-default-hover text-default',
            danger: 'bg-danger text-white',
            outline: 'bg-transparent border border-secondary text-secondary'
        };
        return classMap[variant] || classMap.primary;
    }

    _render() {
        const title = this._getTitle();
        const isDisabled = this._isDisabled();
        const variantClass = this._getVariantClass();

        // Cria o botão uma única vez e depois só atualiza propriedades
        // Isso evita recriação desnecessária do DOM e mantém o event listener intacto
        if (!this._button) {
            const button = document.createElement('button');
            button.type = 'button';
            this.appendChild(button);
            this._button = button;
        }

        const hostClasses = this.className; 

        this._button.className = `btn w-100 ${variantClass}`;
        this._button.textContent = title;
        this._button.disabled = isDisabled;
    }

    _handleClick(event) {
        const action = this._getAction();

        if (action === 'nova-tarefa') {
            handleNovoItem(event);
        }

        // Dispara um evento customizado para permitir escuta externa
        this.dispatchEvent(new CustomEvent('button-action', {
            detail: { action },
            bubbles: true,
            composed: true
        }));
    }

    // Permite habilitar/desabilitar o botão programaticamente
    set disabled(value) {
        if (value) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }
}

customElements.define('basic-button', BasicButton);