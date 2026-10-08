import {mulberry32} from '../rng';
export function makeGrain(){const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const c=canvas.getContext('2d')!,data=c.createImageData(256,256),r=mulberry32(321);for(let i=0;i<data.data.length;i+=4){const v=Math.floor(r()*255);data.data[i]=data.data[i+1]=data.data[i+2]=v;data.data[i+3]=255;}c.putImageData(data,0,0);return canvas;}
