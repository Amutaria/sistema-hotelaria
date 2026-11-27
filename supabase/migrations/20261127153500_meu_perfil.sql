-- Campos pessoais do perfil
ALTER TABLE public.perfis
ADD COLUMN IF NOT EXISTS nome_completo text,
ADD COLUMN IF NOT EXISTS cpf text,
ADD COLUMN IF NOT EXISTS telefone text,
ADD COLUMN IF NOT EXISTS endereco text,
ADD COLUMN IF NOT EXISTS cep text;

-- Permitir que o usuário atualize somente o próprio perfil
DROP POLICY IF EXISTS "Usuário atualiza o próprio perfil"
ON public.perfis;

CREATE POLICY "Usuário atualiza o próprio perfil"
ON public.perfis
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Impedir que usuários alterem o próprio nível de acesso
REVOKE UPDATE ON TABLE public.perfis FROM authenticated;

GRANT UPDATE (
  nome_completo,
  cpf,
  telefone,
  endereco,
  cep
)
ON TABLE public.perfis
TO authenticated;
