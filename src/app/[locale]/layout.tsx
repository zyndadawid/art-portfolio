import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import Navbar from "../../components/Navbar";
import { getMessages } from "next-intl/server";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>; // <-- this is the required type!
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params; // Await the params
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
