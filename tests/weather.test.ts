import {it,expect} from 'vitest';
import {BLOCK_MS,weatherAt,weatherFor,TABLE,SEASON_KEY} from '../lib/weather';
it('weather deterministic within each six-hour block',()=>{const t=Date.UTC(2026,3,1,6);for(let seed=0;seed<30;seed++)expect(weatherAt(seed,t)).toBe(weatherAt(seed,t+BLOCK_MS-1))});
it('season probabilities sum to one',()=>{for(const table of Object.values(TABLE))expect(table.reduce((n,[,p])=>n+p,0)).toBeCloseTo(1)});
it('uses stored overrides and UTC season keys',()=>{const t=Date.UTC(2026,9,1);expect(weatherFor({seed:1,realWeather:{[Math.floor(t/BLOCK_MS)]:'flood'}},t)).toBe('flood');expect(SEASON_KEY(t)).toBe('2026-autumn')});
