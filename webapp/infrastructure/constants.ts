export const SUPPORTED_ALBUM_VIEW_FONTS = [
  // Sans Serif
  { name: "Inter", fallback: "sans-serif" },
  { name: "Roboto", fallback: "sans-serif" },
  { name: "Nunito Sans", fallback: "sans-serif" },
  { name: "Nunito", fallback: "sans-serif" },
  { name: "Montserrat", fallback: "sans-serif" },
  { name: "Oswald", fallback: "sans-serif" },
  { name: "Open Sans", fallback: "sans-serif" },

  // Serif
  { name: "EB Garamond", fallback: "serif" },
  { name: "Cormorant Garamond", fallback: "serif" },
  { name: "Zilla Slab", fallback: "serif" },
  { name: "Rokkitt", fallback: "serif" },

  // Handwritten / Fancy
  { name: "Caveat", fallback: "serif" },
  { name: "Dancing Script", fallback: "serif" },
] as const satisfies { name: string; fallback: string }[];

export const SUPPORTED_ALBUM_VIEW_FONT_NAMES = SUPPORTED_ALBUM_VIEW_FONTS.map(
  (font) => font.name,
);
