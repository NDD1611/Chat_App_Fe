'use client'
import { removeLocaleFromPathname } from "@/utils/locale.util";
import { useLingui } from "@lingui/react";
import { Avatar, Box, Menu } from "@mantine/core";
import { useCurrentLocale } from "next-i18n-router/client";
import { usePathname, useRouter } from "next/navigation";
import i18nConfig from "../../../../i18nConfig";

export const SwitchLanguage = () => {
    const { i18n } = useLingui();
    const locale = useCurrentLocale(i18nConfig);
    const pathname = usePathname()
    const router = useRouter()

    const handleChangeLanguage = (lang: string) => {
        const newPathname: string = removeLocaleFromPathname(pathname, locale)
        switch (lang) {
            case 'en':
                router.push(`/en${newPathname}`)
                break
            case 'vi':
                router.push(`/vi${newPathname}`)
                break
        }
    }
    return <Menu shadow="md" width={200} position='right'>
        <Menu.Target >
            <Box component='div'
                mb={15}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <Avatar style={{ cursor: 'pointer' }} size={'sm'} src={i18n._("/images/en.png")} alt='image flag' />
            </Box>
        </Menu.Target>

        <Menu.Dropdown >
            <Menu.Item
                onClick={() => {
                    handleChangeLanguage('en')
                }}
            >
                English
            </Menu.Item>
            <Menu.Item
                onClick={() => {
                    handleChangeLanguage('vi')
                }}
            >
                Tiếng Việt
            </Menu.Item>
        </Menu.Dropdown>
    </Menu>
}
