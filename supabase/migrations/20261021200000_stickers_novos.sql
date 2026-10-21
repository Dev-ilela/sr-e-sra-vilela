-- Stickers novos: videogame, óculos, teclado, academia, Zoe, notebook, presente, girassol, bicicleta e salto.
alter table public.recados drop constraint if exists recados_sticker_check;
alter table public.recados add constraint recados_sticker_check check (
  sticker in ('aliancas','coracao','pomba','bolo','buque','biblia','brinde','carta','palavra','oracao','joia','tmj','gravata',
              'controle','oculos','teclado','halter','zoe','notebook','presente','girassol','bicicleta','salto')
);
