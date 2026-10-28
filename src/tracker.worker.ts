/// <reference lib="webworker" />
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
let tracker:HandLandmarker;
const assetBase=new URL('./',self.location.href);
self.onmessage=async ({data})=>{
 if(data.type==='init') {try {const vision=await FilesetResolver.forVisionTasks(new URL('wasm',assetBase).href);tracker=await HandLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:new URL('models/hand_landmarker.task',assetBase).href,delegate:'CPU'},runningMode:'VIDEO',numHands:2,minHandDetectionConfidence:.55,minHandPresenceConfidence:.55,minTrackingConfidence:.55});self.postMessage({type:'ready'});}catch(e){self.postMessage({type:'error',message:String(e)});}return;}
 if(data.type==='frame'){try {const start=performance.now();const result=tracker.detectForVideo(data.frame,data.time);self.postMessage({type:'result',landmarks:result.landmarks,handedness:result.handedness,ms:performance.now()-start});}catch(e){self.postMessage({type:'error',message:String(e)});}finally{data.frame.close();}}
};
