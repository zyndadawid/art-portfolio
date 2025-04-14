import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import Navbar from "../../components/Navbar";
import { getMessages } from "next-intl/server";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>; // 👈 NOTE: This is now a Promise
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params; // 👈 Await the params here

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navbar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
