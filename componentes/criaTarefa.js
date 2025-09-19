import { carregaTarefa } from './carregaTarefa.js'
import concluirTarefa from './concluiTarefa.js'
import deletarTarefa from './deletaTarefa.js'

export const handleNovoItem = (evento) => {
    evento.preventDefault()
    const tarefas = JSON.parse(localStorage.getItem('tarefas'))||[]
    const input = document.querySelector('.title-task input')
    const titulo = input.value

    const calendario = document.querySelector('.date-task input')
    const data = moment(calendario.value)

    const dataFormatada = data.format('DD/MM/YYYY')

    const concluida = false;

    const dados = { 
        titulo,
        dataFormatada,
        concluida
    }

    const tarefasAtualizadas = [...tarefas, dados];

    localStorage.setItem('tarefas', JSON.stringify(tarefasAtualizadas));
    input.value = " ";

    carregaTarefa();
}

export const Tarefa = ({ titulo, dataFormatada, concluida }, id) => {
    const tarefa = document.createElement('li')
    tarefa.classList.add('list-group-item')

    if (concluida) {
        tarefa.classList.add('active')
    }

    // wrapper correto como elemento
    const conteudoWrapper = document.createElement('div')
    conteudoWrapper.classList.add('card')

    // Card topo
    const topoCard = document.createElement('div')
    topoCard.classList.add('card-header')

    // Card Corpo
    const cardCorpo = document.createElement('div')
    cardCorpo.classList.add('card-body')

    // Card Conteúdo
    const cardConteudo = document.createElement('div')
    cardConteudo.classList.add('card-body')

    // Card Rodapé
    const cardRodape = document.createElement('div')
    cardRodape.classList.add('d-flex')

    // span da data
    const elDataFormatada = document.createElement('span')
    elDataFormatada.classList.add('card-text')
    elDataFormatada.textContent = dataFormatada

    // Título
    const elTitulo = document.createElement('span')
    elTitulo.classList.add('card-title', 'd-block')
    elTitulo.textContent = titulo

    // Botão concluir
    const elBotaoConcluir = document.createElement('basic-button')
    elBotaoConcluir.setAttribute('title', 'Concluir')
    elBotaoConcluir.setAttribute('action', `concluir-${id}`)
    elBotaoConcluir.addEventListener('click', () => concluirTarefa(carregaTarefa, id))

    // Botão deletar
    const elBotaoDeletar = document.createElement('basic-button')
    elBotaoDeletar.setAttribute('title', 'Deletar')
    elBotaoDeletar.setAttribute('action', `deletar-${id}`)
    elBotaoDeletar.addEventListener('click', () => deletarTarefa(carregaTarefa, id))

    // Incluindo
    topoCard.appendChild(elDataFormatada)

    cardConteudo.appendChild(elTitulo)

    cardRodape.appendChild(elBotaoDeletar)
    cardRodape.appendChild(elBotaoConcluir)

    cardConteudo.appendChild(cardRodape)

    conteudoWrapper.appendChild(topoCard)
    conteudoWrapper.appendChild(cardConteudo)

    tarefa.appendChild(conteudoWrapper)

    return tarefa
}