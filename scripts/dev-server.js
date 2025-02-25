const https = require('https');
const fs = require('fs');
const path = require('path');

const cert = fs.readFileSync(path.join(__dirname, '../cert/localhost.crt'));
const key = fs.readFileSync(path.join(__dirname, '../cert/localhost.key'));

const options = {
  key: key,
  cert: cert
};

const server = https.createServer(options, (req, res) => {
  // Simple static file server
  let filePath = path.join(__dirname, '../public', req.url === '/' ? 'index.html' : req.url);
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

server.listen(3001, () => {
  console.log('Development server running on https://localhost:3001/');
});