
import {
	describe,
	after,
	it      }          from 'mocha';
import { strictEqual } from 'node:assert/strict';
import WebSocket       from 'ws';

let ws_client;

describe('ExtWS using ws', () => {
	it('client connect', () => {
		ws_client = new WebSocket('ws://localhost:18365/ws');

		const promise = Promise.all([
			new Promise((resolve) => {
				ws_client.on(
					'open',
					() => {
						resolve();
					},
				);
			}),
			new Promise((resolve) => {
				ws_client.once(
					'message',
					(message) => {
						if (Buffer.isBuffer(message) === true) {
							message = message.toString();
						}

						if (message.startsWith('1{') === true) {
							resolve();
						}
						else {
							throw new Error('Invalid message');
						}
					},
				);
			}),
		]);

		return promise;
	});

	it('client send & receive messages', () => {
		const promise = new Promise((resolve) => {
			ws_client.once(
				'message',
				(message) => {
					if (Buffer.isBuffer(message) === true) {
						message = message.toString();
					}

					strictEqual(
						message,
						'4greeting{"greeting":"Hello, world!"}',
					);

					resolve();
				},
			);
		});

		ws_client.send('4greeting{"name":"world"}');

		return promise;
	});

	it('broadcast', () => {
		const promise = new Promise((resolve) => {
			ws_client.once(
				'message',
				(message) => {
					if (Buffer.isBuffer(message) === true) {
						message = message.toString();
					}

					strictEqual(
						message,
						'4{"foo":"bar"}',
					);

					resolve();
				},
			);
		});

		ws_client.send('4broadcast');

		return promise;
	});

	describe('groups', () => {
		it('message for a group', function () {
			this.slow(250);

			const promise = new Promise((resolve) => {
				ws_client.once(
					'message',
					(message) => {
						if (Buffer.isBuffer(message) === true) {
							message = message.toString();
						}

						strictEqual(
							message,
							'4group{"foo":"bar"}',
						);

						resolve();
					},
				);
			});

			ws_client.send('4joinGroup{"name":"group"}');

			setTimeout(
				() => {
					ws_client.send('4sendToGroup{"name":"group"}');
				},
				100,
			);

			return promise;
		});
		it('message for another group', function () {
			this.slow(1050);

			const promise = new Promise((resolve) => {
				ws_client.once(
					'message',
					() => {
						throw new Error('Received message for another group');
					},
				);

				setTimeout(
					() => resolve(),
					500,
				);
			});

			ws_client.send('4sendToGroup{"name":"another-group"}');

			return promise;
		});
		it('message for a group after leave', function () {
			this.slow(1250);

			const promise = new Promise((resolve) => {
				ws_client.once(
					'message',
					() => {
						throw new Error('Received message for a group after leave');
					},
				);

				setTimeout(
					() => resolve(),
					500,
				);
			});

			ws_client.send('4leaveGroup{"name":"group"}');

			setTimeout(
				() => {
					ws_client.send('4sendToGroup{"name":"group"}');
				},
				100,
			);

			return promise;
		});
	});

	after(() => {
		setTimeout(
			() => process.exit(0), // eslint-disable-line no-process-exit, unicorn/no-process-exit
			1000,
		);
	});
});
