/* eslint-disable unicorn/no-await-expression-member */

const tests = [
	{
		name: 'client',
		tests: [
			{
				name: 'connect',
				test: (await import('./tests/client.connect.js')).default,
			},
			{
				name: 'send & receive messages',
				test: (await import('./tests/client.send-receive.js')).default,
			},
		],
	},
	{
		name: 'groups',
		tests: [
			{
				name: 'message for a group',
				test: (await import('./tests/groups/message.js')).default,
			},
			{
				name: 'message for another group',
				test: (await import('./tests/groups/message.another-group.js')).default,
			},
			{
				name: 'message for a group after leave that group',
				test: (await import('./tests/groups/message.after-leave.js')).default,
			},
		],
	},
	{
		name: 'broadcast',
		tests: [
			{
				name: 'broadcast',
				test: (await import('./tests/broadcast.js')).default,
			},
		],
	},
];

export default tests;
