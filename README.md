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
