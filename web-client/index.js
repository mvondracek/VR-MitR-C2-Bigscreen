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
console.debug('DEBUG', 'Static HTTP server started.');
//endregion

let zombies = {};
let controlPanelWs = null; // websocket connection to the control panel
const webSocketServer = new WebSocket.Server({port:8081});
webSocketServer.on('connection', function(ws) {
    console.log('New connection established.');
    ws.on('message', function(data) {
        let message = JSON.parse(data);
        console.debug(message);
        switch(message.type) {
            case 'control-panel-connect':
                console.log('Control panel WebSocket connected');
                if(controlPanelWs !== null){
                    console.warn('WARN', 'Previous Control panel WebSocket overwritten.')
                }
                controlPanelWs = ws;
                break;
            case 'zombie-register': {
                if (controlPanelWs.readyState !== WebSocket.OPEN) {
                    console.error('ERROR', 'Control panel WebSocket is not open. Cannot forward: %s', message);
                    return;
                }
                zombies[message.uuid] = ws;
                console.log('New zombie:', message.uuid);
                controlPanelWs.send(data);
                break;
            }
            case 'zombie-cmd': {
                let destinationWs = zombies[message.uuid];
                if(!destinationWs){
                    console.error('ERROR', 'Zombie Websocket with given id was not found', message.uuid);
                    return;
                }
                if (destinationWs.readyState !== WebSocket.OPEN) {
                    console.error('ERROR', 'Zombie WebSocket is not open. Cannot forward: %s', message);
                    return;
                }
                destinationWs.send(data);
                break;
            }
            case 'zombie-result': {
                if(controlPanelWs.readyState !== WebSocket.OPEN){
                    console.error('ERROR','Control panel WebSocket is not open. Cannot forward: %s', message);
                    return;
                }
                controlPanelWs.send(data);
                break;
            }
            case 'chat':
                if(controlPanelWs.readyState !== WebSocket.OPEN){
                    console.error('ERROR','Control panel WebSocket is not open. Cannot forward: %s', message);
                    return;
                }
                controlPanelWs.send(data);
                console.log('FWD: %s', data);
                break;
            case 'room-discovered':
                if(controlPanelWs.readyState !== WebSocket.OPEN){
                    console.error('ERROR','Control panel WebSocket is not open. Cannot forward: %s', message);
                    return;
                }
                controlPanelWs.send(data);
                console.log('FWD: %s', data);
                break;
            default:
                console.warn('WARN', 'unexpected data', data);
        }
    });
});
console.debug('DEBUG', 'Relay WebSocket server started.');
console.log('Please open http://127.0.0.1:8080/ in your browser.');

function getZombieId(message){
    return message.steamId + '_' + message.oculusId;
}
