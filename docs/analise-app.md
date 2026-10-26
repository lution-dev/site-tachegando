# Análise do código do app (`lution-dev/app-tachegando`) e o que mudou no site

Fonte: leitura do repositório (somente leitura). Tudo abaixo foi conferido no código, não só nos documentos.

## O que o app realmente faz
**Consumidor ("Cliente")**: gratuito. Mapa com vendedores por perto, busca ("Buscar profissional ou produto"), categorias (Comida, Hortifruti, Bebidas, Doces), perfil do vendedor, acompanhar no mapa, favoritos, avisos (notificações) e o botão **"Me avise quando chegar"** (mensagem: "Aviso ativado. Vamos te avisar quando estiver perto").

**Vendedor ("Profissional", "Vender enquanto se desloca")**: cadastro (nome, nome do negócio, telefone, e-mail, senha), "Meu trabalho" com **"Começar minha rota"**, criação de rota (**gravar pelo GPS** ou **marcar no mapa**, nome da rota, todos os dias ou escolher dias, **"Avisar clientes até qual distância da rota?"**: Perto 100 m, Normal 150 m, Mais longe 300 m), mapa **"Onde tem clientes"**, produtos, plano ("Ver onde tem clientes", "Avisar clientes por perto", "Criar rotas", **"Sem taxas por venda"**).

**Diferencial técnico real** (dossiê `docs/patentes`): o ERR parte da **rota do vendedor** e mostra onde há demanda viável perto dela, com pouco desvio, em vez de só listar vendedores próximos. Isso confirma o posicionamento "a rota é do vendedor".

## O que estava errado no site (corrigido)
| Antes | Problema | Agora |
|---|---|---|
| "Peça uma parada" | O app não tem esse botão. | "Me avise quando chegar" / "ative o aviso de chegada" |
| Vendedor "decide se para" | O vendedor vê onde tem clientes e decide se vale o desvio. | "Veja onde tem clientes perto da rota" |
| Painel pedia só bairros e dias | O app pede nome do negócio, nome da rota e distância de aviso. | Painel com os mesmos campos |
| Benefícios genéricos | Havia funções reais não citadas. | Gravar rota (GPS ou mapa), onde tem clientes, distância de aviso, favoritos, busca e categorias, sem taxa por venda |

## Conflitos entre fontes (decidir antes de publicar)
1. **Preço:** o código de checkout mostra **R$ 29,90**; `STORIES.md` fala em **R$ 49**. O site **não cita valor**.
2. **Teste grátis de 14 dias:** só existe como história. Não está no site.
3. **Números de investidores** (`investor-hub`: "32.454 online agora", "56.325 vendedores"): estão marcados como "informados para apresentação" e contradizem a informação de que o app ainda não está em uso. **Não usar no site** (brand book 8.6).
4. **Vocabulário:** o app chama o vendedor de "Profissional" e o consumidor de "Cliente". O site usa "vendedor" e "consumidor", como o brand book. Vale alinhar o app ou o brand book.

## Alertas sobre o repositório (público)
- **Senha do keystore de release** em texto aberto (`build.gradle.kts`: `release123`). Trocar e tirar do código.
- **Extratos para investidores (PDFs) e participações societárias** dentro de um repositório público. Mover para algo privado.
- **Dossiê de patente** também está público. Isso pode prejudicar o pedido (divulgação prévia). Falar com o advogado antes de qualquer outra divulgação. Por isso o site descreve só o benefício, nunca o método.
- A chave do Supabase no código é a pública (`anon`), o que é normal; a proteção depende das regras de acesso (RLS) do banco.

## Desempenho (Lighthouse, mesmo ambiente de antes)
| Página (celular) | Antes | Depois |
|---|---|---|
| Home | 74 (LCP 5,4 s, 1.077 KB) | 96 (LCP 2,6 s, 485 KB) |
| Home (desktop) | 98 | 100 |
Mudanças: fontes locais em vez do Google Fonts, imagens em WebP com versão menor para celular e pré-carregamento da imagem principal.

## Próximas melhorias possíveis com o app em mãos
- Usar **telas reais do app** no site (há build web em Compose/Wasm; precisa rodar o app para capturar). Substitui a ilustração do celular.
- Alinhar o cadastro do site com a futura conexão ao Supabase (tabelas `vendors`, `products` e rotas já existem).
- Reaproveitar as cores do app no painel só se forem as oficiais: o app usa `#FF6B00` e `#1B2A4A`, o deck da marca define `#FC4200` e `#01172E`. **Definir qual vale.**
