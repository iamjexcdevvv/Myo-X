async function getKey(salt: Uint8Array): Promise<CryptoKey> {
	const encoder = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		encoder.encode(import.meta.env.VITE_ENCRYPTION_KEY),
		{ name: "PBKDF2" },
		false,
		["deriveKey"]
	);

	return crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt,
			iterations: 100_000,
			hash: "SHA-256",
		},
		keyMaterial,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt", "decrypt"]
	);
}

export async function encryptToken(token: string): Promise<{
	cipherText: string;
	iv: string;
	salt: string;
}> {
	const encoder = new TextEncoder();
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const salt = crypto.getRandomValues(new Uint8Array(16)); // per-token salt (optional)
	const key = await getKey(salt);
	const encoded = encoder.encode(token);

	const encrypted = await crypto.subtle.encrypt(
		{ name: "AES-GCM", iv },
		key,
		encoded
	);

	return {
		cipherText: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
		iv: btoa(String.fromCharCode(...iv)),
		salt: btoa(String.fromCharCode(...salt)),
	};
}

export async function decryptToken({
	cipherText,
	iv,
	salt,
}: {
	cipherText: string;
	iv: string;
	salt: string;
}): Promise<string> {
	const decoder = new TextDecoder();
	const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
	const saltBytes = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0));
	const encryptedBytes = Uint8Array.from(atob(cipherText), (c) =>
		c.charCodeAt(0)
	);

	const key = await getKey(saltBytes);

	const decrypted = await crypto.subtle.decrypt(
		{ name: "AES-GCM", iv: ivBytes },
		key,
		encryptedBytes
	);

	return decoder.decode(decrypted);
}
