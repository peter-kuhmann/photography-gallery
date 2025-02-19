import { genSalt, hash } from "bcryptjs";
import { getEnv } from "~/env";

export async function hashPassword(password: string): Promise<string> {
	return hash(password, await genSalt(getEnv().PASSWORD_HASH_SALT_ROUNDS));
}
