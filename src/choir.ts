import {frequency} from './music.mjs';
import {voiceWeights} from './harmony.mjs';
type Part={oscillators:OscillatorNode[],lfos:OscillatorNode[],vibratos:GainNode[],filters:BiquadFilterNode[],level:GainNode};
export class FormantChoir{
 readonly parts:Part[]=[];readonly output:GainNode;private mode='choir';private openness=0;private roll=0;
 constructor(readonly ctx:AudioContext,dry:AudioNode,wet:AudioNode){
  this.output=ctx.createGain();this.output.gain.value=1;this.output.connect(dry);this.output.connect(wet);
  const harmonics=new Float32Array(65);for(let i=1;i<65;i++)harmonics[i]=1/i**1.45;const wave=ctx.createPeriodicWave(new Float32Array(65),harmonics);
  for(let index=0;index<8;index++){
   const level=ctx.createGain();level.gain.value=0;level.connect(this.output);const sum=ctx.createGain();sum.gain.value=.52;
   const filters=[730,1090,2440].map((f,j)=>{const filter=ctx.createBiquadFilter();filter.type='bandpass';filter.frequency.value=f*(.98+index*.007);filter.Q.value=[6,8,11][j];const gain=ctx.createGain();gain.gain.value=[1.6,.85,.28][j];sum.connect(filter).connect(gain).connect(level);return filter;});
   const body=ctx.createBiquadFilter();body.type='lowpass';body.frequency.value=450;const bodyGain=ctx.createGain();bodyGain.gain.value=.12;sum.connect(body).connect(bodyGain).connect(level);
   const oscillators:OscillatorNode[]=[],lfos:OscillatorNode[]=[],vibratos:GainNode[]=[];
   for(let singer=0;singer<3;singer++){const oscillator=ctx.createOscillator();oscillator.setPeriodicWave(wave);oscillator.detune.value=(singer-1)*6+(index%3-1)*1.7;const singerGain=ctx.createGain();singerGain.gain.value=.32;const pan=ctx.createStereoPanner();pan.pan.value=Math.max(-.85,Math.min(.85,(index%2?1:-1)*(.14+index*.07)+(singer-1)*.12));oscillator.connect(singerGain).connect(pan).connect(sum);const lfo=ctx.createOscillator();lfo.frequency.value=4.3+index*.13+singer*.21;const vibrato=ctx.createGain();vibrato.gain.value=3.5+singer*.8;lfo.connect(vibrato).connect(oscillator.detune);lfo.start(ctx.currentTime+singer*.017);oscillator.start(ctx.currentTime+singer*.011);oscillators.push(oscillator);lfos.push(lfo);vibratos.push(vibrato);}
   this.parts.push({oscillators,lfos,vibratos,filters,level});
  }
 }
 setMode(mode:string){if(this.mode===mode)return;this.mode=mode;const values=new Float32Array(65);for(let i=1;i<65;i++)values[i]=1/i**(mode==='vocoder'?1.04:1.45);const wave=this.ctx.createPeriodicWave(new Float32Array(65),values);for(const part of this.parts)for(const oscillator of part.oscillators)oscillator.setPeriodicWave(wave);this.setExpression(this.roll);}
 setExpression(roll:number){this.roll=roll;const t=this.ctx.currentTime;const base=this.mode==='vocoder'?[650,1220,2700]:[730,1090,2440];for(let i=0;i<this.parts.length;i++){const part=this.parts[i];part.filters.forEach((filter,j)=>{filter.frequency.setTargetAtTime(base[j]*(1+roll*(j===0?.22:.13))*(.98+i*.007),t,.08);filter.Q.setTargetAtTime(this.mode==='vocoder'?12:[6,8,11][j],t,.08);});for(let j=0;j<3;j++)part.vibratos[j].gain.setTargetAtTime((this.mode==='vocoder'?1.5:4)+j*.8+Math.max(0,roll)*12,t,.08);}}
 play(notes:number[],volume:number,openness:number){const weights=voiceWeights(openness);this.openness=openness;const norm=Math.sqrt(weights.reduce((v,w)=>v+w*w,0));const t=this.ctx.currentTime;this.parts.forEach((part,i)=>{part.level.gain.setTargetAtTime(volume*weights[i]*1.3/norm,t,.055);for(const oscillator of part.oscillators)oscillator.frequency.setTargetAtTime(frequency(notes[i]??notes[0]),t,.025);});}
 silence(){for(const part of this.parts)part.level.gain.setTargetAtTime(0,this.ctx.currentTime,.025);}
 get voices(){return voiceWeights(this.openness).filter(w=>w>.35).length;}
}
