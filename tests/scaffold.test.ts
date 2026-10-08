import {expect,it} from 'vitest';
import {existsSync} from 'node:fs';
it('includes the application and environment template',()=>{expect(existsSync('app/page.tsx')).toBe(true);expect(existsSync('.env.example')).toBe(true)});
