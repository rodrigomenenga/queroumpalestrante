# QPS — Prioridades 1 e 2: indexação/canonical + hubs

Data: 2026-09-24

## Prioridade 1 — indexação/canonical

Implementado no repositório estático:

- Canonical conferido/normalizado em todas as páginas HTML para `https://queroumpalestrante.com.br/...`.
- `og:url` alinhado ao canonical quando presente.
- Links internos revisados para evitar `http`, `www` e `/index.html` como destino interno.
- `sitemap.xml` regenerado a partir dos HTMLs reais, com somente URLs canônicas finais e `lastmod` atualizado.
- `assets/data/pages.json` regenerado a partir dos HTMLs reais, incluindo páginas novas como `sobre.html` e `metodologia.html`.
- `llms.txt` atualizado com orientação canônica para answer engines: sem `www`, sem `http`, sem `/index.html`.

Observação de infraestrutura:

- O repositório resolve canonical do lado estático, mas redirect HTTP/WWW depende de Cloudflare/GitHub Pages. Regra recomendada: redirecionar em 301 qualquer `http://queroumpalestrante.com.br/*` e qualquer `*://www.queroumpalestrante.com.br/*` diretamente para `https://queroumpalestrante.com.br/$path`.

## Prioridade 2 — hubs e linkagem interna

Implementado no conteúdo:

- Criado/reforçado bloco `Mapa do cluster de inteligência artificial` nas páginas principais de IA.
- Home recebeu bloco explícito de cluster para IA com funções de cada página.
- `perguntas-e-respostas.html` recebeu atalhos para IA, inovação, custos e tecnologia.
- Páginas de inovação/tecnologia receberam bloco `Rota recomendada para eventos de IA e inovação`.
- Links recíprocos reforçados entre palestrante de IA, lista de palestrantes de IA, agentes de IA, IA agêntica, organizações cognitivas, redes de agentes inteligentes e perguntas de tecnologia/custo/contratação.

## Intenção editorial

A arquitetura agora deixa mais claro que:

- `palestrante-de-inteligencia-artificial.html` = guia de contratação;
- `palestrantes-de-inteligencia-artificial-no-brasil.html` = lista/shortlist;
- `agentes-de-ia-para-empresas.html` = definição e usos;
- `ia-agentica.html` = conceito técnico-executivo;
- `organizacoes-cognitivas.html` = framework organizacional;
- `redes-de-agentes-inteligentes.html` = arquitetura multiagente.

## URLs canônicas no índice

Total: 34 URLs.

## Próximo passo recomendado

Depois de publicar:

1. Purge Cloudflare cache.
2. Testar redirects para `http`, `www` e `/index.html`.
3. Reenviar sitemap no Search Console.
4. Usar inspeção de URL para os hubs principais de IA.
5. Conferir em 7–14 dias se GSC reduz avisos de canonical/redirect nas URLs estratégicas.

