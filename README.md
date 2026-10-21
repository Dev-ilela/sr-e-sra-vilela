# Sr. e Sra. Vilela

Site do casamento de Gabriel e Bianca — 9 de julho de 2027.

## Rodando localmente

```bash
npm install
npm run dev
```

## Onde mexer

- `src/config/casamento.ts` — nomes, data/horário da cerimônia e foto da entrada.
- `src/app/globals.css` — paleta (azul marinho, névoa, ouro, sálvia) e estilos.
- Para a foto de fundo: coloque o arquivo em `public/fotos/` e informe o caminho em `fotoEntrada`.

## Lista de presentes

- Página `/presentes`, com chamada na home. Os itens vêm da tabela `presentes` no Supabase e são buscados de novo a cada 5 minutos.
- `tipo = 'magalu'`: o botão abre a lista na Magalu, onde o pagamento e o controle acontecem.
- `tipo = 'pix'`: abre um diálogo com QR Code e Pix copia e cola já com o valor. O convidado pode deixar nome e recado (tabela `contribuicoes_pix`, que só os noivos leem).
- Variáveis de ambiente: veja `.env.example`.

## Mural de post-its

- Página `/mural` (com chamada na home): quadro de cortiça com o post-it dos noivos e os recados aprovados. Qualquer visitante escreve um post-it (nome, recado de até 280 caracteres e cor); ele entra como pendente na tabela `recados` e só aparece no quadro depois de aprovado.
- Quem enviou vê o próprio post-it "aguardando os noivos" (guardado no navegador) e, quando ele é aprovado, recebe a resposta dos noivos com o sticker escolhido.
- `/mural/[id]`: página de um post-it, feita para compartilhar, com a arte gerada em `opengraph-image.tsx` (aparece no WhatsApp).
- `/mural/noivos`: aprovação com senha. A senha é conferida no banco (funções `mural_*`), sem chave secreta no site. Para trocar a senha, rode no SQL Editor do Supabase:
  `select private.mural_definir_senha('nova senha');`
- Stickers: `src/components/mural/Stickers.tsx`. SQL do mural: `supabase/migrations/20261021120000_mural_de_post_its.sql`.
