#!/usr/bin/env python

import asyncio
import functools
from multiprocessing import Process, Pipe
import os

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
#upstreamUrl = 'ws://'+"127.0.0.1:8081"
ear_socket = None


def log(socket_from, socket_to, msg):
    if msg[b'type'] == b'room-latest':
        print('.')
        # logging.info(f"FROM {socket_from.remote_address[0]} TO {socket_to.remote_address[0]} unpacked:{msg}")
    elif msg[b'type'] in [b'offer', b'answer', b'ice']:
        logging.info(f"FROM {socket_from.remote_address[0]} TO {socket_to.remote_address[0]} unpacked:{msg}")
    else:
        logging.info(f"FROM {socket_from.remote_address[0]} TO {socket_to.remote_address[0]} unpacked:{msg}")


async def forward_up(down_socket, up_socket, queue_client_2_mitm):
    async for msg_raw in down_socket:
        msg = msgpack.unpackb(msg_raw)
        log(down_socket, up_socket, msg)
        queue_client_2_mitm.put(msg_raw)
        await up_socket.send(msg_raw)
    await asyncio.sleep(0.04)


async def forward_down(down_socket, up_socket, queue_mitm_2_client):
    async for msg_raw in up_socket:
        msg = msgpack.unpackb(msg_raw)
        log(up_socket, down_socket, msg)
        await down_socket.send(msg_raw)
    await asyncio.sleep(0.04)


async def mitm2client(down_socket, queue_mitm_2_client):
    logging.info('mitm2client queue_mitm_2_client.qsize()==' + str(queue_mitm_2_client.qsize()))
    logging.info('queue_mitm_2_client.GET')
    try:
        msg = queue_mitm_2_client.get(timeout=0.050)
    except queue.Empty:
        pass
        logging.debug('queue_client_2_mitm empty')
    else:
        logging.info('>>>>>>>>> MITM -> client queue_mitm_2_client msg:' + str(msg))
        await down_socket.send(msg)
        queue_mitm_2_client.task_done()
    asyncio.sleep(0.04)


async def relay(down_socket, path, queue_client_2_mitm, queue_mitm_2_client):
    logging.info('connected relay ' + str(down_socket.remote_address))
    async with websockets.connect(upstreamUrl) as up_socket:
        while True:
            await asyncio.ensure_future(asyncio.gather(
                forward_up(down_socket, up_socket, queue_client_2_mitm),
                forward_down(down_socket, up_socket, queue_mitm_2_client),
                mitm2client(down_socket, queue_mitm_2_client),
            ))


async def ear_register(socket, path, queue_client_2_mitm, queue_mitm_2_client):
    logging.info('connected ' + str(socket.remote_address))
    global ear_socket
    ear_socket = socket
    msg = msgpack.unpackb(await ear_socket.recv())
    if msg[b'type'] == b'box-register':
        logging.info('registered ' + str(socket.remote_address))
    else:
        logging.error('unexpected message type ' + str(socket.remote_address)+' '+str(msg))

    msg_raw = msgpack.packb({'type': 'registered'})
    await ear_socket.send(msg_raw)
    logging.info('sent ' + str(msg_raw))
    while True:
        try:
            # logging.debug('waiting for queue_client_2_mitm')
            msg = queue_client_2_mitm.get(timeout=0.050)
        except queue.Empty:
            pass
            # logging.debug('queue_client_2_mitm empty')
        else:
            logging.info('queue_client_2_mitm msg:' + str(msg))
            await ear_socket.send(msg)
            queue_client_2_mitm.task_done()
        try:
            msg = await asyncio.wait_for(ear_socket.recv(), 0.050)
        except asyncio.TimeoutError:
            pass
        else:
            logging.info('ear_register ///// MITM -> CLIENT queue_mitm_2_client msg:' + str(msg))
            queue_mitm_2_client.put(msg)
            logging.info('ear_register queue_mitm_2_client.qsize()==' + str(queue_mitm_2_client.qsize()))


# queue_client_2_mitm = queue.Queue()
# queue_mitm_2_client = queue.Queue()


# start_ear = websockets.serve(functools.partial(
#     ear_register,
#    queue_client_2_mitm=queue_client_2_mitm,
#    queue_mitm_2_client=queue_mitm_2_client), myIP, 8090)
# start_relay = websockets.serve(functools.partial(
#    relay,
#    queue_client_2_mitm=queue_client_2_mitm,
#    queue_mitm_2_client=queue_mitm_2_client), myIP, 8080)

# logging.info("started")
# asyncio.get_event_loop().run_until_complete(asyncio.gather(start_relay, start_ear))
# asyncio.get_event_loop().run_forever()


# ################################################################
def client_receiver(client2mitm_pipe, mitm2client_pipe):
    async def serve_connection(websocket, path, client2mitm_pipe, mitm2client_pipe):
        logging.info(f"CONNECTED client {websocket.remote_address}")
        cs = Process(target=client_sender, args=(websocket, mitm2client_pipe))
        cs.start()
        try:
            while True:
                logging.debug('client_receiver: waiting on websocket.recv')
                msg_raw = await websocket.recv()
                msg = msgpack.unpackb(msg_raw)
                logging.info(f"FROM {websocket.remote_address} unpacked:{msg}")
                client2mitm_pipe.send((websocket.remote_address, msg_raw))
        finally:
            logging.info(f"DISCONNECTED client {websocket.remote_address}")
            cs.join() # TODO maybe await

    logging_config()
    logging.debug(
        f'client_receiver: module name: {__name__}, parent process: {os.getppid()}, process id:{os.getpid()}.')
    logging.debug('client_receiver: starting server')
    asyncio.get_event_loop().run_until_complete(websockets.serve(functools.partial(
        serve_connection, client2mitm_pipe=client2mitm_pipe, mitm2client_pipe=mitm2client_pipe), 'localhost', 8080))
    asyncio.get_event_loop().run_forever()
    logging.debug('client_receiver: server terminated')


def client_sender(websocket, mitm2client_pipe):
    logging_config()
    logging.info(f'client_sender: module name: {__name__}, parent process: {os.getppid()}, process id:{os.getpid()}.')
    while True:
        logging.debug('client_sender: waiting on mitm2client_pipe')
        remote_address, msg_raw = mitm2client_pipe.recv()
        logging.debug('client_sender: sending')
        loop = asyncio.get_event_loop()
        loop.run_until_complete(websocket.send(msg_raw))
        loop.close()
        logging.debug('client_sender: sent ok')


def logging_config():
    logging.basicConfig(level=logging.DEBUG)
    logger_websockets = logging.getLogger('websockets')
    logger_websockets.setLevel(logging.INFO)
    logger_websockets.addHandler(logging.StreamHandler())
    logging.getLogger().setLevel(logging.DEBUG)


def main():
    logging_config()
    logging.info(f'main module name: {__name__}, parent process: {os.getppid()}, process id:{os.getpid()}. ')

    client2mitm_pipe, mitm2client_pipe = Pipe()
    cr = Process(target=client_receiver, args=(client2mitm_pipe, mitm2client_pipe))
    cr.start()
    cr.join()


if __name__ == '__main__':
    main()
