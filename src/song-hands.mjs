import {choirVoicing,snapMelody} from './harmony.mjs';
// Only vertical register belongs to the right hand. Chord choice is automatic.
export class RightSongHand {
 register=1;
 reset(){this.register=1;}
 update(point){
  if(!point)return;
  if(this.register===1){if(point.y<.34)this.register=2;else if(point.y>.66)this.register=0;}
  else if(this.register===2&&point.y>.42)this.register=1;
  else if(this.register===0&&point.y<.58)this.register=1;
 }
}
export function registeredChoir(chord,tonic,register,base=48){
 const lead=snapMelody(base+19,chord,tonic,'chord'),shift=(register-1)*12;
 return choirVoicing(lead,chord).map(n=>{n+=shift;while(n<36)n+=12;while(n>96)n-=12;return n;});
}
