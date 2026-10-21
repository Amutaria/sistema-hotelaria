# Casos de Uso

#UC(Use Case)
## Relação entre requisitos e casos de uso 

### RF01 - Cadastrar clientes 

  - UC01 - Cadastrar Cliente
    
      Ator: Funcionário
      
      Objetivo: Permitir o cadastro de um novo cliente no sistema.
      
      Pré-condições:
       O usuário deve estar autenticado no sistema.
      
      Fluxo Principal:
      
      1 - O funcionário acessa a opção de cadastro de clientes.
    
      2 - O sistema apresenta o formulário de cadastro.
    
      3 - O funcionário informa o nome completo, CPF, telefone, e-mail e endereço do cliente.
    
      4 - O sistema valida os dados informados.
    
      5 - O sistema verifica se o CPF já está cadastrado.
    
      6 - Não havendo cadastro com o CPF informado, o sistema registra o novo cliente.
    
      7 - O sistema informa que o cadastro foi realizado com sucesso.
      
      Fluxos Alternativos:
      
      FA01 Caso algum dado obrigatório não seja informado, o sistema solicita o preenchimento do campo.
    
      FA02 Caso algum dado informado seja inválido, o sistema informa o erro e solicita a correção.
    
      FA03 Caso o CPF já esteja cadastrado, o sistema informa que o cliente já possui cadastro e não realiza um novo registro.
    
      
      Regra de Negócio relacionada:
      
      RN01 - O cadastro deve conter nome completo, CPF, telefone, e-mail e endereço.

  - UC02 - Consultar Cliente
  - UC03 - Alterar Cliente
  - UC04 - Excluir Cliente

### RF02 - Cadastrar quartos 

  - UC05 - Cadastrar Quartos
      Ator: Funcionário
      
      Objetivo: Permitir o cadastro de um novo quarto no sistema.
      
      Pré-condições: O usuário deve estar autenticado no sistema.
      
      Fluxo Principal:
      
      1 - O funcionário acessa a opção de cadastro de quartos.
    
      2 - O sistema apresenta o formulário de cadastro.
    
      3 - O funcionário informa o número, tipo e valor da diária do quarto.
    
      4 - O sistema valida os dados informados.
    
      5 - O sistema verifica se o número do quarto já está cadastrado.
    
      6 - Não havendo cadastro com o número informado, o sistema registra o novo quarto.
    
      7 - O sistema informa que o cadastro foi realizado com sucesso.
      
      Fluxos Alternativos:
    
      FA01 Caso algum dado obrigatório não seja informado, o sistema solicita o preenchimento do campo.
    
      FA02 Caso algum dado informado seja inválido, o sistema informa o erro e solicita a correção.
    
      FA03 Caso o número do quarto já esteja cadastrado, o sistema informa que o quarto já possui cadastro e não realiza um novo registro.
      
      Regra de Negócio relacionada:
      
      RN02 - Apenas o administrador pode realizar alterações nos quartos.
    
      RN03 - O quarto deve possuir um tipo (individual, duplo, triplo ou suíte) e um valor de diária.
    
      RN04 - O quarto deve possuir um status (disponível, reservado, ocupado ou em manutenção).

### RF03 - Consultar disponibilidade

  - UC06 - Consultar Disponibilidade
      Ator: Cliente

      Objetivo: Permitir que o cliente consulte os quartos disponíveis para um determinado período de hospedagem.
      
      Pré-condições:
      
      O sistema deve estar disponível.
      O cliente deve informar a data de entrada e a data de saída.
      
      Fluxo principal:
      
      1 - O cliente acessa a opção de consultar disponibilidade.
    
      2 - O sistema solicita a data de entrada e a data de saída.
    
      3 - O cliente informa o período desejado.
    
      4 - O sistema verifica os quartos cadastrados.
    
      5 - O sistema verifica se existem reservas para o período informado.
    
      6 - O sistema verifica se os quartos estão em manutenção.
    
      7 - O sistema apresenta os quartos disponíveis para o período.
      
      Fluxos alternativos:
      
      FA01 – Datas inválidas: Caso a data de saída seja anterior ou igual à data de entrada, o sistema informa que o período é inválido e solicita novas datas.
    
      FA02 – Nenhum quarto disponível: Caso não existam quartos disponíveis para o período informado, o sistema informa que não há quartos disponíveis.
    
      FA03 – Quarto em manutenção: Quartos com status "Em manutenção" não devem ser apresentados como disponíveis.
      
      Regras de negócio relacionadas:
      
      RN06: A disponibilidade do quarto depende da ausência de outra reserva no período informado e de o quarto não estar em manutenção.
    
      RN07: O mesmo quarto não pode possuir reservas com períodos de hospedagem iguais.
    
      RN09: A data de saída deve ser posterior à data de entrada.
    
### RF04 - Realizar reserva

  - UC07 - Realizar Reserva
      Ator: Cliente

      Objetivo: Permitir que o cliente realize uma reserva de quarto para um determinado período de hospedagem.
      
      Pré-condições:
      
      O cliente deve estar cadastrado no sistema.
      Deve existir um quarto disponível para o período desejado.
      O sistema deve estar disponível.
      
      Fluxo principal:
      
      1 - O cliente acessa a opção de realizar reserva.
    
      2 - O sistema solicita o período de hospedagem.
    
      3 - O cliente informa a data de entrada e a data de saída.
    
      4 - O sistema verifica a disponibilidade dos quartos.
    
      5 - O cliente seleciona um quarto disponível.
    
      6 - O sistema apresenta os dados da reserva para confirmação.
    
      7 - O cliente confirma a reserva.
    
      8 - O sistema registra a reserva.
    
      9 - O sistema informa que a reserva foi realizada com sucesso.
      
      Fluxos alternativos:
      
      FA01 – Cliente não cadastrado: Caso o cliente não esteja cadastrado, o sistema informa que é necessário realizar o cadastro antes de efetuar a reserva.
    
      FA02 – Quarto indisponível: Caso o quarto selecionado não esteja mais disponível, o sistema informa a indisponibilidade e solicita que o cliente selecione outro quarto.
    
      FA03 – Período inválido: Caso a data de saída seja anterior ou igual à data de entrada, o sistema informa que o período é inválido e solicita novas datas.
    
      FA04 – Cancelamento da confirmação: Caso o cliente não confirme a reserva, o sistema não registra a reserva.
      
      Regras de negócio relacionadas:
      
      RN06: A reserva só pode ser realizada para quartos disponíveis no período informado.
    
      RN07: O mesmo quarto não pode possuir reservas com períodos de hospedagem iguais.
    
      RN08: Para realizar uma reserva, é necessário possuir um cliente cadastrado e informar as datas de entrada e saída.
    
      RN09: A data de saída deve ser posterior à data de entrada.

### RF05 - Calcular hospedagem 

  - UC08 - Calcular Hospedagem

### RF06 - Realizar pagamento

  - UC09 - Realizar pagamento

### RF07 - Emitir comprovante 

  - UC10 - Emitir Comprovante

### RF08 - Gerenciar reservas

  - UC11 - Alterar Reserva
  - UC12 - Cancelar Reserva

### RF09 - Realizar check-in e check-out

  - UC13 - Realizar Check-in
  - UC14 - Realizar Check-out

### RF10 - Gerar relatórios 

  - UC15 - Gerar Relatórios 

  
