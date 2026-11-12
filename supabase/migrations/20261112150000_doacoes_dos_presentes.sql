-- Doações da lista de presentes.
-- O convidado avisa que presenteou (fica pendente); os noivos confirmam, agradecem e o card vira "presenteado".
-- Os noivos também podem dar baixa direto, sem aviso. Usa a mesma senha/sessão do mural.

create type public.status_doacao as enum ('pendente', 'confirmado', 'recusado');
create type public.forma_doacao as enum ('pix', 'objeto');

-- Sticker de cada item (um por tipo de presente), mostrado quando ele é presenteado.
alter table public.presentes add column sticker text;

create table public.doacoes (
  id uuid primary key default gen_random_uuid(),
  -- Nulo no Pix de valor livre ("Do seu jeito").
  presente_id uuid references public.presentes (id) on delete set null,
  nome text not null check (char_length(btrim(nome)) between 2 and 60),
  mensagem text check (char_length(mensagem) <= 280),
  anonimo boolean not null default false,
  forma public.forma_doacao not null,
  status public.status_doacao not null default 'pendente',
  origem text not null default 'convidado' check (origem in ('convidado', 'noivos')),
  agradecimento text check (char_length(agradecimento) <= 200),
  -- Quem pediu anonimato não aparece no site; o nome fica só para os noivos.
  nome_publico text generated always as (case when anonimo then null else btrim(nome) end) stored,
  created_at timestamptz not null default now(),
  confirmado_em timestamptz
);

create index doacoes_confirmadas_idx on public.doacoes (presente_id, confirmado_em) where status = 'confirmado';
create index doacoes_status_idx on public.doacoes (status, created_at desc);

alter table public.doacoes enable row level security;

revoke all on public.doacoes from anon, authenticated;
grant insert (presente_id, nome, mensagem, anonimo, forma) on public.doacoes to anon, authenticated;
grant select (id, presente_id, nome_publico, forma, agradecimento, confirmado_em) on public.doacoes to anon, authenticated;

create policy doacao_entra_pendente on public.doacoes
  for insert to anon, authenticated
  with check (
    status = 'pendente' and origem = 'convidado' and agradecimento is null and confirmado_em is null
    and (presente_id is null or exists (select 1 from public.presentes p where p.id = presente_id and p.ativo))
  );

create policy doacoes_confirmadas_visiveis on public.doacoes
  for select to anon, authenticated
  using (status = 'confirmado');

create or replace function public.doacao_antispam()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.doacoes d where d.created_at > now() - interval '10 minutes') >= 30 then
    raise exception 'muitos avisos agora, tente mais tarde' using errcode = 'P0001';
  end if;
  new.nome := btrim(new.nome);
  new.mensagem := nullif(btrim(new.mensagem), '');
  return new;
end;
$$;

create trigger doacoes_antispam
  before insert on public.doacoes
  for each row when (new.origem = 'convidado')
  execute function public.doacao_antispam();

-- O aviso antigo do Pix (sem uso até aqui) foi substituído pela tabela acima.
drop table if exists public.contribuicoes_pix;

-- ---------- Painel dos noivos ----------

create or replace function public.presentes_doacoes_listar(token text, filtro public.status_doacao)
returns table (
  id uuid,
  presente_id uuid,
  presente_nome text,
  presente_tipo text,
  presente_imagem text,
  presente_sticker text,
  presente_valor numeric,
  nome text,
  mensagem text,
  anonimo boolean,
  forma public.forma_doacao,
  status public.status_doacao,
  origem text,
  agradecimento text,
  created_at timestamptz,
  confirmado_em timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.mural_sessao_valida(token) then
    raise exception 'sessão inválida' using errcode = '28000';
  end if;
  return query
    select d.id, d.presente_id, p.nome, p.tipo::text, p.imagem_url, p.sticker, p.valor,
           d.nome, d.mensagem, d.anonimo, d.forma, d.status, d.origem, d.agradecimento, d.created_at, d.confirmado_em
    from public.doacoes d
    left join public.presentes p on p.id = d.presente_id
    where d.status = filtro
    order by case when filtro = 'pendente' then d.created_at end asc,
             coalesce(d.confirmado_em, d.created_at) desc
    limit 500;
end;
$$;

-- Confirma, recusa ou devolve para pendente; também salva o agradecimento.
create or replace function public.presentes_doacao_moderar(
  token text,
  doacao_id uuid,
  novo_status public.status_doacao,
  novo_agradecimento text default null,
  novo_anonimo boolean default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.mural_sessao_valida(token) then
    raise exception 'sessão inválida' using errcode = '28000';
  end if;
  update public.doacoes d
  set status = novo_status,
      agradecimento = nullif(btrim(novo_agradecimento), ''),
      anonimo = coalesce(novo_anonimo, d.anonimo),
      confirmado_em = case when novo_status = 'confirmado' then coalesce(d.confirmado_em, now()) else null end
  where d.id = doacao_id;
end;
$$;

-- Baixa feita pelos noivos (sem aviso do convidado): já entra confirmada.
create or replace function public.presentes_doacao_registrar(
  token text,
  presente uuid,
  nome_doador text,
  forma_doacao public.forma_doacao,
  texto_agradecimento text default null,
  doador_anonimo boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  novo uuid;
begin
  if not private.mural_sessao_valida(token) then
    raise exception 'sessão inválida' using errcode = '28000';
  end if;
  insert into public.doacoes (presente_id, nome, forma, anonimo, agradecimento, status, origem, confirmado_em)
  values (presente, btrim(nome_doador), forma_doacao, doador_anonimo, nullif(btrim(texto_agradecimento), ''), 'confirmado', 'noivos', now())
  returning id into novo;
  return novo;
end;
$$;

revoke all on function public.doacao_antispam(),
  public.presentes_doacoes_listar(text, public.status_doacao),
  public.presentes_doacao_moderar(text, uuid, public.status_doacao, text, boolean),
  public.presentes_doacao_registrar(text, uuid, text, public.forma_doacao, text, boolean) from public;
grant execute on function public.presentes_doacoes_listar(text, public.status_doacao),
  public.presentes_doacao_moderar(text, uuid, public.status_doacao, text, boolean),
  public.presentes_doacao_registrar(text, uuid, text, public.forma_doacao, text, boolean) to anon, authenticated;
