-- Execute manualmente no SQL Editor do Supabase após revisar o modelo de acesso.
-- Este modelo permite CRUD a qualquer usuário autenticado do Supabase Auth.
-- Não habilite cadastro público de contas: crie os usuários da equipe pelo painel Auth.
-- Se o hotel precisar de permissões por funcionário/unidade, será necessário adicionar
-- uma tabela de perfis e políticas por usuário antes de colocar em produção.

begin;

alter table public.hospedes
  alter column estado type varchar(2)
  using nullif(trim(estado), '');

alter table public.acompanhantes
  drop constraint if exists fk_acompanhantes_hospedes;

alter table public.acompanhantes
  add constraint fk_acompanhantes_hospedes
  foreign key (hospede_id) references public.hospedes(id)
  on delete cascade;

alter table public.hospedes enable row level security;
alter table public.acompanhantes enable row level security;

-- Remove políticas antigas permissivas para PUBLIC e políticas autenticadas duplicadas.
drop policy if exists hospedes_all on public.hospedes;
drop policy if exists hospedes_all_dev on public.hospedes;
drop policy if exists authenticated_hospedes on public.hospedes;
drop policy if exists "Acesso de usuarios autenticados aos hospedes" on public.hospedes;

drop policy if exists acompanhantes_all on public.acompanhantes;
drop policy if exists acompanhantes_all_dev on public.acompanhantes;
drop policy if exists authenticated_acompanhantes on public.acompanhantes;
drop policy if exists "Acesso de usuarios autenticados aos acompanhantes" on public.acompanhantes;

create policy "equipe_autenticada_hospedes"
  on public.hospedes
  for all
  to authenticated
  using (true)
  with check (true);

create policy "equipe_autenticada_acompanhantes"
  on public.acompanhantes
  for all
  to authenticated
  using (true)
  with check (true);

commit;
