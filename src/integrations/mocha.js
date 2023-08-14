
import {
	describe,
	it,
	after   } from 'mocha';

import {
	createServer,
	runTests    } from '../main.js';

export { SERVER_PORT } from '../consts.js';

export default function (driver) {
	createServer(driver);

	runTests({
		describe,
		test({
			name,
			test,
			slow,
			timeout,
		}) {
			return it(
				name,
				function () {
					if (typeof timeout === 'number') {
						this.timeout(timeout);
					}
					if (typeof slow === 'number') {
						this.slow(slow);
					}

					return test();
				},
			);
		},
	});

	after(() => {
		setTimeout(() => {
			process.exit(); // eslint-disable-line no-process-exit, unicorn/no-process-exit
		});
	});
}
