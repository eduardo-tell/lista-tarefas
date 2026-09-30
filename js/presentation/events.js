// Contrato de eventos da aplicação.
// Componentes não se chamam uns aos outros: conversam por nomes estáveis.
// Isso é o "D" de SOLID (Dependency Inversion) na prática da UI.

export const EVENTOS = Object.freeze({
    // UI pede para criar uma tarefa. Detalhe: { titulo, date }.
    CRIAR: 'tarefa:criar',
    // UI pede para alternar concluída. Detalhe: { id }.
    ALTERNAR: 'tarefa:alternar',
    // UI pede para abrir o diálogo de exclusão. Detalhe: { id, titulo }.
    PEDIR_EXCLUSAO: 'tarefa:pedir-exclusao',
    // Diálogo confirmou a exclusão. Detalhe: { id }.
    CONFIRMAR_EXCLUSAO: 'tarefa:confirmar-exclusao',
    // UI pede troca de filtro. Detalhe: { filtro }.
    FILTRAR: 'tarefa:filtrar',
    // Aplicação avisa que o estado mudou. Detalhe: estado completo.
    ESTADO: 'tarefas:estado',
    // Aplicação pede um anúncio para leitor de tela. Detalhe: { mensagem }.
    ANUNCIAR: 'app:anunciar'
});

// Dispara um CustomEvent no document para qualquer componente escutar.
// bubbles não é necessário no document, mas composed ajuda se no futuro
// algum componente usar Shadow DOM.
export const emitir = (nome, detalhe = {}) => {
    document.dispatchEvent(new CustomEvent(nome, {
        detail: detalhe,
        bubbles: true,
        composed: true
    }));
};

// Atalho para assinar um evento no document e devolver a função de limpeza.
export const ouvir = (nome, handler) => {
    document.addEventListener(nome, handler);
    return () => document.removeEventListener(nome, handler);
};
