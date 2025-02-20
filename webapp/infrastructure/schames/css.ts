import { z } from "zod";
import { SUPPORTED_ALBUM_VIEW_FONT_NAMES } from "~/infrastructure/constants";

export const CssHexColorSchema = z
  .string()
  .regex(/#[a-fA-F0-9]{3}([a-fA-F0-9]{3})?/, "Must be a valid HEX CSS color.");

export const CssIntegerPixelSizeSchema = z
  .string()
  .regex(/\d+px/, "Must be an integer CSS pixel size.");

export const AlbumViewFontSchema = z.enum(SUPPORTED_ALBUM_VIEW_FONT_NAMES);
