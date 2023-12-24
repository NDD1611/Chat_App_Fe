import { locales } from "../../i18nConfig"

export const getLocaleFromPathname = (pathname: string): string => {
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )
    if (pathnameHasLocale) {
        return pathname.split('/')[1]
    }
    return ''
}

export const removeLocaleFromPathname = (pathname: string, locale: string | undefined): string => {
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )
    if (pathnameHasLocale) {
        let newPathname = ''
        if (pathname.startsWith(`/${locale}/`)) {
            newPathname = pathname.replace(`/${locale}/`, '/')
        }
        if (pathname === `/${locale}`) {
            newPathname = pathname.replace(`/${locale}`, '/')
        }
        return newPathname
    }
    return pathname
}