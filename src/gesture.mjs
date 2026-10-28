import {assignHands} from './music.mjs';
// Bind a musical role to a recognized hand, so it can cross the screen to use the menu.
export class HandRoles {
 labels = {};
 reset(){this.labels={};}
 update(landmarks,handedness=[]){
  const initial=assignHands(landmarks),result={};
  const labelAt=i=>handedness[i]?.[0]?.categoryName;
  for(const role of ['volume','pitch']){
   if(!this.labels[role]&&initial[role]){
    const index=landmarks.indexOf(initial[role].points),label=labelAt(index);
    if(label&&!Object.values(this.labels).includes(label))this.labels[role]=label;
   }
   if(this.labels[role]){
    const matches=landmarks.map((points,i)=>({points,i})).filter(h=>labelAt(h.i)===this.labels[role]);
    if(matches.length===1){const points=matches[0].points;result[role]={x:1-[0,5,9,13,17].reduce((v,i)=>v+points[i].x,0)/5,y:[0,5,9,13,17].reduce((v,i)=>v+points[i].y,0)/5,points};}
   }else result[role]=initial[role];
  }
  return result;
 }
}
export class Dwell {
 id=null; since=0; latched=null;
 latch(id){this.id=id;this.latched=id;this.since=0;}
 constructor(duration=850){this.duration=duration;}
 reset(){this.id=null;this.since=0;this.latched=null;}
 update(point,targets,now){
  const target=point&&targets.find(t=>point.x>=t.left&&point.x<=t.right&&point.y>=t.top&&point.y<=t.bottom);
  if(!target){this.reset();return {id:null,progress:0,activate:null};}
  if(this.latched===target.id)return{id:target.id,progress:1,activate:null};
  if(this.id!==target.id){this.id=target.id;this.since=now;this.latched=null;}
  const progress=Math.min(1,Math.max(0,(now-this.since)/this.duration));
  if(progress===1){this.latched=target.id;return{id:target.id,progress,activate:target.id};}
  return{id:target.id,progress,activate:null};
 }
}
