
export const SERVER_PORT = Math.floor(Math.random() * 40_000) + 10_000;

const textDecoder = new TextDecoder();
export function payloadStringify(payload) {
	if (typeof payload === 'string') {
		return payload;
	}

	if (
		payload instanceof ArrayBuffer
		|| ArrayBuffer.isView(payload) === true
	) {
		return textDecoder.decode(payload);
	}

	throw new Error('Invalid payload.');
}
