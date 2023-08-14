
import { strictEqual } from 'node:assert/strict';

import createClient         from '../../client.js';
import { payloadStringify } from '../../consts.js';

export default async function () {
	const { ws_client } = globalThis;
	const ws_client_another = await createClient({
		closable: true,
	});

	ws_client_another.send('4joinGroup{"name":"another-group"}');

	setTimeout(() => {
		ws_client.send('4sendToGroup{"name":"another-group"}');
	});

	return Promise.race([
		new Promise((resolve, reject) => {
			ws_client.addEventListener(
				'message',
				() => {
					reject(
						new Error('Received message for another group'),
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
