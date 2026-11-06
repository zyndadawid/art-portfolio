const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
const code=ts.transpileModule(fs.readFileSync('src/lib/black-hole-game.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const context={exports:{}};vm.runInNewContext(code,context);
const {BlackHoleGame,merge,gravity}=context.exports;
const input={left:false,right:false,thrust:false,fire:false,aim:null};
test('mergers conserve mass and momentum',()=>{
 const a={x:10,y:20,vx:8,vy:2,mass:20},b={x:100,y:200,vx:-4,vy:5,mass:10},m=merge(a,b);
 assert.equal(m.mass,30);assert.equal(m.vx*30,120);assert.equal(m.vy*30,90);assert.equal(m.x,40);
});
test('gravity is finite even at the singularity',()=>{
 const g=gravity(10,10,{x:10,y:10,mass:10000});assert.ok(Number.isFinite(g.x)&&Number.isFinite(g.y));
});
test('laser hits feed rather than destroy black holes',()=>{
 const g=new BlackHoleGame();g.holes=[{x:500,y:350,vx:0,vy:0,mass:20}];
 g.shots=[{x:500,y:400,vx:0,vy:-600,life:1}];
 for(let i=0;i<10;i++)g.update(1/60,input);
 assert.equal(g.stats.fed,1);assert.ok(g.holes[0].mass>=25);assert.equal(g.shots.length,0);
});
test('overlapping holes merge and an astronaut is consumed',()=>{
 const g=new BlackHoleGame();g.holes=[{x:100,y:100,vx:0,vy:0,mass:20},{x:101,y:100,vx:0,vy:0,mass:30}];
 g.people=[{x:100,y:100,vx:0,vy:0,angle:0}];g.update(1/60,input);
 assert.equal(g.holes.length,1);assert.equal(g.stats.mergers,1);assert.equal(g.stats.astronauts,1);assert.equal(g.people.length,0);assert.ok(g.holes[0].mass>=60);
});
test('ship capture reaches the darkness finale and restart resets the universe',()=>{
 const g=new BlackHoleGame();g.ship.x=g.holes[0].x;g.ship.y=g.holes[0].y;g.update(1/60,input);assert.equal(g.swallowing,true);
 for(let i=0;i<400;i++)g.update(1/60,input);
 assert.equal(g.ended,true);assert.equal(g.holes.length,1);assert.equal(g.stats.mergers,2);
 const fresh=new BlackHoleGame();assert.equal(fresh.ended,false);assert.equal(fresh.stats.fed,0);assert.equal(fresh.holes.length,3);
});
test('extended play stays finite with bounded lasers and ends',()=>{
 const g=new BlackHoleGame();for(let i=0;i<36000&&!g.ended;i++)g.update(1/60,{...input,fire:true,left:true,thrust:i%240<120});
 for(const h of g.holes)for(const n of Object.values(h))assert.ok(Number.isFinite(n));
 assert.ok(g.shots.length<30);assert.equal(g.ended,true);
});
test('a fast tangential astronaut curls inward and is swallowed within one second',()=>{
 const g=new BlackHoleGame();g.holes=[{x:200,y:150,vx:0,vy:0,mass:25}];
 g.people=[{x:270,y:150,vx:0,vy:500,angle:0}];
 g.update(1/60,input);assert.ok(g.people[0].capture);
 const firstAngle=Math.atan2(g.people[0].y-150,g.people[0].x-200);
 for(let i=0;i<25;i++)g.update(1/60,input);
 assert.equal(g.people.length,1);
 assert.ok(Math.atan2(g.people[0].y-150,g.people[0].x-200)>firstAngle+.2);
 assert.ok(Math.hypot(g.people[0].x-200,g.people[0].y-150)<55);
 for(let i=0;i<35;i++)g.update(1/60,input);
 assert.equal(g.people.length,0);assert.equal(g.stats.astronauts,1);
});
test('astronaut capture survives a black-hole merger',()=>{
 const g=new BlackHoleGame();g.holes=[{x:200,y:150,vx:0,vy:0,mass:25}];
 g.people=[{x:260,y:150,vx:0,vy:50,angle:0}];g.update(1/60,input);
 g.holes.push({x:201,y:150,vx:0,vy:0,mass:25});
 for(let i=0;i<60;i++)g.update(1/60,input);
 assert.equal(g.holes.length,1);assert.equal(g.people.length,0);assert.equal(g.stats.astronauts,1);
});
