// Ponto de entrada (Composition Root).
// É o único arquivo que instancia infraestrutura e aplicação juntas.
// Componentes de UI nunca criam o TarefaService: isso é DIP.

import { TarefaRepository } from './infrastructure/tarefa-repository.js';
import { TarefaService } from './application/tarefa-service.js';
import { EVENTOS, emitir, ouvir } from './presentation/events.js';
import { iniciarAnunciador } from './presentation/announcer.js';

import './presentation/components/app-button.js';
import './presentation/components/app-input.js';
import './presentation/components/app-header.js';
import './presentation/components/app-task-form.js';
import './presentation/components/app-task-filters.js';
import './presentation/components/app-task-item.js';
import './presentation/components/app-task-list.js';
import './presentation/components/app-confirm-dialog.js';

// Cria as dependências concretas uma vez só.
const repository = new TarefaRepository();
const service = new TarefaService(repository);

// Publica o estado para todos os componentes que escutam EVENTOS.ESTADO.
const publicar = (estado, mensagem) => {
    emitir(EVENTOS.ESTADO, estado);
    if (mensagem) {
        emitir(EVENTOS.ANUNCIAR, { mensagem });
    }
};

// Cada evento de intenção da UI vira um caso de uso do serviço.
ouvir(EVENTOS.CRIAR, (evento) => {
    try {
        const estado = service.criar(evento.detail);
        publicar(estado, `Tarefa ${evento.detail.titulo} adicionada.`);
    } catch (erro) {
        emitir(EVENTOS.ANUNCIAR, { mensagem: 'Não foi possível criar a tarefa.' });
    }
});

ouvir(EVENTOS.ALTERNAR, (evento) => {
    const estado = service.alternar(evento.detail.id);
    const tarefa = estado.tarefas.find((item) => item.id === evento.detail.id);
    const mensagem = tarefa?.concluida
        ? `Tarefa ${tarefa.titulo} marcada como concluída.`
        : `Tarefa ${tarefa?.titulo ?? ''} marcada como pendente.`;
    publicar(estado, mensagem);
});

ouvir(EVENTOS.CONFIRMAR_EXCLUSAO, (evento) => {
    const antes = service.obterEstado();
    const tarefa = antes.tarefas.find((item) => item.id === evento.detail.id);
    const estado = service.remover(evento.detail.id);
    publicar(estado, `Tarefa ${tarefa?.titulo ?? ''} excluída.`);
});

ouvir(EVENTOS.FILTRAR, (evento) => {
    const estado = service.filtrar(evento.detail.filtro);
    publicar(estado, `Filtro ${evento.detail.filtro} aplicado.`);
});

// Quando o DOM estiver pronto, liga o anunciador e pinta o estado inicial.
document.addEventListener('DOMContentLoaded', () => {
    iniciarAnunciador();
    publicar(service.obterEstado());
});
