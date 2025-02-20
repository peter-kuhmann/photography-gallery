import {
  DbBaseSchema,
  IdSchema,
} from "~/infrastructure/database/schemas/DbBase";
import { z } from "zod";
import {
  AlbumViewFontSchema,
  CssHexColorSchema,
  CssIntegerPixelSizeSchema,
} from "~/infrastructure/schames/css";

export const DbAlbumSchema = DbBaseSchema.extend({
  ownerUserId: IdSchema,

  title: z.string().nonempty(),
  description: z.string().nonempty().optional(),
  slug: z.string().nonempty(),
  enabled: z.boolean(),

  access: z.discriminatedUnion("type", [
    z.object({ type: z.literal("PUBLIC") }),
    z.object({
      type: z.literal("PASSWORD_PROTECTED"),
      password: z.string().nonempty(),
    }),
  ]),

  style: z.object({
    backgroundColor: CssHexColorSchema,
    textColor: CssHexColorSchema,
    baseBorderRadius: CssIntegerPixelSizeSchema,
    font: AlbumViewFontSchema,
    cover: z.discriminatedUnion("type", [
      z.object({
        type: z.literal("MODERN"),
        pictureId: IdSchema.optional(),
      }),
    ]),
  }),

  sortedPictureIds: z.array(IdSchema),
});

export type DbAlbum = z.infer<typeof DbAlbumSchema>;
