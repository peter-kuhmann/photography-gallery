import de from "~/i18n/locales/de";
import en from "~/i18n/locales/en";

export default defineI18nConfig(() => ({
	legacy: false,
	locale: "en",
	messages: {
		en,
		de,
	},
}));
