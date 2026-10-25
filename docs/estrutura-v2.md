# Tá Chegando — Estrutura do site (v2, para aprovação)

Substitui a proposta de `copy-e-estrutura.md` e o primeiro rascunho em `site/`, que foram feitos antes de alinhar direção. **Nada de design ou código até esta estrutura ser aprovada.**

## Decisões já tomadas
- O app **já existe**; o que falta é o **lançamento oficial** (por falta de investimento). O site pode falar do produto como real, mas cada funcionalidade citada precisa estar na lista de confirmação abaixo (brand book 8.4 e 8.6).
- Consumidor: **aviso de lançamento** (lista de interessados).
- Rede de Apoio: aceita **empresas e profissionais autônomos**.
- Vendedor e Rede de Apoio: cadastro **dentro do painel**, após criar conta. Protótipo agora, depois ligado ao BD do app real.
- Fotos: só reais e autorizadas (brand book 5.5). Até lá, ilustração ou imagem de banco real, nunca IA simulando vendedor.

## Mapa do site

| Rota | Público | Objetivo | Ação principal |
|---|---|---|---|
| `/` | Todos | Apresentar a marca e levar cada pessoa ao seu caminho | Escolher: vendo / procuro / quero apoiar |
| `/vendedores` | Vendedor ambulante móvel | Explicar como funciona e converter | Criar conta |
| `/consumidores` | Consumidor | Explicar a proposta e captar interesse | Entrar na lista de aviso de lançamento |
| `/rede-de-apoio` | Empresas e profissionais | Convidar para a rede | Criar conta (tipo Rede de Apoio) |
| `/entrar` | Vendedor e Rede de Apoio | Login e criação de conta | Entrar / criar |
| `/painel` | Vendedor e Rede de Apoio | Cadastro, perfil, depois métricas | Completar cadastro |
| `/privacidade`, `/termos` | Todos | Exigência legal (LGPD) antes de coletar dados | — |

## Home (`/`)
1. Topo: logo, links para as três páginas, Entrar.
2. Abertura: assinatura + frase curta do que é o app + três caminhos em cartões ("Eu vendo", "Eu procuro", "Quero apoiar").
3. O que é o Tá Chegando (3 linhas) e por que existe (tensão: o comércio se move, a informação não).
4. Quem circula por aí (diversidade: não só comida).
5. Como funciona, em alto nível, para os dois lados.
6. Rede de Apoio em destaque curto.
7. Chamada final e rodapé.

## `/vendedores`
Título (proposta): *Você já está na rua. Agora deixe que encontrem você.*
Seções: o que muda no seu dia a dia · como funciona (criar conta → cadastrar rota → usar o app) · o que você controla (autonomia, o que aparece e para quem; **a confirmar com produto**) · o que o app não promete · perguntas frequentes · CTA criar conta.

## `/consumidores`
Título (proposta): *O vendedor que você procura pode estar passando por aí.*
Seções: o que você pode fazer (descobrir, acompanhar aproximação, pedir parada; **a confirmar**) · para quem é · aviso de lançamento (e-mail ou WhatsApp; consentimento LGPD) · perguntas frequentes.

## `/rede-de-apoio`
Título (proposta): *Seu conhecimento pode apoiar quem trabalha em movimento.*
Seções: o que é a rede · áreas (contabilidade, orientação financeira, design, comunicação, assessoria jurídica, outras) · quem pode participar (empresas e profissionais autônomos) · como funciona a participação (**depende de definição; não prometer**) · CTA criar conta.

## Painel (protótipo)
- Vendedor: nome, telefone, o que vende, meio de locomoção, cidade e bairros, dias da rota.
- Rede de Apoio: tipo (empresa ou autônomo), nome, documento (CNPJ ou CPF, opcional), área, como pode apoiar, cidade, contato.
- Telas: Início, Meu cadastro, Métricas (vazio até ligar ao app).

## Posicionamento
- Assinatura da marca: **A. "O comércio que circula, finalmente visível."** (a validar)
- Consumidor: **B. "O vendedor que você procura pode estar passando por aí."**
- Vendedor: **C. "Você já está na rua. Agora deixe que encontrem você."**
- Diferenciais verificáveis: qualquer vendedor em movimento (não só comida), vendedor como protagonista com painel próprio, Rede de Apoio, linguagem e rostos brasileiros, sem promessa de venda. Sem "primeiro", "único" ou "melhor" (brand book 4.6).

## A confirmar com produto antes de ir ao ar
1. O que o app faz hoje para o consumidor (descobrir, acompanhar aproximação, pedir parada, alertas)?
2. O que o app faz hoje para o vendedor (compartilhar rota, receber pedidos de parada, o que controla)?
3. Como a localização é compartilhada, com quem e em quais condições?
4. Plataformas (iOS, Android), data prevista de lançamento e se há link/QR para divulgar.
5. Preço e condições (o site não fala disso enquanto não for confirmado).
6. Escopo real da Rede de Apoio e como será formalizada a participação.
7. Qual o BD do app real (para ligar o painel).

## A definir com você
- Direção visual (fotografia real, ilustração própria, ou mistura) e fonte.
- Logo e tons oficiais de azul e laranja.
- Se haverá fotos reais de vendedores (com autorização) para a abertura.
