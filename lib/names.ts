import {hash,mulberry32} from './rng';
export const adjectives=['small','quiet','late','gentle','hidden','soft','little','sleepy','silver','wild','patient','misty','slow','warm','tender','lucky','still','mellow','distant','wandering'];
export const nouns=['moss','fern','clover','meadow','willow','hollow','grove','thistle','brook','petal','bramble','orchard','reed','birch','poppy','sage','violet','glade','marigold','acorn'];
export function gardenName(seed:number){const r=mulberry32(hash(seed,23));return `${adjectives[Math.floor(r()*20)]} ${nouns[Math.floor(r()*20)]}`;}
