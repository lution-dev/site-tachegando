# SEO e GEO do site

Tudo em `novo/`. As metatags e o JSON-LD das 7 páginas públicas são gerados por `docs/seo-gerar-metadados.py` (rode de dentro de `novo/`; ele reescreve o `<head>` e o JSON-LD, os textos ficam no dicionário `META`).

## O que existe
- **Por página:** título (27 a 56 caracteres), descrição (123 a 156), canonical, hreflang pt-BR + x-default, robots com `max-image-preview:large`, Open Graph completo, Twitter Card com imagem e alt, tema e nome do app.
- **Imagens de compartilhamento** (1200x630, em `novo/img`): `og.png` (Home, Privacidade, Termos), `og-vendedores`, `og-consumidores`, `og-rede-de-apoio`, `og-contato`. Geradas no desenho da marca (tomate ou petróleo, símbolo, Baloo 2, barra de toldo).
- **Dados estruturados (JSON-LD):** Organization (com Argo Apps como empresa mãe e o CNPJ do rodapé), WebSite, WebPage ou ContactPage, BreadcrumbList nas páginas internas e FAQPage em Vendedores (6), Consumidores (6) e Rede de Apoio (5). O texto do FAQPage é extraído das próprias perguntas visíveis, então não diverge da página.
- **Fora do índice:** `/entrar`, `/painel` e a 404 têm `noindex`; o painel e o login também recebem `X-Robots-Tag` e `Disallow` no robots.
- **robots.txt:** libera buscadores e assistentes de IA (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Claude-User, Applebot) e também os rastreadores de treinamento (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended). Para bloquear treinamento, troque `Allow` por `Disallow` nesses quatro.
- **sitemap.xml:** 7 URLs com `lastmod`, hreflang e imagem.
- **llms.txt:** resumo do que o Tá Chegando é e não é, para quem pergunta a assistentes de IA. Só traz fatos que já estão no site.
- **Manifest** (`site.webmanifest`): nome, descrição, idioma, categorias e ícones 192 e 512.
- **vercel.json:** cabeçalhos de segurança (nosniff, referrer, frame, permissions, HSTS), cache longo para fontes, cache de 1 semana para imagens e marca, tipos corretos para `llms.txt` e o manifest, redirect `/v2` para `/`.

## Pendências (dependem de vocês)
1. **Confirmar o domínio.** Tudo aponta para `https://tachegandoapp.com.br`. Se o domínio final for outro, troque no script e rode de novo (e em `sitemap.xml`, `robots.txt`, `llms.txt`).
2. **Search Console e Bing Webmaster:** verificar o domínio, enviar o sitemap e pedir indexação da Home. Depois do lançamento, vale o IndexNow.
3. **Redes sociais oficiais:** quando existirem, entram em `sameAs` na Organization (hoje não há, e não inventei).
4. **Dados do app:** quando o app estiver nas lojas, adicionar o dado estruturado de aplicativo (MobileApplication) com preço e links. Antes disso não declarei, porque ainda não existe para baixar.
5. **Testar compartilhamento:** depois do deploy, colar os links no depurador do Facebook/LinkedIn e no WhatsApp; eles guardam a imagem antiga em cache.
6. **Política de Privacidade e Termos** seguem como rascunho em revisão jurídica.
