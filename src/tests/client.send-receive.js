
import { strictEqual } from 'node:assert/strict';

import { payloadStringify } from '../consts.js';

export default function () {
	const { ws_client } = globalThis;

	const promise = new Promise((resolve) => {
		ws_client.addEventListener(
			'message',
			({ data }) => {
				strictEqual(
					payloadStringify(data),
					'4greeting{"greeting":"Hello, world!"}',
				);

				resolve();
			},
			{
				once: true,
			},
		);
	});

	ws_client.send('4greeting{"name":"world"}');

	return promise;
}
