// Repositório: único ponto que fala com o localStorage.
// O serviço não precisa saber se no futuro isso vira IndexedDB ou uma API.

// Importa a migração de identidade para dados antigos sem id.
import { garantirIdentidade } from '../domain/tarefa.js';

// Chave própria deste projeto para não misturar dados com o lista-tarefas antigo.
const CHAVE_STORAGE = 'lista-tarefas-novo';

// Encapsula leitura e escrita. A classe existe para ser injetada (DIP).
export class TarefaRepository {
    // Aceita uma chave opcional para testes poderem usar outro storage.
    constructor(chave = CHAVE_STORAGE) {
        // Guarda a chave na instância para listar e salvar usarem a mesma.
        this._chave = chave;
    }

    // Lê todas as tarefas. Sempre devolve array, nunca null.
    listar() {
        // getItem devolve string ou null quando a chave ainda não existe.
        const bruto = localStorage.getItem(this._chave);
        // Sem dado salvo, começa com lista vazia em vez de quebrar o JSON.parse.
        const lidas = bruto ? JSON.parse(bruto) : [];
        // Garante id em cada item e persiste de volta se alguma migração ocorreu.
        const comId = lidas.map(garantirIdentidade);
        // Se algum id foi criado agora, grava para a próxima visita já vir correta.
        if (comId.some((tarefa, indice) => tarefa !== lidas[indice])) {
            this.salvarTodas(comId);
        }
        return comId;
    }

    // Substitui a lista inteira. É propositalmente simples (sem patch).
    // Listas pequenas no localStorage não precisam de update parcial.
    salvarTodas(tarefas) {
        // JSON.stringify é o formato que o localStorage aceita (só string).
        localStorage.setItem(this._chave, JSON.stringify(tarefas));
    }
}
