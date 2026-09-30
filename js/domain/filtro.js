// Este arquivo vive na camada de domínio: descreve regras de negócio puras,
// sem HTML, sem localStorage e sem Bootstrap.
// Ele existe para que "o que é um filtro" tenha uma definição única no projeto.

// Congela o objeto para ninguém alterar os valores em tempo de execução.
// Sem isso, um componente poderia reescrever PENDENTES e quebrar os outros.
export const FILTROS = Object.freeze({
    // Valor usado quando o usuário quer ver todas as tarefas.
    // String vazia não seria clara; "todas" documenta a intenção.
    TODAS: 'todas',
    // Valor usado quando o usuário quer ver só o que ainda não foi feito.
    PENDENTES: 'pendentes',
    // Valor usado quando o usuário quer ver só o que já foi concluído.
    CONCLUIDAS: 'concluidas'
});

// Lista na ordem em que os botões devem aparecer na interface.
// Centralizar a ordem aqui evita que o HTML e o JS discordem.
export const FILTROS_NA_TELA = Object.freeze([
    { id: FILTROS.TODAS, rotulo: 'Todas' },
    { id: FILTROS.PENDENTES, rotulo: 'Pendentes' },
    { id: FILTROS.CONCLUIDAS, rotulo: 'Concluídas' }
]);

// Diz se um valor recebido da UI é um filtro conhecido.
// Existe para o serviço recusar estados inválidos (defesa em profundidade).
export const ehFiltroValido = (filtro) => {
    // Object.values devolve ['todas', 'pendentes', 'concluidas'] para comparar.
    return Object.values(FILTROS).includes(filtro);
};

// Decide se uma tarefa deve aparecer dado o filtro atual.
// Isolar essa regra permite testá-la sem montar a tela.
export const tarefaAtendeFiltro = (tarefa, filtro) => {
    // Sem filtro reconhecido, mostra tudo para não esconder dados por acidente.
    if (filtro === FILTROS.TODAS) {
        return true;
    }

    // Pendente é o inverso de concluída, não um terceiro estado.
    if (filtro === FILTROS.PENDENTES) {
        return tarefa.concluida === false;
    }

    // Concluída só entra quando o boolean está explicitamente verdadeiro.
    if (filtro === FILTROS.CONCLUIDAS) {
        return tarefa.concluida === true;
    }

    // Qualquer valor inesperado cai no "mostrar todas" para não quebrar a lista.
    return true;
};
