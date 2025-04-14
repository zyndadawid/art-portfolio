import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import Navbar from "../../components/Navbar";
import { getMessages } from "next-intl/server";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

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
