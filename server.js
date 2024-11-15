// server.js
const express = require('express');
const next = require('next');
const fs = require('fs');
const https = require('https');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/lms-api.annularprojects.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/lms-api.annularprojects.com/fullchain.pem'),
};

app.prepare().then(() => {
  const server = express();

  // Define custom routes here (optional)
  server.get('/custom-route', (req, res) => {
    return app.render(req, res, '/custom-page', req.query);
  });

  // Handle all other routes with Next.js
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server with HTTPS
  https.createServer(httpsOptions, server).listen(3000, (err) => {
    if (err) throw err;
    console.log('> https://www.hrms.annulartech.net');
  });
});
