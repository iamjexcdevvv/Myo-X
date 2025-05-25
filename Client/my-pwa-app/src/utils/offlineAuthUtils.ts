import db from "../database/offlineDB";
import { decryptToken, encryptToken } from "./cryptoUtils";

export const saveUserAccessToken = async (accessToken: string) => {
	const { cipherText, iv, salt } = await encryptToken(accessToken);

	await db.userAuth.put({ id: "access-token", cipherText, salt, iv });
};

export const isUserLastAuthenticated = async () => {
	const record = await db.userAuth.where("id").equals("access-token").first();

	if (!record) return false;

	const token = await decryptToken(record);

	if (!token) return false;

	return true;
};

export const clearUserAccessToken = async () => {
	db.userAuth.clear();
};
