const deletarTarefa = (atualiza, id) => { 
    const index = id;
    const tarefasCadastradas = JSON.parse(localStorage.getItem('tarefas'));

    tarefasCadastradas.splice(index, 1);
    localStorage.setItem('tarefas', JSON.stringify(tarefasCadastradas));

    atualiza();
};

export default deletarTarefa;