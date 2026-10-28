import {clamp} from './music.mjs';
// Screen-space palm roll, measured along wrist → middle-finger knuckle.
// Correct horizontal distances for camera aspect ratio; independent of hand size.
export function palmRoll(points,aspect=1){
 if(!points?.[0]||!points?.[9])return 0;
 const dx=(points[0].x-points[9].x)*aspect,dy=points[0].y-points[9].y;
 if(!Number.isFinite(dx)||!Number.isFinite(dy)||Math.hypot(dx,dy)<.015)return 0;
 const degrees=Math.atan2(dx,dy)*180/Math.PI;
 return Math.sign(degrees)*clamp((Math.abs(degrees)-8)/42);
}
export function expressionFromRoll(roll){
 const value=clamp(roll,-1,1),right=Math.max(0,value);
 return {cutoff:4500*2**(value*(value<0?2.4:1.25)),vibratoCents:right*28,vibratoRate:5.4+right*1.8};
}
