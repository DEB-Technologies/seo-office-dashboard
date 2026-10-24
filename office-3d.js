/* SEO Office World: five-storey architectural cutaway, no character models or mutations. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

const host=document.querySelector('.scene');
const fallback=host?.querySelector('.world');
if(!host||!fallback)throw new Error('Office scene not found');
const canvas=document.createElement('canvas');
canvas.className='world-three-canvas';
canvas.setAttribute('aria-label','3D-kantoorgebouw: klik een verdieping om de kamer te openen; klik een digitaal agent-werkstation voor de laatst gerapporteerde taken.');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));
renderer.setSize(Math.max(host.clientWidth,1),Math.max(host.clientHeight,1),false);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.3;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(35,1,.1,200);
const ambient=new THREE.HemisphereLight(0xffffff,0xc4d5e7,2.4);scene.add(ambient);
const sun=new THREE.DirectionalLight(0xffffff,3.1);
sun.position.set(-18,35,23);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-35;sun.shadow.camera.right=35;sun.shadow.camera.top=35;sun.shadow.camera.bottom=-35;scene.add(sun);
const mat=(color,roughness=.65,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const white=mat('#f7fbff'),floorMat=mat('#dce7f2'),edge=mat('#829db8'),dark=mat('#283e5a'),desk=mat('#f0f6fd'),chair=mat('#536b89'),plant=mat('#5ca487'),pot=mat('#d0e0ea');
const glass=new THREE.MeshPhysicalMaterial({color:'#a9d5f2',transparent:true,opacity:.22,roughness:.08,depthWrite:false,side:THREE.DoubleSide});
const colors=['#75a8f0','#b2a2ec','#7ac5b5','#efbd86','#92b6da'];
const departments=[
 {name:'SEO Operations',rooms:['Technical SEO','Content Studio','WordPress Control','Analytics'],status:'SEO-rapporten beschikbaar'},
 {name:'Social Media & Creative',rooms:['Social Media','Content Creation','Video Studio','Campagnes'],status:'Toekomstige afdeling · geen gekoppelde taken'},
 {name:'Customer Experience',rooms:['Klantenservice','Live Chat','Customer Success','Support'],status:'Toekomstige afdeling · geen gekoppelde taken'},
 {name:'Marketing & Growth',rooms:['Advertising','Email Marketing','CRO Lab','Growth'],status:'Toekomstige afdeling · geen gekoppelde taken'},
 {name:'Executive & Innovation',rooms:['Directie','Vergaderen','AI Innovation','Mission Control'],status:'Toekomstige afdeling · geen gekoppelde taken'}
];
const building=new THREE.Group();scene.add(building);
function cube(parent,w,h,d,x,y,z,material,cast=true){
 const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
 m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=true;parent.add(m);return m;
}
function cylinder(parent,r,h,x,y,z,material){
 const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r*.85,h,12),material);
 m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;
}
const levels=[],pickables=[],agents=[],agentPickables=[],walkers=[];
const height=4.35;
for(let i=0;i<5;i++){
 const y=i*height;
 const group=new THREE.Group();group.position.y=y;building.add(group);levels.push(group);
 const accent=mat(colors[i],.42,.08);
 cube(group,17,.36,11,0,-.18,0,floorMat);
 cube(group,17,.18,.22,0,.05,5.45,edge);
 cube(group,17,3.35,.16,0,1.7,-5.42,white);
 cube(group,.2,3.35,11,-8.4,1.7,0,white);
 cube(group,.2,3.35,11,8.4,1.7,0,white);
 // Floor-to-ceiling glazed frontage: visible in full-building overview.
 for(const x of [-6.3,-2.1,2.1,6.3]){
  cube(group,.075,3.15,.1,x,1.65,5.4,edge,false);
 }
 const pane=cube(group,16.8,3.05,.055,0,1.63,5.4,glass,false);
 pane.userData.floor=i;
 cube(group,16.8,.14,.16,0,3.22,5.4,accent);
 // Four furnished zones on every floor, without fictional staff.
 for(let j=0;j<4;j++){
  const x=-6.1+j*4.05;
  cube(group,3.1,.13,1.45,x,.78,-.7,desk);
  for(const dx of [-1.25,1.25])for(const dz of [-.52,.52])cylinder(group,.055,.7,x+dx,.39,-.7+dz,edge);
  cube(group,1.12,.7,.07,x,1.38,-1.1,dark);
  cube(group,1.0,.57,.025,x,1.4,-1.04,accent);
  cube(group,.1,.28,.1,x,1.01,-1.12,edge);
  cube(group,.78,.15,.8,x,.4,.8,chair);
  cube(group,.12,.65,.12,x,.73,1.13,edge);
  cube(group,.8,.65,.12,x,1.03,1.18,chair);
  if(j<3)cube(group,.055,2.3,5,x+2,1.15,-.1,glass,false);
  // Stylized digital agent terminal; intentionally no human avatars or Maya/Harper assets.
  const terminal=new THREE.Group();terminal.position.set(x,0,1.85);group.add(terminal);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.35,.065,10,32),accent);
  ring.rotation.x=Math.PI/2;ring.position.y=1.05;terminal.add(ring);
  const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.25,1),new THREE.MeshStandardMaterial({color:colors[i],emissive:colors[i],emissiveIntensity:.35,metalness:.3,roughness:.25}));
  core.position.y=1.05;terminal.add(core);
  const pedestal=cylinder(terminal,.28,.14,0,.16,0,dark);
  core.userData.agent={floor:i,index:j};ring.userData.agent={floor:i,index:j};
  agentPickables.push(core,ring);
  agents.push({floor:i,index:j,core,ring,terminal,phase:i*1.5+j*1.2});
  // Procedural office staff, not the rejected Maya/Harper assets.
  const person=new THREE.Group();group.add(person);
  const clothes=mat(['#4679b3','#9879b4','#528c89','#c18e5c'][j]);
  const trousers=mat('#354960'),skin=mat(['#dfab86','#a96f55','#efc39d','#bb896f'][j]);
  const torso=cylinder(person,.28,.73,0,1.19,0,clothes);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.22,14,12),skin);head.position.y=1.79;person.add(head);
  const hair=new THREE.Mesh(new THREE.SphereGeometry(.225,14,10),mat(['#4d352d','#272b38','#80614d','#443a33'][j]));hair.scale.y=.45;hair.position.y=1.94;person.add(hair);
  const limbs={arms:[],legs:[]};
  for(const side of [-1,1]){
   const arm=new THREE.Group();arm.position.set(side*.34,1.45,0);person.add(arm);
   cylinder(arm,.085,.59,0,-.29,0,clothes);limbs.arms.push(arm);
   const leg=new THREE.Group();leg.position.set(side*.15,.82,0);person.add(leg);
   cylinder(leg,.105,.72,0,-.36,0,trousers);
   cube(leg,.22,.13,.35,0,-.72,.09,dark);limbs.legs.push(leg);
  }
  person.userData.agent={floor:i,index:j};
  person.traverse(obj=>{if(obj.isMesh){obj.userData.agent={floor:i,index:j};agentPickables.push(obj)}});
  walkers.push({person,limbs,floor:i,index:j,phase:j*.72+i*.4,originX:x,originZ:1.85});
 }
 for(const x of [-7.5,7.5]){
  cylinder(group,.28,.47,x,.25,3.8,pot);
  for(let n=0;n<3;n++){
   const leaf=new THREE.Mesh(new THREE.SphereGeometry(.36,12,8),plant);
   leaf.position.set(x+Math.sin(n*2.1)*.22,.7+n*.21,3.8+Math.cos(n*2.1)*.2);
   group.add(leaf);
  }
 }
 // Transparent lift core ties all storeys together.
 cube(group,1.45,3.15,1.55,0,1.55,3.9,glass,false);
 cube(group,1.6,.13,1.65,0,3.15,3.9,accent);
 const picker=cube(group,16.8,3.1,.11,0,1.6,5.5,new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),false);
 picker.userData.floor=i;pickables.push(picker);
 // Visible floor number plate.
 const label=document.createElement('canvas');label.width=256;label.height=128;
 const ctx=label.getContext('2d');ctx.fillStyle='#f9fcff';ctx.fillRect(0,0,256,128);
 ctx.fillStyle='#1c3859';ctx.font='bold 88px sans-serif';ctx.textAlign='center';ctx.fillText(String(i+1).padStart(2,'0'),128,95);
 const texture=new THREE.CanvasTexture(label);
 const sign=new THREE.Mesh(new THREE.PlaneGeometry(1.7,.85),new THREE.MeshBasicMaterial({map:texture,transparent:true,side:THREE.DoubleSide}));
 sign.position.set(-7.45,2.45,5.65);group.add(sign);
}
cube(building,18,.6,12,0,-.65,0,edge);
cube(building,18,.23,12,0,5*height-.55,0,white);
const foundation=cube(scene,24,.3,17,0,-1.12,0,mat('#cddde9'));
const overlay=document.createElement('section');
overlay.className='building-inspector';
overlay.setAttribute('aria-label','Verdieping en taken');
overlay.innerHTML='<div class="building-kicker">🏢 BEDRIJFSGEBOUW · 5 VERDIEPINGEN</div><h3 id="building-heading">Alle verdiepingen</h3><p id="building-description">Klik op een verdieping in het gebouw of kies er een uit het menu.</p><div id="building-rooms"></div><div class="building-task-title">Taken en status</div><div id="building-tasks" aria-live="polite">Kies een verdieping om de taken te bekijken.</div><button type="button" id="building-overview">↗ Toon volledig gebouw</button>';
host.append(overlay);
const overviewButton=document.createElement('button');
overviewButton.id='building-back-global';overviewButton.type='button';
overviewButton.textContent='← Volledig gebouw';
overviewButton.setAttribute('aria-label','Terug naar overzicht van alle vijf verdiepingen');
host.append(overviewButton);
overviewButton.addEventListener('click',()=>selectFloor(-1));
const heading=overlay.querySelector('#building-heading'),description=overlay.querySelector('#building-description'),rooms=overlay.querySelector('#building-rooms'),tasks=overlay.querySelector('#building-tasks');
let selected=-1,selectedAgent=-1,orbit=-.52,elevation=.2,distance=65,goalDistance=65,goalY=8.5,light=0,roomMode=false;
const target=new THREE.Vector3(0,8.5,0),raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2();
const agentLabels=['Technical SEO Agent','Content Agent','WordPress Agent','Analytics Agent'];
const agentKeys=['technical','content','wordpress','analytics'];
let lastStatus=null;
async function refreshAgentStatus(){
 try{const res=await fetch('status.json',{cache:'no-store'});if(res.ok)lastStatus=await res.json()}catch(e){/* Preserve offline/preview mode */ }
 if(selected===0)renderTasks();
}
function renderTasks(){
 if(selected<0){tasks.textContent='Selecteer een verdieping om de afdelingen en taken te bekijken.';return;}
 if(selected>0){tasks.textContent='Digitale werkstations zijn een visuele preview. Er zijn geen gekoppelde agents of taken voor deze afdeling.';return;}
 tasks.replaceChildren();
 const info=document.createElement('p');info.textContent=selectedAgent<0?'Selecteer een digitaal agent-werkstation in deze ruimte. Status is afkomstig uit het laatst gepubliceerde rapport, niet uit live agentactiviteit.':agentLabels[selectedAgent]+' · status volgens gepubliceerd SEO-rapport (alleen-lezen).';tasks.append(info);
 if(lastStatus){
  const counts=lastStatus.agent_counts||{};
  const indexes=selectedAgent<0?[0,1,2,3]:[selectedAgent];
  for(const i of indexes){const p=document.createElement('p');p.textContent=agentLabels[i]+': '+(Number.isFinite(counts[agentKeys[i]])?counts[agentKeys[i]]:'?')+' openstaande voorstel(len)';tasks.append(p);}
  const stamp=document.createElement('small');stamp.textContent='Laatst bijgewerkt: '+(lastStatus.generated_at||'onbekend')+' · Geen live uitvoering';tasks.append(stamp);
 }
 const status=document.createElement('p');status.textContent=lastStatus?'Totaal volgens rapport: '+lastStatus.task_count+' voorstel(len).':'Taakaantal ophalen uit status.json…';tasks.append(status);
 fetch('status.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('status unavailable');return r.json()}).then(data=>{
  if(selected!==0)return;
  lastStatus=data;
  status.textContent='Openstaande SEO-voorstellen volgens laatst gepubliceerd statusrapport: '+(Number.isFinite(data.task_count)?data.task_count:'onbekend')+'.';
  const stamp=document.createElement('small');stamp.textContent='Rapportdatum: '+(data.generated_at||'onbekend')+' · Geen live taakuitvoering';tasks.append(stamp);
 }).catch(()=>{if(selected===0)status.textContent='Statusrapport niet beschikbaar; open de bestaande takenlijst voor details.'});
 const jump=document.createElement('button');jump.type='button';jump.textContent='↓ Bekijk SEO-taken en voorstellen';jump.addEventListener('click',()=>document.getElementById('tasks')?.scrollIntoView({behavior:'smooth',block:'start'}));tasks.append(jump);
}
function selectFloor(index){
 selected=index;selectedAgent=-1;roomMode=index>=0;
 overviewButton.hidden=index<0;
 levels.forEach((g,i)=>{g.visible=index<0||i===index});
 foundation.visible=index<0;
 if(index<0){goalY=8.5;goalDistance=65;heading.textContent='Alle verdiepingen';description.textContent='Klik op een verdieping in het gebouw of kies er een uit het menu.';rooms.replaceChildren();}
 else{
  goalY=index*height+1.2;goalDistance=18;
  heading.textContent='Verdieping '+(index+1)+' · '+departments[index].name;
  description.textContent=departments[index].status;
  rooms.replaceChildren();
  for(const name of departments[index].rooms){const item=document.createElement('span');item.textContent=name;rooms.append(item);}
 }
 // Room view isolates the selected floor; overview shows the complete building.
 document.querySelectorAll('#floor-directory [data-floor]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.floor)===index)));
 const current=document.getElementById('floor-current');if(current)current.textContent=index<0?'Overzicht · alle vijf verdiepingen':heading.textContent;
 const toggle=document.getElementById('world-floor');if(toggle)toggle.textContent=index<0?'⌂ Alle verdiepingen':'⌂ Verdieping '+(index+1)+' / 5';
 renderTasks();
}
overlay.querySelector('#building-overview').addEventListener('click',()=>selectFloor(-1));
document.querySelectorAll('#floor-directory [data-floor]').forEach(button=>button.addEventListener('click',()=>selectFloor(Number(button.dataset.floor))));
document.getElementById('world-floor')?.addEventListener('click',()=>selectFloor(selected>=4?-1:selected+1));
for(const [id,delta] of [['world-left',-.22],['world-right',.22]])document.getElementById(id)?.addEventListener('click',()=>{orbit+=delta});
document.getElementById('world-zoom-in')?.addEventListener('click',()=>{goalDistance=Math.max(15,goalDistance-4)});
document.getElementById('world-zoom-out')?.addEventListener('click',()=>{goalDistance=Math.min(90,goalDistance+4)});
document.getElementById('world-light')?.addEventListener('click',()=>{light=(light+1)%3;sun.intensity=[3.1,1.5,.65][light];ambient.intensity=[2.4,1.6,1][light];renderer.toneMappingExposure=[1.3,1.2,1.05][light]});
let drag=null;
canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,orbit,elevation,moved:false};canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>6)drag.moved=true;orbit=drag.orbit-dx*.005;elevation=Math.max(-.15,Math.min(.65,drag.elevation+dy*.003))});
canvas.addEventListener('pointerup',e=>{
 if(!drag)return;const moved=drag.moved;drag=null;if(moved)return;
 const rect=canvas.getBoundingClientRect();mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
 raycaster.setFromCamera(mouse,camera);
 if(selected>=0){
  const hits=raycaster.intersectObjects(agentPickables,false);
  const hit=hits.find(h=>h.object.userData.agent?.floor===selected);
  if(hit){selectedAgent=hit.object.userData.agent.index;heading.textContent=agentLabels[selectedAgent];description.textContent=selected===0?'Bekijk de laatst gerapporteerde SEO-voorstellen van deze agent.':'Preview: deze agent is nog niet gekoppeld.';renderTasks();return;}
 }
 const hits=raycaster.intersectObjects(pickables.filter(p=>selected<0||p.userData.floor===selected),false);
 if(hits.length)selectFloor(hits[0].object.userData.floor);
});
canvas.addEventListener('pointercancel',()=>{drag=null});
canvas.addEventListener('wheel',e=>{e.preventDefault();goalDistance=Math.max(15,Math.min(90,goalDistance+e.deltaY*.035))},{passive:false});
function resize(){const w=Math.max(host.clientWidth,1),h=Math.max(host.clientHeight,1);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(host);
host.prepend(canvas);fallback.style.display='none';host.classList.add('three-active');
document.querySelectorAll('.scene .label,.scene .agent-alert,.scene .manager-label').forEach(el=>{el.style.display='none'});
const oldExperience=host.querySelector('.office-experience');if(oldExperience)oldExperience.remove();
selectFloor(-1);resize();refreshAgentStatus();setInterval(refreshAgentStatus,60000);
let last=0;
function frame(t){
 const dt=Math.min(.08,(t-last)/1000||.016);last=t;
 const a=1-Math.exp(-dt*4.5);target.y+=(goalY-target.y)*a;distance+=(goalDistance-distance)*a;
 const angle=elevation+.28;
 camera.position.set(target.x+Math.sin(orbit)*distance*Math.cos(angle),target.y+Math.sin(angle)*distance,target.z+Math.cos(orbit)*distance*Math.cos(angle));
 camera.lookAt(target);
 const seconds=t*.001;
 agents.forEach(agent=>{agent.core.rotation.y=seconds*.7+agent.phase;agent.core.position.y=1.05+Math.sin(seconds*1.5+agent.phase)*.065;agent.ring.rotation.z=Math.sin(seconds*.65+agent.phase)*.13;});
 walkers.forEach(w=>{
  const cycle=(seconds*.15+w.phase)%1;
  const walking=cycle<.7;
  const u=walking?cycle/.7:1;
  // Each person walks along their workstation aisle and pauses by the desk.
  const z=w.originZ+(walking?Math.sin(u*Math.PI*2)*1.05:0);
  const x=w.originX+(walking?Math.cos(u*Math.PI*2)*.48-.48:0);
  w.person.position.set(x,walking?.035*Math.sin(seconds*11+w.phase):0,z);
  w.person.rotation.y=walking?Math.atan2(-Math.sin(u*Math.PI*2)*.48,Math.cos(u*Math.PI*2)*1.05):Math.PI;
  w.limbs.legs.forEach((limb,j)=>{limb.rotation.x=walking?Math.sin(seconds*9+w.phase+j*Math.PI)*.42:0});
  w.limbs.arms.forEach((limb,j)=>{limb.rotation.x=walking?Math.sin(seconds*9+w.phase+(1-j)*Math.PI)*.33:-.18});
 });
 renderer.render(scene,camera);
 requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
