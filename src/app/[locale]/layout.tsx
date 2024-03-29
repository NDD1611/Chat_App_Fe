import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MainProvider } from "@/provider/Provider";
import "@/styles/global.css";
import "@/app/globals.css";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <MainProvider>{children}</MainProvider>
            </body>
        </html>
    );
}
