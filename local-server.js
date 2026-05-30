/**
 * Southery Sentie — Local Development Server
 * Supports clean URLs: /account → account.html, /shop → shop.html, etc.
 * Mirrors production behaviour (Netlify / Apache / Nginx rewriting)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5500;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    'Content-Type': mime,
    'Content-Length': stat.size,
    'Cache-Control': 'no-cache',
  });
  fs.createReadStream(filePath).pipe(res);
}

function resolve404(res) {
  const notFound = path.join(ROOT, '404.html');
  if (fs.existsSync(notFound)) {
    const stat = fs.statSync(notFound);
    res.writeHead(404, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': stat.size,
    });
    fs.createReadStream(notFound).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 — Page Not Found');
  }
}

const server = http.createServer((req, res) => {
  // Strip query string and decode URI
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  // Remove trailing slash (except root)
  if (urlPath !== '/' && urlPath.endsWith('/')) {
    res.writeHead(301, { Location: urlPath.slice(0, -1) });
    return res.end();
  }

  // Root → index.html
  if (urlPath === '/') urlPath = '/index.html';

  let filePath = path.join(ROOT, urlPath);

  // 1️⃣  Exact file match
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return serveFile(res, filePath);
  }

  // 2️⃣  Clean URL: /account → /account.html
  if (!path.extname(urlPath)) {
    const htmlPath = filePath + '.html';
    if (fs.existsSync(htmlPath)) {
      return serveFile(res, htmlPath);
    }
  }

  // 3️⃣  Directory → index.html inside it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const indexInside = path.join(filePath, 'index.html');
    if (fs.existsSync(indexInside)) {
      return serveFile(res, indexInside);
    }
  }

  // 4️⃣  404
  resolve404(res);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('  ✦  Southery Sentie Dev Server');
  console.log(`  ➜  http://127.0.0.1:${PORT}`);
  console.log('');
  console.log('  Clean URLs enabled — /account works, /shop works, etc.');
  console.log('  Press Ctrl+C to stop.');
  console.log('');
});
