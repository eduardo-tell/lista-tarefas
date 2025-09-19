const concluirTarefa = (atualiza, id) => {
    const tarefasCadastradas = JSON.parse(localStorage.getItem('tarefas'))
    tarefasCadastradas[id].concluida = !tarefasCadastradas[id].concluida;

    localStorage.setItem('tarefas', JSON.stringify(tarefasCadastradas))
    atualiza()
}

export default concluirTarefa
