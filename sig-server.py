#!/usr/bin/env python

import asyncio
import functools

import websockets
import msgpack
import logging
import queue

SIGNAL1 = "signal.bigscreenvr.com"
SIGNAL2 = "signal2.bigscreenvr.com"
SIGNAL3 = "signal3.bigscreenvr.com"
signalServerURL = SIGNAL2
myIP = '172.26.104.1'


upstreamUrl = 'wss://'+signalServerURL
upstreamUrl = 'ws://'+"localhost:8081" # server.py
ear_socket = None


# msg[b'type'] in [b'offer', b'answer', b'ice']:
# logging.info(f"FROM {socket_from.remote_address[0]} TO {socket_to.remote_address[0]} unpacked:{msg}")

CLIENTS = set()


async def forward(websocket, path):
    CLIENTS.add(websocket)
    logging.info(f'connected {websocket.remote_address}')
    while True:
        msg_raw = await websocket.recv()
        msg = msgpack.unpackb(msg_raw)
        for other_socket in CLIENTS.difference([websocket]):
            logging.debug(f"FROM {websocket.remote_address} TO {other_socket.remote_address} unpacked:{msg}")
            await other_socket.send(msg_raw)

# Logging
logging.basicConfig(level=logging.DEBUG)
logger_websockets = logging.getLogger('websockets')
logger_websockets.setLevel(logging.INFO)
logger_websockets.addHandler(logging.StreamHandler())
logging.getLogger().setLevel(logging.DEBUG)

start_relay = websockets.serve(functools.partial(forward), myIP, 8090)

logging.info("started")
asyncio.get_event_loop().run_until_complete(start_relay)
asyncio.get_event_loop().run_forever()
