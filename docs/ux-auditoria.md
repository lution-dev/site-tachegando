# Auditoria UX/UI — site novo (`novo/`)

Método: axe-core (WCAG 2.0/2.1/2.2 A e AA + boas práticas) em 7 páginas, checagem no celular (390 px) e leitura visual dos prints. Data: 26/10/2026.

## Corrigido (antes → depois)
| Problema | Gravidade | Correção |
|---|---|---|
| No celular o menu só mostrava Entrar e Criar conta. Não havia como chegar a Vendedores, Consumidores e Rede de Apoio a partir de uma página interna. | Alta | Menu hambúrguer com painel, botão de 48 px, fecha com Esc e ao tocar em um link. |
| Manifesto: palavras com contraste insuficiente (23 elementos) | Alta | Opacidade inicial de 28% para 58%. |
| Faixas e animações em loop sem como pausar (WCAG 2.2.2) | Alta | Botão "Pausar animações" na faixa (desktop) e no rodapé; respeita `prefers-reduced-motion` e lembra a escolha. |
| `aria-label` em elemento sem papel (faixas) | Média | Texto só para leitor de tela e região nomeada. |
| Conteúdo fora de marcos (landmarks) | Média | Seções nomeadas, `main` com id e link "Pular para o conteúdo". |
| Links do rodapé com 20 px de altura | Média | Área de toque de 44 px ou mais. |
| Senha sem dica nem opção de ver | Média | Dica "Mínimo de 6 caracteres" visível e botão Mostrar/Ocultar. |
| Painel mostrava o passo só em barra | Baixa | Texto "Passo X de Y". |
| Sem página 404 | Baixa | `404.html` no tom da marca. |

Resultado: **0 violações** do axe nas 7 páginas (antes: 2 nas 3 principais, 1 nas demais). Isso não substitui teste com pessoas e leitor de tela.

## Recomendado, depende de decisão
1. **Rótulo do botão "Criar conta" no menu.** O consumidor não cria conta (só avisa-me do lançamento). Sugestão: "Sou vendedor" ou "Cadastre-se".
2. **Cabeçalho sobre fotos claras** (ex.: céu dourado em Consumidores): botão "Entrar" perde contraste. Sugestão: degradê escuro no topo da foto.
3. **Primeira tela no celular:** o título ocupa mais da metade. O botão principal fica no limite da dobra. Sugestão: reduzir o título em telas baixas e encurtar o texto de apoio.
4. **Formulários:** erros por campo (hoje há uma mensagem única), máscara de telefone, estado de "enviando" e foco automático no primeiro erro.
5. **Painel:** salvar o progresso entre passos (hoje, recarregar a página volta ao início) e campo de texto para "Outro".
6. **Prévia de compartilhamento** (imagem Open Graph) para links no WhatsApp e redes.
7. **Grafismos da identidade** (rotas, pins, padrões) e ícones do deck, ainda ausentes.
8. **Teste com pessoas reais**, principalmente vendedores com pouca familiaridade digital. É o que mais falta para ir além do protótipo.
