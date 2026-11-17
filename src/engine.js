export const VERSION=3;
export const STORAGE_KEY='medieval-chronicle-stage1-v1';
export const GEOGRAPHIES=[
 {id:'river',name:'River Valley',region:'Thames or Severn river country',start:{food:4,population:3,wealth:3,stability:2},detail:'A river winds past fertile fields. Waterways bring opportunities and occasional disputes over access.'},
 {id:'coast',name:'Coastal',region:'East Anglia or the southern coast',start:{food:3,population:3,wealth:4,stability:2},detail:'The sea and nearby landing places connect households to fishing and exchange.'},
 {id:'wood',name:'Woodland',region:'The Weald or Forest of Dean',start:{food:3,population:3,wealth:2,stability:4},detail:'Wooded land provides fuel and materials, but access to shared resources matters.'},
 {id:'upland',name:'Upland',region:'Pennines or northern hill country',start:{food:2,population:3,wealth:3,stability:4},detail:'Rougher ground supports pasture and small fields; neighbors rely on established local arrangements.'}
];
export const PRIORITIES=[{id:'food',name:'Food Security',description:'Keep reliable supplies for difficult seasons.',delta:{food:1}},{id:'trade',name:'Trade & Opportunity',description:'Build resources for exchange and future opportunities.',delta:{wealth:1}},{id:'cooperation',name:'Community Cooperation',description:'Strengthen the village’s ability to work through difficulties.',delta:{stability:1}},{id:'autonomy',name:'Local Autonomy',description:'Defend customary local arrangements when dealing with outsiders.',delta:{}}];
export const CHOICES=[
 {id:'A',title:'Store extra grain',hint:'Likely benefit: better reserves. Risk: less work can be done elsewhere.',delta:{food:1},outcome:'Families set aside a shared store of grain. The barns are better supplied, though other work must wait.',legacy:'The village begins a tradition of keeping shared reserves.'},
 {id:'B',title:'Repair buildings and equipment',hint:'Likely benefit: stronger shelter and tools. Risk: less time to gather supplies.',delta:{stability:1},outcome:'Neighbors repair roofs, doors, and worn tools before the weather turns. The village is better prepared to manage disruptions.',legacy:'The village establishes a habit of maintaining essential buildings and equipment.'},
 {id:'C',title:'Fulfill customary obligations',hint:'Likely benefit: dependable arrangements with the local landholder. Risk: less labor remains for other priorities.',delta:{},outcome:'Households meet the work and goods expected under their existing arrangements with the local landholder. There is no immediate change in village resources.',legacy:'The landholder remembers the village as dependable in fulfilling customary obligations.'},
 {id:'D',title:'Organize shared work',hint:'Likely benefit: cooperation when work is difficult. Risk: households must coordinate their time.',delta:{stability:1},outcome:'Families coordinate repairs and harvest tasks. Some disagreements remain, but they have a better way to organize when trouble comes.',legacy:'A precedent for collective work takes root.'}
];
export const CHAPTER_DECISIONS=[
 {year:920,title:'Preparing for Winter',choices:CHOICES},
 {year:940,title:'Land and Authority',choices:[
  {id:'A',title:'Negotiate a compromise',hint:'Seek a workable agreement with the landholder.',delta:{stability:1},outcome:'Village representatives reach a compromise over work and access to land. Some demands remain, but cooperation becomes easier.',legacy:'A precedent for negotiation is established.'},
  {id:'B',title:'Defend customary claims',hint:'Insist that long-standing local practices deserve recognition.',delta:{},outcome:'Villagers defend what they understand to be their customary rights. The dispute is not settled immediately, but their claims are remembered.',legacy:'A record of customary claims strengthens future arguments.'},
  {id:'C',title:'Accept the landholder’s terms',hint:'Preserve access to land, but give up some productive time.',delta:{food:-1},outcome:'The landholder permits continued use of the fields under stricter terms. Households have less food available after fulfilling the new demands.',legacy:'Access is maintained, though the village bears heavier obligations.'},
  {id:'D',title:'Organize community support',hint:'Pool resources and coordinate households.',delta:{wealth:-1,stability:1},outcome:'Households share goods and coordinate their response. The effort costs resources but makes collective action more effective.',legacy:'Shared organization becomes part of the village’s political memory.'}
 ]},
 {year:970,title:'Faith and Community',choices:[
  {id:'A',title:'Offer generous contributions',hint:'Give extra goods beyond established dues.',delta:{wealth:-1},outcome:'The village gives additional goods to the local religious institution, strengthening that relationship but reducing available wealth.',legacy:'Religious leaders remember the village’s generosity.'},
  {id:'B',title:'Offer limited help',hint:'Contribute what households can spare.',delta:{},outcome:'The community provides modest help while keeping most supplies for household needs. The arrangement remains practical, if unremarkable.',legacy:'The village balances religious obligations with local needs.'},
  {id:'C',title:'Contribute shared labor',hint:'Offer time and work rather than extra goods.',delta:{food:-1,stability:1},outcome:'Villagers cooperate on repairs and community work, though less labor is available for food production.',legacy:'Shared labor reinforces cooperation with the religious community.'},
  {id:'D',title:'Prioritize household needs',hint:'Keep more food available for villagers.',delta:{food:1},outcome:'Families retain supplies for their households. Some religious leaders are disappointed, but no immediate village-wide conflict follows.',legacy:'The community asserts that household needs also matter.'}
 ]}
 ,{year:1120,title:'New Ways to Work the Land',choices:[
  {id:'A',title:'Expand the cultivated fields',hint:'More land under cultivation may improve food supplies.',delta:{food:1},outcome:'Households bring additional plots into cultivation. More grain can be grown, though expansion requires sustained work.',legacy:'The cultivated landscape expands.'},
  {id:'B',title:'Invest in better tools',hint:'Spend wealth to support more productive farming.',delta:{wealth:-1,food:1},outcome:'The village devotes goods to improving tools and agricultural work. Food production becomes more dependable.',legacy:'Investment in equipment becomes part of village practice.'},
  {id:'C',title:'Preserve familiar arrangements',hint:'Protect established ways of working and cooperating.',delta:{stability:1},outcome:'Households maintain familiar field arrangements. They can coordinate work more easily, even without expanding production.',legacy:'Established working arrangements remain influential.'},
  {id:'D',title:'Use the strengths of your landscape',hint:'Choose a local improvement suited to the village geography.',delta:{},outcome:'Villagers build on the opportunities offered by their landscape.',legacy:'Local geography shapes a distinctive livelihood.'}
 ]},
 {year:1180,title:'The Market Opens',choices:[
  {id:'A',title:'Trade with the market town',hint:'Sell and exchange goods beyond the village.',delta:{wealth:1},outcome:'Villagers begin visiting the market more often, gaining access to buyers and unfamiliar goods.',legacy:'The village develops stronger market connections.'},
  {id:'B',title:'Sell part of the food surplus',hint:'Earn wealth now, but keep fewer food reserves.',delta:{wealth:1,food:-1},outcome:'Households sell part of their harvest. Trade brings wealth, but stored food is reduced.',legacy:'The village learns the trade-off between selling and storing food.'},
  {id:'C',title:'Invest in a local specialty',hint:'Spend goods now to develop a future opportunity.',delta:{wealth:-1},outcome:'Villagers devote resources to a craft or product suited to their region. Its future success remains uncertain.',legacy:'A local specialty begins to develop.'},
  {id:'D',title:'Keep exchange mostly local',hint:'Focus on existing neighbors and familiar obligations.',delta:{stability:1},outcome:'The village continues relying mainly on nearby households and familiar exchanges.',legacy:'Local ties remain the center of the village economy.'}
 ]},
 {year:1250,title:'Privileges and Obligations',choices:[
  {id:'A',title:'Accept new privileges and dues',hint:'Gain a commercial opportunity with continuing obligations.',delta:{wealth:1},outcome:'The village accepts new privileges, along with the dues and conditions that accompany them.',legacy:'Commercial privileges bring continuing obligations.'},
  {id:'B',title:'Negotiate the conditions',hint:'Try to protect local custom while seeking an agreement.',delta:{},outcome:'Village representatives seek more favorable terms. Some issues remain unresolved, but negotiation continues.',legacy:'The village seeks negotiated terms for new privileges.'},
  {id:'C',title:'Fund a community alternative',hint:'Use shared resources to support greater local cooperation.',delta:{wealth:-1,stability:1},outcome:'Households pool resources for a local arrangement, improving cooperation at an immediate cost.',legacy:'The community strengthens its own institutions.'},
  {id:'D',title:'Decline the proposal',hint:'Keep familiar arrangements and avoid new commitments.',delta:{},outcome:'The village declines the new offer. It avoids additional dues but gains no new privileges.',legacy:'The village chooses continuity over new privileges.'}
 ]}
];
export const HIGH_REFLECTION_QUESTION='How did economic growth change opportunities and obligations in your village between 1120 and 1250? Use at least one decision from your Chronicle.';
export const HIGH_SOURCE_NOTE='The Domesday survey of 1086 recorded landholding, resources, and obligations for royal administration. It is historical context here, not a quoted primary source.';
export const FIRST_SOURCE={
 title:'Æthelstan’s ordinance on religious contributions',
 date:'Attributed to Æthelstan, c. 927; surviving wording was revised and copied in later centuries',
 excerpt:'I, Athelstan, king, with the counsel of Wulfhelm, archbishop, and of my other bishops, make known to the reeves at each burgh ... that ye first of my own goods render the tithes, both of the live stock and of the year’s earthly fruits',
 attribution:'Translated excerpt from “Tithe Ordinance of Athelstan,” in Documents Illustrative of English Church History (1896), p. 49; translation attributed there to Lord Selborne. Ellipsis marks omitted wording.',
 summary:'In this surviving version, the king directs officials to arrange religious contributions and describes giving a share of livestock and crops. The ordinance connects royal officials, bishops, and religious payments. Historians have found that the surviving Old English text was revised in the eleventh century; an earlier version may have called for a one-time charitable gift rather than a permanent tithe requirement.',
 question:'What does this excerpt suggest about how kings and Church leaders worked together? Identify one detail from the excerpt to support your answer.'
};
export const NAME_SUGGESTIONS={farmer:['Eadric','Wulfstan','Ælfgifu','Leofwyn'],craft:['Godric','Eadgyth','Oswald','Wulfric'],religious:['Cuthbert','Eadburh','Æthelred','Wynflæd']};
export function clamp(n){return Math.max(1,Math.min(5,n));}
export function applyDelta(resources,delta){const next={...resources},actual={};for(const key of ['food','population','wealth','stability']){const before=next[key];next[key]=clamp(before+(delta[key]||0));actual[key]=next[key]-before;}return {resources:next,actual};}
export function createDraft(random=Math.random){const index=Math.min(3,Math.floor(random()*4));return {version:VERSION,id:(globalThis.crypto?.randomUUID?.()||String(Date.now())+'-'+String(Math.random()).slice(2)),stage:'setup',turn:0,sourceObservation:'',eraReflection:'',highReflection:'',highJustification:'',normanSeen:false,geography:GEOGRAPHIES[index].id,village:'',names:{farmer:'',craft:'',religious:''},priority:null,resources:null,selected:null,decision:null,chronicle:[],createdAt:new Date().toISOString()};}
export function startVillage(state,{village,names,priority}){if(state.stage!=='setup')throw Error('Village already started');const geo=GEOGRAPHIES.find(g=>g.id===state.geography),founding=PRIORITIES.find(p=>p.id===priority);if(!geo||!founding)throw Error('Invalid setup');const updated=applyDelta(geo.start,founding.delta);return {...state,stage:'decision',turn:0,village,names:{...names},priority,resources:updated.resources,selected:null,chronicle:[{kind:'founding',year:920,title:'Village founded',text:`${village} began in ${geo.region}. Its founding priority was ${founding.name}.`,delta:updated.actual}]};}
export function confirmChoice(state,id){
 if(state.stage!=='decision')throw Error('Not at a decision');
 const turn=state.turn??0, d=CHAPTER_DECISIONS[turn];if(!d)throw Error('No decision available');
 const choice=d.choices.find(c=>c.id===id);if(!choice)throw Error('Invalid choice');
 let delta=choice.delta;let localOutcome=choice.outcome;let localLegacy=choice.legacy;
 if(turn===3&&id==='D'){
  const byGeo={river:{delta:{food:1,wealth:-1},outcome:'A watermill supports grain processing, though its construction costs goods.',legacy:'A mill becomes part of the river landscape.'},coast:{delta:{food:1,wealth:-1},outcome:'Households invest in fishing equipment and landing places, improving food supply at a cost.',legacy:'Fishing becomes a more prominent livelihood.'},wood:{delta:{food:1},outcome:'Families clear additional woodland for cultivation, though access to wood may later be disputed.',legacy:'New clearings reshape woodland use.'},upland:{delta:{wealth:1},outcome:'Villagers increase grazing and exchange animal products, while questions of pasture rights remain.',legacy:'Pastoral trade becomes more important.'}}[state.geography];delta=byGeo.delta;localOutcome=byGeo.outcome;localLegacy=byGeo.legacy;
 }
 if(turn===4&&id==='C'){
  const spec={river:'grain and milling',coast:'fish and salt',wood:'timber and woodcraft',upland:'wool and livestock'}[state.geography];localOutcome+=` The chosen specialty is ${spec}.`;
 }
 const effect=applyDelta(state.resources,delta);
 const first=state.chronicle.find(c=>c.kind==='decision');
 const echo=turn===1?({A:'Your earlier shared grain stores give villagers some confidence in the negotiation.',B:'The earlier repairs remind households of the value of maintaining common arrangements.',C:'The landholder remembers the village’s earlier fulfillment of obligations.',D:'The shared work organized twenty years ago provides a model for acting together.'}[first?.choice]||'Earlier village choices remain part of local memory.'):
 turn===2?({A:'Earlier negotiation has given representatives experience speaking for the village.',B:'Villagers remember their defense of customary claims.',C:'Households remember the cost of accepting stricter terms.',D:'The village can draw on its established habit of organizing together.'}[state.chronicle.find(c=>c.kind==='decision'&&c.year===940)?.choice]||'Past choices shape the community’s discussion.'):'';
 const normanEcho=turn===3?`After the Norman Conquest of 1066, landholding and lordship changed in many parts of England. In ${state.village}, later generations must navigate new authorities. The consequences varied by region; no single village experience was universal. `:'';
 const highEcho=turn>=3?(() => {const past=state.chronicle.filter(c=>c.kind==='decision');const latest=past.at(-1);const founding=past[0];return ` Earlier choices remain visible: ${latest?.legacy||founding?.legacy||'the village remembers its customs'}`;})():'';
 const outcome=normanEcho+localOutcome+(echo?' '+echo:'')+highEcho;
 const record={id,title:choice.title,year:d.year,actual:effect.actual,outcome,legacy:localLegacy};
 return {...state,stage:'outcome',selected:id,resources:effect.resources,decision:record,chronicle:[...state.chronicle,{kind:'decision',year:d.year,choice:id,title:d.title+' — '+choice.title,text:outcome,legacy:localLegacy,delta:effect.actual}]};
}
export function finishStage(state){
 if(state.stage!=='outcome')throw Error('Not at outcome');
 const turn=state.turn??0;
 if(turn<2)return {...state,stage:'decision',turn:turn+1,selected:null,decision:null};
 if(turn===2)return {...state,stage:'source',selected:null};
 if(turn===3||turn===4)return {...state,stage:'decision',turn:turn+1,selected:null,decision:null};
 return {...state,stage:'highJustification',selected:null};
}
export function finishSource(state,observation){if(state.stage!=='source'||observation.trim().length<15)throw Error('Write a source observation of at least 15 characters');return {...state,stage:'reflection',sourceObservation:observation.trim()};}
export function finishReflection(state,reflection){if(state.stage!=='reflection'||reflection.trim().length<20)throw Error('Write a reflection of at least 20 characters');return {...state,stage:'norman',eraReflection:reflection.trim(),normanSeen:false};}
export function finishNorman(state){if(state.stage!=='norman')throw Error('Not at Norman transition');return {...state,stage:'decision',turn:3,normanSeen:true,selected:null,decision:null};}
export function finishHighJustification(state,text){if(state.stage!=='highJustification'||text.trim().length<20)throw Error('Write at least 20 characters');return {...state,stage:'highReflection',highJustification:text.trim()};}
export function finishHighReflection(state,text){if(state.stage!=='highReflection'||text.trim().length<20)throw Error('Write at least 20 characters');return {...state,stage:'complete',highReflection:text.trim()};}
export function validName(value){return typeof value==='string'&&value.trim().length>=2&&value.trim().length<=32&&/^[\p{L}\p{M}][\p{L}\p{M}\p{N} '\-]*$/u.test(value.trim())&&!/(?:fuck|shit|bitch|cunt|nigg|fag|asshole|hitler|nazi)/i.test(value);}
export function validateState(s){if(!s||typeof s!=='object'||s.version!==VERSION||!['setup','decision','outcome','source','reflection','norman','highJustification','highReflection','complete'].includes(s.stage))return false;if(!GEOGRAPHIES.some(g=>g.id===s.geography)||typeof s.id!=='string'||s.id.length>120)return false;if(typeof s.village!=='string'||s.village.length>32||!s.names||!['farmer','craft','religious'].every(k=>typeof s.names[k]==='string'&&s.names[k].length<=32))return false;if(!Array.isArray(s.chronicle)||s.chronicle.length>8)return false;if(!Number.isInteger(s.turn??0)||(s.turn??0)<0||(s.turn??0)>5)return false;if(s.stage!=='setup'){if(!validName(s.village)||!['farmer','craft','religious'].every(k=>validName(s.names[k]))||!PRIORITIES.some(p=>p.id===s.priority))return false;if(!s.resources||!['food','population','wealth','stability'].every(k=>Number.isInteger(s.resources[k])&&s.resources[k]>=1&&s.resources[k]<=5))return false;}if(s.stage==='outcome'&&(!s.decision||!['A','B','C','D'].includes(s.decision.id)))return false;return true;}
export function formatEffects(actual){const names={food:'Food',population:'Population',wealth:'Wealth',stability:'Stability'};return Object.entries(names).filter(([k])=>actual[k]!==0).map(([k,n])=>`${n} ${actual[k]>0?'+':''}${actual[k]}`).join(' · ')||'No immediate resource change';}

export function migrateState(s){
 if(!s||![1,2,3].includes(s.version))return s;
 if(s.version===3)return s;
 let next={...s,version:3,highReflection:'',highJustification:'',normanSeen:false};
 if(s.version===1){next={...next,turn:0,sourceObservation:'',eraReflection:''};if(s.stage==='complete'){next.stage='decision';next.turn=1;next.decision=null;next.selected=null;}}
 else if(s.stage==='complete'){next.stage='norman';next.turn=2;next.decision=null;next.selected=null;}
 return next;
}
