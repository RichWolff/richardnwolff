// Custom server for Dreamhost deployment
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Check if we're in production mode
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Define the port (Dreamhost typically assigns a port)
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    // Parse the URL
    const parsedUrl = parse(req.url, true);
    
    // Let Next.js handle the request
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
}); 