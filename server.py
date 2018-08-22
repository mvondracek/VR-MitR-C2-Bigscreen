#!/usr/bin/env python

# WS server that sends messages at random intervals

import asyncio
import websockets
import msgpack

async def server(websocket, path):
    print("connected")
    while True:
        msg_raw = await websocket.recv()
        print(f"< recv:{msg_raw}")
        #msg = msgpack.unpackb(msg_raw)
        msg = msg_raw
        print(f"# unpacked:{msg}")

        #msg_raw = msgpack.packb(b'replty to ' + msg)
        #await websocket.send(msg_raw)
        #print(f"> send:{msg_raw}")

start_server = websockets.serve(server, '127.0.0.1', 8081)

print("started")
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
