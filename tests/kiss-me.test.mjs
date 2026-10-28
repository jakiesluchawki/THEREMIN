import test from 'node:test';
import assert from 'node:assert/strict';
import {kissMeAt,KISS_ME_CUES,SongSync} from '../src/kiss-me.mjs';
import {registeredChoir} from '../src/song-hands.mjs';

test('album arrangement follows all sections, including the longer instrumental and final cadence',()=>{
 for(const [time,name,section] of [[1.34,'E♭','Wstęp'],[6.14,'E♭7','Wstęp'],[20.54,'E♭','Zwrotka 1'],[39.74,'Fm','Refren 1'],[52.94,'B♭/D','Refren 1'],[61.34,'E♭','Łącznik'],[70.94,'E♭','Zwrotka 2'],[90.14,'Fm','Refren 2'],[111.74,'E♭','Instrumental'],[130.94,'Fm7','Łącznik chóru'],[140.54,'Fm7','Refren 3'],[162.14,'E♭','So kiss me'],[181.34,'E♭','Outro'],[200.54,'E♭','Wybrzmienie']]){
  const h=kissMeAt(time);assert.equal(h.chord.name,name,`at ${time}s`);assert.equal(h.section.name,section);
 }
});
test('cue boundaries use the recording clock without wrapping, and arbitrary backward seeks are deterministic',()=>{
 for(let i=1;i<KISS_ME_CUES.length;i++){
  const cue=KISS_ME_CUES[i];assert.ok(cue.at>KISS_ME_CUES[i-1].at);
  assert.equal(kissMeAt(cue.at-.001).index,i-1);assert.equal(kissMeAt(cue.at).index,i);
 }
 const first=kissMeAt(40.2);kissMeAt(190);assert.deepEqual(kissMeAt(40.2),first);
 assert.equal(kissMeAt(0).rest,true);assert.equal(kissMeAt(1.339).rest,true);assert.equal(kissMeAt(1.34).rest,false);assert.equal(kissMeAt(210).rest,true);assert.equal(kissMeAt(600).rest,true);
});
test('choral voicings preserve every mapped chord including sevenths and slash basses in all registers',()=>{
 for(const cue of KISS_ME_CUES){if(cue.token==='N')continue;const h=kissMeAt(cue.at);for(let register=0;register<3;register++)for(const note of registeredChoir(h.chord,3,register))assert.ok(h.chord.pcs.includes(note%12),`${cue.token} / ${note}`);}
});
test('latency correction offsets the entire map without restarting sections or accumulating drift',()=>{
 const sync=new SongSync();sync.nudge(.1);assert.equal(kissMeAt(39.64,sync.offset).section.name,'Refren 1');
 for(let i=0;i<100;i++)sync.nudge(.1);assert.equal(sync.offset,1);
 sync.reset();assert.equal(sync.offset,0);assert.equal(kissMeAt(140.54,sync.offset).section.name,'Refren 3');
});
