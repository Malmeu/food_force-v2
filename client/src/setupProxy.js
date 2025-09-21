const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://food-force-api.onrender.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api', // rewrite path
      },
      headers: {
        'Connection': 'keep-alive'
      }
    })
  );
};
