# Funcionalidades do app, conforme o código (`lution-dev/app-tachegando`)

Levantamento feito só pela leitura do código, sem rodar o app e sem capturas de tela. "Real" = conversa com o banco (Supabase). "Simulado" = dados fixos no código. "Planejado" = aparece só nas histórias ou documentos.

## Conta e acesso
| Função | Estado | Detalhe |
|---|---|---|
| Criar conta e entrar com e-mail e senha | Real | Supabase Auth. Tipo de conta: cliente ou profissional (vendedor). |
| Recuperar senha por e-mail | Real | |
| Login por telefone/SMS, Google, Apple | Planejado | Só nas histórias. |
| Cadastro do vendedor | Real | Nome, nome do negócio, telefone, e-mail, senha. Um perfil de vendedor é criado automaticamente no banco. |
| Cadastro do consumidor | Real | |

## Consumidor
| Função | Estado | Detalhe |
|---|---|---|
| Mapa com vendedores | Real | Lista do banco, com atualização em tempo real (Supabase Realtime). |
| Filtro por categoria | Real | Comida, Hortifruti, Bebidas, Doces. |
| Busca "Buscar profissional ou produto" | Existe na tela | Não verifiquei se filtra de fato. |
| Perfil do vendedor (produtos, nota) | Real (leitura) | Nota e avaliações são campos de texto/número no banco; **não há tela para avaliar** que eu tenha encontrado. |
| **"Me avise quando chegar"** | **Real (parte 1)** | Cria uma intenção de compra no banco, com a localização do consumidor, temporária e com status. **Não encontrei envio de aviso (push).** |
| Acompanhar no mapa | Parcial | A posição do vendedor vem do banco em tempo real, mas o texto "Está chegando em 2 minutos" é **fixo no código**. A distância mostrada é um campo de texto. |
| Favoritos | Simulado | Lista fixa de 4 vendedores no código. |
| Avisos (notificações) | Simulado | Lista fixa no código. |
| Localização do próprio consumidor no mapa | Pendente | Marcado como TODO no código. |

## Vendedor
| Função | Estado | Detalhe |
|---|---|---|
| Criar rota (gravar por GPS ou marcar no mapa) | Real | Salva pontos, dias, tolerância de desvio e um polígono de influência no banco. Gravação ignora pontos a menos de 10 m do anterior. |
| Escolher dias e distância de aviso | Real | Perto 100 m, Normal 150 m, Mais longe 300 m. |
| "Clientes perto da rota" durante a rota | Parcial | Consulta o banco a cada 30 s e agrupa as intenções de compra, **mas o agrupamento é uma versão simplificada ("mock DBSCAN, para demonstração")** e o mapa usa uma **posição GPS fixa de São Paulo**. |
| Mapa "Onde tem clientes" (calor) | **Simulado** | 5 zonas fixas em São Paulo. Não usa demanda real. |
| Produtos | Simulado | Lista de exemplo na memória, não salva no banco pelo que li. |
| Localização do vendedor em tempo real | Real | Atualiza a posição do vendedor no banco. |
| Plano e pagamento | **Simulado** | A tela de pagamento espera 1,5 s e conclui. Não há gateway (Asaas/Mercado Pago) ligado. Valor mostrado: R$ 29,90. |
| "Sem taxas por venda" | Texto da tela de plano | Afirmação de produto. |
| Frota (vários veículos) | Planejado | Só nas histórias. |
| Teste grátis de 14 dias | Planejado | Só nas histórias. |

## Notificações push
**Não encontrei** Firebase, OneSignal ou qualquer envio de push no app ou no banco. O alerta de chegada hoje **registra o interesse, mas não avisa ninguém**.

## O que isso significa para o site
O site descreve o comportamento **projetado** ("ative o aviso de chegada", "veja onde tem clientes"). Isso só é verdadeiro no lançamento se estas peças estiverem prontas:
1. **Aviso de chegada entregue ao consumidor** (push). Hoje não existe.
2. **"Onde tem clientes" com dados reais.** Hoje é simulado.
3. **Cobrança** ligada de verdade e com o valor definido (R$ 29,90 ou R$ 49).

Enquanto isso, mantenha o selo "Lançamento em breve" e não aponte datas. O brand book (8.6) diz que planos e documentos técnicos não provam que uma função está disponível.

## Corretos e seguros de afirmar hoje
- Consumidor gratuito.
- O vendedor define a própria rota, os dias e a distância de aviso.
- Cadastro de vendedor e de consumidor com e-mail.
- Vendedores aparecem num mapa e podem ser filtrados por categoria.
- Registrar o interesse em ser avisado quando o vendedor chegar.
