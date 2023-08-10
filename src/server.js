
import ExtWS from '@extws/server';

export default function (driver) {
	const server = new ExtWS({
		driver,
	});

	server.on(
		'client.greeting',
		(event) => {
			event.client.send(
				'greeting',
				{
					greeting: `Hello, ${event.data.name}!`,
				},
			);
		},
	);

	server.on(
		'client.broadcast',
		() => {
			server.broadcast({
				foo: 'bar',
			});
		},
	);

	server.on(
		'client.joinGroup',
		(event) => {
			event.client.join(
				event.data.name,
			);
		},
	);

	server.on(
		'client.leaveGroup',
		(event) => {
			event.client.leave(
				event.data.name,
			);
		},
	);

	server.on(
		'client.sendToGroup',
		(event) => {
			server.sendToGroup(
				event.data.name,
				'group',
				{
					foo: 'bar',
				},
			);
		},
	);

	return server;
}
