import {STORAGE_KEY,GEOGRAPHIES,PRIORITIES,CHOICES,NAME_SUGGESTIONS,createDraft,startVillage,confirmChoice,finishStage,finishSource,finishReflection,finishNorman,finishHighJustification,finishHighReflection,CHAPTER_DECISIONS,HIGH_REFLECTION_QUESTION,HIGH_SOURCE_NOTE,FIRST_SOURCE,migrateState,validName,validateState,formatEffects} from './engine.js';
import {makePDF} from './pdf.js';
const $=id=>document.getElementById(id);
let state;let step=0;let saveTimer;const STEPS=['Name your village','Meet your people','Discover your land','Choose a priority'];
try{const raw=localStorage.getItem(STORAGE_KEY);const parsed=raw?JSON.parse(raw):null;state=validateState(migrateState(parsed))?migrateState(parsed):createDraft();}catch{state=createDraft();}
try{step=Math.max(0,Math.min(3,Number(localStorage.getItem(STORAGE_KEY+'-step'))||0));}catch{}
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));localStorage.setItem(STORAGE_KEY+'-step',String(step));$('saveStatus').textContent='Saved on this device.';}catch{$('saveStatus').textContent='Browser saving unavailable. Download a backup.';}}
function laterSave(){clearTimeout(saveTimer);saveTimer=setTimeout(save,120);}
function el(tag,cls='',txt){const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;}
function btn(label,callback,cls=''){const b=el('button',cls,label);b.type='button';b.addEventListener('click',callback);return b;}
function add(p,...nodes){p.append(...nodes);return p;}
function goTop(){document.getElementById('story').scrollIntoView({behavior:'smooth',block:'nearest'});}
function geo(){return GEOGRAPHIES.find(g=>g.id===state.geography);}
function render(){const stage=state.stage,turn=state.turn??0,d=CHAPTER_DECISIONS[turn];const title=state.village?.trim()||'A Village Takes Root';$('villageTitle').textContent=title;$('status').textContent=stage==='setup'?`Founding · Step ${step+1} of 4`:stage==='decision'?`Chapter ${turn<3?'I':'II'} · Decision ${turn+1} of 6`:stage==='outcome'?`Decision ${turn+1} · Outcome`:stage==='source'?'Historical source':stage==='reflection'?'Chapter I reflection':stage==='norman'?'1066 · Norman Conquest':stage==='highJustification'?'Decision justification':stage==='highReflection'?'Chapter II reflection':'Chapter II · Complete';$('year').textContent='ENGLAND · c. '+(stage==='setup'?920:(stage==='norman'?1066:d?.year||1250));$('mapCaption').textContent=geo().detail;renderMap();renderResources();renderStory();renderChronicle();}
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
 const first=state.chronicle.find(e=>e.kind==='decision');const choice=first?.choice;
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
function chapterOverlay(){const entries=state.chronicle.filter(e=>e.kind==='decision');let art='';if(entries.length>=2){art+=`<g opacity=".92"><path d="M590 515 Q690 490 755 535" fill="none" stroke="#ead3a3" stroke-width="12" stroke-dasharray="18 9"/><circle cx="750" cy="535" r="15" fill="#e8c27c" stroke="#694d2c" stroke-width="5"/></g>`;}if(entries.length>=4){art+=`<g class="mapchange"><path d="M790 520Q830 470 905 450" stroke="#b98e58" stroke-width="15" fill="none" stroke-dasharray="14 8"/><path d="M1080 680l28 -56 28 56z" fill="#b77c4b" stroke="#64462b" stroke-width="5"/></g>`;}if(entries.length>=5){art+=`<g class="mapchange"><rect x="1130" y="635" width="90" height="48" rx="7" fill="#b47c4e" stroke="#5b402e" stroke-width="5"/><path d="M1122 635l53 -40 53 40" fill="#d9b47a" stroke="#5b402e" stroke-width="6"/></g>`;}if(entries.length>=3){art+=`<g><path d="M1320 270 L1348 250 L1377 270 L1377 307 L1320 307Z" fill="#f6db9e" stroke="#64462b" stroke-width="5"/><path d="M1348 249V214M1336 228H1360" stroke="#65462d" stroke-width="7"/></g>`;}return art;}
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
 layer.innerHTML=changeOverlay()+chapterOverlay();
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
function renderDecision(root){const turn=state.turn??0,d=CHAPTER_DECISIONS[turn];heading(root,`CHAPTER ${turn<3?'I':'II'} · DECISION ${turn+1} OF 6 · c. ${d.year}`,d.title);
const intros=[`Autumn settles over ${state.village}. The harvest is gathered, but grain must be stored, roofs repaired, and customary duties met. There are not enough hands to do everything before winter.`,`Twenty years have passed. The landholder demands changes to the work and access arrangements that village households have long relied upon. Some villagers want compromise; others insist that custom should be respected.`,`Thirty more years pass. The local religious community asks for help beyond the contributions households already owe. Faith is central to village life, but families must also provide for themselves.`,
 `It is now 1120. Generations have passed since the Norman Conquest. Landholders and local arrangements have changed in much of England. Population and cultivation are growing in many regions. Your village must decide how to organize work on its land.`,
 `It is 1180. A nearby town has an authorized market, offering villagers new chances to sell, buy, and exchange. These opportunities also carry risks: goods sold cannot be stored, and investments may not succeed.`,
 `It is 1250. A landholder offers privileges that could help the village's trade, but the arrangement brings dues and conditions. Some households see opportunity; others worry about obligations.`];
const voices=[`${state.names.farmer}, a farmer, worries about the grain supply. ${state.names.craft}, who works with tools and goods, points to damaged roofs. ${state.names.religious}, the religious representative, warns that some families have enough grain for winter while others may struggle, and urges the village to consider those with the least to spare.`,`${state.names.farmer} fears losing access to useful land. ${state.names.craft} asks whether villagers can bargain together. ${state.names.religious} urges careful discussion.`,`${state.names.religious} explains why the religious institution needs support. ${state.names.farmer} points to household food needs, while ${state.names.craft} asks what the community can reasonably contribute.`,
 `A descendant of ${state.names.farmer} wants a more dependable harvest. A descendant of ${state.names.craft} sees the value of better tools. The religious community reminds everyone that access to land is not equally shared.`,
 `A descendant of ${state.names.craft} sees buyers for local goods. A farming household worries that selling too much grain could leave too little for winter.`,
 `A descendant of ${state.names.farmer} asks what the new dues will cost. A craftworking household hopes for better access to buyers. The religious representative asks who will benefit from the proposed privileges.`];
add(root,el('p','',intros[turn]),el('blockquote','',voices[turn]));if(turn>0){const earlier=state.chronicle.filter(e=>e.kind==='decision').at(-1);if(earlier)add(root,el('p','echo','YOUR VILLAGE’S HISTORY: '+earlier.legacy));if(turn===5){const earlier2=state.chronicle.filter(e=>e.kind==='decision').slice(-2,-1)[0];if(earlier2)add(root,el('p','echo','AN EARLIER TURNING POINT: '+earlier2.legacy));}}
add(root,el('p','hint','Choose one approach. You can change your mind until you confirm. Exact effects appear afterward.'));
const opts=el('div','options');for(const c of d.choices){const b=btn('',()=>{state.selected=c.id;save();renderStory();},'choice'+(state.selected===c.id?' selected':''));b.setAttribute('aria-pressed',String(state.selected===c.id));add(b,el('strong','',`${c.id}. ${c.title}`),el('span','',c.hint));opts.append(b);}root.append(opts);const confirm=btn('Confirm decision →',()=>{if(!state.selected)return;state=confirmChoice(state,state.selected);save();render();goTop();},'primary');confirm.disabled=!state.selected;root.append(confirm);}
function renderOutcome(root){const d=state.decision;heading(root,`DECISION ${state.turn+1} · CONSEQUENCES`,CHAPTER_DECISIONS[state.turn].title);add(root,el('div','geocard',d.title),el('p','',d.outcome),el('h3','','Immediate resource effects'),el('p','effect',formatEffects(d.actual)),el('h3','','Echo for the future'),el('p','',d.legacy),el('p','hint','Your choice is recorded in the Chronicle. Look at the village map for new signs of change.'));root.append(btn(state.turn===2?'Continue to historical source →':state.turn===5?'Continue to your justification →':'Continue to next decision →',()=>{state=finishStage(state);save();render();goTop();},'primary'));}
function responseBox(root,label,value,onInput){const l=el('label','',label);const area=el('textarea');area.rows=4;area.value=value||'';area.placeholder='Write your answer here…';area.addEventListener('input',()=>{onInput(area.value);laterSave();});root.append(l,area);return area;}
function renderSource(root){heading(root,'HISTORIAN’S DESK · SOURCE 1 OF 4',FIRST_SOURCE.title);
 add(root,el('p','hint',FIRST_SOURCE.date));
 const source=el('section','sourceexcerpt');
 add(source,el('div','eyebrow','HISTORICAL TEXT · TRANSLATED EXCERPT'),el('blockquote','',FIRST_SOURCE.excerpt),el('p','sourcecredit',FIRST_SOURCE.attribution));
 root.append(source);
 add(root,el('h3','','What does it mean?'),el('p','',FIRST_SOURCE.summary),el('p','',FIRST_SOURCE.question));
 const area=responseBox(root,'Your observation (at least one sentence)',state.sourceObservation,v=>state.sourceObservation=v);
 const help=el('details','sourceHelp');
 add(help,el('summary','','Help me understand'));
 const vocab=el('section','helpSection');add(vocab,el('h4','','Vocabulary'));
 const definitions=el('dl','vocabList');
 for(const [term,definition] of [['Reeve','A royal or local official.'],['Tithe','A tenth part, often given for religious purposes.']]){
  const item=el('div','vocabEntry');add(item,el('dt','',term),el('dd','',definition));definitions.append(item);
 }
 vocab.append(definitions);help.append(vocab);
 const guidance=el('section','helpSection');add(guidance,el('h4','','Hint'),el('p','','The excerpt shows what authorities requested; it does not prove that every household complied. Look for the people named in the excerpt and what they are asked to do.'));help.append(guidance);root.append(help);
 root.append(btn('Save observation and continue →',()=>{try{state=finishSource(state,area.value);save();render();goTop();}catch{error(root,'Please write at least one meaningful sentence (15 characters or more).');}},'primary'));
}
function renderReflection(root){heading(root,'END OF CHAPTER I · c. 970','What Shaped Your Village?');add(root,el('p','',`Think back to the decisions ${state.village} made between 920 and 970.`),el('p','','Which had the greatest influence on your village: preparing for survival, negotiating land and authority, or supporting religious life? Explain with one example from your Chronicle.'));const area=responseBox(root,'Your 1–2 sentence reflection',state.eraReflection,v=>state.eraReflection=v);root.append(btn('Finish the Early Middle Ages chapter →',()=>{try{state=finishReflection(state,area.value);save();render();goTop();}catch{error(root,'Please explain your answer with at least 20 characters.');}},'primary'));}
function renderNorman(root){heading(root,'HISTORICAL TRANSITION · 1066–1120','A New Order in England');add(root,el('p','',`Almost a century has passed since ${state.village} began. Children, grandchildren, and great-grandchildren inherit its fields and customs. In 1066 William of Normandy conquered England. Over the following decades, many estates passed to new lords, castles appeared, and royal administration changed.`),el('p','',`The effects were not identical everywhere. Some villagers faced new demands while others continued familiar farming routines under different authorities. The Domesday survey of 1086 recorded landholding and resources for royal administration.`),el('p','echo',HIGH_SOURCE_NOTE),el('p','',`The descendants of ${state.names.farmer}, ${state.names.craft}, and the village's religious community now face new opportunities and obligations.`));root.append(btn('Enter the High Middle Ages →',()=>{state=finishNorman(state);save();render();goTop();},'primary'));}
function renderHighJustification(root){heading(root,'HISTORIAN’S NOTE · DECISION 6','Explain Your Decision');add(root,el('p','','Why did your village accept, negotiate, fund an alternative, or decline the proposed privileges? Explain a likely benefit and a possible cost using the decision you just made.'));const area=responseBox(root,'Your 1–2 sentence justification',state.highJustification,v=>state.highJustification=v);root.append(btn('Save justification →',()=>{try{state=finishHighJustification(state,area.value);save();render();goTop();}catch{error(root,'Please write at least 20 characters.');}},'primary'));}
function renderHighReflection(root){heading(root,'END OF CHAPTER II · c. 1250','Growth and Obligations');add(root,el('p','',HIGH_REFLECTION_QUESTION));const area=responseBox(root,'Your 1–2 sentence reflection',state.highReflection,v=>state.highReflection=v);root.append(btn('Complete Chapter II →',()=>{try{state=finishHighReflection(state,area.value);save();render();goTop();}catch{error(root,'Please write at least 20 characters.');}},'primary'));}
function renderComplete(root){heading(root,'CHAPTER II COMPLETE · c. 1250','A Village Transformed');add(root,el('p','',`Across more than three centuries, ${state.village} has made six decisions about survival, authority, religion, farming, trade, and obligations.`),el('p','','Your Chronicle, source observation, decision justification, and both era reflections are saved in this browser and included in your chapter report.'),el('p','hint','This build completes the Early and High Middle Ages chapters. The Black Death and Late Middle Ages are planned for the next stage.'));navigation(root,null,downloadPDF,'Download Chapters I–II PDF');root.append(btn('Download backup',downloadBackup,'outline'));}
function renderStory(){const root=$('story');root.replaceChildren();if(state.stage==='setup')renderSetup(root);else if(state.stage==='decision')renderDecision(root);else if(state.stage==='outcome')renderOutcome(root);else if(state.stage==='source')renderSource(root);else if(state.stage==='reflection')renderReflection(root);else if(state.stage==='norman')renderNorman(root);else if(state.stage==='highJustification')renderHighJustification(root);else if(state.stage==='highReflection')renderHighReflection(root);else renderComplete(root);}
function renderChronicle(){const root=$('chronicle');root.replaceChildren();if(!state.chronicle.length){root.append(el('p','hint','Your village’s decisions and their consequences will appear here.'));return;}for(const entry of state.chronicle){const a=el('article','entry');add(a,el('span','eyebrow',`c. ${entry.year}`),el('h3','',entry.title),el('p','',entry.text));if(entry.legacy)a.append(el('p','hint','Echo for the future: '+entry.legacy));root.append(a);}}
function download(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2500);}
function filename(s){return (s||'village').normalize('NFKD').replace(/[^a-zA-Z0-9_-]/g,'-').slice(0,32)||'village';}
function downloadBackup(){save();download(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),`medieval-chronicle-${filename(state.village)}-backup.json`);}
function downloadPDF(){download(makePDF(state),`medieval-chronicle-${filename(state.village)}-chapters1-2.pdf`);}
$('closeLandmark').addEventListener('click',()=>$('landmarkInfo').hidden=true);
$('menuToggle').addEventListener('click',()=>{const isOpen=$('tools').hidden;$('tools').hidden=!isOpen;$('menuToggle').setAttribute('aria-expanded',String(isOpen));});
$('backup').addEventListener('click',downloadBackup);$('pdf').addEventListener('click',downloadPDF);$('restore').addEventListener('click',()=>$('backupFile').click());
$('backupFile').addEventListener('change',async e=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;if(f.size>200000)return alert('Backup file is too large.');try{const obj=JSON.parse(await f.text());const imported=migrateState(obj);if(!validateState(imported))throw Error('Invalid');if(!confirm('Import backup? It will replace your current saved progress.'))return;state=imported;step=state.stage==='setup'?0:3;save();render();}catch{alert('This is not a valid Medieval Chronicle backup. Your existing work is unchanged.');}});
$('new').addEventListener('click',()=>{if(!confirm('Start a new village? This replaces current saved progress. Download a backup first if needed.'))return;state=createDraft();step=0;save();render();});
window.addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save();});save();render();
