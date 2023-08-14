
import { strictEqual } from 'node:assert/strict';

import { payloadStringify } from '../../consts.js';

export default function () {
	const { ws_client } = globalThis;

	ws_client.send('4joinGroup{"name":"group"}');

	setTimeout(() => {
		ws_client.send('4sendToGroup{"name":"group"}');
	});

	return new Promise((resolve) => {
		ws_client.addEventListener(
			'message',
			({ data }) => {
				strictEqual(
					payloadStringify(data),
					'4group{"foo":"bar"}',
				);

				resolve();
			},
			{
				once: true,
			},
		);
	});
}
