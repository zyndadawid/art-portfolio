"use client";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useState, type CSSProperties } from "react";
import works from "@/data/portfolio.json";
const positions = [[16, 27], [48, 19], [80, 28], [31, 57], [69, 57], [15, 86], [85, 86]];
export default function PortfolioList() {
    const locale = useLocale() as 'en' | 'pl';
    const pl = locale === 'pl';
    const [view, setView] = useState('map');
    return <section className="works-page"><div className="works-heading"><div><p className="micro">02 — {pl ? 'ATLAS PRAC' : 'AN ATLAS OF WORKS'}</p><h1>{pl ? 'Wszystko jest' : 'Everything is'}<br /><em>{pl ? 'połączone.' : 'connected.'}</em></h1></div><div className="works-tools"><p>{pl ? 'Siedem układów. Nieskończenie wiele połączeń. Podążaj za własną orbitą.' : 'Seven systems. Infinite connections. Follow your own orbit.'}</p><div className="view-toggle"><button aria-pressed={view === 'map'} onClick={() => setView('map')}>{pl ? 'Konstelacja' : 'Constellation'} ↗</button><button aria-pressed={view === 'index'} onClick={() => setView('index')}>{pl ? 'Indeks' : 'Index'} ☰</button></div></div></div>
 <div className={view === 'map' ? 'constellation' : 'work-index'}>
 {view === 'map' && <><svg className="star-lines" viewBox="0 0 1000 900" preserveAspectRatio="none" aria-hidden="true"><path d="M160 243 L480 171 L800 252 L690 513 L850 774 L310 513 L150 774 L160 243 L690 513 L480 171 L310 513 L800 252"/><ellipse cx="500" cy="450" rx="420" ry="320"/></svg><span className="map-coordinate micro" aria-hidden="true">∞<br />NO FIXED CENTRE</span></>}
 {works.map((w, i) => <Link className="work-node" key={w.slug} href={`/${locale}/portfolio/${w.slug}`} style={{ '--x': positions[i][0] + '%', '--y': positions[i][1] + '%', '--delay': `${i * -1.7}s` } as CSSProperties}><span className="node-number micro">{String(i + 1).padStart(2, '0')} /</span><div className="node-image"><Image src={w.link} alt={w.title[locale]} width={420} height={320} sizes="(max-width: 700px) 75vw, 25vw"/></div><div className="node-caption"><h2>{w.title[locale]}</h2><span>↗</span></div></Link>)}
 </div><footer className="works-footer micro"><span>{pl ? 'PRZYCIĄGANIE JEST POCZĄTKIEM' : 'ATTRACTION IS A BEGINNING'}</span><a href="/media/Dawid_Zynda_portfolio.pdf" target="_blank" rel="noreferrer">{pl ? 'CAŁE PORTFOLIO' : 'COMPLETE PORTFOLIO'} ↓ PDF</a></footer></section>;
}
