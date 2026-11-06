"use client";
import {useEffect,useRef,useState} from 'react';
import {useLocale} from 'next-intl';
import {BlackHoleGame, Input, Statistics} from '@/lib/black-hole-game';
const emptyInput=():Input=>({left:false,right:false,thrust:false,fire:false,aim:null});
export default function BlackHoleArcade(){
 const pl=useLocale()==='pl';
 const canvas=useRef<HTMLCanvasElement>(null), area=useRef<HTMLDivElement>(null);
 const engine=useRef<BlackHoleGame|null>(null),input=useRef<Input>(emptyInput());
 const active=useRef(false),visible=useRef(false),soundOn=useRef(false),audio=useRef<AudioContext|null>(null);
 const [mode,setMode]=useState<'ready'|'playing'|'paused'|'ended'>('ready');
 const [sound,setSound]=useState(false),[supported,setSupported]=useState(true);
 const [stats,setStats]=useState<Statistics>({fed:0,mergers:0,astronauts:0,time:0});
 const [collapsing,setCollapsing]=useState(false);
 function pause(){active.current=false;input.current=emptyInput();setMode(m=>m==='playing'?'paused':m);}
 function noise(kind:'laser'|'merge'|'gulp'){
  const ctx=audio.current;if(!soundOn.current||!ctx||ctx.state!=='running')return;
  const oscillator=ctx.createOscillator(),gain=ctx.createGain(),t=ctx.currentTime;
  oscillator.type=kind==='laser'?'sine':'triangle';oscillator.frequency.setValueAtTime(kind==='laser'?720:kind==='merge'?110:240,t);
  oscillator.frequency.exponentialRampToValueAtTime(35,t+.22);gain.gain.setValueAtTime(.035,t);gain.gain.exponentialRampToValueAtTime(.001,t+.25);
  oscillator.connect(gain);gain.connect(ctx.destination);oscillator.start();oscillator.stop(t+.26);
 }
 function start(){
  engine.current=new BlackHoleGame(noise);setStats({...engine.current.stats});setCollapsing(false);
  input.current=emptyInput();active.current=true;setMode('playing');area.current?.focus({preventScroll:true});
 }
 function resume(){active.current=true;setMode('playing');area.current?.focus({preventScroll:true});}
 function toggleSound(){
  const enabled=!soundOn.current;soundOn.current=enabled;setSound(enabled);
  if(enabled){try{audio.current??=new AudioContext();void audio.current.resume().catch(()=>{soundOn.current=false;setSound(false);});}catch{soundOn.current=false;setSound(false);}}
 }
 useEffect(()=>{
  const el=canvas.current,root=area.current;if(!el||!root)return;
  const c=el.getContext('2d');if(!c){setSupported(false);return;}
  const texture=new Image();texture.src='/media/black-hole-06-thumb.webp';
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  engine.current=new BlackHoleGame(noise);
  let frame=0,last=0,uiTime=0;
  const resize=()=>{const dpr=Math.min(window.devicePixelRatio||1,2);el.width=1000*dpr;el.height=640*dpr;c.setTransform(dpr,0,0,dpr,0,0);engine.current?.draw(c,texture,reduced.matches);};
  resize();window.addEventListener('resize',resize);
  const observer=new IntersectionObserver(entries=>{visible.current=entries[0].isIntersecting;if(!visible.current)pause();},{threshold:.2});observer.observe(root);
  const hide=()=>{if(document.hidden)pause();};document.addEventListener('visibilitychange',hide);
  const blur=()=>pause();window.addEventListener('blur',blur);
  function loop(now:number){
   const dt=Math.min((now-last)/1000||0,1/30);last=now;
   const game=engine.current;
   if(game&&visible.current){
    if(active.current){game.update(dt,input.current);uiTime+=dt;if(uiTime>.2){setStats({...game.stats});setCollapsing(game.swallowing);uiTime=0;}
     if(game.ended){active.current=false;setStats({...game.stats});setMode('ended');}}
    game.draw(c!,texture,reduced.matches);
   }
   frame=requestAnimationFrame(loop);
  }frame=requestAnimationFrame(loop);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('resize',resize);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',hide);void audio.current?.close();audio.current=null;};
 },[]);
 const key=(code:string,down:boolean)=>{
  if(code==='ArrowLeft'||code==='KeyA')input.current.left=down;
  if(code==='ArrowRight'||code==='KeyD')input.current.right=down;
  if(code==='ArrowUp'||code==='KeyW')input.current.thrust=down;
  if(code==='Space')input.current.fire=down;
  if(down)input.current.aim=null;
 };
 const controls=[['left','↶',pl?'Obrót w lewo':'Turn left'],['thrust','↑',pl?'Ciąg':'Thrust'],['right','↷',pl?'Obrót w prawo':'Turn right'],['fire','✳',pl?'Laser':'Fire laser']] as const;
 return <>
 <div className="descent" aria-hidden="true"><span className="micro">{pl?'DALEJ NIE MA JUŻ ŚWIATŁA':'THERE IS NO LIGHT FURTHER DOWN'}<br/>↓</span><div className="descent-line"/></div>
 <section className="arcade-section" id="play" aria-labelledby="arcade-title">
 <div className="arcade-intro"><p className="micro">05 — {pl?'MAŁY EKSPERYMENT Z KONSEKWENCJAMI':'A SMALL EXPERIMENT IN CONSEQUENCES'}</p><h2 id="arcade-title">{pl?'Porusz':'Disturb the'} <em>{pl?'wszechświat.':'universe.'}</em></h2><p>{pl?'Światło je karmi. Grawitacja robi resztę.':'Light feeds them. Gravity does the rest.'}</p></div>
 <div className={`arcade-frame ${collapsing?'is-collapsing':''}`} ref={area} tabIndex={0} role="group" aria-label={pl?'Gra w czarne dziury':'Black hole game'} aria-describedby="game-instructions"
 onBlur={e=>{if(!e.currentTarget.parentElement?.contains(e.relatedTarget))pause();}}
 onKeyDown={e=>{if(e.target!==e.currentTarget&&e.target!==canvas.current)return;if(['ArrowLeft','ArrowRight','ArrowUp','Space','KeyA','KeyD','KeyW'].includes(e.code)){e.preventDefault();key(e.code,true);}if(e.code==='Escape')pause();}}
 onKeyUp={e=>{if(['ArrowLeft','ArrowRight','ArrowUp','Space','KeyA','KeyD','KeyW'].includes(e.code)){e.preventDefault();key(e.code,false);}}}>
 <canvas ref={canvas} className="arcade-canvas" role="img" aria-label={pl?'Statek, czarne dziury i astronauci. Sterowanie pod grą.':'Spaceship, black holes and astronauts. Controls below the game.'}
 onPointerMove={e=>{if(e.pointerType==='mouse'&&active.current){const r=e.currentTarget.getBoundingClientRect();input.current.aim={x:(e.clientX-r.left)/r.width*1000,y:(e.clientY-r.top)/r.height*640};}}}
 onPointerDown={e=>{if(!active.current)return;e.currentTarget.setPointerCapture(e.pointerId);area.current?.focus({preventScroll:true});input.current.fire=true;}}
 onPointerUp={()=>{input.current.fire=false;}} onPointerCancel={()=>{input.current.fire=false;}} onLostPointerCapture={()=>{input.current.fire=false;}}/>
 <div className="arcade-hud micro"><span>{pl?'POGORSZENIE':'MADE IT WORSE'} <strong>{String(stats.fed*100+stats.mergers*1000+stats.astronauts*500).padStart(6,'0')}</strong></span><span>{pl?'FUZJE':'MERGERS'} {stats.mergers} <span className="hud-people">/ {pl?'MAKARON':'NOODLES'} {stats.astronauts}</span></span></div>
 {mode!=='playing'&&<div className="arcade-overlay" aria-live="polite"><p className="micro">{mode==='ended'?'∞ / 0':pl?'SYMULACJA NIEODPOWIEDZIALNOŚCI':'AN IRRESPONSIBILITY SIMULATOR'}</p><h3>{mode==='ended'?(pl?'Pomogłeś.':'You helped.'):mode==='paused'?(pl?'Wszechświat poczeka.':'The universe can wait.'):(pl?'To nie są asteroidy.':'These are not asteroids.')}</h3><p>{mode==='ended'?(pl?`${stats.fed} dawek światła. ${stats.mergers} fuzji. ${stats.astronauts} astronautów zamienionych w makaron.`:`${stats.fed} doses of light. ${stats.mergers} mergers. ${stats.astronauts} astronauts turned into noodles.`):mode==='paused'?(pl?'Weź oddech. Chaos nigdzie nie ucieka.':'Take a breath. The chaos is going nowhere.'):(pl?'Strzelaj światłem. Nakarm czarne dziury. Nie ma wygranej — tylko coraz większy problem.':'Fire light. Feed the black holes. There is no winning. Only a progressively larger problem.')}</p>
 {supported?<button className="arcade-start" onClick={mode==='paused'?resume:start}>{mode==='ended'?(pl?'Jeszcze jeden wszechświat ↗':'Another universe ↗'):mode==='paused'?(pl?'Kontynuuj ↗':'Resume ↗'):(pl?'Co może pójść nie tak? ↗':'What could possibly go wrong? ↗')}</button>:<p>{pl?'Twoja przeglądarka nie obsługuje tej gry.':'This browser does not support the game canvas.'}</p>}</div>}
 </div>
 <div className="arcade-toolbar"><div className="touch-controls">{controls.map(([action,symbol,label])=><button key={action} aria-label={label} disabled={mode!=='playing'||collapsing}
 onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);input.current.aim=null;input.current[action]=true;}}
 onPointerUp={()=>{input.current[action]=false;}} onPointerCancel={()=>{input.current[action]=false;}} onLostPointerCapture={()=>{input.current[action]=false;}}
 onKeyDown={e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();input.current[action]=true;}}} onKeyUp={()=>{input.current[action]=false;}} onBlur={()=>{input.current[action]=false;}}>{symbol}<span>{label}</span></button>)}</div>
 <div className="arcade-options"><button onClick={()=>mode==='playing'?pause():mode==='paused'?resume():undefined} disabled={mode==='ready'||mode==='ended'}>{mode==='paused'?(pl?'Wznów':'Resume'):(pl?'Pauza':'Pause')}</button><button onClick={toggleSound} aria-pressed={sound}>{pl?'Dźwięk':'Sound'} {sound?'ON':'OFF'}</button></div></div>
 <p className="arcade-instructions micro" id="game-instructions">{pl?'← → / A D OBRÓT · ↑ / W CIĄG · SPACJA LASER · ESC PAUZA · MYSZ: CELOWANIE I STRZAŁ · DOTYK: PRZYCISKI POWYŻEJ':'← → / A D TURN · ↑ / W THRUST · SPACE FIRE · ESC PAUSE · MOUSE: AIM & FIRE · TOUCH: BUTTONS ABOVE'}</p>
 <p className="arcade-footnote">{pl?'Żaden astronauta nie ucierpiał. Kilku zmieniło proporcje.':'No astronauts were harmed. A few were proportionally inconvenienced.'}</p>
 </section></>;
}
