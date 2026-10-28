export const BACKING_MIN_DB=-48;
export const clampDb=db=>Number.isFinite(db)?Math.min(0,Math.max(BACKING_MIN_DB,db)):BACKING_MIN_DB;
export const dbToGain=db=>db<=BACKING_MIN_DB?0:10**(clampDb(db)/20);
export const formatDb=db=>db<=BACKING_MIN_DB?'−∞ dB':`${Math.round(clampDb(db))} dB`;
