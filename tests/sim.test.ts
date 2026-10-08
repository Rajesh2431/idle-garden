import {describe,it,expect} from 'vitest';
import {catchUp,catchUpAsync,markPresent,newGarden,plantGift,stepTick,TICK_MS,MAX_CATCHUP_TICKS} from '../lib/sim';
const start=Date.UTC(2026,3,1,12);
describe('simulation',()=>{
 it('is deterministic across identical seeds and timestamps',()=>{const a=newGarden(start,12),b=structuredClone(a);catchUp(a,start+7*86400000);catchUp(b,start+7*86400000);expect(a).toEqual(b)});
 it('caps 200 days at sixty days',()=>expect(catchUp(newGarden(start,12),start+200*86400000).ticks).toBe(MAX_CATCHUP_TICKS));
 it('skips presence without growth and never rewinds',()=>{const s=newGarden(start,1),before=structuredClone(s.plants);markPresent(s,start+TICK_MS*50);markPresent(s,start-1);expect(s.plants).toEqual(before);expect(s.tick).toBe(Math.floor(start/TICK_MS)+50)});
 it('plants gifts deterministically and logs their bloom once',()=>{const s=newGarden(start,2);plantGift(s,{from:'fern',msg:'for you',hue:200},start);const p=s.plants.at(-1)!;expect(p.gift).toEqual({from:'fern',msg:'for you'});p.age=17.99;s.water=100;stepTick(s,s.tick+1);stepTick(s,s.tick+1);expect(s.log.filter(e=>e.text==="fern's flower opened.")).toHaveLength(1)});
 it('fires anniversaries once and obeys plant/log caps',()=>{const s=newGarden(start,22);for(let i=6;i<400;i++)s.plants.push({...s.plants[0],id:s.nextId++});s.log=Array.from({length:200},()=>({t:start,kind:'note' as const,text:'old'}));catchUp(s,start+200*86400000);catchUp(s,start+201*86400000);expect(s.plants.length).toBeLessThanOrEqual(400);expect(s.log.length).toBeLessThanOrEqual(200);for(const d of[7,30,100])expect(s.milestones.filter(m=>m===`anniversary:${d}`)).toHaveLength(1);expect(new Set(s.milestones).size).toBe(s.milestones.length)});
 it('keeps report events even with an already-full rolling log',()=>{const s=newGarden(start,2);s.log=Array.from({length:200},()=>({t:start,kind:'note' as const,text:'old'}));expect(catchUp(s,start+86400000).newLog.length).toBeGreaterThan(0)});
 it('async catch-up equals synchronous state and report',async()=>{const a=newGarden(start,5),b=structuredClone(a);const report=catchUp(a,start+31*86400000),progress:number[]=[];expect(await catchUpAsync(b,start+31*86400000,n=>progress.push(n))).toEqual(report);expect(a).toEqual(b);expect(progress.at(-1)).toBe(1)});
});
