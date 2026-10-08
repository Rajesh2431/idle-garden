import {PRESENCE_WINDOW_MS} from './sim';
export const isPresent=(visible:boolean,lastActivity:number,monotonicNow:number)=>visible&&monotonicNow-lastActivity<PRESENCE_WINDOW_MS;
export function frameInterval(idleMs:number){return 1000/(idleMs>30*60000?10:idleMs>5*60000?30:60);}
