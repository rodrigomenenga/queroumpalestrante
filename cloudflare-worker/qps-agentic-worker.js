// Cloudflare Worker for queroumpalestrante.com.br agent-readiness.
// Adds Accept: text/markdown negotiation for homepage and Markdown 404 bodies.
// Serves static files from the GitHub repository raw content to avoid GitHub Pages/CNAME origin loops.

const RAW_ORIGIN = 'https://raw.githubusercontent.com/rodrigomenenga/queroumpalestrante/main';
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

function contentTypeFor(path) {
  if (path.endsWith('.html')) return 'text/html; charset=utf-8';
  if (path.endsWith('.css')) return 'text/css; charset=utf-8';
  if (path.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (path.endsWith('.json')) return 'application/json; charset=utf-8';
  if (path.endsWith('.xml')) return 'application/xml; charset=utf-8';
  if (path.endsWith('.txt')) return 'text/plain; charset=utf-8';
  if (path.endsWith('.md')) return 'text/markdown; charset=utf-8';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  if (path.endsWith('.ico')) return 'image/x-icon';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  if (path.endsWith('.webp')) return 'image/webp';
  return 'application/octet-stream';
}

function repoPath(pathname) {
  let p = pathname;
  if (p === '/') return '/index.html';
  if (p.endsWith('/')) return `${p}index.html`;
  return p;
}

async function fetchRepoFile(pathname) {
  const p = repoPath(pathname);
  const res = await fetch(RAW_ORIGIN + p, {
    headers: { 'user-agent': 'qps-agentic-worker/1.0' },
    cf: { cacheTtl: 300, cacheEverything: true },
  });
  if (res.status === 404) return null;
  const headers = new Headers(res.headers);
  headers.set('content-type', contentTypeFor(p));
  headers.set('cache-control', 'public, max-age=300');
  headers.set('vary', 'Accept');
  // GitHub raw sends restrictive/security headers that are irrelevant here; keep response clean.
  headers.delete('content-security-policy');
  headers.delete('content-disposition');
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
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

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { 'allow': 'GET, HEAD' } });
    }

    const fileResp = await fetchRepoFile(url.pathname);
    if (fileResp) return fileResp;

    if (wantsMarkdown(request)) return markdown404(url.toString());

    const html404 = await fetchRepoFile('/404.html');
    if (html404) return new Response(html404.body, { status: 404, headers: html404.headers });
    return new Response('Not found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', 'vary': 'Accept' } });
  },
};
