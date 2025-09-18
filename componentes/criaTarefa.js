import { carregaTarefa } from './carregaTarefa.js'
import BotaoConclui from './concluiTarefa.js'
import BotaoDeleta from './deletaTarefa.js'
 

export const handleNovoItem = (evento) => {
    evento.preventDefault()
    const tarefas = JSON.parse(localStorage.getItem('tarefas'))||[]
    const input = document.querySelector('#title-task')
    const valor = input.value

    const calendario = document.querySelector('#date-task')
    const data = moment(calendario.value)

    const dataFormatada = data.format('DD/MM/YYYY')

    const dados = { 
        valor,
        dataFormatada
    }

    const tarefasAtualizadas = [...tarefas, dados]

    localStorage.setItem('tarefas', JSON.stringify(tarefasAtualizadas))

    input.value = " "

    carregaTarefa()
}

export const Tarefa = ({ valor, dataFormatada }) => {

    const tarefa = document.createElement('li')
    tarefa.classList.add('task')

    const conteudo = `    
        <div class="card">
            <div class="card-body">
                ${dataFormatada} * ${valor}
            </div>
        </div>
    `;



    tarefa.innerHTML = conteudo

    tarefa.appendChild(BotaoConclui())
    tarefa.appendChild(BotaoDeleta())
   
    return tarefa

}
