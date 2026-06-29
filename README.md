# lista-tarefas

Projeto de estudo para criar uma aplicação de lista de tarefas com foco em componentes reutilizáveis, interação no navegador e persistência local. A interface é montada com web components e o estado das tarefas é salvo no localStorage, permitindo que os dados permaneçam disponíveis mesmo após recarregar a página.

---

## Resumo do projeto

Este projeto consiste em uma lista de tarefas simples, mas bem organizada, com funcionalidades para:

- adicionar novas tarefas;
- marcar tarefas como concluídas;
- remover tarefas;
- filtrar tarefas por status;
- agrupar tarefas por data;
- manter os dados salvos no navegador.

A aplicação foi construída com JavaScript moderno, utilizando módulos ES6 e web components para separar a interface em blocos reutilizáveis.

---

## Tecnologias utilizadas

### Frontend

| Tecnologia | Uso no projeto |
|------------|----------------|
| HTML5 | Estrutura da interface principal |
| Bootstrap 5 | UI pronta, classes utilitárias e componentes visuais |
| JavaScript ES Modules | Organização do código em módulos independentes |
| Web Components | Criação de elementos personalizados como botão e input |
| Moment.js | Formatação e comparação de datas |
| localStorage | Persistência das tarefas no navegador |

### Arquitetura e organização

| Pasta / arquivo | Função |
|-----------------|---------|
| index.html | Estrutura principal da aplicação e containers da interface |
| main.js | Ponto de entrada da aplicação, inicializa os módulos principais |
| componentes/ | Contém os componentes e módulos responsáveis pela lógica da lista |
| service/data.js | Funções auxiliares para manipulação de datas |

---

## Arquitetura do projeto

A aplicação segue uma arquitetura simples e modular, com separação de responsabilidades em arquivos específicos.

### 1. Estrutura principal

- O arquivo index.html define a estrutura da página, incluindo o formulário, a área de filtros e o container onde as tarefas são renderizadas.
- O arquivo main.js atua como ponto de entrada, importando os módulos principais e iniciando a aplicação.

### 2. Componentização com web components

A interface utiliza elementos personalizados para encapsular partes da UI:

- basic-button.js: representa o botão de adicionar tarefa;
- basic-input.js: representa os campos de entrada de texto e data.

Essa abordagem deixa a interface mais organizada e facilita a reutilização de elementos.

### 3. Fluxo de dados

O fluxo principal do projeto funciona da seguinte forma:

1. O usuário preenche o formulário e clica em adicionar.
2. O módulo criaTarefa.js coleta os dados e salva a tarefa no localStorage.
3. O módulo carregaTarefa.js lê as tarefas salvas e renderiza a lista na tela.
4. Os módulos de conclusão, exclusão e filtro atualizam a interface após cada ação.
5. O módulo contadorTarefa.js atualiza os números de tarefas totais, concluídas e pendentes.

### 4. Organização por responsabilidade

Cada arquivo tem uma função específica:

- criaTarefa.js: cria e salva novas tarefas;
- carregaTarefa.js: renderiza as tarefas na página;
- concluiTarefa.js: alterna o estado de conclusão;
- deletaTarefa.js: remove uma tarefa;
- filtraTarefa.js: controla os filtros de visualização;
- criaData.js: agrupa tarefas por data;
- contadorTarefa.js: calcula os contadores do cabeçalho;
- service/data.js: funções auxiliares para ordenar e limpar datas repetidas.

Essa divisão torna o projeto mais fácil de manter e evoluir.

---

## Como executar

Abra o arquivo index.html em um navegador moderno, ou utilize um servidor simples para evitar problemas com módulos JavaScript.

Exemplo simples:

```bash
python -m http.server 8000
```

Depois acesse http://localhost:8000 no navegador.

---

## Próximos passos

- [ ] Alternar visualmente o layout do status de cada tarefa.
- [ ] Adicionar data automática quando não informada.
