"use client";
import React, { useEffect } from "react";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import messagesEn from "../locales/en/messages.json";
import messagesVi from "../locales/vi/messages.json";
import { useCurrentLocale } from "next-i18n-router/client";
import i18nConfig from "../../i18nConfig";
import { store } from "../redux/store";
import { MantineProvider, createTheme } from "@mantine/core";
import { Provider } from "react-redux";
import { ColorSchemeScript } from "@mantine/core";
import Head from "next/head";
import { socket, socketConnectToServer } from "@/socket/connection.socket";
import "@/styles/global.module.scss";
import "@/app/globals.css";
import "@mantine/core/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

i18n.load({
    en: messagesEn,
    vi: messagesVi,
});
i18n.activate("en");
const theme = createTheme({
    /** Put your mantine theme override here */
});
export const MainProvider = ({ children }: { children: React.ReactNode }) => {
    const locale = useCurrentLocale(i18nConfig);
    useEffect(() => {
        if (locale) {
            i18n.activate(locale);
        }
    }, [locale]);
    useEffect(() => {
        let socketInstance: any = socket;
        const userDetailsJson = localStorage.getItem("userDetails");
        const userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null;
        if (
            (userDetails && socketInstance === null) ||
            (socketInstance && socketInstance.connected === false)
        ) {
            socketConnectToServer(userDetails);
        }
    });
    return (
        <MantineProvider theme={theme}>
            <I18nProvider i18n={i18n}>
                <Provider store={store}>
                    <Head>
                        <ColorSchemeScript />
                    </Head>
                    {children}
                    <ToastContainer />
                </Provider>
            </I18nProvider>
        </MantineProvider>
    );
};
