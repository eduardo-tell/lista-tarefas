export const filtraTarefa = () => {
    const tarefas = JSON.parse(localStorage.getItem('tarefas'))||[];
    console.log(tarefas);

    var naoConcluidas = tarefas.filter(function(obj) {
        return obj.concluida == false;
    });

    var concluidas = tarefas.filter(function(obj) {
        return obj.concluida == true;
    }); 

    console.log(naoConcluidas);
    console.log(concluidas);
}