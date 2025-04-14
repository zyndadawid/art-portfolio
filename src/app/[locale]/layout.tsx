// import { ReactNode } from "react";
// import { notFound } from "next/navigation";
// import { NextIntlClientProvider } from "next-intl";
// import Navbar from "../../components/Navbar";
// import { getMessages } from "next-intl/server";

// type Props = {
//   children: ReactNode;
//   params: { locale: string };
// };

// export default async function LocaleLayout({
//   children,
//   params: { locale },
// }: Props) {
//   const messages = await getMessages();

//   return (
//     <html lang={locale}>
//       <body>
//         <NextIntlClientProvider messages={messages}>
//           <Navbar />
//           {children}
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   );
// }
// import { notFound } from "next/navigation";
// import { NextIntlClientProvider } from "next-intl";
// import Navbar from "@/components/Navbar";

// export async function generateStaticParams() {
//   return [{ locale: "en" }, { locale: "pl" }];
// }

// export const getRequestConfig = ({
//   params,
// }: {
//   params: { locale: string };
// }) => {
//   return { locale: params.locale };
// };

// export default async function LocaleLayout({
//   children,
//   params: { locale },
// }: {
//   children: React.ReactNode;
//   params: { locale: string };
// }) {
//   let messages;
//   try {
//     messages = (await import(`../../locales/${locale}.json`)).default;
//   } catch (error) {
//     notFound();
//   }

//   return (
//     <html lang={locale}>
//       <body>
//         <NextIntlClientProvider locale={locale} messages={messages}>
//           <Navbar />
//           {children}
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   );
// }
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import Navbar from "@/components/Navbar";

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pl" }];
}

// Remove getRequestConfig export from here

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`../../locales/${locale}.json`)).default;
  } catch {
    notFound();
  }

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
