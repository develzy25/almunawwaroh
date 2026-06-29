/* eslint-disable */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

let server;

function startLocalServer() {
  server = http.createServer((req, res) => {
    // Sanitize path to prevent directory traversal
    let safePath = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    
    // Remove query parameters or hashes if present
    const qIndex = safePath.indexOf('?');
    if (qIndex !== -1) safePath = safePath.substring(0, qIndex);
    const hIndex = safePath.indexOf('#');
    if (hIndex !== -1) safePath = safePath.substring(0, hIndex);

    if (safePath === '/' || safePath === '\\') {
      safePath = '/index.html';
    }

    const filePath = path.join(__dirname, 'out', safePath);
    
    // Check if file exists, if not serve index.html (Next.js fallback)
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        serveFile(path.join(__dirname, 'out', 'index.html'), res);
      } else {
        serveFile(filePath, res);
      }
    });
  });

  // Listen on a random available port (0 = OS assigns any free port)
  server.listen(0, '127.0.0.1', () => {
    const port = server.address().port;
    console.log(`Local server running on http://127.0.0.1:${port}`);
    createWindow(port);
  });
}

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Server Error: ${err.code}`);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

function createWindow(port) {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'Al-Munawwaroh',
    icon: path.join(__dirname, 'public', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  win.setMenuBarVisibility(false);
  win.loadURL(`http://127.0.0.1:${port}`);
}

app.whenReady().then(() => {
  startLocalServer();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      startLocalServer();
    }
  });
});

app.on('window-all-closed', () => {
  if (server) {
    server.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
