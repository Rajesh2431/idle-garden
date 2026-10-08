import {GardenStateSchema} from './schema';
import type {GardenState} from './types';
export const STORAGE_KEY='idle-garden:v1';
let memory:GardenState|null=null;
export function loadWithStatus():{state:GardenState|null;unavailable:boolean;corrupt:boolean}{let raw:string|null=null;try{raw=localStorage.getItem(STORAGE_KEY);if(!raw)return{state:memory?structuredClone(memory):null,unavailable:false,corrupt:false};return{state:GardenStateSchema.parse(JSON.parse(raw)),unavailable:false,corrupt:false};}catch{if(raw!==null){try{localStorage.setItem(`idle-garden:corrupt:${Date.now()}`,raw);localStorage.removeItem(STORAGE_KEY);return{state:null,unavailable:false,corrupt:true};}catch{return{state:null,unavailable:true,corrupt:true};}}return{state:memory?structuredClone(memory):null,unavailable:true,corrupt:false};}}
export function load(){return loadWithStatus().state;}
export function save(s:GardenState){memory=structuredClone(s);try{localStorage.setItem(STORAGE_KEY,JSON.stringify(s));return true;}catch{return false;}}
export function reset(){memory=null;try{localStorage.removeItem(STORAGE_KEY);return true;}catch{return false;}}
