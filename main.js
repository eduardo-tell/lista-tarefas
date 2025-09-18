import {handleNovoItem} from './componentes/criaTarefa.js'
import {carregaTarefa} from './componentes/carregaTarefa.js'

class BasicButton extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || 'Título padrão';
        const action = this.getAttribute('action') || 'Descrição padrão';
        
        this.innerHTML = `
            <button
              class="btn btn-primary btn-lg w-100"
              type="button"
              data-action="${action}"
            >
              ${title}
            </button>
        `;

        this.querySelector(`[data-action=${action}]`).addEventListener('click', handleNovoItem)
    }
}

class BasicInput extends HTMLElement {
    connectedCallback() {
        const id = this.getAttribute('id') || 'input';
        const type = this.getAttribute('type') || 'text';
        const placeholder = this.getAttribute('placeholder') || 'Descrição padrão';
        
        this.innerHTML = `
           <input
                id="${id}"
                type="${type}"
                class="form-control form-control-lg"
                placeholder="${placeholder}"
            /> 
        `;
    }
}

customElements.define('basic-input', BasicInput);
customElements.define('basic-button', BasicButton);
carregaTarefa()
