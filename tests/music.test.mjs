import test from 'node:test';
import assert from 'node:assert/strict';
import {pitchFromY,volumeFromY,frequency,assignHands,noteInfo} from '../src/music.mjs';
test('pitch covers exactly three octaves, clamps outside the field',()=>{assert.equal(pitchFromY(.84),48);assert.equal(pitchFromY(.16),84);assert.equal(pitchFromY(-1),84);assert.equal(pitchFromY(2),48);assert.equal(frequency(69),440);});
test('volume reaches silence at the bottom and full amplitude at top',()=>{assert.equal(volumeFromY(.84),0);assert.ok(Math.abs(volumeFromY(.16)-1)<1e-12);assert.ok(volumeFromY(.5)<.5);});
test('quantization chooses valid notes without escaping the register',()=>{for(let i=0;i<1000;i++){const p=pitchFromY(i/1000,48,3,'pentatonic');assert.ok([0,2,4,7,9].includes(p%12));assert.ok(p>=48&&p<=84);assert.equal(pitchFromY(i/1000,48,3,'chromatic')%1,0);}});
const hand=(x,y)=>Array.from({length:21},()=>({x,y,z:0}));
test('mirrored camera coordinates keep distinct roles and never invent missing hands',()=>{const a=assignHands([hand(.8,.3),hand(.2,.4)]);assert.ok(Math.abs(a.volume.x-.2)<.001);assert.ok(Math.abs(a.pitch.x-.8)<.001);assert.equal(assignHands([hand(.8,.3)]).pitch,undefined);assert.equal(assignHands([hand(.5,.3)]).volume,undefined);assert.equal(assignHands([]).pitch,undefined);});
test('tuning readout respects concert A and signed cents',()=>{assert.deepEqual(noteInfo(69),{name:'A',octave:4,cents:0});assert.equal(noteInfo(69.25).cents,25);assert.equal(noteInfo(68.75).cents,-25);});
