# lista-tarefas-novo

Releitura do projeto `lista-tarefas` com a **mesma base de Web Components**, o **mesmo Bootstrap 5.3.8** e a **mesma paleta**, reorganizada em camadas. O objetivo não é só repetir a lista: é mostrar onde o código antigo misturava responsabilidades e como um desenho atual (Clean Architecture + SOLID) deixa cada parte mais fácil de entender, testar e evoluir.

Este repositório é um projeto irmão, independente. Os dados ficam em outra chave do `localStorage`, então as duas listas não se misturam.

---

## Paleta

As cores abaixo são as do projeto original, aplicadas como tokens CSS que sobrescrevem o Bootstrap sem editar `bootstrap.css`:

| Token | Valor | Uso |
| --- | --- | --- |
| `--bs-primary` | `#29A29D` | Header, botão principal, linha do tempo, bordas |
| `--bs-primary-rgb` | `41, 162, 157` | Sombras de foco e transparências |
| `--bs-secondary` | `#A3F7BF` | Chips, hovers e tarefas concluídas |
| `--bs-body-color` | `#222831` | Texto |
| `--bs-danger` | `#C56868` | Excluir, erros de validação |
| `--tertiary` | `#A3F7BF` | Alias da secundária |
| `--default` | `#FCFCFC` | Fundo da página |

O layout é outro (hero em cartão, linha do tempo por data, cartões com faixa lateral). A dinâmica de cores é a mesma.

---

## O que o app faz

São as mesmas funcionalidades do projeto original:

1. **Criar tarefa** com título obrigatório e data opcional.
2. **Data padrão** = hoje, quando o campo data fica vazio.
3. **Persistir** no `localStorage`.
4. **Agrupar** tarefas pela data, com o rótulo **Hoje** para o dia atual.
5. **Ordenar** os grupos da data mais antiga para a mais recente.
6. **Concluir / desfazer** o status da tarefa.
7. **Excluir** tarefa.
8. **Filtrar** por pendentes e concluídas (aqui também há o filtro explícito **Todas**).
9. **Contar** totais, concluídas e pendentes no cabeçalho.
10. **Validar** título vazio antes de salvar e **limpar** título e data depois de adicionar.

Melhorias de uso (sem mudar o produto):

- confirmação acessível antes de excluir;
- estado vazio com mensagem de acordo com o filtro;
- anúncio para leitor de tela a cada ação;
- foco de volta ao título depois de cadastrar.

---

## Como executar

O projeto usa ES Modules. Abrir o `index.html` direto no disco (`file://`) costuma falhar. Use um servidor local na pasta do projeto:

```bash
python -m http.server 8000
```

Depois abra [http://localhost:8000](http://localhost:8000).

Outra opção, se tiver o Node.js:

```bash
npx serve .
```

Navegador: qualquer um moderno com suporte a Custom Elements, `localStorage` e `<dialog>`.

---

## Por que esta arquitetura

O projeto original funciona, mas mistura papéis no mesmo arquivo: `criaTarefa.js` grava no storage, monta HTML e escuta clique. `basic-button` importa a função de criar tarefa. Filtro lê classe CSS interna do botão. Data depende do Moment.js (biblioteca descontinuada).

Aqui a regra é: **cada camada só fala com a de dentro**. A tela não conhece `localStorage`. O serviço não conhece botão. O repositório não conhece filtro.

Isso não é “usar Solid (o framework)”. É usar **SOLID** e um desenho próximo de **Clean Architecture / Ports & Adapters**, que é o modelo atual mais didático para um app vanilla.

```
index.html  →  landmarks e composição da página
js/main.js  →  Composition Root (única cola)
     │
     ├─ presentation/   UI, eventos, acessibilidade
     ├─ application/    casos de uso
     ├─ domain/         o que é uma tarefa e um filtro
     └─ infrastructure/ localStorage e datas
```

### SOLID aplicado

| Princípio | Onde aparece neste projeto |
| --- | --- |
| **S** — Single Responsibility | Um arquivo, um motivo para mudar. `TarefaService` não desenha HTML. `app-button` não cria tarefa. |
| **O** — Open/Closed | Novo filtro entra em `filtro.js` e passa a aparecer na barra, sem reescrever o serviço. |
| **L** — Liskov | Qualquer repositório com `listar()` e `salvarTodas()` pode substituir o `TarefaRepository`. |
| **I** — Interface Segregation | Os eventos são contratos pequenos (`tarefa:criar`, `tarefa:alternar`). Nenhum componente depende de uma API gigante. |
| **D** — Dependency Inversion | O serviço recebe o repositório pronto. Os componentes emitem eventos; não importam o serviço. Quem liga as pontas é o `main.js`. |

### Comunicação por eventos

Os Web Components **não se chamam**. Eles disparam `CustomEvent` no `document`. O `main.js` traduz intenção em caso de uso e devolve `tarefas:estado`.

Isso evita o acoplamento do projeto antigo, em que o botão importava `handleNovoItem`.

Fluxo de uma tarefa nova:

1. `app-task-form` valida o título e emite `tarefa:criar`.
2. `main.js` chama `service.criar()`.
3. O serviço usa a fábrica do domínio e o repositório grava.
4. `main.js` emite `tarefas:estado` e `app:anunciar`.
5. Header, filtros e lista pintam o estado novo.
6. O leitor de tela ouve “Tarefa X adicionada”.

---

## Estrutura de pastas

```
lista-tarefas-novo/
├── index.html
├── README.md
├── css/
│   ├── bootstrap.css          Bootstrap 5.3.8 (arquivo idêntico ao original)
│   └── styles.css             tokens, layout novo, foco e movimento reduzido
└── js/
    ├── main.js                composição da aplicação
    ├── domain/
    │   ├── tarefa.js          fábrica e invariantes da tarefa
    │   └── filtro.js          filtros válidos e regra de visibilidade
    ├── application/
    │   └── tarefa-service.js  criar, alternar, remover, filtrar, agrupar
    ├── infrastructure/
    │   ├── tarefa-repository.js  persistência em localStorage
    │   └── date.js            datas em pt-BR sem Moment.js
    └── presentation/
        ├── events.js          nomes dos eventos (contrato)
        ├── announcer.js       região aria-live
        └── components/
            ├── mesclar-classes.js
            ├── app-button.js
            ├── app-input.js
            ├── app-header.js
            ├── app-task-form.js
            ├── app-task-filters.js
            ├── app-task-item.js
            ├── app-task-list.js
            └── app-confirm-dialog.js
```

Cada arquivo JS está comentado linha a linha: o que a instrução faz e por que ela precisa existir.

---

## Modelo de dados

Chave do `localStorage`: `lista-tarefas-novo`.

```json
{
  "id": "uuid",
  "titulo": "Revisar o relatório",
  "date": "16/09/2026",
  "concluida": false
}
```

- `id` nasce com `crypto.randomUUID()` — o original usava índice da lista, o que quebra ao excluir um item do meio.
- `date` permanece `DD/MM/YYYY`, igual ao app antigo, para a regra de agrupamento continuar reconhecível.
- Tarefas sem `id` (se alguém reaproveitar JSON velho) ganham um id na leitura.

---

## Web Components

Não usam Shadow DOM de propósito: as classes do Bootstrap precisam vazar para o controle nativo. O custom element é um wrapper; o `<button>` e o `<input>` de verdade ficam dentro.

| Tag | Papel |
| --- | --- |
| `app-button` | Botão nativo com variantes. Sem regra de negócio. |
| `app-input` | Campo com `id` interno (o `label for` funciona), erro e `aria-invalid`. |
| `app-header` | Título e contadores. |
| `app-task-form` | Formulário de criação. |
| `app-task-filters` | Grupo de filtros com `aria-pressed`. |
| `app-task-item` | Um cartão de tarefa. |
| `app-task-list` | Grupos por data e estado vazio. |
| `app-confirm-dialog` | `<dialog>` nativo para confirmar exclusão. |

O `label` aponta para `input-id` do campo interno. No projeto original o `for` do label (`taskTitle`) não batia com o `id` do input (`title-task`), então clicar no rótulo não focava o campo.

---

## Acessibilidade e usabilidade

O que foi coberto de propósito:

| Tema | Como |
| --- | --- |
| Idioma | `lang="pt-BR"` |
| Título da página | `<title>Lista de tarefas</title>` |
| Landmarks | `header`, `main`, `form`, `dialog` |
| Pular conteúdo | link “Pular para o conteúdo” |
| Rótulos | `<label for>` ligado ao `id` do input nativo |
| Ajuda | texto visível + `aria-describedby` |
| Erro | `aria-invalid`, `role="alert"`, foco no campo |
| Teclado | todos os controles são nativos; Enter envia o form |
| Foco visível | `:focus-visible` com a cor primária |
| Alvo de toque | botões com altura mínima de 44px |
| Status | badge “pendente/concluída”, não só cor |
| Tarefa concluída | riscado + badge + `aria-label` no cartão |
| Filtros | `role="group"` e `aria-pressed` |
| Contadores | `aria-label` com singular/plural |
| Lista | `aria-live="polite"` na lista |
| Anúncios | região `#anuncios` escondida visualmente |
| Exclusão | `<dialog>` com rótulo, descrição, Escape e foco restaurado |
| Data | `<time datetime="YYYY-MM-DD">` e data por extenso no SR |
| Estado vazio | `role="status"` com mensagem do filtro |
| Movimento | `prefers-reduced-motion` desliga shake e transições |
| XSS | títulos com `textContent`, nunca `innerHTML` de dado do usuário |

O Bootstrap entra só como CSS. Nenhum JavaScript do Bootstrap é necessário.

---

## O que melhorou em relação ao original

1. **Separação de camadas** — UI, caso de uso, domínio e storage não se atravessam.
2. **Botão burro** — `app-button` não importa a função de criar tarefa.
3. **Eventos nomeados** — um contrato só, em `events.js`.
4. **IDs estáveis** — exclusão e conclusão não dependem da posição no array.
5. **Datas nativas** — sai o Moment.js.
6. **Label correto** — o clique no rótulo foca o campo.
7. **Filtro “Todas”** — não é mais preciso “desclicar” o filtro ativo para ver tudo.
8. **Confirmar exclusão** — evita clique acidental.
9. **Acessibilidade de verdade** — idioma, foco, live region, diálogo, movimento reduzido.
10. **Layout novo** — mesma paleta, hierarquia visual mais clara.

---

## Como acrescentar um filtro novo

1. Inclua a constante em `js/domain/filtro.js`.
2. Ensine `tarefaAtendeFiltro` a interpretá-la.
3. Coloque o botão em `FILTROS_NA_TELA`.

O serviço e a barra de filtros passam a usar o valor novo sem reescrita.

Para trocar o `localStorage` por uma API, implemente outra classe com `listar()` e `salvarTodas()` e injete-a no `main.js`. Nada da UI muda.

---

## Tecnologias

| Tecnologia | Papel |
| --- | --- |
| HTML5 | Estrutura e landmarks |
| Bootstrap 5.3.8 | Grid, formulário, utilitários (arquivo local `css/bootstrap.css`) |
| JavaScript ES Modules | Organização em arquivos |
| Web Components | Elementos `app-*` |
| localStorage | Persistência |
| `Date` nativo + `Intl` | Datas em pt-BR |

Não há build, bundler nem framework. O ponto é enxergar as responsabilidades com o menor ruído possível.
