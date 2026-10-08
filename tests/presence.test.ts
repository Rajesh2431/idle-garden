import {it,expect} from 'vitest';
import {isPresent,frameInterval} from '../lib/presence';
it('presence requires visibility and input inside forty-five seconds',()=>{expect(isPresent(true,100,45099)).toBe(true);expect(isPresent(true,100,45100)).toBe(false);expect(isPresent(false,100,101)).toBe(false)});
it('throttles long-idle frames',()=>{expect(frameInterval(600001)).toBeCloseTo(1000/30);expect(frameInterval(1800001)).toBe(100)});
