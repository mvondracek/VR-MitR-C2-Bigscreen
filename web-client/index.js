'use strict';

const nodeStatic = require('node-static');
const http = require('http');
const WebSocket = require('ws');
require('log-timestamp');

//region Web server hosting the MitR Rogue App
let fileServer = new(nodeStatic.Server)();
let app = http.createServer(function(req, res) {
  fileServer.serve(req, res);
}).listen(8080);
//endregion


let controlPanelWs = null; // websocket connection to the control panel
const webSocketServer = new WebSocket.Server({port:8081});
webSocketServer.on('connection', function(ws) {
    ws.on('message', function(message) {
        if(message === 'control-panel-connect'){
            console.log('Control panel WebSocket connected');
            if(controlPanelWs !== null){
                console.warn('WARN', 'Previous Control panel WebSocket overwritten.')
            }
            controlPanelWs = ws;
        }
        else{
            if(controlPanelWs.readyState !== WebSocket.OPEN){
                console.error('ERROR','Control panel WebSocket is not open. Cannot forward: %s', message);
                return;
            }
            controlPanelWs.send(message);
            console.log('FWD: %s', message);
        }
    });
});
