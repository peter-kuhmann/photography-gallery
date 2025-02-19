export const REDIS_KEYS = {
	users: {
		entitiesPrefix: "users:entities:",
		emailToIdHash: "users:emailToId",
	},
	albums: {
		entitiesPrefix: "albums:entities:",
		slugToIdHash: "albums:slugToId",
	},
	albumPictures: {
		entitiesPrefix: "album-pictures:entities:",
	},
} as const;
