import type {GardenState} from '../types';
import {seasonOf,weatherFor} from '../weather';
import {tickFraction} from '../sim';
import {drawSky,localNight} from './sky';
import {makeGround,drawPond} from './ground';
import {SpriteCache,drawPlants} from './plants';
import {makeGrain} from './grain';
import {drawCritters} from './critters';
import {drawWeather} from './weather-fx';
export interface SceneOptions {motion?:boolean;quality?:'auto'|'low'|'high';shy?:number;pointer?:{x:number;y:number};present?:boolean;flash?:number}
export class Scene {
 sprites=new SpriteCache();private ground?:HTMLCanvasElement;private groundKey='';private grain?:HTMLCanvasElement;particles=0;
 draw(c:CanvasRenderingContext2D,w:number,h:number,s:GardenState,ms:number,options:SceneOptions={}){const season=seasonOf(ms),night=localNight(ms),motion=options.motion??true,key=[w,h,s.seed,season].join(':');if(key!==this.groundKey){this.ground=makeGround(w,h,s.seed,season);this.groundKey=key;}this.sprites.limit=options.quality==='low'?250:600;drawSky(c,w,h,ms,s.seed,season,motion);c.drawImage(this.ground!,0,0,w,h);const weather=weatherFor(s,ms);drawPond(c,w,h,s.water,ms,['rain','storm','flood'].includes(weather),motion);drawPlants(c,w,h,s.plants,this.sprites,season,night,ms,options.present?0:tickFraction(ms),motion,options.pointer??{x:-999,y:-999},options.shy??0);
 drawCritters(c,w,h,s,ms,!motion,options.pointer??{x:-999,y:-999},options.shy??0);this.particles=drawWeather(c,w,h,weather,s.seed,ms,!motion,options.quality==='low',!!options.flash&&performance.now()-options.flash<80);
 if(!this.grain)this.grain=makeGrain();c.save();c.globalCompositeOperation='overlay';c.globalAlpha=.06;c.fillStyle=c.createPattern(this.grain,'repeat')!;c.fillRect(0,0,w,h);c.restore();const v=c.createRadialGradient(w*.5,h*.4,h*.2,w*.5,h*.5,Math.max(w,h)*.7);v.addColorStop(0,'#2e433800');v.addColorStop(1,'#2e433824');c.fillStyle=v;c.fillRect(0,0,w,h);
 }
}
