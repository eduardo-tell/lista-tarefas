import { contadorTarefa } from './contadorTarefa.js';

export const deletarTarefa = (id) => {
    const item = document.querySelector(`[data-task-id="${id}"]`);

    if (!item || item.classList.contains('task-exit')) return;

    item.classList.add('task-exit');
    item.querySelectorAll('button').forEach((botao) => {
        botao.disabled = true;
    });

    const finalizarExclusao = (evento) => {
        if (evento.target !== item || evento.animationName !== 'task-exit') return;

        item.removeEventListener('animationend', finalizarExclusao);

        const tarefasCadastradas = JSON.parse(localStorage.getItem('tarefas')) || [];
        const atualizadas = tarefasCadastradas.filter((tarefa) => tarefa.id !== id);
        localStorage.setItem('tarefas', JSON.stringify(atualizadas));

        const secao = item.closest('[data-date]');
        item.remove();

        if (secao && !secao.querySelector('[data-task-id]')) {
            secao.remove();
        }

        contadorTarefa();
    };

    item.addEventListener('animationend', finalizarExclusao);
};
