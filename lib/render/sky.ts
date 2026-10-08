import {mulberry32,hash} from '../rng';
import type {Season} from '../weather';
export function localNight(ms:number){const h=new Date(ms).getHours();return h<6||h>=19;}
export function drawSky(ctx:CanvasRenderingContext2D,w:number,h:number,ms:number,seed:number,season:Season,motion:boolean){
 const d=new Date(ms),hour=d.getHours()+d.getMinutes()/60,night=localNight(ms),twilight=(hour>=5&&hour<8)||(hour>=17&&hour<20);
 const colors=night?['#182e3b','#35474d','#758080','#bdbaa1']:twilight?['#c4c8bc','#e6d2b7','#f3dcb8','#ece3c9']:season==='winter'?['#c5d8dc','#dce5df','#eaeade','#f1eddd']:['#ceddd0','#e0e7d6','#ebecd8','#f4efd9'];
 const g=ctx.createLinearGradient(0,0,0,h*.85);colors.forEach((c,i)=>g.addColorStop(i/3,c));ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 const r=mulberry32(hash(seed,90));if(night){for(let i=0;i<65;i++){const x=r()*w,y=r()*h*.56,rad=.5+r()*1.2;ctx.globalAlpha=.25+(motion?(Math.sin(ms/2400+i)+1)*.2:.35);ctx.fillStyle='#fff9da';ctx.beginPath();ctx.arc(x,y,rad,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;}
 const progress=night?((hour+5)%24)/12:(hour-6)/12,x=w*(.12+.76*Math.max(0,Math.min(1,progress))),y=h*(.4-Math.sin(Math.max(0,Math.min(1,progress))*Math.PI)*.23),radius=Math.min(w,h)*.035;
 const glow=ctx.createRadialGradient(x,y,0,x,y,radius*4);glow.addColorStop(0,night?'#fff1c425':'#fff6cf77');glow.addColorStop(1,'#fff4cc00');ctx.fillStyle=glow;ctx.fillRect(x-radius*4,y-radius*4,radius*8,radius*8);ctx.fillStyle=night?'#f1eacb':'#fcf1cc';ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();if(night){ctx.fillStyle=colors[1];ctx.beginPath();ctx.arc(x+radius*.45,y-radius*.3,radius*.86,0,Math.PI*2);ctx.fill();}
 // Transparent, broad cloud strips are generated shapes, not bitmap assets.
 ctx.fillStyle=night?'#d5d5bc09':'#fffcdf36';for(let i=0;i<5;i++){const cx=((r()*w+(motion?ms/180000*(i+1):0))%(w+240))-120,cy=h*(.15+r()*.31);ctx.beginPath();ctx.ellipse(cx,cy,70+r()*100,4+r()*9,0,0,Math.PI*2);ctx.fill();}
}
