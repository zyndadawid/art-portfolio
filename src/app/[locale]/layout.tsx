import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import Navbar from "../../components/Navbar";
import { getMessages } from "next-intl/server";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
