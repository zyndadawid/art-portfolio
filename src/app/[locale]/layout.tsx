import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import Navbar from "../../components/Navbar";
import { getMessages } from "next-intl/server";
export default async function LocaleLayout({ children, params }: {
    children: ReactNode;
    params: Promise<{
        locale: string;
    }>;
}) {
    const { locale } = await params;
    const messages = await getMessages({ locale });
    return <NextIntlClientProvider locale={locale} messages={messages}><Navbar />{children}</NextIntlClientProvider>;
}
