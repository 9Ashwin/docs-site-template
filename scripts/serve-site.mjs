import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveSiteFile } from './site-files.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../static-site');
const portIndex = process.argv.indexOf('--port');
const port = Number(portIndex < 0 ? 3000 : process.argv[portIndex + 1]);
// 与构建时的 SITE_BASE 保持一致；为空时按根路径站点服务。
const siteBase = (process.env.SITE_BASE ?? '').replace(/\/$/, '');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.mp4': 'video/mp4', '.srt': 'application/x-subrip; charset=utf-8' };
const server = createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
    const url = new URL(request.url, 'http://localhost');
    // 把请求路径映射回产物根：项目站点访问 /my-repo/docs/x，产物里是 /docs/x。
    let pathname = url.pathname;
    if (siteBase) {
      if (pathname === siteBase) { response.writeHead(308, { Location: siteBase + '/' + url.search }).end(); return; }
      if (!pathname.startsWith(siteBase + '/')) { response.writeHead(404).end('Not found'); return; }
      pathname = pathname.slice(siteBase.length);
    }
    if (pathname === '/docs') { response.writeHead(308, { Location: `${siteBase}/docs/` + url.search }).end(); return; }
    let file = await resolveSiteFile(root, pathname);
    const status = file ? 200 : 404;
    if (!file) file = await resolveSiteFile(root, pathname.startsWith('/docs/') ? '/docs/404.html' : '/404.html');
    if (!file) { response.writeHead(404).end('Not found'); return; }
    response.writeHead(status, { 'Content-Type': types[extname(file.path)] || 'application/octet-stream', 'Content-Length': file.info.size, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    if (request.method === 'HEAD') response.end();
    else createReadStream(file.path).pipe(response);
  } catch { response.writeHead(500).end('Unable to serve this page'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Site preview: http://127.0.0.1:${port}${siteBase}/`));
