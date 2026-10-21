-- Mural de post-its: qualquer visitante escreve, os noivos aprovam.
-- Depois de aplicar, defina a senha da página de aprovação no SQL Editor:
--   select private.mural_definir_senha('sua senha aqui');

create type public.cor_post_it as enum ('amarelo', 'rosa', 'azul', 'verde', 'laranja');
create type public.status_recado as enum ('pendente', 'aprovado', 'recusado');

create table public.recados (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(btrim(nome)) between 2 and 60),
  mensagem text not null check (char_length(btrim(mensagem)) between 3 and 280),
  cor public.cor_post_it not null default 'amarelo',
  status public.status_recado not null default 'pendente',
  -- Devolutiva dos noivos: recado curto e um sticker da coleção.
  resposta text check (char_length(resposta) <= 200),
  sticker text check (sticker in ('aliancas','coracao','pomba','bolo','buque','biblia','brinde','carta','palavra','oracao','joia','tmj','gravata')),
  created_at timestamptz not null default now(),
  moderado_em timestamptz
);

create index recados_aprovados_idx on public.recados (moderado_em desc) where status = 'aprovado';
create index recados_status_idx on public.recados (status, created_at desc);

alter table public.recados enable row level security;

-- Visitante: escreve só nome, mensagem e cor (o id vem do navegador para ele achar o próprio post-it depois).
revoke all on public.recados from anon, authenticated;
grant insert (id, nome, mensagem, cor) on public.recados to anon, authenticated;
grant select (id, nome, mensagem, cor, resposta, sticker, created_at, moderado_em) on public.recados to anon, authenticated;

create policy recado_entra_pendente on public.recados
  for insert to anon, authenticated
  with check (status = 'pendente' and resposta is null and sticker is null and moderado_em is null);

create policy recados_aprovados_visiveis on public.recados
  for select to anon, authenticated
  using (status = 'aprovado');

-- Freio simples contra spam: mesmo texto repetido e enxurrada de envios.
create or replace function public.recado_antispam()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.recados r
    where lower(btrim(r.mensagem)) = lower(btrim(new.mensagem))
      and r.created_at > now() - interval '1 day'
  ) then
    raise exception 'recado repetido' using errcode = 'P0001';
  end if;

  if (select count(*) from public.recados r where r.created_at > now() - interval '10 minutes') >= 40 then
    raise exception 'muitos recados agora, tente mais tarde' using errcode = 'P0001';
  end if;

  new.nome := btrim(new.nome);
  new.mensagem := btrim(new.mensagem);
  return new;
end;
$$;

create trigger recados_antispam
  before insert on public.recados
  for each row execute function public.recado_antispam();

-- ---------- Área dos noivos (senha) ----------
-- Tudo que é privado fica no schema "private", que a API não expõe.

create schema if not exists private;
revoke all on schema private from anon, authenticated;

create table private.mural_senha (
  id boolean primary key default true check (id),
  hash text not null
);

create table private.mural_sessoes (
  token_hash text primary key,
  expira_em timestamptz not null
);

create table private.mural_tentativas (
  quando timestamptz not null default now()
);

-- Troca a senha (e derruba as sessões abertas).
create or replace function private.mural_definir_senha(nova text)
returns void
language sql
set search_path = ''
as $$
  insert into private.mural_senha (id, hash) values (true, extensions.crypt(nova, extensions.gen_salt('bf', 10)))
  on conflict (id) do update set hash = excluded.hash;
  delete from private.mural_sessoes;
$$;

create or replace function private.mural_sessao_valida(token text)
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1 from private.mural_sessoes s
    where s.token_hash = encode(extensions.digest(token, 'sha256'), 'hex')
      and s.expira_em > now()
  );
$$;

-- Entrar: devolve um token de sessão (30 dias) ou null. Trava após muitas tentativas erradas.
create or replace function public.mural_entrar(senha text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  token text;
begin
  if (select count(*) from private.mural_tentativas t where t.quando > now() - interval '15 minutes') >= 8 then
    raise exception 'muitas tentativas, espere alguns minutos' using errcode = 'P0001';
  end if;

  if not exists (select 1 from private.mural_senha m where m.hash = extensions.crypt(senha, m.hash)) then
    insert into private.mural_tentativas default values;
    delete from private.mural_tentativas t where t.quando < now() - interval '1 day';
    return null;
  end if;

  token := encode(extensions.gen_random_bytes(32), 'hex');
  delete from private.mural_sessoes s where s.expira_em < now();
  insert into private.mural_sessoes (token_hash, expira_em)
  values (encode(extensions.digest(token, 'sha256'), 'hex'), now() + interval '30 days');
  return token;
end;
$$;

create or replace function public.mural_sair(token text)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from private.mural_sessoes s where s.token_hash = encode(extensions.digest(token, 'sha256'), 'hex');
$$;

create or replace function public.mural_listar(token text, filtro public.status_recado)
returns setof public.recados
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.mural_sessao_valida(token) then
    raise exception 'sessão inválida' using errcode = '28000';
  end if;
  return query
    select * from public.recados r
    where r.status = filtro
    order by case when filtro = 'pendente' then r.created_at end asc,
             coalesce(r.moderado_em, r.created_at) desc
    limit 300;
end;
$$;

create or replace function public.mural_moderar(
  token text,
  recado_id uuid,
  novo_status public.status_recado,
  nova_resposta text default null,
  novo_sticker text default null
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
  update public.recados r
  set status = novo_status,
      resposta = nullif(btrim(nova_resposta), ''),
      sticker = nullif(novo_sticker, ''),
      moderado_em = case when novo_status = 'pendente' then null else now() end
  where r.id = recado_id;
end;
$$;

revoke all on function public.mural_entrar(text), public.mural_sair(text),
  public.mural_listar(text, public.status_recado),
  public.mural_moderar(text, uuid, public.status_recado, text, text),
  public.recado_antispam() from public;
grant execute on function public.mural_entrar(text), public.mural_sair(text),
  public.mural_listar(text, public.status_recado),
  public.mural_moderar(text, uuid, public.status_recado, text, text) to anon, authenticated;
revoke all on all functions in schema private from public, anon, authenticated;
