const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// API proxy - must come before static files
app.use(createProxyMiddleware('/api', {
  target: 'http://39.106.98.184',
  changeOrigin: true,
  on: { error: (err, req, res) => res.status(502).json({ error: 'Backend unreachable' }) }
}));

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

app.listen(PORT, () => console.log(`Dashboard on ${PORT}`));
