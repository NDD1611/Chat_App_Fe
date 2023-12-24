/** @type {import('@lingui/conf').LinguiConfig} */
import { formatter } from "@lingui/format-json"
import { locales, defaultLocale } from "./i18nConfig";
module.exports = {
    locales: locales,
    catalogs: [
        {
            path: "<rootDir>/src/locales/{locale}/messages",
            include: ["src"],
        },
    ],
    sourceLocale: defaultLocale,
    format: formatter({ style: "minimal" }),
};