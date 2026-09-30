// Região viva para leitores de tela.
// Existe porque mudanças visuais (lista, contadores) não são faladas sozinhas.

// Importa o contrato de eventos para ouvir pedidos de anúncio.
import { EVENTOS, ouvir } from './events.js';

// Liga o elemento #anuncios aos eventos da aplicação.
// Deve ser chamado uma vez no main.js, no arranque.
export const iniciarAnunciador = () => {
    // Pega o container visualmente oculto definido no HTML.
    const destino = document.getElementById('anuncios');

    // Sem o elemento, não há o que anunciar; evita erro em páginas de teste.
    if (!destino) {
        return;
    }

    // Escuta pedidos globais de mensagem.
    ouvir(EVENTOS.ANUNCIAR, (evento) => {
        // Lê a mensagem enviada por quem disparou o evento.
        const mensagem = evento.detail?.mensagem ?? '';
        // Limpa antes para o leitor de tela perceber a mudança mesmo
        // se a próxima frase for igual à anterior.
        destino.textContent = '';
        // requestAnimationFrame garante que o DOM "viu" o vazio antes do texto novo.
        requestAnimationFrame(() => {
            destino.textContent = mensagem;
        });
    });
};
