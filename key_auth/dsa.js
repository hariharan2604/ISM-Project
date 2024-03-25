const http = require('http'); 
const {keygeneration,keydeletion}=require("./keyfunctions")

function yourProcess() {
    keygeneration('hari');
}
const interval = 0.1 * 60 * 1000;
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Server is running!');
});
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
yourProcess();
setInterval(yourProcess, interval);
