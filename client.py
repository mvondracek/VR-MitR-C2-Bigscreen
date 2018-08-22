#!/usr/bin/env python

# WS client example

import asyncio
import time

import websockets
import msgpack

destination = "172.26.104.1:8080"


async def hello():
    async with websockets.connect('ws://' + destination) as websocket:
        while True:
            input('retry?')
            msg = {'type': 'test-msg'}
            print(f"# unpacked:{msg}")

            msg_raw = msgpack.packb(msg)
            await websocket.send(msg_raw)
            print(f"> send:{msg_raw}")

            #msg_raw_recv = await websocket.recv()
            #print(f"< recv:{msg_raw_recv}")
            #msg_recv = msgpack.unpackb(msg_raw_recv)
            #print(f"# unpacked:{msg_recv}")


print("started")
asyncio.get_event_loop().run_until_complete(hello())

