**HISTÓRIAS DE USUÁRIO**

**Sistema de Gestão Hoteleira**

*O que cada um do hotel falou sobre o problema — e o que gostaria que o sistema fizesse*

Preparado para: [Nome do Hotel / Cliente]

Data: agosto de 2026

# **1. Como este documento foi montado**

Depois de levantar os problemas no documento Definição do Problema, conversamos com quem vive a rotina do hotel todo dia: camareiras, recepcionistas, hóspedes que voltam sempre, o fornecedor que entrega as bebidas, a gerente e o proprietário. O que está aqui é o que essas pessoas relataram, com as próprias palavras, e o que cada uma imagina que resolveria a situação.

As falas foram organizadas no formato de história de usuário para orientar a construção do sistema. Os nomes usados representam os perfis de usuário identificados e servem para deixar claro de quem é cada necessidade.

# **2. Quem conversou com a gente**

- Marlene Souza e Joana Ribeiro — camareiras.

- Carlos Andrade e Patrícia Nogueira — recepcionistas (dia e noite).

- Ricardo Menezes, Fernanda Lima e Antônio Barbosa — hóspedes.

- Márcio Tavares — fornecedor de bebidas e itens de frigobar.

- Cláudia Ferreira — gerente do hotel.

- Jorge Almeida — proprietário.

# **3. As histórias**

## **3.1 As camareiras**

**HU-01 — Saber quais quartos já podem ser limpos**

**Quem falou:** Marlene Souza, camareira (turno do dia)

**A reclamação:**

> *“Eu subo e desço direto pra perguntar na recepção se o hóspede do 204 já foi embora. Às vezes bato na porta e o hóspede ainda está lá, fico numa saia justa danada. Já aconteceu de eu limpar um quarto que nem tinha sido usado e deixar outro pra depois, aí chegou hóspede e o quarto não estava pronto.”*

**O que sugeriu:**

A Marlene disse que resolveria se ela pudesse olhar numa tela, ou até no celular, uma lista dos quartos com uma cor pra cada situação: quem já saiu, quem ainda está hospedado, quem está em obra.

**Virando história:** *Como camareira, eu quero ver numa lista atualizada quais quartos já estão liberados pra limpeza, para não precisar ficar perguntando na recepção nem bater na porta de hóspede que ainda não saiu.*

**Pra dar por resolvido, o sistema precisa:**

- Mostrar todos os quartos com a situação de cada um: ocupado, livre, aguardando limpeza, em limpeza ou em manutenção.

- Quando a recepção fizer o check-out, o quarto aparece na lista da camareira na hora.

- A camareira consegue marcar “estou limpando” e depois “pronto”.

- A recepção enxerga essa mudança na mesma hora, sem precisar de telefonema.

**Problema de origem:** Problema 4 — Check-in e check-out sem controle efetivo

**Prioridade:** Alta

**HU-02 — Anotar o frigobar na hora, sem papelzinho**

**Quem falou:** Joana Ribeiro, camareira (turno da noite)

**A reclamação:**

> *“Eu anoto o que faltou no frigobar num papel e depois entrego na recepção. Só que às vezes o papel se perde, ou eu escrevo ‘2 refri’ e ninguém sabe se era lata ou garrafa. Quando o hóspede já foi embora, não tem mais o que fazer, o hotel perde.”*

**O que sugeriu:**

A Joana comentou que seria mais fácil se, ali mesmo no quarto, ela já marcasse os itens numa lista pronta e aquilo caísse direto na conta do hóspede.

**Virando história:** *Como camareira, eu quero registrar o que o hóspede consumiu do frigobar no momento em que confiro o quarto, para o valor cair direto na conta dele e não se perder até o check-out.*

**Pra dar por resolvido, o sistema precisa:**

- Lista dos itens do frigobar já cadastrada, com o preço de cada um.

- A camareira só escolhe o item e a quantidade e confirma.

- O consumo vai automaticamente para a conta do hóspede daquele quarto.

- Fica gravado quem lançou, em que dia e a que horas.

- Se lançar errado, só o supervisor pode cancelar o lançamento.

**Problema de origem:** Problema 6 — Controle financeiro frágil

**Prioridade:** Alta

## **3.2 A recepção**

**HU-03 — Não vender o mesmo quarto duas vezes**

**Quem falou:** Carlos Andrade, recepcionista (turno do dia)

**A reclamação:**

> *“Na semana passada chegou um casal com reserva pro 105 e o quarto já estava com outro hóspede. A reserva do casal tinha sido feita por telefone e anotada no caderno, e a outra veio por e-mail e foi pra planilha. Tive que arrumar quarto pra eles em outro hotel e o cliente saiu furioso.”*

**O que sugeriu:**

O Carlos disse que o problema é ter três lugares diferentes pra anotar reserva. Pra ele, tinha que ser um lugar só, e o sistema não deixar nem salvar se o quarto já estivesse ocupado naquelas datas.

**Virando história:** *Como recepcionista, eu quero cadastrar as reservas num lugar só, com o sistema conferindo se o quarto está livre, para nunca mais vender o mesmo quarto para duas pessoas.*

**Pra dar por resolvido, o sistema precisa:**

- O sistema não deixa salvar reserva de quarto já ocupado no mesmo período.

- Reserva feita por telefone, e-mail ou no balcão vai toda para a mesma base.

- Ao escolher as datas, aparecem só os quartos que estão realmente livres.

- Cada reserva ganha um código pra ser localizada depois.

- Nome, contato, documento e período são obrigatórios pra fechar a reserva.

**Problema de origem:** Problema 1 — Agendamento manual; Problema 3 — Duplicidade de agendamento

**Prioridade:** Crítica

**HU-04 — Fazer check-in sem formar fila no balcão**

**Quem falou:** Patrícia Nogueira, recepcionista (turno da noite)

**A reclamação:**

> *“Quando chega ônibus de excursão é um sufoco. Cada hóspede leva uns dez minutos porque tenho que preencher a ficha na mão, copiar o documento e procurar a reserva no caderno. A fila dá a volta no saguão e o pessoal começa a reclamar alto.”*

**O que sugeriu:**

A Patrícia sugeriu que, se a reserva já estivesse no sistema com os dados do hóspede, ela só confirmaria e entregaria a chave. E que o quarto mudasse de situação sozinho, sem ela ter que avisar ninguém.

**Virando história:** *Como recepcionista, eu quero fazer check-in e check-out puxando os dados que já estão na reserva, para atender mais rápido e não deixar fila no balcão.*

**Pra dar por resolvido, o sistema precisa:**

- Localizar a reserva pelo nome, documento ou código.

- Os dados do hóspede já vêm preenchidos, sem redigitar nada.

- Ao fazer o check-in, o quarto muda para “ocupado” sozinho.

- No check-out, aparece a conta fechada com diárias e consumos.

- Depois do check-out, o quarto entra na lista de limpeza automaticamente.

**Problema de origem:** Problema 2 — Demora no atendimento; Problema 4 — Check-in e check-out sem controle efetivo

**Prioridade:** Alta

## **3.3 Os hóspedes**

**HU-05 — Reservar e ter certeza de que o quarto é meu**

**Quem falou:** Ricardo Menezes, hóspede (representante comercial, se hospeda quase todo mês)

**A reclamação:**

> *“Eu ligo, o atendente diz que anotou, e eu fico o mês inteiro sem nada por escrito. Duas vezes cheguei e a reserva não existia. Agora eu ligo de novo na véspera só pra confirmar, o que é perda de tempo pra mim e pra eles.”*

**O que sugeriu:**

O Ricardo disse que bastava poder olhar as datas disponíveis e fechar a reserva ele mesmo, recebendo uma confirmação com um número, algo que ele pudesse mostrar na chegada.

**Virando história:** *Como hóspede, eu quero ver os quartos disponíveis e fechar minha reserva recebendo uma confirmação, para chegar no hotel com a certeza de que tenho onde dormir.*

**Pra dar por resolvido, o sistema precisa:**

- O hóspede informa data de entrada, data de saída e quantidade de pessoas.

- Aparecem só as acomodações livres, com o valor da diária.

- Ao concluir, ele recebe a confirmação com o código da reserva.

- A reserva confirmada trava o quarto para aquele período na mesma hora.

**Problema de origem:** Problema 1 — Agendamento manual; Problema 3 — Duplicidade de agendamento

**Prioridade:** Alta

**HU-06 — Mandar os documentos antes e não preencher ficha de novo**

**Quem falou:** Fernanda Lima, hóspede (viaja a trabalho)

**A reclamação:**

> *“É a quarta vez que me hospedo aqui e toda vez preencho a mesma ficha à mão e entrego meu RG no balcão. Uma vez pedi uma segunda via do comprovante da hospedagem pra prestação de contas da empresa e demoraram dois dias pra achar o papel, disseram que tinha sumido do arquivo.”*

**O que sugeriu:**

A Fernanda achou que resolveria se ela pudesse mandar os documentos pelo celular antes de viajar e o hotel guardasse o cadastro dela pras próximas vezes.

**Virando história:** *Como hóspede, eu quero enviar meus dados e documentos antes de chegar, para não preencher ficha de papel toda vez nem correr o risco de meus documentos se perderem.*

**Pra dar por resolvido, o sistema precisa:**

- O hóspede anexa a cópia do documento à reserva dele.

- Os documentos ficam guardados de forma segura, ligados ao cadastro.

- Nas próximas hospedagens o cadastro é reaproveitado, só confirmando os dados.

- O recepcionista vê os documentos na tela no momento do check-in.

**Problema de origem:** Problema 5 — Perda de documentos; Problema 2 — Demora no atendimento

**Prioridade:** Média-Alta

**HU-07 — Conferir a conta antes da hora de pagar**

**Quem falou:** Antônio Barbosa, hóspede (viaja com a família nas férias)

**A reclamação:**

> *“No check-out me cobraram quatro águas e duas cervejas. Cerveja ninguém tomou, éramos eu, minha esposa e as crianças. Discuti uns quinze minutos no balcão, não tinha como provar nada de lado nenhum. No fim tiraram, mas saí com a impressão ruim.”*

**O que sugeriu:**

O Seu Antônio disse que gostaria de poder olhar a conta durante a estadia, e não só na hora de ir embora, pra resolver qualquer engano no mesmo dia.

**Virando história:** *Como hóspede, eu quero acompanhar minha conta durante a estadia, para conferir o que está sendo cobrado e resolver qualquer engano antes do check-out.*

**Pra dar por resolvido, o sistema precisa:**

- A conta mostra diárias e consumos com data, item e valor.

- O total é atualizado a cada novo lançamento.

- O hóspede pode questionar um lançamento na recepção, que registra a contestação.

- No check-out dá pra receber a conta em formato digital.

**Problema de origem:** Problema 6 — Controle financeiro frágil

**Prioridade:** Média-Alta

## **3.4 O fornecedor**

**HU-08 — Saber o que entregar antes de sair com o caminhão**

**Quem falou:** Márcio Tavares, fornecedor (distribuidora de bebidas e itens de frigobar)

**A reclamação:**

> *“Eu entrego aqui toda quinta. Só que o pedido vem por WhatsApp, às vezes de madrugada, às vezes ninguém manda e eu chego com o caminhão sem saber quanto deixar. Já voltei com mercadoria e já faltou refrigerante no hotel na mesma semana.”*

**O que sugeriu:**

O Márcio falou que preferia receber o pedido pronto, com item e quantidade, e poder registrar a entrega na hora, com o hotel dando baixa no estoque na mesma hora.

**Virando história:** *Como fornecedor, eu quero receber o pedido de reposição já fechado pelo hotel e registrar a entrega, para levar a quantidade certa e não depender de conferência no papel.*

**Pra dar por resolvido, o sistema precisa:**

- O sistema monta o pedido com base no consumo registrado e no estoque mínimo.

- O fornecedor acessa o pedido com os itens, as quantidades e o prazo.

- A entrega é registrada e o estoque é atualizado na hora.

- Fica o histórico de pedidos e entregas para conferência depois.

**Problema de origem:** Problema 6 — Controle financeiro frágil; Problema 7 — Falta de relatórios gerenciais

**Prioridade:** Média

## **3.5 A gerente e o proprietário**

**HU-09 — Saber como o hotel está indo sem passar a noite na planilha**

**Quem falou:** Cláudia Ferreira, gerente do hotel

**A reclamação:**

> *“Quando o proprietário me pergunta como foi o mês, eu passo dois dias juntando caderno, planilha e comprovante pra chegar num número que nem sei se está certo. Ano passado a gente contratou gente demais em abril porque achava que ia lotar, e não lotou. Foi puro chute.”*

**O que sugeriu:**

A Cláudia disse que queria abrir uma tela e ver ocupação e faturamento do período que ela escolhesse, e conseguir comparar com o mesmo mês do ano passado.

**Virando história:** *Como gerente, eu quero ver relatórios de ocupação e faturamento por período, para decidir preço, promoção e escala de equipe olhando número, e não achismo.*

**Pra dar por resolvido, o sistema precisa:**

- Escolher o período: dia, semana, mês ou um intervalo qualquer.

- Ver taxa de ocupação, faturamento total e média por hóspede.

- Exportar o relatório em planilha ou PDF pra levar pra reunião.

- Os números saem sozinhos das reservas e dos lançamentos, sem digitação.

- Dá pra comparar com períodos anteriores.

**Problema de origem:** Problema 7 — Falta de relatórios gerenciais

**Prioridade:** Média-Alta

**HU-10 — Dormir tranquilo com os dados dos hóspedes**

**Quem falou:** Jorge Almeida, proprietário do hotel

**A reclamação:**

> *“Hoje qualquer funcionário abre a gaveta e vê cópia de documento, dado de cartão, endereço de hóspede. Já teve ficha aparecendo em cima do balcão à vista de todo mundo. Se vazar alguma coisa, o problema é meu, e ainda tem essa história de LGPD que meu contador vive falando.”*

**O que sugeriu:**

O Seu Jorge disse que quer cada funcionário vendo só o que precisa pro trabalho dele, com senha própria, e que dê pra saber depois quem olhou o quê.

**Virando história:** *Como proprietário, eu quero que cada funcionário acesse só as informações necessárias ao trabalho dele, com registro de quem consultou o quê, para proteger os dados dos hóspedes e ficar em dia com a LGPD.*

**Pra dar por resolvido, o sistema precisa:**

- Perfis de acesso separados: camareira, recepção, gerência e proprietário.

- Cada perfil enxerga só o que precisa pra função.

- Login e senha individuais, sem conta compartilhada.

- Toda consulta ou alteração em dado sensível fica registrada com usuário, data e hora.

- Backup automático e periódico da base de dados.

**Problema de origem:** Problema 8 — Segurança de dados dos clientes

**Prioridade:** Crítica

# **4. Resumo**

Um apanhado geral das histórias, pra facilitar a hora de decidir o que entra primeiro.

| **Código** | **Quem**             | **O que a pessoa quer**                                     | **Prioridade** |
|------------|----------------------|-------------------------------------------------------------|----------------|
| **HU-01**  | Marlene (camareira)  | Saber quais quartos já podem ser limpos                     | Alta           |
| **HU-02**  | Joana (camareira)    | Anotar o frigobar na hora, sem papelzinho                   | Alta           |
| **HU-03**  | Carlos (recepção)    | Não vender o mesmo quarto duas vezes                        | Crítica        |
| **HU-04**  | Patrícia (recepção)  | Fazer check-in sem formar fila no balcão                    | Alta           |
| **HU-05**  | Ricardo (hóspede)    | Reservar e ter certeza de que o quarto é meu                | Alta           |
| **HU-06**  | Fernanda (hóspede)   | Mandar os documentos antes e não preencher ficha de novo    | Média-Alta     |
| **HU-07**  | Antônio (hóspede)    | Conferir a conta antes da hora de pagar                     | Média-Alta     |
| **HU-08**  | Márcio (fornecedor)  | Saber o que entregar antes de sair com o caminhão           | Média          |
| **HU-09**  | Cláudia (gerente)    | Saber como o hotel está indo sem passar a noite na planilha | Média-Alta     |
| **HU-10**  | Jorge (proprietário) | Dormir tranquilo com os dados dos hóspedes                  | Crítica        |

# **5. Pra fechar**

As dez histórias cobrem os oito problemas levantados anteriormente. Vale passar esse material pelas mesmas pessoas que foram ouvidas antes de partir para o detalhamento técnico — é comum aparecer alguma coisa que ficou de fora quando elas leem o próprio relato no papel.

*Documento sujeito a validação e ajustes conforme retorno do cliente.*
