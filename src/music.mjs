export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export function pitchFromY(y, base = 48, octaves = 3, scale = 'free') {
  const midi = base + clamp((0.84 - y) / 0.68) * octaves * 12;
  if (scale === 'chromatic') return Math.round(midi);
  if (scale === 'pentatonic') {
    const notes = []; for (let n = base; n <= base + octaves * 12; n++) if ([0, 2, 4, 7, 9].includes(n % 12)) notes.push(n);
    return notes.reduce((a, b) => Math.abs(b - midi) < Math.abs(a - midi) ? b : a);
  }
  return midi;
}
export const frequency = midi => 440 * 2 ** ((midi - 69) / 12);
export const volumeFromY = y => clamp((0.84 - y) / 0.68) ** 1.7;
export function noteInfo(midi) {
 const n = Math.round(midi); return {name:['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'][((n%12)+12)%12], octave: Math.floor(n/12)-1, cents:Math.round((midi-n)*100)};
}
export function assignHands(landmarks) {
 const hands = landmarks.map(points => ({x:1-(points[0].x+points[5].x+points[9].x+points[13].x+points[17].x)/5,y:(points[0].y+points[5].y+points[9].y+points[13].y+points[17].y)/5, points}));
 return {volume:hands.filter(h=>h.x<0.48).sort((a,b)=>a.x-b.x)[0], pitch:hands.filter(h=>h.x>0.52).sort((a,b)=>b.x-a.x)[0]};
}
