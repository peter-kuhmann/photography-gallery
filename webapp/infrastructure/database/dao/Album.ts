import { REDIS_KEYS } from "~/infrastructure/database/constants";
import {
  generateCreateData,
  generateUpdateData,
} from "~/infrastructure/database/dao/Base";
import { dbGetJson, dbSetJson, getDb } from "~/infrastructure/database/db";
import {
  type DbAlbum,
  DbAlbumSchema,
} from "~/infrastructure/database/schemas/DbAlbum";
import type {
  CreateInputData,
  UpdateInputData,
} from "~/infrastructure/database/schemas/DbBase";

export function getAlbumKey(id: string): string {
  return REDIS_KEYS.albums.entitiesPrefix + id;
}

export async function createAlbum(
  albumData: CreateInputData<DbAlbum>,
): Promise<DbAlbum> {
  const newAlbum: DbAlbum = DbAlbumSchema.parse({
    ...generateCreateData(),
    ...albumData,
  });

  const fieldsUpdated = await getDb().hsetnx(
    REDIS_KEYS.albums.slugToIdHash,
    newAlbum.slug,
    newAlbum.id,
  );

  if (fieldsUpdated === 0) {
    throw new Error("An album with that slug already exists.");
  }

  return dbSetJson<DbAlbum>(
    getAlbumKey(newAlbum.id),
    newAlbum,
    "IF_NOT_EXISTS",
  );
}

export async function updateAlbum(
  album: DbAlbum,
  updates: UpdateInputData<DbAlbum>,
): Promise<DbAlbum> {
  const updatedAlbum: DbAlbum = DbAlbumSchema.parse({
    ...album,
    ...updates,
    ...generateUpdateData(),
  });

  if (album.slug !== updatedAlbum.slug) {
    const fieldsUpdated = await getDb().hsetnx(
      REDIS_KEYS.albums.slugToIdHash,
      updatedAlbum.slug,
      album.id,
    );

    if (fieldsUpdated === 0) {
      throw new Error("An album with that slug already exists.");
    }

    await getDb().hdel(REDIS_KEYS.albums.slugToIdHash, album.slug);
  }

  return dbSetJson<DbAlbum>(
    getAlbumKey(updatedAlbum.id),
    updatedAlbum,
    "IF_EXISTS",
  );
}

export async function getAlbumById(id: string): Promise<DbAlbum | null> {
  return dbGetJson<DbAlbum>(getAlbumKey(id));
}

export async function getAlbumBySlug(slug: string): Promise<DbAlbum | null> {
  const albumId = await getDb().hget(REDIS_KEYS.albums.slugToIdHash, slug);
  if (!albumId) {
    return null;
  }

  const album = await dbGetJson<DbAlbum>(getAlbumKey(albumId));
  if (!album) {
    throw new Error(
      "Slug was present in slug to id hash, but album could not be found.",
    );
  }

  return album;
}
