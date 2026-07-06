const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy API calls to backend
app.use('/api', createProxyMiddleware({
  target: 'http://39.106.98.184',
  changeOrigin: true,
  onError: (err, req, res) => {
    res.status(503).json({ error: 'API service unavailable' });
  }
}));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Dashboard running on port ${PORT}`);
});
