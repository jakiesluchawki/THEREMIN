import {clamp} from './music.mjs';
export const KEYS=[{pc:0,name:'C'},{pc:1,name:'D♭'},{pc:2,name:'D'},{pc:3,name:'E♭'},{pc:4,name:'E'},{pc:5,name:'F'},{pc:6,name:'F♯'},{pc:7,name:'G'},{pc:8,name:'A♭'},{pc:9,name:'A'},{pc:10,name:'B♭'},{pc:11,name:'B'}];
export const SONGS=[
 {id:'kiss-original',name:'Kiss Me · oryginał',detail:'Wersja albumowa · cały utwór · akordy z czasem YouTube',steps:['I'],beatsPerStep:4,tonic:3,bpm:100},
 {id:'pop',name:'Pop · I–V–vi–IV',detail:'Cztery akordy · po jednym takcie',steps:['I','V','vi','IV'],beatsPerStep:4,tonic:7,bpm:100},
 {id:'classic',name:'Klasycznie · I–IV–V–I',detail:'Tonika · subdominanta · dominanta',steps:['I','IV','V','I'],beatsPerStep:4,tonic:7,bpm:100},
 {id:'tonic',name:'Tonika · jeden akord',detail:'Stała harmonia do ćwiczenia gestów',steps:['I'],beatsPerStep:4,tonic:7,bpm:100}
];
const mod=n=>((n%12)+12)%12;
export function chordFor(token,tonic=7,minor=false){
 const specs={ii7:[2,[0,3,7,10],'S','m7'],vi7:[9,[0,3,7,10],'T','m7'],IVmaj7:[5,[0,4,7,11],'S','maj7'],I:[0,minor?[0,3,7]:[0,4,7],'T',minor?'m':''],Imaj7:[0,[0,4,7,11],'T','maj7'],I7:[0,[0,4,7,10],'D → S','7'],ii:[2,minor?[0,3,6]:[0,3,7],'S',minor?'dim':'m'],IV:[minor?5:5,minor?[0,3,7]:[0,4,7],'S',minor?'m':''],V:[7,[0,4,7],'D',''],vi:[minor?8:9,minor?[0,4,7]:[0,3,7],'T',minor?'':'m'],'V/3':[7,[0,4,7],'D',''],IVsus2:[5,[0,2,7],'S','sus2'],Vsus4:[7,[0,5,7],'D','sus4']};
 const [offset,intervals,fn,suffix]=specs[token]||specs.I;const root=mod(tonic+offset);const bass=token==='V/3'?mod(root+4):root;
 const rootName=KEYS.find(k=>k.pc===root).name,bassName=KEYS.find(k=>k.pc===bass).name;
 return {token,root,bass,pcs:intervals.map(n=>mod(root+n)),name:rootName+suffix+(token==='V/3'?'/'+bassName:''),fn};
}
export function songAt(id,beat,tonic,minor=false){const song=SONGS.find(s=>s.id===id)||SONGS[0];const step=Math.floor(Math.max(0,beat)/song.beatsPerStep)%song.steps.length;return {song,step,chord:chordFor(song.steps[step],tonic,minor),progress:(Math.max(0,beat)%song.beatsPerStep)/song.beatsPerStep};}
export function snapMelody(raw,chord,tonic,mode='chord',previous){
 const classes=mode==='chord'?chord.pcs:(mode==='minor'?[0,2,3,5,7,8,10]:mode==='pentatonic'?[0,2,4,7,9]:[0,2,4,5,7,9,11]).map(n=>mod(n+tonic));
 const notes=[];for(let n=36;n<=96;n++)if(classes.includes(mod(n)))notes.push(n);
 if(previous!==undefined&&classes.includes(mod(previous))&&Math.abs(raw-previous)<.68)return previous;
 return notes.reduce((a,b)=>Math.abs(b-raw)<Math.abs(a-raw)?b:a);
}
export function choirVoicing(lead,chord){
 const candidates=[];for(let n=36;n<=96;n++)if(chord.pcs.includes(mod(n)))candidates.push(n);
 const below=candidates.filter(n=>n<lead).sort((a,b)=>b-a);
 const bass=36+chord.bass;const pool=[lead,below[1]??lead-12,below[0]??lead-12,bass,below[3]??lead-24,below[2]??lead-12,below[4]??lead-24,lead-12];
 return pool.map(n=>{while(n<36)n+=12;while(n>96)n-=12;return n;});
}
export function fingerOpenness(points,aspect=1){
 if(!points||points.length<21)return 0;
 const distance=(a,b)=>Math.hypot((a.x-b.x)*aspect,a.y-b.y);
 const ratios=[[5,8],[9,12],[13,16],[17,20]].map(([mcp,tip])=>{const palm=distance(points[0],points[mcp]);return palm>.015?clamp((distance(points[0],points[tip])/palm-1.05)/1.15):0;});
 return ratios.reduce((a,b)=>a+b,0)/4;
}
export function voiceWeights(openness){const expanded=clamp(openness)*7;return Array.from({length:8},(_,i)=>i===0?1:clamp((expanded-(i-1))/.72));}
export function pinchDistance(points,aspect=1){if(!points||points.length<21)return 10;const d=(a,b)=>Math.hypot((a.x-b.x)*aspect,a.y-b.y);const palm=d(points[0],points[9]);return palm>.015?d(points[4],points[8])/palm:10;}
export class HarmonyClock{
 beat=0;at=0;bpm=100;running=false;
 position(now){return Math.max(0,this.beat+(this.running?(now-this.at)*this.bpm/60:0));}
 setRunning(running,now){if(this.running===running)return;this.beat=this.position(now);this.at=now;this.running=running;}
 setBpm(bpm,now){this.beat=this.position(now);this.at=now;this.bpm=bpm;}
 restart(now){this.beat=0;this.at=now;}
 next(now,step){this.beat=(Math.floor(this.position(now)/step)+1)*step;this.at=now;}
}
