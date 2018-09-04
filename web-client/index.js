'use strict';

let nodeStatic = require('node-static');
let http = require('http');

let fileServer = new(nodeStatic.Server)();
let app = http.createServer(function(req, res) {
  fileServer.serve(req, res);
}).listen(8080);
