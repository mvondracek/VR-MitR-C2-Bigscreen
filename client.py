#!/usr/bin/env python

# WS client example

import asyncio
import datetime
import time

import websockets
import msgpack

destination = "172.26.104.1:8080"
destination = 'localhost:8081' # server.py
destination = '172.26.104.1:8080' # relay.py
destination = '172.26.104.1:8090' # sig-server.py

async def hello():
    async with websockets.connect('ws://' + destination) as websocket:
        while True:
            msg = {'type': 'ice', 'foo': datetime.datetime.utcnow().isoformat() + 'Z'}
            msg_raw = msgpack.packb(msg)
            await websocket.send(msg_raw)
            print(f"> msg:{msg}, msg_raw:{msg_raw}")

            #msg_raw_recv = await websocket.recv()
            #print(f"< recv:{msg_raw_recv}")
            #msg_recv = msgpack.unpackb(msg_raw_recv)
            #print(f"# unpacked:{msg_recv}")
            await asyncio.sleep(1)


print("started")
asyncio.get_event_loop().run_until_complete(hello())

