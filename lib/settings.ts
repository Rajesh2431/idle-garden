import {z} from 'zod';
const SettingsSchema=z.object({sound:z.boolean(),volume:z.number().min(0).max(1),motion:z.enum(['auto','reduced','full']),quality:z.enum(['auto','low','high']),realWeather:z.boolean()});
export type Settings=z.infer<typeof SettingsSchema>;
export const defaults:Settings={sound:false,volume:.35,motion:'auto',quality:'auto',realWeather:false};
export function loadSettings():Settings{try{return{...SettingsSchema.parse(JSON.parse(localStorage.getItem('idle-garden:settings')??'null')),sound:false};}catch{return{...defaults};}}
export function saveSettings(s:Settings){try{localStorage.setItem('idle-garden:settings',JSON.stringify(s));}catch{}}
