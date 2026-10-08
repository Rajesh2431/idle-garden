import {hash,mulberry32} from '../rng';
import type {Weather} from '../types';
export function lightningAt(seed:number,ms:number){const interval=5000+hash(seed,Math.floor(ms/3600000),53)%10000;return ms%interval<80;}
export function drawWeather(c:CanvasRenderingContext2D,w:number,h:number,weather:Weather,seed:number,ms:number,reduced:boolean,low:boolean,forcedFlash=false){const r=mulberry32(hash(seed,54)),cap=Math.floor((low?70:180)*(reduced?.5:1)),t=reduced?0:ms;let particles=0;c.save();
 if(weather==='rain'||weather==='storm'||weather==='flood'){particles=cap;c.strokeStyle=weather==='storm'?'#dee8d482':'#e4ead66b';c.lineWidth=.8;c.beginPath();for(let i=0;i<cap;i++){const speed=.14+r()*.15,x=(r()*w+t*.025)%(w+25)-20,y=(r()*h+t*speed)%h,len=6+r()*12;c.moveTo(x,y);c.lineTo(x-3,y+len);}c.stroke();if(weather==='storm'){c.fillStyle='#273e4a28';c.fillRect(0,0,w,h);}if(weather==='flood'){c.fillStyle='#426f7f45';c.fillRect(0,h*.85,w,h*.15);}}
 if(weather==='fog')for(let i=0;i<3;i++){const x=w*(.15+i*.35)+Math.sin(t/17000+i)*w*.15,y=h*(.58+i*.09),g=c.createRadialGradient(x,y,0,x,y,w*.5);g.addColorStop(0,'#edf0da65');g.addColorStop(1,'#edf0da00');c.fillStyle=g;c.fillRect(0,0,w,h);}
 if(weather==='frost'){c.fillStyle='#b8dcec2c';c.fillRect(0,0,w,h);particles=Math.min(cap,70);for(let i=0;i<particles;i++){const x=r()*w,y=h*(.6+r()*.4);c.globalAlpha=.2+(Math.sin(t/1700+i)+1)*.3;c.fillStyle='#f3f7e7';c.fillRect(x,y,1.5,1.5);}}
 if(weather==='drought'){c.fillStyle='#d8aa5626';c.fillRect(0,0,w,h);if(!reduced){c.strokeStyle='#f8e6b61f';for(let i=0;i<14;i++){c.beginPath();const y=h*(.6+i*.035);c.moveTo(0,y);c.bezierCurveTo(w*.3,y+Math.sin(ms/1600+i)*6,w*.7,y-5,w,y);c.stroke();}}}
 if(!reduced&&(forcedFlash||(weather==='storm'&&lightningAt(seed,ms)))){c.globalAlpha=1;c.fillStyle='#fffae680';c.fillRect(0,0,w,h);}c.restore();return particles;
}
