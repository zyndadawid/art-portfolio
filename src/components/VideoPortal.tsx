"use client";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
const films = ["/media/transmission-01.mp4", "/media/transmission-02.mp4", "/media/transmission-03.mp4", "/media/transmission-04.mp4"];
export default function VideoPortal() {
    const pl = useLocale() === "pl";
    const locale = pl ? 'pl' : 'en';
    const [active, setActive] = useState<number | null>(null);
    const [playing, setPlaying] = useState(false);
    const [failed, setFailed] = useState(false);
    const video = useRef<HTMLVideoElement>(null);
    useEffect(() => { setActive(Math.floor(Math.random() * films.length)); }, []);
    useEffect(() => { if (active === null)
        return; setFailed(false); const reduced = window.matchMedia('(prefers-reduced-motion: reduce)'); if (!reduced.matches)
        video.current?.play().catch(() => setPlaying(false)); }, [active]);
    function select(i: number) { setActive(i); }
    return <section className="portal">
 <video ref={video} className="portal-film" src={active === null ? undefined : films[active]} poster="/media/event-horizon-05.webp" muted loop playsInline preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false); }} aria-label={pl ? 'Film — Horyzont zdarzeń' : 'Event Horizon — moving image'}/>
 <div className="portal-shade"/><div className="portal-orbit" aria-hidden="true"/>
 <div className="portal-topline micro"><span>01 — {pl ? 'POLE WIDZENIA' : 'FIELD OF VIEW'}</span><span>{pl ? 'MATERIA W CIĄGŁEJ PRZEMIANIE' : 'MATTER IN CONSTANT TRANSFORMATION'}</span></div>
 <div className="portal-title"><p className="micro">{pl ? 'RZEŹBA · OBRAZ · RUCH' : 'SCULPTURE · IMAGE · MOTION'}</p><h1>{pl ? 'Teoria' : 'Theory of'}<br /><em>{pl ? 'wszystkiego' : 'everything'}</em><span className="title-star" aria-hidden="true">✳</span></h1><div className="portal-intro"><p>{pl ? 'Pomiędzy tym, co widzialne, a tym, co nieznane.' : 'Somewhere between the visible and the unknown.'}</p><Link className="enter-link" href={`/${locale}/portfolio`}>{pl ? 'Wejdź w konstelację' : 'Enter the constellation'} <span>↗</span></Link></div></div>
 <footer className="portal-footer"><div className="film-selector"><span className="micro">{pl ? 'SYGNAŁ' : 'SIGNAL'}</span>{films.map((_, i) => <button key={i} aria-label={`${pl ? 'Film' : 'Film'} ${i + 1}`} aria-pressed={active === i} onClick={() => select(i)}>{String(i + 1).padStart(2, '0')}</button>)}</div><button className="play-control micro" disabled={failed} onClick={() => { if (!video.current)
        return; if (playing)
        video.current.pause();
    else
        video.current.play().catch(() => setFailed(true)); }}>{failed ? (pl ? 'FILM NIEDOSTĘPNY' : 'FILM UNAVAILABLE') : playing ? (pl ? 'Ⅱ PAUZA' : 'Ⅱ PAUSE MOTION') : (pl ? '▷ ODTWÓRZ' : '▷ PLAY MOTION')}</button><span className="micro portal-note">{pl ? 'ŻADEN POCZĄTEK NIE JEST TAKI SAM' : 'NO TWO BEGINNINGS ARE THE SAME'}</span></footer>
 </section>;
}
