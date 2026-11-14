import {STORAGE_KEY,GEOGRAPHIES,PRIORITIES,CHOICES,NAME_SUGGESTIONS,createDraft,startVillage,confirmChoice,finishStage,validName,validateState,formatEffects} from './engine.js';
import {makePDF} from './pdf.js';
const $=id=>document.getElementById(id);
let state;let step=0;let saveTimer;const STEPS=['Name your village','Meet your people','Discover your land','Choose a priority'];
try{const raw=localStorage.getItem(STORAGE_KEY);const parsed=raw?JSON.parse(raw):null;state=validateState(parsed)?parsed:createDraft();}catch{state=createDraft();}
try{step=Math.max(0,Math.min(3,Number(localStorage.getItem(STORAGE_KEY+'-step'))||0));}catch{}
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));localStorage.setItem(STORAGE_KEY+'-step',String(step));$('saveStatus').textContent='Saved on this device.';}catch{$('saveStatus').textContent='Browser saving unavailable. Download a backup.';}}
function laterSave(){clearTimeout(saveTimer);saveTimer=setTimeout(save,120);}
function el(tag,cls='',txt){const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;}
function btn(label,callback,cls=''){const b=el('button',cls,label);b.type='button';b.addEventListener('click',callback);return b;}
function add(p,...nodes){p.append(...nodes);return p;}
function goTop(){document.getElementById('story').scrollIntoView({behavior:'smooth',block:'nearest'});}
function geo(){return GEOGRAPHIES.find(g=>g.id===state.geography);}
function render(){const s=state.stage;const title=state.village?.trim()||'A Village Takes Root';$('villageTitle').textContent=title;$('status').textContent=s==='setup'?`Founding · Step ${step+1} of 4`:s==='decision'?'Chapter I · Decision 1 of 9':s==='outcome'?'Decision 1 · Outcome':'Stage 1.5 · Complete';$('mapCaption').textContent=geo().detail;renderMap();renderResources();renderStory();renderChronicle();}
// The painted village is a reusable background. Interactive HTML buttons and
// state-driven SVG decorations sit above it, so they can evolve independently.
const landmarks=[
 {id:'fields',name:'Fields',x:19,y:73,text:'Households cultivate crops on scattered plots. Harvests depend on the seasons, available labor, and access to land.'},
 {id:'homes',name:'Cottages',x:32,y:45,text:'Timber-framed cottages shelter households with different amounts of land, goods, and customary obligations.'},
 {id:'church',name:'Church',x:84,y:21,text:'The local church shapes worship, community life, obligations, and relationships with religious institutions.'},
 {id:'store',name:'Granary',x:10,y:45,text:'The raised granary stores food and protects some supplies from dampness and animals.'},
 {id:'river',name:'River',x:77,y:82,text:'The river supports water, transport, and local livelihoods. Its importance differs between regions.'}
];
function changeOverlay(){
 const choice=state.decision?.id;
 if(!choice)return '';
 const common='<defs><filter id="glow"><feGaussianBlur stdDeviation="3"/></filter></defs>';
 if(choice==='A')return common+`<g class="mapchange" transform="translate(151 515)">
 <ellipse cx="0" cy="7" rx="75" ry="21" fill="#e6b45b" opacity=".25"/>
 <path d="M-44 -28 Q-62 -4 -50 16 Q-29 31 -8 14 Q2 -6 -18 -29Z" fill="#b98a4f" stroke="#5c462d" stroke-width="4"/>
 <path d="M-7 -39 Q-24 -7 -13 21 Q10 37 31 18 Q39 -7 17 -39Z" fill="#d5ad69" stroke="#5c462d" stroke-width="4"/>
 <path d="M28 -21 Q16 0 26 22 Q48 36 67 17 Q71 -2 51 -26Z" fill="#b98a4f" stroke="#5c462d" stroke-width="4"/>
 <path d="M-35 -26 Q-23 -21 -13 -28 M0 -37 Q10 -30 20 -37 M39 -22 L53 -25" stroke="#6c5338" stroke-width="4" fill="none"/>
 </g>`;
 if(choice==='B')return common+`<g class="mapchange" stroke="#f7d78b" stroke-width="8" stroke-linecap="round" opacity=".9">
 <path d="M390 305 L485 264 M426 321 L524 277 M929 437 L1034 405"/>
 </g><g class="mapchange" fill="#fff3b6"><path d="M545 277l6 17 18 6-18 6-6 17-6-17-18-6 18-6Z"/><path d="M1010 378l5 12 12 5-12 5-5 12-5-12-12-5 12-5Z"/></g>`;
 if(choice==='C')return `<g class="mapchange" transform="translate(1005 640)"><path d="M0 0V-95" stroke="#4b3c2c" stroke-width="8"/><path d="M4 -90 Q35 -100 66 -85V-32Q32 -45 4 -30Z" fill="#8b4637" stroke="#f1d5a4" stroke-width="4"/><path d="M29 -77L45 -77M37 -85V-68" stroke="#eacb91" stroke-width="5"/></g>`;
 return `<g class="mapchange" transform="translate(860 680)">
 <ellipse rx="91" ry="26" fill="#e7c78d" opacity=".35"/>
 ${[[-53,0],[-16,-12],[20,3],[55,-8]].map(([x,y],i)=>`<g transform="translate(${x} ${y})"><circle cy="-27" r="10" fill="${i%2?'#d9ac7f':'#a87954'}" stroke="#60482f" stroke-width="2"/><path d="M-12 -15L12 -15L18 22L-18 22Z" fill="${i%2?'#59735b':'#8b6c48'}" stroke="#42513c" stroke-width="2"/></g>`).join('')}
 </g>`;
}
function renderMap(){
 const root=$('map');
 root.replaceChildren();
 const art=el('div','mapart');
 const img=el('img','villagepainting');
 img.src='./assets/medieval-village.webp';
 img.alt='Painted overview of a medieval English farming village, with cottages, a church, fields, a granary, and a river.';
 img.draggable=false;
 art.append(img);
 const layer=document.createElementNS('http://www.w3.org/2000/svg','svg');
 layer.setAttribute('viewBox','0 0 1672 941');
 layer.setAttribute('preserveAspectRatio','xMidYMid meet');
 layer.setAttribute('class','changes');
 layer.setAttribute('aria-hidden','true');
 layer.innerHTML=changeOverlay();
 art.append(layer);
 root.append(art);
 for(const mark of landmarks){
   const b=btn(mark.name,()=>{
     const text=mark.id==='store'&&state.decision?.id==='A'
       ?'Your villagers have stored extra grain for winter. The sacks beside the granary mark this choice.'
       :mark.id==='homes'&&state.decision?.id==='B'
       ?'Freshly repaired roofs help households prepare for winter. Golden highlights mark the repaired buildings.'
       :mark.text;
     $('landmarkTitle').textContent=mark.name;
     $('landmarkText').textContent=text;
     $('landmarkInfo').hidden=false;
   },'hotspot');
   b.style.left=mark.x+'%';b.style.top=mark.y+'%';
   b.title='Inspect '+mark.name;
   root.append(b);
 }
 $('landmarkInfo').hidden=true;
}
function renderResources(){const root=$('resources');root.replaceChildren();const definitions=[['food','Food','Supplies'],['population','Population','Demographic condition'],['wealth','Wealth','Goods and means'],['stability','Stability','Managing disruptions']];for(const [key,name,desc] of definitions){const n=el('div','resitem');add(n,el('div','resname',name),el('div','resvalue',state.resources?String(state.resources[key])+'/5':'—'));const p=el('div','resbar');for(let i=1;i<=5;i++)p.append(el('span',state.resources?.[key]>=i?'filled':''));add(n,p,el('div','resdesc',desc));root.append(n);}}
function heading(root,kicker,title){add(root,el('span','eyebrow',kicker),el('h2','',title));}
function error(root,msg){let e=root.querySelector('.error');if(!e){e=el('p','error');e.setAttribute('role','alert');root.append(e);}e.textContent=msg;}
function stepBar(root){const p=el('div','stepbar');add(p,el('span','eyebrow',`VILLAGE FOUNDING · STEP ${step+1} OF 4`));const track=el('div','steptrack');for(let i=0;i<4;i++)track.append(el('span',i<=step?'active':''));p.append(track);root.append(p);}
function inputField(label,value,onChange){const box=el('div','field');const id='field-'+Math.random().toString(36).slice(2);const l=el('label','',label);l.htmlFor=id;const input=el('input');input.id=id;input.maxLength=32;input.autocomplete='off';input.value=value;input.placeholder='Enter a name (2–32 characters)';input.addEventListener('input',()=>{onChange(input.value);laterSave();});add(box,l,input);return {box,input};}
function navigation(root,back,next,nextLabel='Continue'){const row=el('div','actions');if(back)row.append(btn('← Back',back,'outline'));row.append(btn(nextLabel,next,'primary'));root.append(row);}
function renderSetup(root){stepBar(root);if(step===0){heading(root,'ENGLAND · c. 920','A Village Takes Root');add(root,el('p','',`England is not yet fully united under one ruler. Anglo-Saxon rulers hold some regions, while Scandinavian settlement and conquest have shaped others. Across the countryside, people farm, trade, and meet obligations shaped by local custom. Your village begins here. Its story will unfold across generations.`));const f=inputField('What will your village be called?',state.village,v=>state.village=v);root.append(f.box);add(root,el('p','hint','Choose a plausible village name. You can use letters, spaces, hyphens, or apostrophes.'));navigation(root,null,()=>{state.village=f.input.value.trim();if(!validName(state.village))return error(root,'Please enter an appropriate village name of 2–32 characters.');step=1;save();render();goTop();});}
else if(step===1){heading(root,'THE PEOPLE OF YOUR VILLAGE','Meet the Founders');add(root,el('p','','Three people will help tell your village’s story. Their perspectives may differ, and later generations will remember their choices.'));const inputs={};for(const [key,label] of [['farmer','Farmer'],['craft','Craftworker or merchant'],['religious','Religious representative']]){const f=inputField(label,state.names[key],v=>state.names[key]=v);inputs[key]=f.input;const suggestions=el('div','chips');for(const name of NAME_SUGGESTIONS[key])suggestions.append(btn(name,()=>{f.input.value=name;state.names[key]=name;laterSave();},'chip'));add(root,f.box,suggestions);}navigation(root,()=>{step=0;save();render();},()=>{for(const k of Object.keys(inputs))state.names[k]=inputs[k].value.trim();if(!Object.values(state.names).every(validName))return error(root,'Please give each character an appropriate name of 2–32 characters.');step=2;save();render();goTop();});}
else if(step===2){heading(root,'THE LAND AROUND YOU','Discover Your Geography');const g=geo();add(root,el('div','geocard',g.name),el('p','',g.detail),el('p','hint',`Your village lies in ${g.region}. Geography was assigned once and stays the same throughout the simulation.`),el('p','hint','Look at the illustrated map above. Select its landmarks to learn about the village.'));const r=el('div','starting');for(const [key,val] of Object.entries(g.start))r.append(el('span','',`${key[0].toUpperCase()+key.slice(1)} ${val}/5`));root.append(r);navigation(root,()=>{step=1;save();render();},()=>{step=3;save();render();goTop();});}
else{heading(root,'YOUR FOUNDING PRIORITY','What Matters Most?');add(root,el('p','','Your first priority shapes the village’s starting circumstances, but you may make different choices later.'));const choices=el('div','prioritygrid');for(const p of PRIORITIES){const b=btn('',()=>{state.priority=p.id;save();renderStory();},'prioritycard'+(state.priority===p.id?' selected':''));b.setAttribute('aria-pressed',String(state.priority===p.id));add(b,el('strong','',p.name),el('span','',p.description),el('small','',p.id==='autonomy'?'Stronger customary negotiating position; no resource bonus':formatEffects({food:0,population:0,wealth:0,stability:0,...p.delta})));choices.append(b);}root.append(choices);navigation(root,()=>{step=2;save();render();},()=>{if(!state.priority)return error(root,'Please select a founding priority.');state=startVillage(state,{village:state.village.trim(),names:state.names,priority:state.priority});save();render();goTop();},'Found my village →');}}
function renderDecision(root){heading(root,'CHAPTER I · DECISION 1 OF 9 · c. 920','Preparing for Winter');add(root,el('p','',`Autumn settles over ${state.village}. The harvest is gathered, but grain must be stored, roofs repaired, and customary duties met. There are not enough hands to do everything before winter.`),el('blockquote','',`${state.names.farmer}, a farmer, worries about the grain supply. ${state.names.craft}, who works with tools and goods, points to damaged roofs. ${state.names.religious}, the religious representative, reminds everyone that households have different needs.`),el('p','hint','Choose one approach. You can change your mind until you confirm. Exact effects appear afterward.'));const opts=el('div','options');for(const c of CHOICES){const b=btn('',()=>{state.selected=c.id;save();renderStory();},'choice'+(state.selected===c.id?' selected':''));b.setAttribute('aria-pressed',String(state.selected===c.id));add(b,el('strong','',`${c.id}. ${c.title}`),el('span','',c.hint));opts.append(b);}root.append(opts);const confirm=btn('Confirm decision →',()=>{if(!state.selected)return;state=confirmChoice(state,state.selected);save();render();goTop();},'primary');confirm.disabled=!state.selected;root.append(confirm);}
function renderOutcome(root){const d=state.decision;heading(root,'DECISION 1 · CONSEQUENCES','Winter Preparations');add(root,el('div','geocard',d.title),el('p','',d.outcome),el('h3','','Immediate resource effects'),el('p','effect',formatEffects(d.actual)),el('h3','','Echo for the future'),el('p','',d.legacy),el('p','hint','Look at your village map. Some choices have left visible changes. This decision is now recorded in the Chronicle.'));root.append(btn('Continue →',()=>{state=finishStage(state);save();render();goTop();},'primary'));}
function renderComplete(root){heading(root,'STAGE 1.5 COMPLETE','Your Village Has Begun');add(root,el('p','',`Your first decision has shaped a tradition in ${state.village}. Later chapters will carry this history forward.`),el('p','','This prototype stops after decision 1 of 9. The final historical argument and additional chapters will come in later stages.'),el('p','hint','You can download a backup or the Stage 1 report now.'));navigation(root,null,downloadPDF,'Download Stage 1 PDF');root.append(btn('Download backup',downloadBackup,'outline'));}
function renderStory(){const root=$('story');root.replaceChildren();if(state.stage==='setup')renderSetup(root);else if(state.stage==='decision')renderDecision(root);else if(state.stage==='outcome')renderOutcome(root);else renderComplete(root);}
function renderChronicle(){const root=$('chronicle');root.replaceChildren();if(!state.chronicle.length){root.append(el('p','hint','Your village’s decisions and their consequences will appear here.'));return;}for(const entry of state.chronicle){const a=el('article','entry');add(a,el('span','eyebrow',`c. ${entry.year}`),el('h3','',entry.title),el('p','',entry.text));if(entry.legacy)a.append(el('p','hint','Echo for the future: '+entry.legacy));root.append(a);}}
function download(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2500);}
function filename(s){return (s||'village').normalize('NFKD').replace(/[^a-zA-Z0-9_-]/g,'-').slice(0,32)||'village';}
function downloadBackup(){save();download(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),`medieval-chronicle-${filename(state.village)}-backup.json`);}
function downloadPDF(){download(makePDF(state),`medieval-chronicle-${filename(state.village)}-stage1.pdf`);}
$('closeLandmark').addEventListener('click',()=>$('landmarkInfo').hidden=true);
$('menuToggle').addEventListener('click',()=>{const isOpen=$('tools').hidden;$('tools').hidden=!isOpen;$('menuToggle').setAttribute('aria-expanded',String(isOpen));});
$('backup').addEventListener('click',downloadBackup);$('pdf').addEventListener('click',downloadPDF);$('restore').addEventListener('click',()=>$('backupFile').click());
$('backupFile').addEventListener('change',async e=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;if(f.size>200000)return alert('Backup file is too large.');try{const obj=JSON.parse(await f.text());if(!validateState(obj))throw Error('Invalid');if(!confirm('Import backup? It will replace your current saved progress.'))return;state=obj;step=state.stage==='setup'?0:3;save();render();}catch{alert('This is not a valid Stage 1 backup. Your existing work is unchanged.');}});
$('new').addEventListener('click',()=>{if(!confirm('Start a new village? This replaces current saved progress. Download a backup first if needed.'))return;state=createDraft();step=0;save();render();});
window.addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save();});save();render();
