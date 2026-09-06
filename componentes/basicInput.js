class BasicInput extends HTMLElement {
    connectedCallback() {
        const style = this.getAttribute('style') || 'input';
        const type = this.getAttribute('type') || 'text';
        const id = this.getAttribute('id') || 'input';
        const placeholder = this.getAttribute('placeholder') || 'Descrição padrão';
        
        this.innerHTML = `
           <input
                type="${type}"
                class="form-control form-control border border-2 border-primary rounded-2 ${style}"
                aria-describedby="${placeholder}"
                placeholder="${placeholder}"
                id="${id}"
            /> 
        `;
    }
}

customElements.define('basic-input', BasicInput);