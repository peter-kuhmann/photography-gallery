import type { I18nMessages } from "~/i18n/types";

export default {
  language: "German",
  public: {
    album: {
      view: {
        notFound: {
          title: "Album nicht gefunden",
        },
        passwordProtection: {
          passwordPlaceholder: "Passwort",
          unlockButton: "Entsperren",
          invalidPassword: "Passwort ist falsch",
        },
        cover: {
          openAlbum: "Album öffnen",
        },
      },
    },
  },
} satisfies I18nMessages;
