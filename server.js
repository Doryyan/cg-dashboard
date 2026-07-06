const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const apiProxy = createProxyMiddleware({
  target: 'http://39.106.98.184',
  changeOrigin: true,
  onError: (err, req, res) => res.status(502).json({ error: 'Backend unreachable' })
});

app.use('/api', apiProxy);
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

app.listen(PORT, () => console.log(`Dashboard on port ${PORT}`));
