import { REDIS_KEYS } from "~/infrastructure/database/constants";
import {
	generateCreateData,
	generateUpdateData,
} from "~/infrastructure/database/dao/Base";
import { dbGetJson, dbSetJson } from "~/infrastructure/database/db";
import {
	type DbAlbumPicture,
	DbAlbumPictureSchema,
} from "~/infrastructure/database/schemas/AlbumPicture";
import type {
	CreateInputData,
	UpdateInputData,
} from "~/infrastructure/database/schemas/Base";

export function getAlbumPictureKey(id: string): string {
	return REDIS_KEYS.albumPictures.entitiesPrefix + id;
}

export async function createAlbumPicture(
	albumPicture: CreateInputData<DbAlbumPicture>,
): Promise<DbAlbumPicture> {
	const newAlbumPicture: DbAlbumPicture = DbAlbumPictureSchema.parse({
		...generateCreateData(),
		...albumPicture,
	});

	return dbSetJson<DbAlbumPicture>(
		getAlbumPictureKey(newAlbumPicture.id),
		newAlbumPicture,
		"IF_NOT_EXISTS",
	);
}

export async function updateAlbumPicture(
	albumPicture: DbAlbumPicture,
	updates: UpdateInputData<DbAlbumPicture>,
): Promise<DbAlbumPicture> {
	const updatedAlbumPicture: DbAlbumPicture = DbAlbumPictureSchema.parse({
		...albumPicture,
		...updates,
		...generateUpdateData(),
	});

	return dbSetJson<DbAlbumPicture>(
		getAlbumPictureKey(updatedAlbumPicture.id),
		updatedAlbumPicture,
		"IF_EXISTS",
	);
}

export async function getAlbumPictureById(
	id: string,
): Promise<DbAlbumPicture | null> {
	return dbGetJson<DbAlbumPicture>(getAlbumPictureKey(id));
}
