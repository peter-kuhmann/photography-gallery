import { BaseSchema, IdSchema } from "~/infrastructure/database/schemas/Base";
import { z } from "zod";

export const DbAlbumSchema = BaseSchema.extend({
	ownerUserId: IdSchema,

	title: z.string().nonempty(),
	slug: z.string().nonempty(),
	enabled: z.boolean(),
	access: z.discriminatedUnion("type", [
		z.object({ type: z.literal("PUBLIC") }),
		z.object({
			type: z.literal("PASSWORD_PROTECTED"),
			password: z.string().nonempty(),
		}),
	]),

	pictures: z.array(IdSchema),
});

export type DbAlbum = z.infer<typeof DbAlbumSchema>;
