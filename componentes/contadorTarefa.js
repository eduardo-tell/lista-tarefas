export const contadorTarefa = () => {
    const tarefas = JSON.parse(localStorage.getItem('tarefas'))||[];

    var naoConcluidas = tarefas.filter(function(obj) {
        return obj.concluida == false;
    });

    var concluidas = tarefas.filter(function(obj) {
        return obj.concluida == true;
    }); 

    document.getElementById('totalTasks').textContent = tarefas.length;
    document.getElementById('completedTasks').textContent = concluidas.length;
    document.getElementById('pendingTasks').textContent = naoConcluidas.length;
}