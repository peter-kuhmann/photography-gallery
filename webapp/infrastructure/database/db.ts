import Redis from "ioredis";
import { getEnv } from "~/env";

let redis: Redis | null = null;

type SetMode = "ALWAYS" | "IF_NOT_EXISTS" | "IF_EXISTS";

export function getDb() {
	if (!redis) {
		redis = new Redis(getEnv().REDIS_URL);
	}

	return redis;
}

export async function dbSetJson<TYPE extends object>(
	key: string,
	value: TYPE,
	mode: SetMode,
) {
	const ok = await getDb().call(
		"JSON.SET",
		key,
		"$",
		JSON.stringify(value),
		...(mode === "IF_EXISTS" ? ["XX"] : mode === "IF_NOT_EXISTS" ? ["NX"] : []),
	);

	if (!ok) {
		if (mode === "IF_EXISTS") {
			throw new Error("Mode was 'IF_EXISTS', but record did not exist.");
		}
		if (mode === "IF_NOT_EXISTS") {
			throw new Error("Mode was 'IF_NOT_EXISTS', but record did exist.");
		}
		throw new Error("Unknown error, could not set JSON document.");
	}

	return value;
}

export async function dbGetJson<TYPE extends object>(
	key: string,
): Promise<TYPE | null> {
	const rawDocument = (await getDb().call("JSON.GET", key, "$")) as
		| string
		| null;

	if (!rawDocument) {
		return null;
	}

	return JSON.parse(rawDocument)[0] as TYPE;
}
