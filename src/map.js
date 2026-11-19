// Stage 3.8.1: Four deterministic, layered playmat maps. No remote images or libraries.
const palettes={river:['#9cba78','#7a9f62'],coast:['#d5c391','#b6ad79'],wood:['#719c65','#598451'],upland:['#b2b58a','#929a78']};
// Distinct landmark coordinates; all share the same 1000 × 560 coordinate system.
const layouts={
 river:{fields:[164,400],homes:[322,235],church:[170,285],store:[320,365],water:[755,385],manor:[160,115],market:[460,290],improve:[720,155]},
 coast:{fields:[145,160],homes:[440,255],church:[235,320],store:[285,415],water:[845,280],manor:[480,120],market:[630,320],improve:[705,420]},
 wood:{fields:[705,400],homes:[415,280],church:[255,330],store:[650,345],water:[245,465],manor:[625,155],market:[480,360],improve:[825,415]},
 upland:{fields:[760,400],homes:[465,270],church:[310,310],store:[650,345],water:[910,345],manor:[735,120],market:[520,355],improve:[820,465]}
};
export const mapPositions=layouts;
function rect(x,y,w,h,fill,extra=''){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`}
function path(d,fill,extra=''){return `<path d="${d}" fill="${fill}" ${extra}/>`}
function tree(x,y,t=0){return `<g transform="translate(${x} ${y})">${rect(-3,0,6,18,'#59492f')}${rect(-13,-17,26,23,t?'#326c47':'#427d48')}${rect(-9,-24,18,13,t?'#478959':'#61965b')}${rect(-4,-28,9,8,'#78a56b')}</g>`}
function house(x,y,roof='#a85e46'){return `<g transform="translate(${x} ${y})">${rect(-22,-9,44,33,'#ddc69a','stroke="#69543c" stroke-width="3"')}${path('M-29 -9L0 -31L29 -9Z',roof,'stroke="#5b4639" stroke-width="3"')}${rect(-7,5,14,19,'#72583e')}${rect(13,0,6,8,'#6e907b')}</g>`}
function field(x,y,good=true){let out=`<g transform="translate(${x} ${y})">${rect(-95,-48,190,104,good?'#bd9c51':'#98875c','stroke="#756f43" stroke-width="5" rx="5"')}`;for(let i=0;i<6;i++)out+=path(`M${-82+i*30} -38 l-7 83`,'none',`stroke="${good?'#e8c66d':'#b8aa76'}" stroke-width="8"`);return out+'</g>'}
function water(geo){if(geo==='coast')return path('M775 0H1000V560H900Q840 490 820 430Q800 345 790 270Q780 150 775 0Z','#478da7')+path('M770 0Q775 170 792 275Q804 385 820 430Q845 505 898 560','none','stroke="#e9dfaa" stroke-width="19"')+path('M803 0Q804 165 820 275Q829 380 852 420','none','stroke="#86c0c7" stroke-width="5" stroke-dasharray="12 19"');if(geo==='river')return path('M860 -30Q750 95 875 220Q940 335 770 425Q695 475 750 600','none','stroke="#396f84" stroke-width="95"')+path('M860 -30Q750 95 875 220Q940 335 770 425Q695 475 750 600','none','stroke="#6eacc0" stroke-width="70"')+path('M860 -30Q750 95 875 220Q940 335 770 425Q695 475 750 600','none','stroke="#a4d0d0" stroke-width="5" stroke-dasharray="25 30"');return path('M875 0Q920 100 900 200Q850 360 925 560','none','stroke="#719ca6" stroke-width="19"')}
function road(d,w=26){return path(d,'none',`stroke="#856d4a" stroke-width="${w+8}" stroke-linecap="round"`)+path(d,'none',`stroke="#d8bc87" stroke-width="${w}" stroke-linecap="round"`)}
function hill(x,y,k=1){return `<g transform="translate(${x} ${y}) scale(${k})">${path('M-86 32L-32 -40L6 -15L40 -71L94 32Z','#758a69','stroke="#657c60" stroke-width="5"')}${path('M20 -37L40 -71L65 -29L44 -39Z','#c2c8ae')}${path('M-50 0L-32 -40L-10 -12Z','#a2ac8c')}</g>`}
function pasture(x,y){let o=`<g transform="translate(${x} ${y})">${rect(-75,-34,150,70,'#8eae74','stroke="#bcb69b" stroke-width="7" rx="12"')}`;for(const [a,b] of [[-35,-8],[12,10],[49,-15]])o+=`<g transform="translate(${a} ${b})">${rect(-10,-6,21,13,'#e5e0c9','rx="4"')}${rect(9,-4,7,7,'#555c50')}${rect(-6,6,3,7,'#514d40')}${rect(5,6,3,7,'#514d40')}</g>`;return o+'</g>'}
function boat(x,y){return `<g transform="translate(${x} ${y})">${path('M-24 2Q0 25 27 2Z','#75543c','stroke="#4e4239" stroke-width="3"')}${path('M0 1V-28','none','stroke="#574839" stroke-width="3"')}${path('M3 -26L23 -6H3Z','#f0ddac')}</g>`}
function base(geo){
 let [ground,shade]=palettes[geo]||palettes.river;let s=rect(0,0,1000,560,ground);
 // Quiet, deterministic texture; buildings and terrain remain readable at Chromebook sizes.
 for(let i=0;i<44;i++){let x=(i*173+37)%980,y=(i*97+43)%540;s+=rect(x,y,13+(i%4)*9,8+(i%3)*7,shade,'opacity=".22" rx="5"')}
 if(geo==='river'){
  // Two riverbanks, a central crossing, and floodplain fields.
  s+=path('M765 -40Q650 90 775 185Q890 275 730 380Q625 450 680 610','none','stroke="#376d86" stroke-width="104"');
  s+=path('M765 -40Q650 90 775 185Q890 275 730 380Q625 450 680 610','none','stroke="#65abc4" stroke-width="83"');
  s+=path('M765 -40Q650 90 775 185Q890 275 730 380Q625 450 680 610','none','stroke="#a2d3d8" stroke-width="6" stroke-dasharray="19 25"');
  s+=road('M-20 290Q145 215 315 255Q500 315 655 305Q755 300 1010 250');
  s+=road('M325 245Q300 345 170 410',17);s+=road('M310 255Q235 175 180 115',16);
  s+=path('M708 341L790 322','none','stroke="#70583e" stroke-width="30"')+path('M708 341L790 322','none','stroke="#d4b98b" stroke-width="20"');
  for(const [x,y] of [[60,85],[345,65],[540,85],[945,95],[910,485],[470,475]])s+=tree(x,y);
 }else if(geo==='coast'){
  // A sheltered crescent bay with a single inland approach to the harbor.
  s+=path('M745 -20H1020V580H840Q755 505 795 425Q830 335 760 285Q710 215 745 -20Z','#408eae');
  s+=path('M742 -20Q700 215 762 285Q830 335 795 425Q755 505 840 580','none','stroke="#eddaab" stroke-width="24"');
  s+=path('M785 -20Q748 190 795 278Q863 352 836 430','none','stroke="#87c8d2" stroke-width="5" stroke-dasharray="16 20"');
  s+=road('M-20 360Q175 355 335 315Q470 295 620 300Q715 300 775 340');
  s+=road('M345 310Q280 235 180 185',17);s+=road('M460 285Q490 190 480 135',17);
  s+=path('M778 341L866 340','none','stroke="#674b36" stroke-width="16"');
  for(let i=0;i<5;i++)s+=rect(792+i*15,328,6,23,'#c2a078');
  s+=boat(906,260)+boat(920,420);
  for(const [x,y] of [[60,60],[305,75],[590,55],[90,495],[480,495]])s+=tree(x,y);
 }else if(geo==='wood'){
  // Forest ring and deliberately small clearing. Tracks enter from three sides.
  for(let i=0;i<100;i++){let x=(i*127+29)%980,y=(i*193+31)%540;let dx=(x-485)/370,dy=(y-280)/185;if(dx*dx+dy*dy<1)continue;s+=tree(x,y,i%4===0)}
  s+=path('M0 510Q110 485 195 510Q255 530 315 560','none','stroke="#457d95" stroke-width="39"');
  s+=path('M0 510Q110 485 195 510Q255 530 315 560','none','stroke="#80b8c3" stroke-width="27"');
  s+=road('M-10 280Q180 250 330 285Q480 320 625 295Q770 265 1005 285',18);
  s+=road('M440 300Q380 375 290 460',15);s+=road('M520 300Q560 215 625 155',14);
  s+=path('M260 492L301 473','none','stroke="#78583d" stroke-width="14"');
 }else{
  // Rocky slopes encircle a narrow valley, with pastures uphill.
  for(const [x,y,k] of [[70,95,1.5],[250,60,1.2],[870,70,1.6],[90,495,1.3],[930,505,1.4],[580,55,.7]])s+=hill(x,y,k);
  s+=path('M950 190Q915 290 935 370Q910 470 975 560','none','stroke="#4a829b" stroke-width="38"');
  s+=path('M950 190Q915 290 935 370Q910 470 975 560','none','stroke="#8bc1c9" stroke-width="26"');
  s+=road('M-20 355Q180 385 300 320Q450 260 600 315Q740 360 1010 305',22);
  s+=road('M455 270Q370 190 270 145',15);s+=road('M615 325Q680 220 735 130',15);
  s+=pasture(235,155)+pasture(235,465);
  for(let i=0;i<26;i++){let x=(i*103+51)%970,y=(i*137+19)%530;if(x>335&&x<750&&y>205&&y<420)continue;s+=rect(x,y,11,8,'#777d71','rx="3"')}
 }
 return s;
}
function granary(x,y,low){return `<g transform="translate(${x} ${y})">${rect(-26,-5,52,38,low?'#9d9276':'#d2b579','stroke="#69523d" stroke-width="4"')}${path('M-33 -5L0 -32L33 -5Z','#765d44','stroke="#544535" stroke-width="4"')}${rect(-10,11,20,22,low?'#493f38':'#896a46')}${low?rect(12,21,11,5,'#b34c38'):rect(12,15,12,11,'#e5c76d')}</g>`}
function church(x,y){return `<g transform="translate(${x} ${y})">${rect(-32,-10,64,44,'#ded1ae','stroke="#76664d" stroke-width="4"')}${path('M-39 -10L0 -36L39 -10Z','#73776a','stroke="#514e44" stroke-width="4"')}${rect(-12,-55,25,32,'#d7c6a5','stroke="#71654e" stroke-width="4"')}${path('M-16 -55L0 -75L17 -55Z','#73776a')}${rect(-5,-68,10,8,'#8f9d96')}</g>`}
function manor(x,y,norman){return `<g transform="translate(${x} ${y})">${rect(-36,-8,73,48,norman?'#b6afa0':'#c4a47c','stroke="#655344" stroke-width="5"')}${path('M-43 -8L0 -40L44 -8Z',norman?'#6b6c67':'#8e5947','stroke="#53493d" stroke-width="4"')}${rect(-9,11,20,29,'#665441')}${norman?rect(30,-48,31,74,'#b5b0a5','stroke="#69675f" stroke-width="5"')+path('M26 -48L46 -67L65 -48Z','#6d6f70'):''}</g>`}
function market(x,y){return `<g transform="translate(${x} ${y})">${rect(-38,2,76,10,'#725638')}${path('M-44 -4L-30 -27H31L45 -4Z','#b4544c','stroke="#72513c" stroke-width="4"')}${rect(-27,-13,18,9,'#e5cf9a')}${rect(8,-13,17,9,'#f3d7a1')}</g>`}
function mill(x,y){return `<g transform="translate(${x} ${y})">${house(0,0,'#81664e')}<circle cx="29" cy="13" r="24" fill="#aa8c5d" stroke="#4f493c" stroke-width="5"/><path d="M29 -11V37M5 13H53M12 -4L46 30M46 -4L12 30" stroke="#655139" stroke-width="5"/></g>`}
function noticeBadge(x,y,label){return `<g transform="translate(${x} ${y})">${rect(-13,-51,26,27,'#fff0bb','stroke="#664f36" stroke-width="3" rx="5"')}<text x="0" y="-32" text-anchor="middle" font-size="22" font-family="sans-serif" font-weight="bold" fill="#855735">!</text><title>${label}</title></g>`}
export function describeMap(state){let entries=state.chronicle||[];let decision=(n)=>entries.find(e=>e.kind==='decision'&&e.year===n);let d1120=decision(1120),d1180=decision(1180);let norman=!!(state.survival?.norman||state.normanSeen||['normanEvent','norman'].includes(state.stage));let raid=(state.survival?.log||[]).some(e=>e.event==='raid'&&e.danger>=1);let lowFood=state.resources?.food<=1;let farm=!!(d1120&&['A','B','D'].includes(d1120.choice));let millBuilt=!!(d1120&&d1120.choice==='D'&&['river','coast'].includes(state.geography));let market=!!(d1180&&['A','B','C'].includes(d1180.choice));let details=[];if(farm)details.push('Farming improvements are visible because the village invested in agriculture in 1120.');if(market)details.push('Market stalls reflect the trading choice made in 1180.');if(norman)details.push('The manor has changed under Norman lordship. This change reflects the Conquest, not a particular negotiation choice.');if(raid)details.push('A warning post recalls the earlier raid crisis.');if(lowFood)details.push('Sparse fields and the granary marker reflect dangerously low food reserves.');return {norman,raid,lowFood,farm,millBuilt,market,details};}
export function mapMarkup(state){const geo=layouts[state.geography]?state.geography:'river',p=layouts[geo],f=describeMap(state),r=state.resources||{};let s=base(geo);s+=field(...p.fields,!f.lowFood);s+=house(...p.homes);s+=house(p.homes[0]+67,p.homes[1]+38,'#8f704d');s+=house(p.homes[0]-47,p.homes[1]+64,'#9a694d');s+=church(...p.church);s+=granary(...p.store,f.lowFood);s+=manor(...p.manor,f.norman);if(f.farm){s+=field(p.fields[0]+(geo==='river'?0:geo==='coast'?-10:geo==='wood'?-25:10),p.fields[1]+(geo==='river'?100:geo==='coast'?125:geo==='wood'?95:95),true);if(f.millBuilt)s+=mill(...p.improve)}
 if(f.market)s+=market(...p.market);if(f.raid)s+=`<g transform="translate(130 257)">${rect(-4,-48,8,65,'#5f4c37')}${rect(4,-45,35,20,'#ad634b')}${noticeBadge(0,0,'Past insecurity')}</g>`;
 if(r.population<=1)s+=rect(p.homes[0]+36,p.homes[1]+20,52,34,'#685d4c','opacity=".35"');
 if(state.stage==='crisis'||state.stage==='villageLost')s+=rect(0,0,1000,560,'#4c332e','opacity=".13"');
 return `<svg class="playmatSvg" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Top-down pixel-art ${geo} village with fields, cottages, granary, church and manor">${s}</svg>`;
}
