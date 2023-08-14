
import {
	SERVER_PORT,
	payloadStringify } from './consts.js';

let { WebSocket } = globalThis;

export default async function ({
	closable = false,
} = {}) {
	if (!WebSocket) {
		const module_ws = await import('ws');
		WebSocket = module_ws.default;
	}

	const ws_client = new WebSocket(`ws://localhost:${SERVER_PORT}/ws`);

	ws_client.addEventListener(
		'error',
		(error) => {
			throw error;
		},
	);
	if (!closable) {
		ws_client.addEventListener(
			'close',
			() => {
				throw new Error('Connection closed.');
			},
		);
	}

	await Promise.all([
		new Promise((resolve) => {
			ws_client.addEventListener(
				'open',
				() => {
					resolve();
				},
				{
					once: true,
				},
			);
		}),
		new Promise((resolve) => {
			ws_client.addEventListener(
				'message',
				({ data }) => {
					if (payloadStringify(data).startsWith('1{') === true) {
						resolve();
					}
					else {
						throw new Error('Invalid payload received while connecting to server.');
					}
				},
				{
					once: true,
				},
			);
		}),
	]);

	return ws_client;
}
