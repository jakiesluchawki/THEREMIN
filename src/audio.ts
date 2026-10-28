import { frequency } from './music.mjs';
import {FormantChoir} from './choir';
import {expressionFromRoll} from './expression.mjs';
export class Theremin {
 choir:FormantChoir; ctx: AudioContext; filter:BiquadFilterNode; lfo:OscillatorNode; mix: GainNode; voice: OscillatorNode; amplitude: GainNode; master: GainNode; analyser: AnalyserNode; vibrato: GainNode; wet: GainNode; dry: GainNode; destination: MediaStreamAudioDestinationNode;
 constructor() {
  this.ctx = new AudioContext({latencyHint:'interactive'}); const c = this.ctx;
  this.voice = c.createOscillator(); this.amplitude = c.createGain(); this.amplitude.gain.value = 0;
  this.mix = c.createGain(); this.master = c.createGain(); this.master.gain.value = .32;
  const lowpass = c.createBiquadFilter();this.filter=lowpass; lowpass.type = 'lowpass'; lowpass.frequency.value = 4500; lowpass.Q.value = .4;
  this.dry = c.createGain(); this.dry.gain.value = .85; this.wet = c.createGain(); this.wet.gain.value = .15;
  const reverb = c.createConvolver(); const length = c.sampleRate * 1.8; const impulse = c.createBuffer(2,length,c.sampleRate);
  let seed=91823; for(let ch=0;ch<2;ch++) {const d=impulse.getChannelData(ch); for(let i=0;i<length;i++){seed=(seed*1664525+1013904223)>>>0;d[i]=(seed/4294967296*2-1)*Math.exp(-i/(c.sampleRate*.35));}} reverb.buffer=impulse;
  const compressor=c.createDynamicsCompressor(); compressor.threshold.value=-8; compressor.knee.value=6; compressor.ratio.value=8; compressor.attack.value=.003; compressor.release.value=.12;
  this.analyser = c.createAnalyser(); this.analyser.fftSize=1024;
  this.voice.connect(lowpass).connect(this.amplitude); this.amplitude.connect(this.dry).connect(this.mix); this.amplitude.connect(reverb).connect(this.wet).connect(this.mix);
  this.choir=new FormantChoir(c,this.dry,reverb); this.mix.connect(this.master); this.master.connect(compressor).connect(this.analyser).connect(c.destination);
  this.destination=c.createMediaStreamDestination(); this.analyser.connect(this.destination);
  const lfo=c.createOscillator();this.lfo=lfo; lfo.frequency.value=5.4; this.vibrato=c.createGain(); this.vibrato.gain.value=0; lfo.connect(this.vibrato).connect(this.voice.detune); lfo.start(); this.voice.start(); this.setVoice('classic');
 }
 async resume(){await this.ctx.resume();}
 setVoice(kind:string){const spectra:Record<string,number[]>={classic:[0,1,.25,.12,.055,.025],vocal:[0,1,.1,.34,.12,.075,.04],sine:[0,1]};const values=spectra[kind]||spectra.classic;this.voice.setPeriodicWave(this.ctx.createPeriodicWave(new Float32Array(values.length),new Float32Array(values)));}
 play(midi:number,volume:number,glide=.045){const t=this.ctx.currentTime;this.voice.frequency.setTargetAtTime(frequency(midi),t,glide);this.amplitude.gain.setTargetAtTime(volume*.65,t,volume>0?.018:.025);}
 silence(){this.choir.silence();this.amplitude.gain.setTargetAtTime(0,this.ctx.currentTime,.018);}
 setMaster(v:number){this.master.gain.setTargetAtTime(v*.6,this.ctx.currentTime,.02);}
 setSpace(v:number){this.wet.gain.setTargetAtTime(v*.55,this.ctx.currentTime,.03);this.dry.gain.setTargetAtTime(1-v*.3,this.ctx.currentTime,.03);}
 setExpression(roll:number){const e=expressionFromRoll(roll),t=this.ctx.currentTime;this.filter.frequency.setTargetAtTime(Math.min(e.cutoff,this.ctx.sampleRate*.45),t,.065);this.vibrato.gain.setTargetAtTime(e.vibratoCents,t,.065);this.lfo.frequency.setTargetAtTime(e.vibratoRate,t,.065);}
 setVibrato(v:number){this.vibrato.gain.setTargetAtTime(v*35,this.ctx.currentTime,.03);}
}
