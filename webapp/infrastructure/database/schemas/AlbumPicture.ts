import { BaseSchema, IdSchema } from "~/infrastructure/database/schemas/Base";
import { z } from "zod";

const S3PictureSchema = z.object({
	mimeType: z.string().regex(/^image\/(jpg|jpeg|png|webp)/),
	bytes: z.number().min(1),
	width: z.number().min(1),
	height: z.number().min(1),
	s3ObjectKey: z.string().nonempty(),
});

export const DbAlbumPictureSchema = BaseSchema.extend({
	owningAlbumId: IdSchema,
	filename: z.string(),

	originalImage: S3PictureSchema,
	optimizedImage: S3PictureSchema,
});

export type DbAlbumPicture = z.infer<typeof DbAlbumPictureSchema>;
