export const BEATS=[
 {id:'jazz',name:'Jazz Hop',bpm:119,bars:4,description:'Miękki werbel · swobodny groove',pattern:[1,0,.35,0,.7,0,.35,0,1,0,.35,1,.7,0,.35,0]},
 {id:'funk',name:'Pocket Funk',bpm:100,bars:4,description:'Synkopa · klasyczny pocket',pattern:[1,.25,0,.45,.8,0,.4,0,1,0,.4,.5,.8,.25,0,.4]},
 {id:'electro',name:'Slow Electro',bpm:120,bars:4,description:'Automat · old-school breaks',pattern:[1,0,.4,1,.8,0,.4,0,1,.4,.6,0,.8,.5,.4,0]},
 {id:'house',name:'Classic House',bpm:117,bars:2,description:'Równa stopa · otwarty hi-hat',pattern:[1,0,.4,0,1,0,.65,0,1,0,.4,0,1,0,.65,0]}
] as const;
export type BeatId=typeof BEATS[number]['id'];
type Voice={source:AudioBufferSourceNode,gain:GainNode,start:number,id:BeatId};
export class BeatPlayer{
 private buffers=new Map<BeatId,Promise<AudioBuffer>>(); private active?:Voice;private pending?:Voice;private timer?:ReturnType<typeof setTimeout>;private token=0;
 readonly level:GainNode; selected:BeatId|undefined; muted=false;
 onChange=()=>{};
 constructor(readonly ctx:AudioContext,output:AudioNode){this.level=ctx.createGain();this.level.gain.value=.55;this.level.connect(output);}
 load(id:BeatId){let promise=this.buffers.get(id);if(!promise){promise=fetch(`${import.meta.env.BASE_URL}beats/${id}.wav`).then(r=>{if(!r.ok)throw new Error('BEAT_LOAD');return r.arrayBuffer();}).then(data=>this.ctx.decodeAudioData(data)).catch(e=>{this.buffers.delete(id);throw e;});this.buffers.set(id,promise);}return promise;}
 preload(){for(const beat of BEATS)void this.load(beat.id).catch(()=>{});}
 async select(id:BeatId){
  const token=++this.token;const buffer=await this.load(id);if(token!==this.token)return;
  if(this.selected===id&&this.active&&!this.pending)return;
  if(this.timer)clearTimeout(this.timer);
  if(this.pending){this.pending.source.stop();this.pending.gain.disconnect();this.pending=undefined;}
  const now=this.ctx.currentTime;let start=now+.035;
  if(this.active){const beat=BEATS.find(b=>b.id===this.active!.id)!;const bar=240/beat.bpm;start=this.active.start+Math.ceil((now+.07-this.active.start)/bar)*bar;}
  const source=this.ctx.createBufferSource();source.buffer=buffer;source.loop=true;source.loopEnd=buffer.duration;
  const gain=this.ctx.createGain();gain.gain.value=0;gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(1,start+.018);source.connect(gain).connect(this.level);source.start(start);
  const next={source,gain,start,id};this.pending=next;this.selected=id;this.onChange();
  this.timer=setTimeout(()=>{if(token!==this.token)return;const old=this.active;if(old){old.gain.gain.cancelScheduledValues(start);old.gain.gain.setValueAtTime(1,this.ctx.currentTime);old.gain.gain.linearRampToValueAtTime(0,this.ctx.currentTime+.018);old.source.stop(this.ctx.currentTime+.025);old.source.onended=()=>old.gain.disconnect();}this.active=next;this.pending=undefined;this.onChange();},Math.max(0,(start-now)*1000));
 }
 get transport(){const voice=this.active||this.pending;if(!voice)return undefined;return {start:voice.start,bpm:BEATS.find(b=>b.id===voice.id)!.bpm};}
 get playing(){return !!(this.active||this.pending);}
 get waiting(){return !!this.pending;}
 setVolume(value:number){this.level.gain.setTargetAtTime(this.muted?0:value*.85,this.ctx.currentTime,.025);}
 setMuted(muted:boolean,value:number){this.muted=muted;this.setVolume(value);}
 stop(){this.token++;if(this.timer)clearTimeout(this.timer);const now=this.ctx.currentTime;for(const voice of [this.active,this.pending])if(voice){voice.gain.gain.cancelScheduledValues(now);voice.gain.gain.setTargetAtTime(0,now,.008);try{voice.source.stop(now+.04);}catch{}voice.source.onended=()=>voice.gain.disconnect();}this.active=undefined;this.pending=undefined;this.selected=undefined;this.onChange();}
}
