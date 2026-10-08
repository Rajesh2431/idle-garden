import {it,expect} from 'vitest';
import {gzip} from 'pako';
import {newGarden} from '../lib/sim';
import {encodeSnapshot,decodeSnapshot} from '../lib/snapshot';
it('round-trips valid gardens',()=>{const s=newGarden(1800000000000,42);expect(decodeSnapshot(encodeSnapshot(s))).toEqual(s)});
it('rejects oversize, malformed and out of bounds data',()=>{expect(()=>decodeSnapshot('a'.repeat(102401))).toThrow();expect(()=>decodeSnapshot('what?')).toThrow();const s=newGarden(1800000000000,1);s.water=101;const bad=Buffer.from(gzip(JSON.stringify(s))).toString('base64url');expect(()=>decodeSnapshot(bad)).toThrow();expect(()=>encodeSnapshot(s)).toThrow()});
it('stops decompression bombs',()=>{const bomb=Buffer.from(gzip(' '.repeat(400000))).toString('base64url');expect(()=>decodeSnapshot(bomb)).toThrow('expands')});
