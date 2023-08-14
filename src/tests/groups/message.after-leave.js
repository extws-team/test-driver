
import { strictEqual } from 'node:assert/strict';

import createClient         from '../../client.js';
import { payloadStringify } from '../../consts.js';

export default async function () {
	const { ws_client } = globalThis;
	const ws_client_another = await createClient({
		closable: true,
	});

	ws_client.send('4leaveGroup{"name":"group"}');
	ws_client_another.send('4joinGroup{"name":"group"}');

	setTimeout(() => {
		ws_client.send('4sendToGroup{"name":"group"}');
	});

	return Promise.race([
		new Promise((resolve, reject) => {
			ws_client.addEventListener(
				'message',
				() => {
					reject(
						new Error('Received message for a group that the client has left'),
					);
				},
				{
					once: true,
				},
			);
		}),
		new Promise((resolve) => {
			ws_client_another.addEventListener(
				'message',
				({ data }) => {
					strictEqual(
						payloadStringify(data),
						'4group{"foo":"bar"}',
					);

					setTimeout(resolve);

					ws_client_another.close();
				},
				{
					once: true,
				},
			);
		}),
	]);
}
