// import { getRequestConfig, requestLocale } from 'next-intl/server';
// import { notFound } from 'next/navigation';
// import { locales } from '../src/config';

// export default getRequestConfig(async () => {
//   const locale = await requestLocale();

//   if (!locales.includes(locale as 'en' | 'pl')) {
//     notFound();
//   }

//   return {
//     locale,
//     messages: (await import(`../src/locales/${locale}.json`)).default,
//   };
// });
