import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import Navbar from "../../components/Navbar";
import { getMessages } from "next-intl/server";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages({ locale: params.locale });

  return (
    <html lang={params.locale}>
      <body>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <Navbar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
