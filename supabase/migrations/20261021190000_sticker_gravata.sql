-- Sticker novo: gravata.
alter table public.recados drop constraint if exists recados_sticker_check;
alter table public.recados add constraint recados_sticker_check check (
  sticker in ('aliancas','coracao','pomba','bolo','buque','biblia','brinde','carta','palavra','oracao','joia','tmj','gravata')
);
