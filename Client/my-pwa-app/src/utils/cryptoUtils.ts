async function getKey(): Promise<CryptoKey> {
	const enc = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		enc.encode(import.meta.env.VITE_ENCRYPTION_KEY),
		{ name: "PBKDF2" },
		false,
		["deriveKey"]
	);

	return crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt: enc.encode("unique-salt"),
			iterations: 100000,
			hash: "SHA-256",
		},
		keyMaterial,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt", "decrypt"]
	);
}

export async function encryptToken(
	token: string
): Promise<{ cipherText: string; iv: number[] }> {
	const key = await getKey();
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const encoded = new TextEncoder().encode(token);
	const encrypted = await crypto.subtle.encrypt(
		{ name: "AES-GCM", iv },
		key,
		encoded
	);
	return {
		cipherText: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
		iv: Array.from(iv),
	};
}

export async function decryptToken(
	cipherText: string,
	iv: number[]
): Promise<string> {
	const key = await getKey();
	const encryptedBytes = Uint8Array.from(atob(cipherText), (c) =>
		c.charCodeAt(0)
	);
	const decrypted = await crypto.subtle.decrypt(
		{ name: "AES-GCM", iv: new Uint8Array(iv) },
		key,
		encryptedBytes
	);
	return new TextDecoder().decode(decrypted);
}
