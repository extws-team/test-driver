
import TESTS from './tests.js';

function createTest(
	test_functions,
	test_options,
) {
	if ('tests' in test_options) {
		test_functions.describe(
			test_options.name,
			() => {
				for (const test_option of test_options.tests) {
					createTest(
						test_functions,
						test_option,
					);
				}
			},
		);
	}
	else if ('test' in test_options) {
		test_functions.test(test_options);
	}
	else {
		throw new Error('Invalid test options.');
	}
}

export async function runTests(test_functions) {
	for (const test of TESTS) {
		createTest(
			test_functions,
			test,
		);
	}
}

export { SERVER_PORT } from './consts.js';
export { default as createServer } from './server.js';
