export type Kind = 'grass'|'flower'|'tree'|'mushroom'|'reed';
export type Weather = 'clear'|'rain'|'drought'|'storm'|'fog'|'frost'|'flood';
export interface GiftInfo { from: string; msg: string }
export interface Plant { id:number; kind:Kind; x:number; z:number; age:number; hp:number; hue:number; seed:number; gift?:GiftInfo }
export type LogKind = 'weather'|'bloom'|'arrival'|'ring'|'loss'|'birth'|'note';
export interface LogEntry { t:number; kind:LogKind; text:string }
export interface GardenState {
 v:1; seed:number; createdAt:number; tick:number; lastPresent:number; water:number; soil:number; nextId:number; peakPlants:number; lastWeather:Weather; milestones:string[]; plants:Plant[]; log:LogEntry[]; name:string; realWeather?:Record<number,Weather>; lastAlbumSeason?:string;
}
export interface Report { ticks:number; awayMs:number; newLog:LogEntry[]; before:Plant[]; after:Plant[] }
