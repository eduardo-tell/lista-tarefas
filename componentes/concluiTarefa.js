export const concluirTarefa = (atualiza, id) => {
    const tarefasCadastradas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const tarefa = tarefasCadastradas.find((item) => item.id === id);

    if (!tarefa) return;

    tarefa.concluida = !tarefa.concluida;
    localStorage.setItem('tarefas', JSON.stringify(tarefasCadastradas));
    atualiza();
}
