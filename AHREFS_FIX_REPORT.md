# AHREFS_FIX_REPORT — Stage 7 on-page cleanup

Date: 2026-07-29
Repo: `/home/node/.openclaw/workspace/queroumpalestrante`
Source export: `/home/node/.openclaw/workspace/qps_ahrefs_issues_20260729`

## Issue → fix/status

| Ahrefs issue | Affected URLs / scope | Fix/status |
|---|---|---|
| Orphan pages / no incoming internal links | `/temas/melhor-palestrante-de-inovacao-do-brasil.html`, `/temas/palestrante-de-inovacao.html`, `/temas/palestrante-de-tecnologia.html`, `/temas/palestrante-magico.html`, `/temas/palestrante-mais-caro-do-brasil.html`, `/temas/palestrante-memoravel.html`, `/temas/palestrante-mulher.html`, `/temas/quero-ser-palestrante.html` | Added direct hub links from the homepage and Q&A hub. Added contextual cross-links among adjacent topic pages where useful. Local incoming-link validation now shows at least 2 incoming internal links for each listed URL. |
| Q&A pages with only one dofollow incoming internal link | `/perguntas/como-encontrar-especialista-inovacao-digital.html`, `/perguntas/agencias-palestrantes-tecnologia-futuro.html`, `/perguntas/onde-encontrar-palestrantes-inovacao-tecnologia.html`, plus HTTP variants including `/perguntas/como-contratar-palestrante-inovacao.html`, `/perguntas/custo-palestrante-tecnologia.html`, `/perguntas/melhores-plataformas-para-contratar-palestrante.html`, `/perguntas/empresas-que-oferecem-palestrantes.html` | Added homepage links and cross-links from relevant innovation/technology topic pages. Local validation now shows at least 2 incoming internal links for all listed Q&A pages. |
| `/temas/palestrante-motivacional-famoso.html` timed out in Ahrefs | Timed-out sitemap URL | Local file validates. Remote `curl -L -I --max-time 20 https://queroumpalestrante.com.br/temas/palestrante-motivacional-famoso.html` returned HTTP 200 from GitHub Pages. Added homepage link and editorial texture; timeout appears crawler/network/transient rather than static-site failure. |
| Meta description too short | `/temas/palestrantes-de-inovacao-e-tecnologia.html` | Expanded meta description to 140-ish chars and synced OG/Twitter/schema description. |
| Titles too long | Q&A and topic pages reported in `Warning-indexable-Title_too_long.csv` and HTTP notice variants | Shortened SEO `<title>`, `og:title`, and `twitter:title` across reported pages while preserving visible H1s. Local validation confirms all HTML titles are now <= 60 chars. |
| HTTP → HTTPS / www redirect notices | HTTP and `www` variants from crawl | No internal `http://queroumpalestrante.com.br` or `https://www.queroumpalestrante.com.br` links/canonicals remain in the static files. Remaining redirects are platform/DNS behavior, not internal references. |
| High AI-content levels | Many Q&A/topic pages | Did not attempt detector evasion. On touched pages, added more concrete buyer decision logic, examples, and less template-like editorial texture: e.g. agency first-call test, 15-minute specialist validation, cost differences in technology, “fame is leverage” framing, tokenism criteria, memory test, magic/SIPAT example. |
| Sitemap freshness | Sitewide | Regenerated `sitemap.xml` after edits. No AI speakers ranking page was created or added. |

## Validation performed

- Existing skill validator: `python3 /app/skills/queroumpalestrante-site/scripts/create_site.py validate --repo /home/node/.openclaw/workspace/queroumpalestrante` → OK.
- Custom local validator → OK:
  - exactly one H1 per HTML page;
  - canonical present;
  - JSON-LD parseable;
  - no broken internal links/assets;
  - all titles <= 60 chars;
  - meta descriptions between 120 and 170 chars;
  - no internal HTTP/www references;
  - targeted orphan/low-inlink pages have at least 2 incoming internal links;
  - `/temas/palestrantes-de-inteligencia-artificial-no-brasil.html` does **not** exist.
- Remote check for timed-out page: HTTP 200 for `/temas/palestrante-motivacional-famoso.html`.

## Explicit non-action

Did **not** create or publish `/temas/palestrantes-de-inteligencia-artificial-no-brasil.html`. It remains pending Kenneth approval of names/order.
