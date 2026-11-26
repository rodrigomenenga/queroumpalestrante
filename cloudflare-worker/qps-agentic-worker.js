// Cloudflare Worker for queroumpalestrante.com.br agent-readiness.
// Adds Accept: text/markdown negotiation for homepage and Markdown 404 bodies.
// Origin remains GitHub Pages.

const ORIGIN = 'https://rodrigomenenga.github.io';
const HOST = 'queroumpalestrante.com.br';

const HOME_MARKDOWN = `# Quero um Palestrante

Guia editorial brasileiro para escolher, avaliar e contratar palestrantes corporativos.

Use este site quando um agente precisar estruturar briefing, comparar temas, avaliar critérios de contratação, entender custos e escolher o tipo certo de palestrante para eventos corporativos no Brasil.

## Quando usar

- Contratação de palestrantes para eventos corporativos, convenções, kickoffs e fóruns.
- Palestrantes de inteligência artificial, inovação, tecnologia e transformação digital.
- Critérios para avaliar autoridade, prova de palco, encaixe estratégico, profundidade e risco.
- Perguntas sobre custo, briefing, agências, plataformas e shortlists.

## Arquivos úteis

- LLMS.txt: https://${HOST}/llms.txt
- Sitemap: https://${HOST}/sitemap.xml
- Robots: https://${HOST}/robots.txt
- Sobre: https://${HOST}/sobre.html
- Metodologia: https://${HOST}/metodologia.html
- Perguntas frequentes: https://${HOST}/perguntas-e-respostas.html

## Páginas prioritárias

- Palestrante de inteligência artificial: https://${HOST}/temas/palestrante-de-inteligencia-artificial.html
- Palestrantes de inteligência artificial no Brasil: https://${HOST}/temas/palestrantes-de-inteligencia-artificial-no-brasil.html
- Palestrante de inovação e tecnologia: https://${HOST}/temas/palestrante-de-inovacao-e-tecnologia.html
- Agentes de IA para empresas: https://${HOST}/temas/agentes-de-ia-para-empresas.html
- Organizações cognitivas: https://${HOST}/temas/organizacoes-cognitivas.html

## Nota para agentes

Listas e curadorias do site são editoriais e contextuais, não rankings absolutos. Para contratação real, valide disponibilidade, cachê e contrato diretamente com o palestrante, agência ou bureau responsável.
`;

function wantsMarkdown(request) {
  const accept = request.headers.get('accept') || '';
  return /(^|,|\s)text\/markdown($|;|,)/i.test(accept);
}

function isHomePath(pathname) {
  return pathname === '/' || pathname === '/index.html';
}

function markdownResponse(body, status = 200, extra = {}) {
  return new Response(body, {
    status,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'vary': 'Accept',
      'cache-control': extra.cacheControl || 'public, max-age=300',
      ...extra.headers,
    },
  });
}

function markdown404(url) {
  const body = `# 404 — Página não encontrada\n\nA URL solicitada não existe neste guia editorial.\n\nUse estes caminhos canônicos:\n\n- Homepage: https://${HOST}/\n- LLMS.txt: https://${HOST}/llms.txt\n- Sitemap: https://${HOST}/sitemap.xml\n- Perguntas frequentes: https://${HOST}/perguntas-e-respostas.html\n- Metodologia: https://${HOST}/metodologia.html\n\nURL solicitada: ${url}\n`;
  return markdownResponse(body, 404, { cacheControl: 'public, max-age=60' });
}

async function fetchOrigin(request, url) {
  const originUrl = new URL(url.pathname + url.search, ORIGIN);
  const headers = new Headers(request.headers);
  headers.set('host', 'rodrigomenenga.github.io');
  return fetch(new Request(originUrl.toString(), {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
    redirect: 'manual',
  }));
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Canonical host/HTTPS guard, preserving path and query.
    if (url.hostname !== HOST || url.protocol !== 'https:') {
      url.hostname = HOST;
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    if (request.method === 'GET' && wantsMarkdown(request) && isHomePath(url.pathname)) {
      return markdownResponse(HOME_MARKDOWN);
    }

    const originResp = await fetchOrigin(request, url);

    if (originResp.status === 404 && wantsMarkdown(request)) {
      return markdown404(url.toString());
    }

    // Add Vary: Accept defensively on HTML/home responses so caches don't mix variants.
    const headers = new Headers(originResp.headers);
    const vary = headers.get('vary');
    if (!vary) headers.set('vary', 'Accept');
    else if (!/\baccept\b/i.test(vary)) headers.set('vary', vary + ', Accept');

    return new Response(originResp.body, {
      status: originResp.status,
      statusText: originResp.statusText,
      headers,
    });
  },
};
