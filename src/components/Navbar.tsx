"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
export default function Navbar() {
    const locale = useLocale();
    const path = usePathname();
    const pl = locale === "pl";
    useEffect(() => { document.documentElement.lang = locale; }, [locale]);
    return <header className="site-header"><Link className="wordmark" href={`/${locale}`}>DAWID ŻYNDA<span>ART / MATTER / SPACE</span></Link><nav aria-label={pl ? "Nawigacja" : "Main navigation"}>
 {[['portfolio', pl ? 'Prace' : 'Works'], ['cv', 'CV'], ['contact', pl ? 'Kontakt' : 'Contact']].map(([route, label]) => <Link key={route} href={`/${locale}/${route}`} aria-current={path.includes('/' + route) ? 'page' : undefined}>{label}</Link>)}
 <Link href={`/${locale}#play`}>{pl ? "Graj" : "Play"} ✳</Link>
 <Link className="language" href={path.replace(`/${locale}`, `/${pl ? 'en' : 'pl'}`)} lang={pl ? 'en' : 'pl'}>{pl ? 'EN' : 'PL'} ↗</Link></nav></header>;
}
