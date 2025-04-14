import {getRequestConfig} from 'next-intl/server';
import { notFound } from 'next/navigation';
import {locales} from './config'

export default getRequestConfig(async ({locale})=> {
    if(!locales.includes(locale as string )) notFound();

    return {
        messages: (await import(`./locales/${locale}.json`)).default,
    }
})