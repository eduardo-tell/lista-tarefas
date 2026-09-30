// Este módulo é a "entidade" da aplicação: o que uma tarefa é, e o que ela
// pode ou não ser. Nenhum outro arquivo deve inventar o formato do objeto.

// Importa o formatador de datas da infraestrutura para preencher a data padrão.
// Em um projeto maior isso poderia ser injetado; aqui o ganho não compensaria.
import { formatarDataBr, hojeEmBr } from '../infrastructure/date.js';

// Quantidade máxima de caracteres do título.
// Existe para evitar tarefas gigantes que quebram o layout e a leitura.
export const TITULO_MAXIMO = 120;

// Cria uma tarefa nova já válida.
// A fábrica concentra invariantes: quem chama não precisa lembrar das regras.
export const criarTarefa = ({ titulo, date }) => {
    // Remove espaços nas pontas para "   " não passar como título preenchido.
    const tituloLimpo = String(titulo ?? '').trim();

    // Sem título não existe tarefa útil; o erro é um código, não um texto de UI.
    // A tela traduz o código, respeitando o Princípio da Responsabilidade Única.
    if (!tituloLimpo) {
        throw new Error('TITULO_OBRIGATORIO');
    }

    // Limite de tamanho protege layout, storage e leitores de tela.
    if (tituloLimpo.length > TITULO_MAXIMO) {
        throw new Error('TITULO_MUITO_LONGO');
    }

    // Se o usuário não escolheu data, assume o dia de hoje.
    // Isso replica a regra do projeto original e evita tarefas sem agrupamento.
    const dataFinal = date ? formatarDataBr(date) : hojeEmBr();

    // Retorna um objeto simples (não uma classe) para persistir fácil no JSON.
    return {
        // UUID evita colidir índices quando se remove itens do meio da lista.
        id: crypto.randomUUID(),
        // Título já sanitizado; a UI nunca deve gravar o valor cru do input.
        titulo: tituloLimpo,
        // Data sempre no formato brasileiro DD/MM/YYYY, igual ao projeto antigo.
        date: dataFinal,
        // Toda tarefa nasce pendente; concluir é uma ação explícita depois.
        concluida: false
    };
};

// Alterna o estado de conclusão sem mutar o original.
// Imutabilidade evita bugs em que a tela e o storage ficam dessincronizados.
export const alternarConclusao = (tarefa) => {
    // Copia todas as propriedades e inverte só o boolean de conclusão.
    return {
        ...tarefa,
        concluida: !tarefa.concluida
    };
};

// Garante que tarefas antigas (sem id) recebam um identificador.
// Existe para migrar dados do projeto original se a chave for reutilizada.
export const garantirIdentidade = (tarefa) => {
    // Se já tem id válido, devolve a própria tarefa sem criar objeto novo.
    if (tarefa && typeof tarefa.id === 'string' && tarefa.id.length > 0) {
        return tarefa;
    }

    // Gera id novo e preserva o restante dos campos.
    return {
        ...tarefa,
        id: crypto.randomUUID()
    };
};
