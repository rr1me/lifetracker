export const concat = (...buffers: Uint8Array[]) => {
	const size = buffers.reduce((acc, { length }) => acc + length, 0);
	const buf = new Uint8Array(size);
	let i = 0;
	for (const buffer of buffers) {
		buf.set(buffer, i);
		i += buffer.length;
	}
	return buf;
};

export const encoder = new TextEncoder();
export const decoder = new TextDecoder();
