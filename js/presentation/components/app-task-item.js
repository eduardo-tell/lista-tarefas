// Item individual da lista. Recebe a tarefa por propriedade, não por atributo,
// porque o título pode ter aspas e caracteres que quebrariam HTML.

import { EVENTOS, emitir } from '../events.js';
import { dataPorExtenso } from '../../infrastructure/date.js';

class AppTaskItem extends HTMLElement {
    constructor() {
        super();
        this._tarefa = null;
    }

    // Setter chamado pela lista: item.tarefa = objeto.
    set tarefa(valor) {
        this._tarefa = valor;
        this._render();
    }

    get tarefa() {
        return this._tarefa;
    }

    _render() {
        if (!this._tarefa) {
            return;
        }

        const { id, titulo, date, concluida } = this._tarefa;
        const status = concluida ? 'concluída' : 'pendente';
        const dataExtenso = dataPorExtenso(date);

        this.innerHTML = '';
        this.className = `task-item d-block ${concluida ? 'is-done' : 'is-pending'}`;

        const artigo = document.createElement('article');
        artigo.className = 'task-card rounded-3 p-2 p-md-4';
        artigo.setAttribute(
            'aria-label',
            `Tarefa ${status}: ${titulo}, ${dataExtenso}`
        );

        const corpo = document.createElement('div');
        corpo.className = 'd-flex flex-column flex-md-row align-items-md-center gap-2 gap-md-3';

        const info = document.createElement('div');
        info.className = 'flex-grow-1';

        const heading = document.createElement('h3');
        heading.className = 'h5 mb-1 task-title';
        heading.textContent = titulo;

        const meta = document.createElement('p');
        meta.className = 'mb-0 task-meta';
        meta.innerHTML = `
            <span class="visually-hidden">, data </span>
            <time datetime="${this._iso(date)}">${date}</time>
        `;

        info.appendChild(heading);

        const acoes = document.createElement('div');
        acoes.className = 'd-flex gap-2 task-actions';

        const concluir = document.createElement('app-button');
        concluir.setAttribute('label', concluida ? 'Desfazer' : 'Concluir');
        concluir.setAttribute('variant', concluida ? 'primary' : 'outline');
        concluir.setAttribute(
            'aria-label',
            concluida ? `Marcar "${titulo}" como pendente` : `Marcar "${titulo}" como concluída`
        );
        concluir.addEventListener('click', () => {
            emitir(EVENTOS.ALTERNAR, { id });
        });

        const excluir = document.createElement('app-button');
        excluir.setAttribute('label', 'Excluir');
        excluir.setAttribute('variant', 'danger');
        excluir.setAttribute('aria-label', `Excluir a tarefa ${titulo}`);
        excluir.addEventListener('click', () => {
            emitir(EVENTOS.PEDIR_EXCLUSAO, { id, titulo });
        });

        acoes.appendChild(concluir);
        acoes.appendChild(excluir);
        corpo.appendChild(info);
        corpo.appendChild(acoes);
        artigo.appendChild(corpo);
        this.appendChild(artigo);
    }

    // time[datetime] precisa de ISO para máquinas; a tela continua em BR.
    _iso(dataBr) {
        const [dia, mes, ano] = dataBr.split('/');
        return `${ano}-${mes}-${dia}`;
    }
}

customElements.define('app-task-item', AppTaskItem);
