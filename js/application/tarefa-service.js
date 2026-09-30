// Camada de aplicação: casos de uso.
// Orquestra domínio + repositório sem conhecer botão, formulário ou CSS.

// Regras de filtro e agrupamento ficam importadas, não copiadas.
import { FILTROS, ehFiltroValido, tarefaAtendeFiltro } from '../domain/filtro.js';
import { criarTarefa, alternarConclusao } from '../domain/tarefa.js';
import { compararDatasBr } from '../infrastructure/date.js';

// Serviço único da aplicação. Um método = um caso de uso (SRP).
export class TarefaService {
    // Recebe o repositório pronto: o serviço não instancia a infraestrutura.
    // Isso é Inversão de Dependência: depende de uma abstração injetada.
    constructor(repository) {
        this._repository = repository;
        // Filtro começa em "todas" para a primeira visita mostrar a lista completa.
        this._filtro = FILTROS.TODAS;
    }

    // Caso de uso: obter o estado que a tela precisa renderizar.
    obterEstado() {
        const tarefas = this._repository.listar();
        return {
            tarefas,
            filtro: this._filtro,
            contadores: this._contar(tarefas),
            grupos: this._agrupar(tarefas, this._filtro)
        };
    }

    // Caso de uso: criar tarefa a partir dos dados crus do formulário.
    criar({ titulo, date }) {
        // A fábrica valida e monta o objeto; o serviço só persiste.
        const nova = criarTarefa({ titulo, date });
        // Lê o estado atual para não sobrescrever tarefas já salvas.
        const atuais = this._repository.listar();
        // Nova tarefa entra no topo da lista (mais recente primeiro no grupo).
        this._repository.salvarTodas([nova, ...atuais]);
        // Devolve o estado já atualizado para a UI não precisar consultar de novo.
        return this.obterEstado();
    }

    // Caso de uso: marcar ou desmarcar conclusão.
    alternar(id) {
        const atuais = this._repository.listar();
        const atualizadas = atuais.map((tarefa) => {
            // Só a tarefa do id clicado muda; as outras seguem iguais.
            return tarefa.id === id ? alternarConclusao(tarefa) : tarefa;
        });
        this._repository.salvarTodas(atualizadas);
        return this.obterEstado();
    }

    // Caso de uso: remover uma tarefa depois da confirmação na UI.
    remover(id) {
        const atuais = this._repository.listar();
        // filter cria lista nova sem o item, sem mutar o array lido.
        const atualizadas = atuais.filter((tarefa) => tarefa.id !== id);
        this._repository.salvarTodas(atualizadas);
        return this.obterEstado();
    }

    // Caso de uso: trocar o filtro visível, sem gravar isso no storage.
    // Filtro é preferência de sessão, não dado da tarefa.
    filtrar(filtro) {
        this._filtro = ehFiltroValido(filtro) ? filtro : FILTROS.TODAS;
        return this.obterEstado();
    }

    // Conta totais para o cabeçalho. Privado porque só o próprio serviço usa.
    _contar(tarefas) {
        const concluidas = tarefas.filter((tarefa) => tarefa.concluida).length;
        const pendentes = tarefas.length - concluidas;
        return {
            todas: tarefas.length,
            concluidas,
            pendentes
        };
    }

    // Agrupa por data já filtrado e ordenado, pronto para a lista renderizar.
    _agrupar(tarefas, filtro) {
        const visiveis = tarefas.filter((tarefa) => tarefaAtendeFiltro(tarefa, filtro));
        const datas = [];

        visiveis.forEach((tarefa) => {
            // Só adiciona a data se ela ainda não estiver no array (únicas).
            if (!datas.includes(tarefa.date)) {
                datas.push(tarefa.date);
            }
        });

        // Ordena datas da mais antiga para a mais recente, como no original.
        datas.sort(compararDatasBr);

        // Monta [{ date, tarefas: [...] }, ...] para a UI só iterar.
        return datas.map((date) => ({
            date,
            tarefas: visiveis.filter((tarefa) => tarefa.date === date)
        }));
    }
}
