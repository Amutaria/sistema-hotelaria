-- Complementos de integridade para o módulo de hóspedes.
-- Aplicado ao projeto Supabase conectado; mantenha este arquivo versionado.

begin;

create or replace function public.set_hospede_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function public.set_hospede_updated_at() from public, anon, authenticated;

drop trigger if exists trg_hospedes_updated_at on public.hospedes;
create trigger trg_hospedes_updated_at
before update on public.hospedes
for each row execute function public.set_hospede_updated_at();

create or replace function public.atualizar_hospede_com_acompanhantes(
  p_hospede_id bigint,
  p_hospede jsonb,
  p_acompanhantes jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  v_hospede public.hospedes%rowtype;
  v_acompanhantes jsonb;
begin
  if auth.uid() is null then
    raise exception 'Não autenticado.' using errcode = '42501';
  end if;

  if jsonb_typeof(coalesce(p_acompanhantes, '[]'::jsonb)) <> 'array' then
    raise exception 'A lista de acompanhantes deve ser um array.' using errcode = '22023';
  end if;

  update public.hospedes
  set
    nome = nullif(btrim(p_hospede->>'nome'), ''),
    cpf = nullif(btrim(p_hospede->>'cpf'), ''),
    nascimento = nullif(p_hospede->>'nascimento', '')::date,
    genero = nullif(p_hospede->>'genero', ''),
    nacionalidade = nullif(p_hospede->>'nacionalidade', ''),
    email = nullif(btrim(p_hospede->>'email'), ''),
    telefone = nullif(btrim(p_hospede->>'telefone'), ''),
    documento = nullif(p_hospede->>'documento', ''),
    cep = nullif(p_hospede->>'cep', ''),
    rua = nullif(p_hospede->>'rua', ''),
    numero = nullif(p_hospede->>'numero', ''),
    complemento = nullif(p_hospede->>'complemento', ''),
    bairro = nullif(p_hospede->>'bairro', ''),
    cidade = nullif(p_hospede->>'cidade', ''),
    estado = nullif(upper(btrim(p_hospede->>'estado')), ''),
    observacoes = nullif(p_hospede->>'observacoes', '')
  where id = p_hospede_id
  returning * into v_hospede;

  if not found then
    raise exception 'Hóspede não encontrado ou sem permissão.' using errcode = 'P0002';
  end if;

  delete from public.acompanhantes where hospede_id = p_hospede_id;

  insert into public.acompanhantes (hospede_id, nome, cpf)
  select p_hospede_id, btrim(item.nome), nullif(btrim(item.cpf), '')
  from jsonb_to_recordset(coalesce(p_acompanhantes, '[]'::jsonb))
    as item(nome text, cpf text)
  where nullif(btrim(item.nome), '') is not null;

  select coalesce(jsonb_agg(to_jsonb(a) order by a.id), '[]'::jsonb)
  into v_acompanhantes
  from public.acompanhantes a
  where a.hospede_id = p_hospede_id;

  return to_jsonb(v_hospede) || jsonb_build_object('acompanhantes', v_acompanhantes);
end;
$$;

revoke all on function public.atualizar_hospede_com_acompanhantes(bigint, jsonb, jsonb) from public, anon;
grant execute on function public.atualizar_hospede_com_acompanhantes(bigint, jsonb, jsonb) to authenticated;

-- A função de evento não é uma RPC pública; o trigger de evento continua funcional.
revoke all on function public.rls_auto_enable() from public, anon, authenticated;

commit;
