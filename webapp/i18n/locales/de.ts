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
          invalidPassword: "Passwort ist falsch",
        },
      },
    },
  },
} satisfies I18nMessages;
