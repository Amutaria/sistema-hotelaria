# Definição do Problema

## Sistema de Gestão Hoteleira

> **Documento de Levantamento de Problemas a Ser Analisados e Eventuais Impactos e Riscos ao Negócio**
>
> **Preparado para:** Projeto Hotel Rio Madeira
> **Data:** agosto de 2026

---

## Sumário

1. [Introdução](#1-introdução)
2. [Objetivo do Documento](#2-objetivo-do-documento)
3. [Contexto do Cliente](#3-contexto-do-cliente)
4. [Descrição Detalhada dos Problemas](#4-descrição-detalhada-dos-problemas)
   - [4.1 Agendamento Manual](#problema-1--agendamento-manual)
   - [4.2 Demora no Atendimento](#problema-2--demora-no-atendimento)
   - [4.3 Duplicidade de Agendamento](#problema-3--duplicidade-de-agendamento)
   - [4.4 Check-in e Check-out sem Controle Efetivo](#problema-4--check-in-e-check-out-sem-controle-efetivo)
   - [4.5 Perda de Documentos](#problema-5--perda-de-documentos)
   - [4.6 Controle Financeiro Frágil](#problema-6--controle-financeiro-frágil)
   - [4.7 Falta de Relatórios Gerenciais](#problema-7--falta-de-relatórios-gerenciais)
   - [4.8 Segurança de Dados dos Clientes](#problema-8--segurança-de-dados-dos-clientes)
5. [Síntese dos Impactos](#5-síntese-dos-impactos)
6. [Considerações Finais](#6-considerações-finais)

---

## 1. Introdução

Este documento tem como finalidade registrar, de forma estruturada e detalhada, os problemas operacionais identificados na rotina administrativa do hotel, a partir do relato apresentado pela equipe do cliente. A definição clara do problema é a etapa inicial e fundamental do desenvolvimento de qualquer sistema, pois estabelece a base sobre a qual serão construídos os requisitos funcionais, as prioridades de implementação e os critérios de sucesso da solução a ser desenvolvida.

Cada problema relatado foi analisado individualmente, considerando sua descrição, as prováveis causas, os impactos gerados na operação do hotel e o nível de risco associado à sua não resolução. Essa análise permitirá que, nas próximas etapas do projeto, sejam definidos requisitos de software capazes de endereçar cada uma dessas questões de forma objetiva.

## 2. Objetivo do Documento

Apresentar de forma clara e organizada os problemas enfrentados atualmente pelo hotel em sua operação diária, de modo a alinhar o entendimento entre a equipe de desenvolvimento e o cliente antes do início da fase de especificação de requisitos e do desenho da solução tecnológica.

## 3. Contexto do Cliente

O hotel realiza atualmente a maior parte de sua gestão operacional — reservas, controle de hóspedes, check-in, check-out e controle financeiro — de forma manual ou com o apoio de ferramentas isoladas e não integradas (como planilhas, cadernos de registro e anotações físicas). Essa forma de trabalho, embora funcional em pequena escala, tem se mostrado insuficiente diante do volume de hóspedes e da necessidade de agilidade, segurança e confiabilidade nas informações, gerando os problemas descritos a seguir.

## 4. Descrição Detalhada dos Problemas

Nesta seção, cada problema relatado pelo cliente é detalhado individualmente, contemplando sua descrição, causas prováveis, impactos no negócio e o nível de risco que representa para a operação do hotel.

### Problema 1 — Agendamento Manual

**Descrição:** As reservas de quartos são registradas manualmente, por meio de planilhas, cadernos ou anotações avulsas, sem um sistema centralizado que padronize e valide as informações no momento do cadastro.

**Causas prováveis:**

- Ausência de um sistema informatizado de reservas.
- Dependência de processos manuais e da memória dos atendentes.
- Falta de um canal único de registro de reservas (telefone, e-mail, presencial etc. tratados separadamente).

**Impactos no negócio:**

- Maior tempo gasto no registro de cada reserva.
- Maior probabilidade de erros de digitação ou de interpretação.
- Dificuldade de consultar rapidamente a disponibilidade de quartos.
- Retrabalho para conciliar informações vindas de fontes diferentes.

**Nível de risco:** `Alto` — impacta diretamente a experiência do hóspede e a eficiência operacional desde o primeiro contato com o hotel.

### Problema 2 — Demora no Atendimento

**Descrição:** O tempo necessário para atender solicitações de reserva, check-in, check-out e outras demandas dos hóspedes é maior do que o desejável, gerando filas e insatisfação.

**Causas prováveis:**

- Processos manuais que exigem múltiplas consultas e preenchimentos.
- Falta de automação nas tarefas repetitivas.
- Ausência de um sistema que centralize as informações do hóspede e da reserva em um único local de consulta.

**Impactos no negócio:**

- Redução da satisfação do hóspede.
- Sobrecarga da equipe de atendimento em horários de pico.
- Percepção de desorganização e falta de profissionalismo por parte dos clientes.
- Possível impacto negativo em avaliações do hotel.

**Nível de risco:** `Alto` — afeta diretamente a experiência do cliente e a reputação do estabelecimento.

### Problema 3 — Duplicidade de Agendamento

**Descrição:** Ocorrem casos em que um mesmo quarto é reservado para mais de um hóspede no mesmo período, gerando conflitos de disponibilidade (overbooking) que só são percebidos próximo ou no momento do check-in.

**Causas prováveis:**

- Falta de um controle único e em tempo real da disponibilidade de quartos.
- Múltiplos canais de reserva (telefone, presencial, e-mail) sem sincronização entre si.
- Ausência de validação automática no momento do cadastro de uma nova reserva.

**Impactos no negócio:**

- Necessidade de realocar ou cancelar reservas de última hora.
- Insatisfação e perda de confiança do hóspede.
- Possíveis custos com reembolsos, hospedagem em outros estabelecimentos ou compensações.
- Desgaste da imagem do hotel.

**Nível de risco:** `Crítico` — gera impacto direto na experiência do hóspede e pode resultar em prejuízo financeiro e reputacional.

### Problema 4 — Check-in e Check-out sem Controle Efetivo

**Descrição:** Não há um processo padronizado e centralizado para registrar a entrada e a saída dos hóspedes, dificultando saber, a qualquer momento, quais quartos estão ocupados, livres, em manutenção ou aguardando limpeza.

**Causas prováveis:**

- Ausência de um sistema de status de quartos em tempo real.
- Registros de check-in/check-out feitos em papel ou planilhas desatualizadas.
- Falta de comunicação padronizada entre a recepção e a equipe de governança/limpeza.

**Impactos no negócio:**

- Atrasos na disponibilização de quartos para novos hóspedes.
- Risco de alocar um hóspede em um quarto ainda ocupado ou não higienizado.
- Dificuldade de rastrear o histórico de estadia de cada hóspede.
- Retrabalho operacional entre os setores.

**Nível de risco:** `Alto` — compromete diretamente a organização da operação diária do hotel.

### Problema 5 — Perda de Documentos

**Descrição:** Documentos físicos relacionados a hóspedes e reservas (fichas de cadastro, comprovantes, contratos, documentos de identificação) são extraviados, danificados ou de difícil localização quando necessários.

**Causas prováveis:**

- Armazenamento exclusivamente físico de documentos, sem cópia digital de backup.
- Ausência de um local centralizado e padronizado de arquivamento.
- Manuseio manual sujeito a extravio, dano ou descarte indevido.

**Impactos no negócio:**

- Dificuldade em comprovar informações de hospedagens anteriores.
- Problemas em auditorias internas ou fiscalizações externas.
- Risco de descumprimento de obrigações legais e contratuais.
- Retrabalho para solicitar documentos novamente ao hóspede.

**Nível de risco:** `Alto` — envolve riscos legais, operacionais e de relacionamento com o cliente.

### Problema 6 — Controle Financeiro Frágil

**Descrição:** Há dificuldade para fechar o caixa diário com precisão e para auditar corretamente os consumos extras dos hóspedes, como os itens retirados do frigobar, gerando divergências entre o valor cobrado e o valor efetivamente consumido.

**Causas prováveis:**

- Registro manual e não integrado de consumos extras.
- Ausência de um sistema que vincule automaticamente o consumo à conta do hóspede.
- Falta de conferência padronizada dos frigobares e demais itens de consumo durante a estadia.

**Impactos no negócio:**

- Perdas financeiras por consumos não cobrados.
- Tempo excessivo gasto no fechamento de caixa.
- Dificuldade de identificar inconsistências ou fraudes.
- Ausência de rastreabilidade dos valores movimentados.

**Nível de risco:** `Crítico` — impacta diretamente a saúde financeira e a governança do hotel.

### Problema 7 — Falta de Relatórios Gerenciais

**Descrição:** A gestão do hotel não dispõe de relatórios claros e confiáveis sobre indicadores essenciais do negócio, como a taxa de ocupação dos quartos e o faturamento em períodos determinados.

**Causas prováveis:**

- Ausência de um sistema que consolide automaticamente os dados operacionais e financeiros.
- Informações dispersas em diferentes planilhas e registros manuais, sem padronização.
- Falta de ferramentas de análise e visualização de dados.

**Impactos no negócio:**

- Dificuldade em tomar decisões estratégicas baseadas em dados (preços, promoções, investimentos).
- Falta de visibilidade sobre o desempenho do negócio ao longo do tempo.
- Dificuldade em identificar sazonalidades, tendências ou oportunidades de melhoria.

**Nível de risco:** `Médio-Alto` — limita a capacidade de planejamento e crescimento do negócio.

### Problema 8 — Segurança de Dados dos Clientes

**Descrição:** As informações pessoais dos hóspedes (dados cadastrais, documentos de identificação, dados de pagamento, entre outros) estão expostas a riscos de roubo, extravio ou acesso indevido, por não haver controles de segurança adequados.

**Causas prováveis:**

- Armazenamento de dados sensíveis em meios físicos ou planilhas sem proteção.
- Ausência de controle de acesso às informações dos hóspedes.
- Falta de políticas e mecanismos de segurança da informação, backup e conformidade com a legislação de proteção de dados (como a LGPD).

**Impactos no negócio:**

- Risco de vazamento de dados pessoais e sanções legais/administrativas.
- Perda de confiança dos hóspedes em relação ao hotel.
- Possíveis danos à imagem da marca em caso de incidente de segurança divulgado publicamente.

**Nível de risco:** `Crítico` — envolve riscos legais (conformidade com a LGPD), financeiros e reputacionais de alta relevância.

## 5. Síntese dos Impactos

A tabela a seguir consolida, de forma resumida, os problemas identificados e seus respectivos níveis de risco para a operação do hotel, servindo como referência inicial para a priorização das funcionalidades a serem desenvolvidas no sistema.

| Nº | Problema | Nível de Risco |
|:--:|----------|:--------------:|
| 1 | Agendamento manual | **Alto** |
| 2 | Demora no atendimento | **Alto** |
| 3 | Duplicidade de agendamento (overbooking) | **Crítico** |
| 4 | Controle de check-in/check-out bagunçado | **Alto** |
| 5 | Perda de documentos | **Alto** |
| 6 | Controle financeiro frágil (caixa/frigobar) | **Crítico** |
| 7 | Falta de relatórios gerenciais | **Médio-Alto** |
| 8 | Segurança de dados dos clientes | **Crítico** |

## 6. Considerações Finais

Os problemas apresentados neste documento evidenciam a necessidade de um sistema informatizado e integrado de gestão hoteleira, capaz de centralizar as informações de reservas, hóspedes, check-in/check-out, controle financeiro e documentos, além de oferecer relatórios gerenciais e mecanismos adequados de segurança da informação.

A partir da validação deste documento pelo cliente, a equipe de desenvolvimento dará início à etapa seguinte do projeto: o **Levantamento e Especificação de Requisitos**, na qual cada um dos problemas aqui descritos será traduzido em funcionalidades objetivas do sistema.

---

*Documento sujeito a validação e ajustes conforme retorno do cliente.*
