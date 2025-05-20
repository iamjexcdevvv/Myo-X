import db from "../database/offlineDB";
import { decryptToken, encryptToken } from "./cryptoUtils";

export const saveUserAccessToken = async (accessToken: string) => {
	const { cipherText, iv } = await encryptToken(accessToken);

	await db.userAuth.put({ id: "access-token", cipherText, iv });
};

export const getUserAccessToken = async () => {
	const record = await db.userAuth.where("id").equals("access-token").first();
	console.log(record);
	if (!record) return null;
	return await decryptToken(record.cipherText, record.iv);
};

export const clearUserAccessToken = async () => {
	db.userAuth.clear();
};
