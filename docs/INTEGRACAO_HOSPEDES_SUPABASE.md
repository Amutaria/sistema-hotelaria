# Integração do módulo de hóspedes com Supabase

## 1. Configuração local

Na raiz do projeto, crie um arquivo `.env.local` com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://cbzyxfmtsbxvyklwbtot.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_chave_sb_publishable
```

A chave Publishable fica no painel Supabase em **Project Settings → API Keys** (ou no diálogo **Connect**). Não use a Secret/service_role key no navegador e não faça commit do arquivo `.env.local`.

## 2. Preparar o banco

Abra o SQL Editor do projeto `sistema-hotelaria` e execute o conteúdo de `supabase/sql/seguranca_hospedes.sql`. O script ajusta o campo `estado` para aceitar siglas de dois caracteres, configura exclusão em cascata dos acompanhantes e substitui políticas públicas permissivas por políticas limitadas a usuários autenticados.

**Atenção ao modelo de autorização:** as políticas propostas permitem que qualquer conta autenticada do Supabase Auth consulte e altere todos os hóspedes. Isso é apropriado apenas para uma equipe interna em que todos os funcionários têm o mesmo nível de acesso. Para produção com permissões por função, funcionário ou unidade, será necessário criar perfis e políticas de propriedade/escopo antes de usar dados reais.

## 3. Criar um usuário de teste

No painel Supabase, abra **Authentication → Users → Add user** e crie um usuário com e-mail e senha. O formulário de login agora usa e-mail e senha do Supabase Auth; ele não cria contas automaticamente.

## 4. Instalar e executar

A integração usa chamadas HTTP nativas ao Supabase, então não exige instalar pacotes adicionais.

```bash
npm install
npm run dev
```

Abra http://localhost:3000, entre com o usuário criado e acesse **Hóspedes → Novo Cadastro**.

## 5. Testes manuais

1. Cadastre um hóspede com nome, CPF, e-mail e telefone.
2. Inclua dois acompanhantes e salve.
3. Confira em **Supabase → Table Editor → hospedes** se existe o hóspede.
4. Confira em **acompanhantes** se os dois registros estão ligados pelo campo `hospede_id`.
5. Atualize a página do navegador: o hóspede deve continuar na listagem.
6. Pesquise por nome, CPF e e-mail.
7. Edite o hóspede e seus acompanhantes; salve e confirme as mudanças no banco.
8. Exclua o hóspede de teste e confirme que seus acompanhantes também foram excluídos.

## 6. Limitações conhecidas do modelo atual

- O login administrativo antigo era apenas uma navegação visual; agora autentica com Supabase Auth.
- A listagem não inventa mais hóspedes de demonstração. Check-in, check-out, quarto e status não são colunas da tabela `hospedes`, então não são persistidos por este módulo.
- A API exige um access token válido. Sem login, as rotas respondem HTTP 401.
- A edição substitui a lista de acompanhantes em chamadas separadas; se a gravação dos acompanhantes falhar depois da atualização do hóspede, confira os dados antes de repetir a operação.
- Antes de publicar em produção, configure URLs de redirecionamento, política de senha, proteção contra abuso e um modelo de autorização por perfil/unidade.
