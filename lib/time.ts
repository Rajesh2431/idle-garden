let offset=0;
export function parseWarp(q:string){const m=q.trim().match(/^([+-]?\d+(?:\.\d+)?)(m|h|d)$/);return m?Math.max(-3650*86400000,Math.min(3650*86400000,Number(m[1])*({m:60000,h:3600000,d:86400000}[m[2] as 'm'|'h'|'d']))):0;}
export function initWarp(){if(typeof window!=='undefined')offset=parseWarp(new URLSearchParams(window.location.search).get('warp')??'');}
export const now=()=>Date.now()+offset;
export function advanceTime(ms:number){offset+=ms;}
export function duration(ms:number){const mins=Math.max(0,Math.floor(ms/60000)),h=Math.floor(mins/60),d=Math.floor(h/24);return d?`${d}d ${h%24}h`:`${h}h ${mins%60}m`;}
export const age=(created:number,ms:number)=>`${Math.max(0,Math.floor((ms-created)/86400000))} days old`;
