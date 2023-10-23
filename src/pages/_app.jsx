import Head from 'next/head';
import { MantineProvider, ColorSchemeProvider, AppShell } from '@mantine/core';
import { useState } from "react";
import { HeaderResponsive } from "@/header";
import { FooterCentered } from "@/footer";

export default function App(props) {
    const { Component, pageProps } = props;

    const [colorScheme, setColorScheme] = useState('dark');
    const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    const header = (
        <HeaderResponsive links={[
            {label: "Авторизация", link: '/auth'},
            {label: "Витрина проектов", link: '/showcase'},
            {label: "Расписание конференции", link: '/schedules'},
        ]} />
    );
    const footer = (
        <FooterCentered />
    );

    return (
        <>
            <Head>
                <title>Silaeder Conference</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>

            <ColorSchemeProvider colorScheme='dark' toggleColorScheme={toggleColorScheme}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{
                        colorScheme
                    }}
                >
                    <AppShell
                        padding='md'
                        header={header}
                        footer={footer}
                    >
                    <Component {...pageProps} />
                    </AppShell>
                </MantineProvider>
            </ColorSchemeProvider>
        </>
    );
}