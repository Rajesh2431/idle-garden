import {clamp,hash,hashString,mulberry32} from './rng';
import {isNight,weatherFor} from './weather';
import {gardenName} from './names';
import type {GardenState,Kind,LogEntry,Plant,Report,Weather} from './types';
export {SEASON_KEY} from './weather';
export {catchUpAsync} from './catchup';
export const TICK_MS=10*60*1000, MAX_CATCHUP_TICKS=60*24*6, MAX_PLANTS=400, MAX_LOG=200, PRESENCE_WINDOW_MS=45_000;
interface Spec {life:number;mature:number;seedProb:number;frostTender:boolean;floodTender:boolean;droughtTender:boolean}
export const SPECIES:Record<Kind,Spec>={
 grass:{life:60,mature:6,seedProb:.6,frostTender:false,floodTender:false,droughtTender:true},
 flower:{life:120,mature:18,seedProb:.7,frostTender:true,floodTender:true,droughtTender:true},
 tree:{life:4000,mature:430,seedProb:.9,frostTender:false,floodTender:false,droughtTender:false},
 mushroom:{life:40,mature:5,seedProb:.8,frostTender:true,floodTender:false,droughtTender:true},
 reed:{life:200,mature:30,seedProb:.5,frostTender:false,floodTender:false,droughtTender:true},
};
const WATER_DELTA:Record<Weather,number>={clear:-.35,rain:2.5,drought:-1.1,storm:3.5,fog:.15,frost:-.1,flood:5};
export function newGarden(now:number,seed=hash(now,31)):GardenState{
 const s:GardenState={v:1,seed,createdAt:now,tick:Math.floor(now/TICK_MS),lastPresent:now,water:40,soil:30,nextId:1,peakPlants:6,lastWeather:'clear',milestones:[],plants:[],log:[],name:gardenName(seed)};
 const rng=mulberry32(hash(seed,1));for(let i=0;i<6;i++)spawn(s,'grass',rng);return s;
}
function spawn(s:GardenState,kind:Kind,rng:()=>number,nearX?:number){if(s.plants.length>=MAX_PLANTS)return;const x=nearX===undefined?rng():clamp(nearX+(rng()-.5)*.12,.01,.99);s.plants.push({id:s.nextId++,kind,x,z:rng(),age:0,hp:1,hue:kind==='flower'?Math.floor((rng()*360+s.soil*2)%360):Math.floor(rng()*40),seed:Math.floor(rng()*1e9)});}
function pickKind(s:GardenState,w:Weather,night:boolean,rng:()=>number):Kind{const pool:[Kind,number][]=[['grass',5],['flower',2+s.soil/40],['tree',.15+s.soil/400]];if(s.water>40&&(night||w==='fog'))pool.push(['mushroom',3]);if(s.water>60)pool.push(['reed',2]);let r=rng()*pool.reduce((a,[,p])=>a+p,0);for(const[k,p]of pool)if((r-=p)<=0)return k;return 'grass';}
function once(s:GardenState,key:string){if(s.milestones.includes(key))return false;s.milestones.push(key);return true;}
const WEATHER_TEXT:Partial<Record<Weather,string[]>>={storm:['a storm rolled through and shook everything.','thunder overnight. the garden held on.'],drought:['the ground cracked. nothing moved for hours.','a dry spell settled in.'],flood:['the pond rose and swallowed the low ground.','water everywhere. the reeds loved it.'],frost:['frost silvered every leaf.','a hard cold snap. the tender ones suffered.']};
/** Mutates only the supplied state. Returns this tick's events before rolling-log eviction. */
export function stepTick(s:GardenState,tick:number):LogEntry[]{
 const events:LogEntry[]=[];const emit=(kind:LogEntry['kind'],text:string)=>{const e={t:tick*TICK_MS,kind,text};s.log.push(e);events.push(e);};
 const rng=mulberry32(hash(s.seed,tick)),ms=tick*TICK_MS,w=weatherFor(s,ms),night=isNight(ms);
 if(w!==s.lastWeather){const lines=WEATHER_TEXT[w];if(lines&&once(s,`weather:${w}`))emit('weather',lines[Math.floor(rng()*lines.length)]);s.lastWeather=w;}
 s.water=clamp(s.water+WATER_DELTA[w],0,100);let g=s.water>15?Math.min(1,s.water/50):.1;if(w==='frost')g*=.2;if(w==='storm')g*=.5;
 const dead:Plant[]=[];
 for(const p of s.plants){const sp=SPECIES[p.kind],prev=p.age;p.age+=g*(p.kind==='mushroom'&&night?2:1);const stressed=(s.water<8&&sp.droughtTender)||(w==='frost'&&sp.frostTender)||(w==='flood'&&sp.floodTender);p.hp=stressed?p.hp-.04:Math.min(1,p.hp+.01);
  if(prev<sp.mature&&p.age>=sp.mature){if(once(s,`bloom:${p.kind}`))emit('bloom',`the first ${p.kind==='mushroom'?'mushrooms':p.kind} matured.`);if(p.gift&&once(s,`gift:${p.id}`)){once(s,'first-gift');emit('bloom',`${p.gift.from}'s flower opened.`);}}
  if(p.hp<=0||p.age>sp.life)dead.push(p);
 }
 if(dead.length){const ids=new Set(dead.map(d=>d.id));s.plants=s.plants.filter(p=>!ids.has(p.id));s.soil=clamp(s.soil+dead.length*.4,0,100);for(const d of dead)if(d.hp>0&&rng()<SPECIES[d.kind].seedProb)spawn(s,d.kind,rng,d.x);}
 if(rng()<.15*g*(.5+s.soil/100))spawn(s,pickKind(s,w,night,rng),rng);
 s.peakPlants=Math.max(s.peakPlants,s.plants.length);const n=s.plants.length;
 if(n>=20&&once(s,'rabbits'))emit('arrival','rabbits found the garden.');if(n>=40&&once(s,'birds'))emit('arrival','birds started nesting.');
 if(s.plants.filter(p=>p.kind==='tree'&&p.age>=SPECIES.tree.mature).length>=3&&once(s,'owl'))emit('arrival','an owl moved in.');
 const m=s.plants.filter(p=>p.kind==='mushroom').map(p=>p.x).sort((a,b)=>a-b);for(let i=0;i+4<m.length;i++)if(m[i+4]-m[i]<=.1&&once(s,'ring')){emit('ring','a fairy ring formed overnight.');break;}
 if(s.peakPlants>=30&&n<s.peakPlants*.2&&once(s,'wipe'))emit('loss','the garden is nearly bare. it will come back.');
 for(const days of[7,30,100])if(ms-s.createdAt>=days*86400000&&once(s,`anniversary:${days}`))emit('note',`${days} days old.`);
 if(s.log.length>MAX_LOG)s.log.splice(0,s.log.length-MAX_LOG);s.tick=Math.max(s.tick,tick);return events;
}
export function catchUp(s:GardenState,nowMs:number):Report{const target=Math.floor(nowMs/TICK_MS),from=Math.max(s.tick+1,target-MAX_CATCHUP_TICKS+1);const before=structuredClone(s.plants),newLog:LogEntry[]=[];let ticks=0;for(let t=from;t<=target;t++){newLog.push(...stepTick(s,t));ticks++;}s.tick=Math.max(s.tick,target);return {ticks,awayMs:Math.max(0,nowMs-s.lastPresent),newLog,before,after:structuredClone(s.plants)};}
export function markPresent(s:GardenState,nowMs:number){s.tick=Math.max(s.tick,Math.floor(nowMs/TICK_MS));s.lastPresent=Math.max(s.lastPresent,nowMs);}
export function tickFraction(nowMs:number){return ((nowMs%TICK_MS)+TICK_MS)%TICK_MS/TICK_MS;}
export function plantGift(s:GardenState,gift:{from:string;msg:string;hue:number},nowMs:number){if(s.plants.length>=MAX_PLANTS)throw new Error('the garden is full. let a little space open first.');const r=mulberry32(hash(s.seed,hashString(gift.from+gift.msg)));s.plants.push({id:s.nextId++,kind:'flower',x:r(),z:r(),age:0,hp:1,hue:clamp(gift.hue,0,360),seed:Math.floor(r()*1e9),gift:{from:gift.from,msg:gift.msg}});s.log.push({t:Math.floor(nowMs/TICK_MS)*TICK_MS,kind:'arrival',text:`a seed from ${gift.from} was planted.`});s.log=s.log.slice(-MAX_LOG);s.peakPlants=Math.max(s.peakPlants,s.plants.length);}
export function describeGarden(s:GardenState,nowMs:number){const counts=Object.keys(SPECIES).map(k=>`${s.plants.filter(p=>p.kind===k).length} ${k}`).join(', ');const residents=['rabbits','birds','owl'].filter(k=>s.milestones.includes(k));return `${s.name}. ${s.plants.length} plants: ${counts}. the weather is ${weatherFor(s,nowMs)}.${residents.length?` ${residents.join(' and ')} live here.`:''}`;}
