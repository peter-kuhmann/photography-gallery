import { dbGetJson, dbSetJson, getDb } from "~/infrastructure/database/db";

import { REDIS_KEYS } from "~/infrastructure/database/constants";
import {
	generateCreateData,
	generateUpdateData,
} from "~/infrastructure/database/dao/Base";
import type {
	CreateInputData,
	UpdateInputData,
} from "~/infrastructure/database/schemas/Base";
import {
	type DbUser,
	DbUserSchema,
} from "~/infrastructure/database/schemas/User";

export function getUserKey(userId: string): string {
	return REDIS_KEYS.users.entitiesPrefix + userId;
}

export async function createUser(
	userData: CreateInputData<DbUser>,
): Promise<DbUser> {
	const newUser: DbUser = DbUserSchema.parse({
		...generateCreateData(),
		...userData,
	});

	const fieldsUpdated = await getDb().hsetnx(
		REDIS_KEYS.users.emailToIdHash,
		newUser.email,
		newUser.id,
	);

	if (fieldsUpdated === 0) {
		throw new Error("A user with that ID already exists.");
	}

	return dbSetJson<DbUser>(getUserKey(newUser.id), newUser, "IF_NOT_EXISTS");
}

export async function updateUser(
	user: DbUser,
	updatedUserData: UpdateInputData<DbUser>,
): Promise<DbUser> {
	const updatedUser: DbUser = DbUserSchema.parse({
		...structuredClone(user),
		...updatedUserData,
		...generateUpdateData(),
	});

	return dbSetJson<DbUser>(getUserKey(user.id), updatedUser, "IF_EXISTS");
}

export function getUserById(id: string): Promise<DbUser | null> {
	return dbGetJson<DbUser>(getUserKey(id));
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
	const userId = await getDb().hget(REDIS_KEYS.users.emailToIdHash, email);
	if (!userId) {
		return null;
	}

	const user = await dbGetJson<DbUser>(getUserKey(userId));
	if (!user) {
		throw new Error(
			"Email was present in email to id hash, but user could not be found.",
		);
	}

	return user;
}
