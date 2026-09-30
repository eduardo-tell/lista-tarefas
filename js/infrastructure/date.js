// Camada de infraestrutura: detalhes técnicos de data.
// Substitui o Moment.js do projeto original por Date nativo (Moment está descontinuado).

// Converte YYYY-MM-DD (valor de <input type="date">) para DD/MM/YYYY.
// Existe porque o HTML fala ISO e a lista do app fala formato brasileiro.
export const formatarDataBr = (valorIsoOuBr) => {
    // Se já veio no formato brasileiro, não tenta parsear de novo.
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(valorIsoOuBr)) {
        return valorIsoOuBr;
    }

    // input type="date" entrega sempre YYYY-MM-DD.
    const partesIso = String(valorIsoOuBr).split('-');

    // Só formata se as três partes existirem; senão cai para hoje.
    if (partesIso.length === 3) {
        const [ano, mes, dia] = partesIso;
        return `${dia}/${mes}/${ano}`;
    }

    // Qualquer valor inesperado vira a data de hoje para a tarefa não ficar órfã.
    return hojeEmBr();
};

// Devolve a data de hoje já no formato usado pelo restante do app.
export const hojeEmBr = () => {
    // new Date() usa o fuso do navegador, que é o que o usuário espera ver.
    const agora = new Date();
    // padStart garante 01/09/2026 em vez de 1/9/2026, para ordenar e comparar.
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = String(agora.getFullYear());
    return `${dia}/${mes}/${ano}`;
};

// Transforma DD/MM/YYYY em Date local, sem UTC, para não "voltar um dia".
export const parsearDataBr = (dataBr) => {
    const [dia, mes, ano] = String(dataBr).split('/').map(Number);
    // Mês no Date é zero-based: janeiro é 0, por isso mes - 1.
    return new Date(ano, mes - 1, dia);
};

// Compara duas datas brasileiras para ordenação crescente (mais antiga primeiro).
export const compararDatasBr = (primeira, segunda) => {
    return parsearDataBr(primeira).getTime() - parsearDataBr(segunda).getTime();
};

// Diz se a data informada é o dia de hoje, para a UI mostrar "Hoje".
export const ehHoje = (dataBr) => {
    return dataBr === hojeEmBr();
};

// Rotulo acessível e visível do grupo: "Hoje" ou a própria data.
export const rotuloDoGrupo = (dataBr) => {
    return ehHoje(dataBr) ? 'Hoje' : dataBr;
};

// Texto longo para leitores de tela, porque "14/09/2026" lido dígito a dígito
// é pior do que "14 de setembro de 2026".
export const dataPorExtenso = (dataBr) => {
    const data = parsearDataBr(dataBr);
    // pt-BR gera o nome do mês por extenso de forma nativa.
    return data.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};
