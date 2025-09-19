import { handleNovoItem } from './criaTarefa.js'

class BasicButton extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || 'Título padrão';
        const action = this.getAttribute('action') || 'Descrição padrão';
        
        this.innerHTML = `
            <button
              class="btn bg-tertiary bg-primary-hover text-default-hover btn-lg w-100"
              type="button"
              data-action="${action}"
            >
              ${title}
            </button>
        `;

        if (action == 'nova-tarefa') {
            this.querySelector(`[data-action=nova-tarefa]`).addEventListener('click', handleNovoItem)            
        }
    }
}

customElements.define('basic-button', BasicButton);