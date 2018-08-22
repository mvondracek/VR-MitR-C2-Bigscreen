#!/usr/bin/env python

# WS server that sends messages at random intervals

import asyncio
import websockets
import msgpack


async def server(websocket, path):
    print("connected")
    while True:
        msg_raw = await websocket.recv()
        msg = msgpack.unpackb(msg_raw)
        print(f"< msg:{msg}, msg_raw:{msg_raw}")


start_server = websockets.serve(server, 'localhost', 8081)

print("started")
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
