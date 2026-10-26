# Design system — Tá Chegando (site `novo/`)

Arquivos: `novo/styles.css` (base e páginas) e `novo/componentes.css` (componentes e vidro). Identidade: `docs/identidade-visual.md`.

## Regra de ouro
**Tudo que fica sobre foto usa vidro (glassmorphism).** Elementos sólidos só em fundo liso. O único elemento sólido sobre foto é o botão primário laranja.

## Tokens de vidro (`componentes.css`)
| Token | Valor | Quando |
|---|---|---|
| `--vidro-bg` / `--vidro-borda` / `--vidro-blur` | branco 14% / branco 38% / 14 px | Vidro claro: fotos escuras ou médias |
| `--vidro-esc-bg` / `--vidro-esc-borda` / `--vidro-esc-blur` | azul profundo 46% / branco 22% / 22 px | Vidro escuro: fotos claras (`.hero.foto-clara`), legendas de foto |
| `--vidro-sombra` | sombra suave + brilho interno no topo | Ambos |

Classes utilitárias: `.vidro` e `.vidro-escuro`. Em heros, o vidro é aplicado automaticamente a selo, botão do menu, botão secundário, cartões de caminho, cartões de passo e a nota "Foto provisória". Em fotos claras, adicionar `foto-clara` à seção do hero (ex.: Consumidores).

Fallback: com `prefers-reduced-transparency`, o vidro vira fundo azul sólido.

## Medidas
| Token | Valor |
|---|---|
| `--h-botao` / `--h-botao-sm` | 48 px / 44 px (menu compacto) |
| `--h-selo` | 40 px |
| `--r-pilula` / `--r-botao` / `--r-cartao` / `--r-painel` | 99 / 14 / 20 / 24 px |

## Componentes
| Componente | Classe | Variações |
|---|---|---|
| Botão | `.btn` | `.or` (primário), `.ln` (secundário; vidro sobre foto), `.az` (escuro sobre fundo claro), `.sm` |
| Botão ícone | `.menu-btn` | vidro (claro ou escuro conforme o hero) |
| Selo | `.selo` | vidro sobre foto |
| Cartão | `.caminho`, `.passos-h div` | vidro sobre foto; `.bento article`, `.card2` sólidos em fundo liso |
| Legenda de foto | `.mosaico figcaption` | vidro escuro |
| Menu do celular | `header.top nav` | tela cheia, vidro escuro com desfoque de 20 px, links em Poppins 1,75 rem com subtítulo, Entrar (vidro) e Criar conta (laranja) no rodapé |

## Menu do celular (opção A, aprovada)
- Abaixo de 900 px, botão hambúrguer de vidro; ao abrir, a navegação cobre a tela inteira, a página atrás fica desfocada e escurecida e o botão vira X.
- Rolagem do fundo bloqueada. Fecha com Esc, ao tocar em um link ou ao ampliar a tela. O foco vai para o primeiro link ao abrir e volta ao botão ao fechar.
- Os subtítulos dos links só aparecem no menu do celular.

## Acessibilidade
Contraste AA verificado com axe nas 7 páginas (0 violações), alvos de toque de 44 px ou mais, link "Pular para o conteúdo", botão "Pausar animações". Detalhes em `docs/ux-auditoria.md`.
