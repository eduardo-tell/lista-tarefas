// Botão reutilizável sem regra de negócio.
// Melhoria em relação ao projeto antigo: este componente NÃO importa criar tarefa.

// Importa o mesclador de classes para o host poder receber class="w-100".
import { mesclarClasses } from './mesclar-classes.js';

// Custom Element que renderiza um <button> nativo por dentro.
// Native button já traz teclado, foco e envio de formulário de graça.
class AppButton extends HTMLElement {
    // Lista de atributos que, ao mudar, pedem novo render.
    static get observedAttributes() {
        return ['label', 'variant', 'type', 'disabled', 'pressed', 'class', 'aria-label'];
    }

    // Construtor só guarda estado interno; ainda não existe DOM.
    constructor() {
        super();
        // Referência ao <button> interno, criada no primeiro render.
        this._button = null;
    }

    // Chamado quando o elemento entra no documento.
    connectedCallback() {
        this._render();
    }

    // Chamado quando um atributo observado muda depois de conectado.
    attributeChangedCallback(nome, antigo, novo) {
        // Evita render inútil na primeira definição (antigo === novo).
        if (antigo === novo || !this.isConnected) {
            return;
        }
        this._render();
    }

    // Getter usado por formulários e por scripts externos.
    get disabled() {
        return this.hasAttribute('disabled');
    }

    // Setter permite appButton.disabled = true sem manipular atributo na mão.
    set disabled(valor) {
        if (valor) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    // Devolve o botão nativo para quem precisa chamar focus() com acessibilidade.
    get nativeControl() {
        return this._button;
    }

    // Monta ou atualiza o botão interno.
    _render() {
        // label visível; cai em "Botão" só para nunca gerar um controle sem nome.
        const label = this.getAttribute('label') || 'Botão';
        // type padrão é button para não enviar formulário sem querer.
        const type = this.getAttribute('type') || 'button';
        // variant escolhe o visual (primary, outline, danger, ghost).
        const variant = this.getAttribute('variant') || 'primary';
        // aria-label extra quando o texto visível não descreve a ação (ícones).
        const ariaLabel = this.getAttribute('aria-label');
        // pressed transforma o botão em interruptor (filtros).
        const pressed = this.getAttribute('pressed');

        // Cria o botão nativo só uma vez para preservar o foco do usuário.
        if (!this._button) {
            this._button = document.createElement('button');
            this.appendChild(this._button);
        }

        // type precisa ser nativo para Enter no input submeter o form.
        this._button.type = type;
        // disabled nativo tira o controle da tabulação e do clique.
        this._button.disabled = this.disabled;
        // className junta visual interno + classes colocadas no host.
        this._button.className = mesclarClasses(this, 'btn', this._classeDaVariante(variant));
        // textContent (não innerHTML) evita XSS se o rótulo vier de dado do usuário.
        this._button.textContent = label;

        // Só define aria-label quando o HTML pediu, para não anunciar duas vezes.
        if (ariaLabel) {
            this._button.setAttribute('aria-label', ariaLabel);
        } else {
            this._button.removeAttribute('aria-label');
        }

        // aria-pressed transforma o botão em toggle acessível.
        if (pressed === 'true' || pressed === 'false') {
            this._button.setAttribute('aria-pressed', pressed);
        } else {
            this._button.removeAttribute('aria-pressed');
        }
    }

    // Mapa de variantes para classes Bootstrap + tokens do projeto.
    _classeDaVariante(variant) {
        const mapa = {
            primary: 'bg-primary text-white border-primary bg-secondary-hover',
            outline: 'border-primary text-primary bg-transparent text-white-hover bg-primary-hover',
            danger: 'border-danger text-danger bg-transparent',
            ghost: 'border-0 text-primary bg-transparent'
        };
        return mapa[variant] || mapa.primary;
    }
}

// Registra a tag <app-button> uma única vez no navegador.
customElements.define('app-button', AppButton);
