# Manual da Usuaria — AgendaEC

## O que e o AgendaEC

O AgendaEC e um aplicativo de apoio para a rotina da loja.

Ele serve para centralizar, em um so lugar:

- tarefas do dia
- clientes
- vendas
- cobrancas
- entregas
- compromissos
- estoque
- fechamento do dia
- relatorios
- mensagens de WhatsApp

A ideia e simples: tudo que antes ficava espalhado em papel, memoria, WhatsApp ou anotacao solta passa a ficar organizado no aplicativo.

---

## Para que serve

O AgendaEC ajuda a loja a responder perguntas do dia a dia:

- O que preciso fazer hoje?
- Quanto vendi hoje?
- Quem esta devendo?
- Quem preciso cobrar?
- Qual cliente comprou?
- Qual entrega esta pendente?
- Como fecho o caixa do dia?
- Que produtos estao acabando?
- O que posso mandar para a cliente no WhatsApp?

Ele nao substitui o WhatsApp. Ele organiza a informacao e abre o WhatsApp com a mensagem pronta para a dona revisar e enviar.

---

## Como entrar no aplicativo

1. Abra o AgendaEC.
2. Informe seu email.
3. Informe sua senha.
4. Toque em **Entrar**.

Usuario inicial:

```text
Email: esdraaline@gmail.com
```

Se o login estiver correto, o aplicativo abre a tela **Hoje**.

---

## Tela Hoje

A tela **Hoje** e a principal.

Ela mostra um resumo rapido do dia:

- vendas do dia
- recebimentos
- tarefas pendentes
- alertas importantes
- atalhos para outras partes do aplicativo

Use essa tela no comeco do dia, durante o atendimento e antes de fechar a loja.

### Quando usar

- para ver o movimento do dia
- para saber o que ainda falta fazer
- para acompanhar vendas recentes
- para acessar rapidamente outras telas

---

## Inbox

O **Inbox** e a tela de captura rapida.

Ela serve para anotar algo sem precisar preencher formulario grande.

Exemplos:

```text
Ligar para Maria amanha
```

```text
Vendi Natura para Ana R$ 80 pix
```

```text
Entregar pedido da Joana sexta
```

O aplicativo tenta entender o texto e transformar em tarefa ou venda.

### Quando usar

- quando a loja esta corrida
- quando voce quer anotar rapido
- quando chegou pedido pelo WhatsApp
- quando lembrou de uma tarefa
- quando fez uma venda simples

### Dica

Escreva de forma natural, mas clara. Coloque nome, valor e data quando souber.

---

## Clientes

A tela **Clientes** guarda as informacoes das clientes da loja.

Nela voce pode ver:

- nome
- telefone
- observacoes
- saldo/debito
- historico relacionado

### Para que serve

- encontrar cliente rapidamente
- ver se a cliente deve algo
- abrir cobranca no WhatsApp
- manter contato organizado

### Telefones

O telefone deve estar com DDD. O sistema prepara o link do WhatsApp automaticamente.

---

## Cobrancas

A tela **Cobrancas** mostra clientes com saldo em aberto.

Ela serve para ajudar a dona a cobrar sem esquecer ninguem.

O aplicativo monta uma mensagem de cobranca, mas nunca envia sozinho.

Fluxo correto:

1. Ver cliente com saldo em aberto.
2. Tocar para cobrar.
3. Conferir a mensagem.
4. Abrir no WhatsApp.
5. Revisar no WhatsApp.
6. Enviar manualmente.

Regra importante: o AgendaEC nunca envia mensagem automatica.

---

## WhatsApp

O WhatsApp e usado por link oficial `wa.me`.

O AgendaEC pode:

- montar mensagem pronta
- abrir conversa no WhatsApp
- preencher o texto

O AgendaEC nao pode:

- enviar mensagem sozinho
- disparar cobranca automatica
- conversar como robo

A dona sempre revisa e toca em enviar dentro do WhatsApp.

---

## Templates de WhatsApp

Templates sao modelos de mensagem.

Exemplos:

- confirmacao de pedido
- lembrete de entrega
- cobranca de saldo

Eles existem para evitar digitar a mesma mensagem toda vez.

### Onde editar

Entre em:

```text
Configuracoes -> Templates WhatsApp
```

### Variaveis

Algumas mensagens usam campos automaticos, como:

```text
{nome}
{produto}
{data}
{saldo}
```

Nao apague essas palavras entre chaves se quiser que o sistema preencha automaticamente.

---

## Estoque

A tela **Estoque** ajuda a acompanhar produtos.

Ela serve para ver:

- produtos cadastrados
- quantidade disponivel
- itens com estoque baixo

### Quando usar

- antes de comprar reposicao
- quando receber mercadoria
- quando vender produto e quiser acompanhar baixa
- para ver o que esta acabando

---

## Entregas e Central

A **Central** reune informacoes operacionais que precisam de acompanhamento.

Ela pode envolver:

- entregas
- compromissos
- tarefas importantes

Use essa area para nao perder prazo, entrega combinada ou atendimento marcado.

---

## Fechamento

A tela **Fechamento** serve para conferir o resultado do dia.

Ela organiza os valores por forma de pagamento, como:

- dinheiro
- pix
- cartao
- fiado

### Quando usar

Use no fim do expediente.

Fluxo recomendado:

1. Conferir vendas do dia.
2. Conferir recebimentos.
3. Conferir valores por forma de pagamento.
4. Confirmar se o caixa bate.
5. Registrar o fechamento.

---

## Relatorios

A tela **Relatorios** mostra uma visao mais ampla do periodo.

Ela serve para:

- ver resultado mensal
- exportar informacoes
- copiar resumo para enviar por WhatsApp
- baixar CSV quando precisar organizar dados fora do app

Use quando quiser entender o movimento alem do dia atual.

---

## Configuracoes

A tela **Configuracoes** concentra ajustes do aplicativo.

Ela pode incluir:

- sincronizacao manual
- templates de WhatsApp
- informacoes da conta
- opcoes operacionais

Use com cuidado. Normalmente, no dia a dia, a usuaria fica mais nas telas **Hoje**, **Inbox**, **Clientes** e **Cobrancas**.

---

## Sincronizacao

O AgendaEC guarda parte dos dados localmente para ajudar no uso diario.

Quando houver internet, os dados podem ser sincronizados com o Supabase, que e o banco online do aplicativo.

### O que isso significa

- se a internet oscilar, algumas informacoes podem continuar no aparelho
- depois, o aplicativo envia as pendencias
- limpar o armazenamento local pode remover cache do aparelho
- dados ja sincronizados devem voltar ao entrar novamente

### Cuidado

Antes de limpar dados do navegador ou trocar de aparelho, confirme que as informacoes importantes foram sincronizadas.

---

## Rotina recomendada de uso

## Comeco do dia

1. Entrar no aplicativo.
2. Abrir **Hoje**.
3. Conferir tarefas pendentes.
4. Conferir entregas ou compromissos.
5. Ver se ha cobrancas importantes.

## Durante o atendimento

1. Usar **Inbox** para anotar rapido.
2. Cadastrar ou localizar cliente em **Clientes**.
3. Registrar vendas.
4. Usar WhatsApp pelo app quando precisar cobrar ou confirmar algo.

## Fim do dia

1. Abrir **Fechamento**.
2. Conferir dinheiro, pix, cartao e fiado.
3. Confirmar fechamento.
4. Verificar se ha pendencias para o dia seguinte.

---

## O que fazer se algo parecer errado

### Nao consigo entrar

Verifique:

- email digitado corretamente
- senha digitada corretamente
- internet funcionando

Se continuar, peça para verificar se o usuario esta ativo no Supabase.

### Entrei, mas os dados nao aparecem

Pode ser:

- internet oscilando
- dados ainda nao sincronizados
- usuario sem vinculo com a loja

### WhatsApp nao abriu

Verifique:

- telefone da cliente
- DDD correto
- WhatsApp instalado no aparelho

### Valor do fechamento parece errado

Confira:

- se todas as vendas foram registradas
- se a forma de pagamento esta correta
- se houve venda fiada ou pagamento parcial

---

## Regras importantes

- O AgendaEC nao envia WhatsApp automaticamente.
- A dona sempre revisa a mensagem antes de enviar.
- Usuarios sao cadastrados manualmente.
- Nao existe auto-cadastro publico.
- Registros financeiros nao devem ser apagados sem cuidado.
- O aplicativo foi feito para uso interno da loja.

---

## Resumo simples

Use assim:

```text
Hoje -> ver o dia
Inbox -> anotar rapido
Clientes -> consultar cliente e saldo
Cobrancas -> cobrar quem deve
Estoque -> acompanhar produtos
Fechamento -> conferir o caixa
Relatorios -> ver resultado do periodo
Configuracoes -> ajustar templates e sincronizacao
```

Se tiver duvida, comece sempre pela tela **Hoje**.
