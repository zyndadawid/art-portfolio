import { getRequestConfig } from 'next-intl/server';
import { locales } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Ensure that locale is defined and is one of "en" | "pl"
  const l = (locale && locales.includes(locale as "en" | "pl"))
    ? (locale as "en" | "pl")
    : "en";

  return {
    locale: l, // include locale property
    messages: (await import(`./locales/${l}.json`)).default,
  };
});
