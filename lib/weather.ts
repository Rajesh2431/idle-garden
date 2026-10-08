import {hash,mulberry32} from './rng';
import type {Weather} from './types';
export type Season='spring'|'summer'|'autumn'|'winter';
export const BLOCK_MS=6*60*60*1000;
export function seasonOf(ms:number):Season {const m=new Date(ms).getUTCMonth(); if(m>=2&&m<=4)return 'spring';if(m>=5&&m<=7)return 'summer';if(m>=8&&m<=10)return 'autumn';return 'winter';}
export const TABLE:Record<Season,[Weather,number][]>={spring:[['clear',.4],['rain',.35],['fog',.15],['storm',.07],['flood',.03]],summer:[['clear',.45],['drought',.25],['storm',.15],['rain',.1],['fog',.05]],autumn:[['clear',.35],['rain',.3],['fog',.2],['storm',.1],['flood',.05]],winter:[['clear',.35],['frost',.35],['fog',.2],['rain',.1]]};
export function weatherAt(seed:number,ms:number):Weather{const block=Math.floor(ms/BLOCK_MS);const r=mulberry32(hash(seed,block,7))();let acc=0;for(const [w,p]of TABLE[seasonOf(ms)]){acc+=p;if(r<acc)return w;}return 'clear';}
export function weatherFor(s:{seed:number;realWeather?:Record<number,Weather>},ms:number):Weather{return s.realWeather?.[Math.floor(ms/BLOCK_MS)]??weatherAt(s.seed,ms);}
export function isNight(ms:number){const h=new Date(ms).getUTCHours();return h<6||h>=19;}
export const SEASON_KEY=(ms:number)=>`${new Date(ms).getUTCFullYear()}-${seasonOf(ms)}`;
