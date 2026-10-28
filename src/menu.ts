import {formatDb} from './levels.mjs';
import {BACKINGS} from './backing';
import {BEATS} from './beats';
import {KEYS,SONGS} from './harmony.mjs';
export type Selection={category:string,id:string,name:string,detail:string};
type MenuState={instrument:string,song:string,tonic:number,scale:string,beat?:string,beatVolume:number,master:number,auto:boolean,muted:boolean,range:number,space:number,backing?:string,backingAuto:boolean,backingDb:number,pointerHand:string};
const CATEGORIES=[['beats','Bity'],['instrument','Instrument'],['song','Piosenka'],['backing','Podkład'],['key','Tonacja'],['scale','Skala'],['settings','Ustawienia']];
export class PerformanceMenu{
 open=false;category='beats';pending:Selection|undefined;
 onOpenChange=(open:boolean)=>{};
 constructor(readonly host:HTMLElement,readonly getState:()=>MenuState,readonly commit:(selection:Selection)=>void,readonly command:(command:string)=>void){host.addEventListener('click',e=>{const button=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-gesture]');if(button)this.activate(button.dataset.gesture!);});this.render();}
 options():Selection[]{const s=this.getState();const category=this.category;let options:{id:string,name:string,detail:string}[]=[];
  if(category==='beats')options=BEATS.map(b=>({id:b.id,name:b.name,detail:`${b.bpm} BPM · ${b.description}`}));
  if(category==='instrument')options=[{id:'theremin',name:'Theremin',detail:'Klasyczna barwa · płynna wysokość'},{id:'choir',name:'Choir · Aaa',detail:'Do 8 partii · 24 warstwy wokalne'},{id:'vocoder',name:'Vocoder · Aaa',detail:'Syntetyczne formanty · robotyczna barwa'}];
  if(category==='song')options=SONGS.map(s=>({id:s.id,name:s.name,detail:s.detail}));
  if(category==='backing')options=[...BACKINGS.map(b=>({id:b.id,name:b.name,detail:b.detail})),{id:'off',name:'Bez piosenki',detail:'Tryb jam · można włączyć bit'}];
  if(category==='key')options=KEYS.map(k=>({id:String(k.pc),name:`${k.name} ${s.scale==='minor'?'moll':'dur'}`,detail:s.backing?(k.pc===3?'Tonacja podkładu YouTube':'Zatrzyma podkład E♭ i transponuje chór'):(k.pc===3?'Oryginał „Kiss Me”':'Transpozycja całej harmonii')}));
  if(category==='scale')options=[{id:'chord',name:'Dźwięki akordu',detail:'Melodia i chór zgodne z bieżącym akordem'},{id:'major',name:'Gama durowa',detail:'7 dźwięków · swobodne nuty przejściowe'},{id:'pentatonic',name:'Pentatonika dur',detail:'5 dźwięków · otwarta improwizacja'},{id:'minor',name:'Gama molowa',detail:'7 dźwięków · progresja w wariancie molowym'}];
  if(category==='settings')options=[{id:'range-36',name:'Rejestr niski',detail:'C2–C5 · bas i tenor'},{id:'range-48',name:'Rejestr środkowy',detail:'C3–C6 · tenor i alt'},{id:'range-60',name:'Rejestr wysoki',detail:'C4–C7 · alt i sopran'},{id:'space-0',name:'Blisko',detail:'Suchy głos · przestrzeń 0%'},{id:'space-35',name:'Sala',detail:'Przestrzeń 35%'},{id:'space-70',name:'Katedra',detail:'Przestrzeń 70%'}];
  return options.map(o=>({...o,category}));
 }
 setOpen(open:boolean){this.open=open;if(!open)this.pending=undefined;this.render();this.onOpenChange(open);}
 activate(action:string){
  if(action==='toggle'||action==='menu-open'){this.setOpen(!this.open);return;}
  if(action==='menu-close'){this.setOpen(false);return;}
  if(action.startsWith('category-')){this.category=action.slice(9);this.pending=undefined;this.render();return;}
  if(action.startsWith('option-')){this.pending=this.options().find(o=>o.id===action.slice(7));this.render();return;}
  if(action==='confirm'&&this.pending){const selection=this.pending;this.setOpen(false);this.commit(selection);return;}
  if(action==='cancel'){this.pending=undefined;this.render();return;}
  this.command(action);this.render();
 }
 render(){const s=this.getState();this.host.classList.toggle('hidden',!this.open);if(!this.open){this.host.innerHTML='';return;}
 const selected=(o:Selection)=>o.category==='settings'?(o.id===`range-${s.range}`||o.id===`space-${Math.round(s.space*100)}`):o.id===(o.category==='beats'?s.beat:o.category==='instrument'?s.instrument:o.category==='song'?s.song:o.category==='backing'?(s.backing||'off'):o.category==='key'?String(s.tonic):s.scale);
 this.host.innerHTML=`<div class="performance-menu" role="region" aria-label="Menu gestów"><div class="menu-header"><div><span class="eyebrow">AER / MENU GESTÓW</span><h2>${this.pending?'Potwierdź wybór.':'Wskaż. Wybierz. Zagraj.'}</h2></div><div class="menu-header-actions"><button data-gesture="sound-toggle">${s.muted?'Wznów dźwięk':'Wycisz'}</button><button data-gesture="menu-close" aria-label="Zamknij menu i wróć do gry">Wróć do gry ↗</button></div></div>${this.pending?`<div class="menu-confirm"><span class="eyebrow">WYBRANA OPCJA</span><h3>${this.pending.name}</h3><p>${this.pending.detail}</p><div class="confirm-actions"><button class="confirm-yes" data-gesture="confirm">Potwierdź ✓</button><button data-gesture="cancel">Wybierz ponownie</button></div><div class="pinch-hint">Przytrzymaj kursor na „Potwierdź” albo złącz kciuk z palcem wskazującym ${s.pointerHand==='right'?'prawej':'lewej'} dłoni.</div></div>`:`<nav class="menu-categories" aria-label="Działy menu">${CATEGORIES.map(([id,name])=>`<button data-gesture="category-${id}" aria-pressed="${this.category===id}">${name}</button>`).join('')}</nav><div class="menu-options ${this.category==='key'?'key-options':''} ${this.category==='song'||this.category==='settings'?'song-options':''}">${this.options().map((o,i)=>`<button data-gesture="option-${o.id}" data-option="${o.id}" aria-pressed="${selected(o)}"><span class="option-number mono">${String(i+1).padStart(2,'0')}${selected(o)?' / AKTYWNE':''}</span><strong>${o.name}</strong><span>${o.detail}</span></button>`).join('')}</div><div class="menu-utility">${this.category==='beats'?`<button data-gesture="beat-less" aria-label="Ciszej bity">−</button><span>Bit ${Math.round(s.beatVolume*100)}%</span><button data-gesture="beat-more" aria-label="Głośniej bity">＋</button><button data-gesture="beat-stop">Wyłącz bit ■</button>`:this.category==='backing'?`<button data-gesture="song-play">Play / pauza</button><button data-gesture="backing-less">−3 dB</button><span>${formatDb(s.backingDb)}</span><button data-gesture="backing-more">＋3 dB</button><button data-gesture="song-earlier" title="Przesuń akordy o 0,1 s wcześniej">−0,1 s</button><button data-gesture="song-later" title="Przesuń akordy o 0,1 s później">＋0,1 s</button><button data-gesture="song-sync-reset">Przywróć synchronizację</button>`:this.category==='song'&&s.backing?`<span>Pełna mapa oryginału · sekcje zmieniają się automatycznie</span>`:this.category==='song'?`<button data-gesture="harmony-auto">${s.auto?'Zatrzymaj':'Wznów'} progresję</button><button data-gesture="harmony-restart">Od początku ↺</button>`:`<button data-gesture="master-less" aria-label="Ciszej cały instrument">−</button><span>Wyjście ${Math.round(s.master*100)}%</span><button data-gesture="master-more" aria-label="Głośniej cały instrument">＋</button>`}</div><div class="menu-help mono">${s.pointerHand==='right'?'PRAWA':'LEWA'} DŁOŃ / KURSOR · PRZYTRZYMAJ, ABY WYBRAĆ · ZŁĄCZ PALCE, ABY POTWIERDZIĆ</div>`}</div>`;
 }
}
