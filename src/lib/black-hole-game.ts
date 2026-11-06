// Deliberately playful gravity: fixed world coordinates keep desktop and touch fair.
export const WORLD = { width: 1000, height: 640 };
export type Body = { x: number; y: number; vx: number; vy: number; mass: number };
export type Input = { left: boolean; right: boolean; thrust: boolean; fire: boolean; aim: {x:number;y:number}|null };
export type Statistics = { fed: number; mergers: number; astronauts: number; time: number };
export const radius = (mass: number) => Math.sqrt(mass) * 4;
export function merge(a: Body, b: Body): Body {
  const mass = a.mass + b.mass;
  return { mass, x:(a.x*a.mass+b.x*b.mass)/mass, y:(a.y*a.mass+b.y*b.mass)/mass,
    vx:(a.vx*a.mass+b.vx*b.mass)/mass, vy:(a.vy*a.mass+b.vy*b.mass)/mass };
}
export function gravity(x:number,y:number,hole:Body,strength=1){
 const dx=hole.x-x,dy=hole.y-y,d=Math.max(24,Math.hypot(dx,dy));
 const acceleration=Math.min(360, hole.mass*1400/(d*d))*strength;
 return {x:dx/d*acceleration,y:dy/d*acceleration};
}
const TAU=Math.PI*2;
type Particle={x:number;y:number;vx:number;vy:number;life:number};
type Astronaut={x:number;y:number;vx:number;vy:number;angle:number;
 capture?:{hole:Body;elapsed:number;distance:number;angle:number;direction:number}};
const CAPTURE_SECONDS=.85;
export class BlackHoleGame {
 holes:Body[]=[]; shots:Particle[]=[]; people:Astronaut[]=[];
 ship={x:500,y:530,vx:0,vy:0,angle:-Math.PI/2};
 stats:Statistics={fed:0,mergers:0,astronauts:0,time:0};
 collapse=0; ended=false; cooldown=0; spawn=4; swallowing=false;
 private stars=Array.from({length:150},()=>({x:Math.random()*1000,y:Math.random()*640,r:.4+Math.random()*1.2}));
 constructor(private sound:(kind:'laser'|'merge'|'gulp')=>void=()=>{}){
  this.holes=[{x:220,y:180,vx:6,vy:2,mass:32},{x:740,y:190,vx:-5,vy:2,mass:25},{x:570,y:330,vx:0,vy:-3,mass:18}];
 }
 update(dt:number,input:Input){
  if(this.ended)return;
  this.stats.time+=dt;
  if(this.swallowing){
   this.collapse+=dt;
   if(this.holes.length>1){this.stats.mergers+=this.holes.length-1;this.holes=[this.holes.reduce(merge)];}
   if(this.collapse>6)this.ended=true;
   return;
  }
  const s=this.ship;
  if(input.aim)s.angle=Math.atan2(input.aim.y-s.y,input.aim.x-s.x);
  else s.angle+=((input.right?1:0)-(input.left?1:0))*3.4*dt;
  if(input.thrust){s.vx+=Math.cos(s.angle)*230*dt;s.vy+=Math.sin(s.angle)*230*dt;}
  this.cooldown-=dt;
  if(input.fire&&this.cooldown<=0){
   this.shots.push({x:s.x+Math.cos(s.angle)*19,y:s.y+Math.sin(s.angle)*19,vx:Math.cos(s.angle)*620+s.vx,vy:Math.sin(s.angle)*620+s.vy,life:1.8});
   this.cooldown=.13;this.sound('laser');
  }
  for(const h of this.holes){
   h.mass+=dt*.45; // Even doing nothing has consequences, eventually.
   const g=gravity(s.x,s.y,h,.7);s.vx+=g.x*dt;s.vy+=g.y*dt;
  }
  const speed=Math.hypot(s.vx,s.vy);if(speed>290){s.vx*=290/speed;s.vy*=290/speed;}
  s.vx*=Math.exp(-.24*dt);s.vy*=Math.exp(-.24*dt);
  s.x=(s.x+s.vx*dt+1000)%1000;s.y=(s.y+s.vy*dt+640)%640;
  for(let i=0;i<this.holes.length;i++){
   const a=this.holes[i];
   for(let j=i+1;j<this.holes.length;j++){
    const b=this.holes[j],ga=gravity(a.x,a.y,b,.16),gb=gravity(b.x,b.y,a,.16);
    a.vx+=ga.x*dt;a.vy+=ga.y*dt;b.vx+=gb.x*dt;b.vy+=gb.y*dt;
    if(Math.hypot(a.x-b.x,a.y-b.y)<radius(a.mass)+radius(b.mass)){
     this.holes[i]=merge(a,b);this.holes.splice(j,1);this.stats.mergers++;this.sound('merge');break;
    }
   }
  }
  for(const h of this.holes){h.x+=h.vx*dt;h.y+=h.vy*dt;
   if(h.x<80||h.x>920)h.vx+=(500-h.x)*.02*dt;
   if(h.y<80||h.y>560)h.vy+=(320-h.y)*.02*dt;
   if(Math.hypot(s.x-h.x,s.y-h.y)<radius(h.mass)+9){this.swallowing=true;this.sound('gulp');}
  }
  for(const shot of this.shots){
   const ox=shot.x,oy=shot.y;
   shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.life-=dt;
   for(const h of this.holes){
    // Segment collision prevents a fast laser skipping across a small hole.
    const dx=shot.x-ox,dy=shot.y-oy;
    const t=Math.max(0,Math.min(1,((h.x-ox)*dx+(h.y-oy)*dy)/(dx*dx+dy*dy||1)));
    if(Math.hypot(ox+dx*t-h.x,oy+dy*t-h.y)<radius(h.mass)){
     h.mass+=5;shot.life=0;this.stats.fed++;break;
    }
   }
  }
  this.shots=this.shots.filter(p=>p.life>0);
  this.spawn-=dt;
  if(this.spawn<=0){
   const h=this.holes[Math.floor(Math.random()*this.holes.length)];
   const angle=Math.random()*TAU,dist=radius(h.mass)+150;
   this.people.push({x:Math.max(20,Math.min(980,h.x+Math.cos(angle)*dist)),y:Math.max(20,Math.min(620,h.y+Math.sin(angle)*dist)),vx:-Math.cos(angle)*14,vy:-Math.sin(angle)*14,angle});
   this.spawn=7+Math.random()*5;
  }
  this.people=this.people.filter(p=>{
   const nearest=()=>this.holes.reduce((a,b)=>Math.hypot(p.x-a.x,p.y-a.y)-radius(a.mass)<Math.hypot(p.x-b.x,p.y-b.y)-radius(b.mass)?a:b);
   let h=p.capture?.hole??nearest();
   // A captured astronaut follows the surviving hole if its original one merges.
   if(!this.holes.includes(h)){h=nearest();if(p.capture)p.capture.hole=h;}
   const distance=Math.hypot(p.x-h.x,p.y-h.y),r=radius(h.mass);
   const consume=()=>{h.mass+=10;this.stats.astronauts++;this.sound('gulp');return false;};
   if(!p.capture&&distance<r*.8)return consume();
   if(!p.capture&&distance<r+65){
    const cross=(p.x-h.x)*p.vy-(p.y-h.y)*p.vx;
    p.capture={hole:h,elapsed:0,distance,angle:Math.atan2(p.y-h.y,p.x-h.x),direction:cross<0?-1:1};
   }
   if(p.capture){
    const capture=p.capture;
    capture.elapsed+=dt;
    const t=Math.min(1,capture.elapsed/CAPTURE_SECONDS);
    // Capture is irreversible: a short tightening spiral, never a stretched flyby.
    const orbit=capture.distance*(1-t)+r*.25*t;
    const angle=capture.angle+capture.direction*2.2*t*t;
    p.x=h.x+Math.cos(angle)*orbit;p.y=h.y+Math.sin(angle)*orbit;
    if(t>=1)return consume();
    return true;
   }
   for(const hole of this.holes){const g=gravity(p.x,p.y,hole,1.5);p.vx+=g.x*dt;p.vy+=g.y*dt;}
   p.x+=p.vx*dt;p.y+=p.vy*dt;p.angle+=dt;return true;
  });
 }
 draw(c:CanvasRenderingContext2D,texture:HTMLImageElement|null,reduced:boolean){
  c.fillStyle='#030504';c.fillRect(0,0,1000,640);
  const finale=this.swallowing?Math.min(1,this.collapse/6):0;
  const main=this.holes[0];
  c.fillStyle='#b5c4ae';
  for(const star of this.stars){
   const pull=finale*finale;
   c.globalAlpha=(1-finale)*(.35+star.r*.25);
   c.beginPath();c.arc(star.x+(main.x-star.x)*pull,star.y+(main.y-star.y)*pull,star.r,0,TAU);c.fill();
  }c.globalAlpha=1;
  for(const h of this.holes){
   const r=radius(h.mass),spin=reduced?0:this.stats.time*.12;
   const halo=c.createRadialGradient(h.x,h.y,r*.7,h.x,h.y,r*2.4);
   halo.addColorStop(0,'#d7f98c44');halo.addColorStop(.6,'#d7f98c0c');halo.addColorStop(1,'#d7f98c00');
   c.fillStyle=halo;c.beginPath();c.arc(h.x,h.y,r*2.4,0,TAU);c.fill();
   c.save();c.translate(h.x,h.y);c.rotate(spin);
   if(texture?.complete&&texture.naturalWidth){c.save();c.beginPath();c.arc(0,0,r*1.23,0,TAU);c.clip();c.globalAlpha=.42;c.drawImage(texture,-r*1.3,-r*1.3,r*2.6,r*2.6);c.restore();}
   c.strokeStyle='#d7f98c99';c.lineWidth=1.4;c.beginPath();c.ellipse(0,0,r*1.5,r*.5,-.3,0,TAU);c.stroke();
   c.fillStyle='#000';c.beginPath();c.arc(0,0,r,0,TAU);c.fill();
   c.strokeStyle='#d7f98c';c.lineWidth=1;c.stroke();c.restore();
  }
  c.strokeStyle='#f4f7dd';c.lineWidth=2;
  for(const shot of this.shots){c.beginPath();c.moveTo(shot.x,shot.y);c.lineTo(shot.x-shot.vx*.025,shot.y-shot.vy*.025);c.stroke();}
  for(const p of this.people){
   const capture=p.capture;
   const t=capture?Math.min(1,capture.elapsed/CAPTURE_SECONDS):0;
   // Warp individual body points around the hole, rather than scaling a rigid sprite.
   const point=(x:number,y:number)=>{
    if(!capture){const co=Math.cos(p.angle),si=Math.sin(p.angle);return {x:p.x+x*co-y*si,y:p.y+x*si+y*co};}
    const h=capture.hole,r=radius(h.mass),distance=Math.hypot(p.x-h.x,p.y-h.y);
    const stretch=1+5*Math.sin(Math.PI*t*.85);
    const along=y*stretch;
    const radial=Math.max(r*.12,distance-along);
    const angle=Math.atan2(p.y-h.y,p.x-h.x)+capture.direction*along/(r+35)*t*1.8;
    const width=x/Math.sqrt(stretch);
    return {x:h.x+Math.cos(angle)*radial-Math.sin(angle)*width,y:h.y+Math.sin(angle)*radial+Math.cos(angle)*width};
   };
   const line=(coords:number[][],close=false,fill=false)=>{
    c.beginPath();const first=point(coords[0][0],coords[0][1]);c.moveTo(first.x,first.y);
    for(let i=1;i<coords.length;i++){
     const [ax,ay]=coords[i-1],[bx,by]=coords[i];
     for(let step=1;step<=8;step++){const q=point(ax+(bx-ax)*step/8,ay+(by-ay)*step/8);c.lineTo(q.x,q.y);}
    }
    if(close)c.closePath();if(fill)c.fill();else c.stroke();
   };
   c.save();c.lineWidth=Math.max(.6,2-t);c.lineCap='round';c.lineJoin='round';c.strokeStyle='#e9e7de';c.fillStyle='#e9e7de';
   const helmet=Array.from({length:25},(_,i)=>[Math.cos(i/24*TAU)*5,-9+Math.sin(i/24*TAU)*5]);
   line(helmet,true,true);c.fillStyle='#3d5f65';line([[-3,-11],[3,-11],[3,-8],[-3,-8],[-3,-11]],true,true);
   line([[-4,-3],[4,-3],[4,8],[-4,8],[-4,-3]],true);
   line([[-4,0],[-10,5]]);line([[4,0],[10,-4]]);line([[-2,8],[-5,15]]);line([[2,8],[6,15]]);c.restore();
  }
  // The event horizon occludes each body segment as it winds inward.
  c.fillStyle='#000';
  for(const h of this.holes){c.beginPath();c.arc(h.x,h.y,radius(h.mass)-.5,0,TAU);c.fill();}
  const s=this.ship;
  c.save();c.translate(s.x+(main.x-s.x)*finale,s.y+(main.y-s.y)*finale);c.rotate(s.angle);c.scale(1+finale*8,1-finale);
  c.strokeStyle='#d7f98c';c.lineWidth=1.7;c.beginPath();c.moveTo(16,0);c.lineTo(-11,-10);c.lineTo(-6,0);c.lineTo(-11,10);c.closePath();c.stroke();c.restore();
  if(this.swallowing){
   const r=radius(main.mass)+Math.pow(finale,2.6)*1400;
   c.fillStyle='#000';c.beginPath();c.arc(main.x,main.y,r,0,TAU);c.fill();
  }
 }
}
