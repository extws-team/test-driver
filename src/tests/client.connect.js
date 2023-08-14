
import createClient from '../client.js';

export default async function () {
	const ws_client = await createClient();
	globalThis.ws_client = ws_client;
}
