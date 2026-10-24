/* Immersive Three.js SEO Office World. Visual-only, zero WordPress mutations. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';

const host = document.querySelector('.scene');
const fallback = host?.querySelector('.world');
if (!host || !fallback) throw new Error('3D scene container unavailable');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const canvas = document.createElement('canvas');
canvas.className = 'world-three-canvas';
canvas.setAttribute('aria-label', 'Interactieve driedimensionale kantoorwereld met vier kamers en wandelende medewerkers');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.45;
host.prepend(canvas);
fallback.style.display = 'none';
host.classList.add('three-active');
const scene = new THREE.Scene();
scene.background = null;
const camera = new THREE.PerspectiveCamera(35,1,.1,150);
const ambient = new THREE.HemisphereLight(0xffffff,0xb3c3d8,2.15);scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffffff,3.0);
sun.position.set(-9,17,13);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-18;sun.shadow.camera.right=18;sun.shadow.camera.top=18;sun.shadow.camera.bottom=-18;
sun.shadow.bias=-.0003;scene.add(sun);
const mat=(c,roughness=.7,metalness=0)=>new THREE.MeshStandardMaterial({color:c,roughness,metalness});
const materials={floor:mat('#e7eff7'),wall:mat('#ffffff'),glass:new THREE.MeshPhysicalMaterial({color:'#dceefa',transparent:true,opacity:.34,roughness:.12,metalness:.06,depthWrite:false}),wood:mat('#f6f9fc'),edge:mat('#b7c8dc'),dark:mat('#2b405c'),screen:mat('#70b8f6',.24,.15),green:mat('#76bc96'),skin:mat('#e7b68e'),hair:mat('#4a3941'),pot:mat('#d7e5ee'),plant:mat('#5fae7c')};
const root=new THREE.Group();scene.add(root);
function cube(parent,w,h,d,x,y,z,m,cast=true){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=cast;o.receiveShadow=true;parent.add(o);return o}
function ball(parent,r,x,y,z,m){const o=new THREE.Mesh(new THREE.SphereGeometry(r,18,12),m);o.position.set(x,y,z);o.castShadow=true;parent.add(o);return o}
function cyl(parent,top,bottom,height,x,y,z,m){const o=new THREE.Mesh(new THREE.CylinderGeometry(top,bottom,height,16),m);o.position.set(x,y,z);o.castShadow=true;parent.add(o);return o}
cube(root,18,.6,18,0,-.3,0,materials.floor);
cube(root,18,.36,18,0,-.76,0,materials.edge);
for(let i=-7;i<=7;i+=2){cube(root,.025,.014,17,i,.017,0,mat('#dbe5f0'),false);cube(root,17,.014,.025,0,.017,i,mat('#dbe5f0'),false)}
// Open-plan, modular rooms. Walls are kept low so the player can see every agent.
const roomPositions=[[-4.5,-4.5],[4.5,-4.5],[-4.5,4.5],[4.5,4.5]];
const roomNames=['Technical SEO Lab','Content Studio','WordPress Control','Analytics Lab'];
const roomColors=['#6e9ee9','#ad9ce5','#e7b379','#7cc8b0'];
const desks=[];
const upperFloor = new THREE.Group();
upperFloor.position.y = 5.4;
upperFloor.visible = false;
root.add(upperFloor);
const upperMat = mat('#f5f9ff');
cube(upperFloor,17,.38,17,0,0,0,upperMat);
cube(upperFloor,17,.3,17,0,-.3,0,materials.edge);
for (const [x,z] of [[-4.5,-4.5],[4.5,-4.5],[-4.5,4.5],[4.5,4.5]]) {
  cube(upperFloor,7,.1,.12,x,.12,z-3.45,materials.wall);
  cube(upperFloor,.12,.1,7,x-3.45,.12,z,materials.wall);
  cube(upperFloor,3,.14,1.5,x,.85,z,materials.wood);
  for (const dx of [-1.25,1.25]) for (const dz of [-.5,.5]) cyl(upperFloor,.06,.06,.72,x+dx,.45,z+dz,materials.edge);
  cube(upperFloor,1,.8,.08,x,1.48,z-.25,materials.dark);
  cube(upperFloor,.9,.68,.03,x,1.48,z-.19,materials.screen);
  cyl(upperFloor,.3,.24,.48,x+2,.27,z+1.8,materials.pot);
  ball(upperFloor,.48,x+2,.87,z+1.8,materials.plant);
}
// An optional second storey is a visual preview, not an activated SEO department.

roomPositions.forEach(([x,z],i)=>{
 const color=mat(roomColors[i]);
 cube(root,7,.09,.08,x,.08,z-3.45,materials.wall);
 cube(root,.08,.1,7,x-3.45,.08,z,materials.wall);
 cube(root,3.6,.13,1.8,x,.84,z,materials.wood);
 for(const dx of [-1.5,1.5])for(const dz of [-.66,.66])cyl(root,.055,.055,.7,x+dx,.42,z+dz,materials.edge);
 cube(root,1.18,.8,.09,x,1.52,z-.32,materials.dark);
 cube(root,1.04,.65,.025,x,1.53,z-.26,color);
 cube(root,.12,.38,.1,x,1.01,z-.34,materials.edge);
 cube(root,.48,.045,.33,x,.87,z+.4,materials.edge);
 cube(root,1,.18,.8,x,.42,z+1.42,materials.dark);
 cube(root,.15,.66,.15,x,.54,z+1.83,materials.edge);
 cube(root,.88,.75,.15,x,.86,z+1.87,materials.dark);
 // Room glass separators: transparent, unobtrusive and physically modelled.
 if(i===0||i===2)cube(root,.08,1.25,5,x+3.38,.7,z,materials.glass,false);
 if(i===0||i===1)cube(root,5,1.25,.08,x,.7,z+3.38,materials.glass,false);
 // Plant.
 cyl(root,.34,.26,.55,x+2.4,.29,z-2.4,materials.pot);
 for(let j=0;j<5;j++)ball(root,.33,x+2.4+Math.sin(j*2.5)*.28,.75+j*.16,z-2.4+Math.cos(j*2.5)*.28,materials.plant);
 // Coloured overhead status beacons (not actual live activity).
 ball(root,.15,x+2.4,1.45,z+2.4,color);
 desks.push({x,z});
});
// Walkable corridor through centre, with decorative reception.
cube(root,2.8,.13,1.1,0,.7,0,materials.wood);
cube(root,2.5,.62,.22,0,.35,.43,materials.edge);
function character(color,atX,atZ){
 const g=new THREE.Group();g.position.set(atX,0,atZ);root.add(g);
 const shirt=mat(color),pants=mat('#506782');
 cyl(g,.31,.37,.82,0,.95,0,shirt);
 ball(g,.28,0,1.65,0,materials.skin);
 const hair=ball(g,.29,0,1.85,-.025,materials.hair);hair.scale.y=.42;
 const legs=[];const arms=[];const shoes=[];
 // Articulated miniature avatar: hands, shoes, facial features and layered hair.
 const jacket=cube(g,.56,.12,.4,0,1.28,0,shirt);
 for(const side of [-1,1]){
  ball(g,.042,side*.11,1.68,.255,materials.dark);
  const shoe=cube(g,.22,.13,.36,side*.18,.075,.1,materials.dark);shoes.push(shoe);
 }
 const nose=ball(g,.06,0,1.58,.27,materials.skin);

 for(const side of [-1,1]){
  const leg=cyl(g,.105,.11,.57,side*.18,.31,0,pants);legs.push(leg);
  const arm=cyl(g,.095,.09,.64,side*.41,1.05,0,shirt);arm.rotation.z=side*.16;arms.push(arm);
  ball(g,.105,side*.41,.7,0,materials.skin);
 }
 return {g,legs,arms,shoes};
}
// Characters can be upgraded with locally licensed GLB avatars without altering SEO logic.
const characterManifest = [
 {key:'technical',model:'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/models/gltf/RobotExpressive/RobotExpressive.glb'},
 {key:'content',model:'assets/agents/content.glb'},
 {key:'wordpress',model:'assets/agents/wordpress.glb'},
 {key:'analytics',model:'assets/agents/analytics.glb'},
 {key:'manager',model:'assets/agents/manager.glb'}
];
const characterMixers=[];
const loader=new GLTFLoader();
const characters=[
 character('#6498db',-4.5,-3.05),
 character('#aa8ed6',4.5,-3.05),
 character('#e4a870',-4.5,5.95),
 character('#6ebda0',4.5,5.95),
 character('#536f99',0,2.1)
];
// Load licensed rigged avatars only when provided. Missing files retain built-in 3D avatars.
characterManifest.forEach((entry,i)=>{
 loader.load(entry.model,gltf=>{
   const actor=characters[i];
   const model=gltf.scene;
   const bounds=new THREE.Box3().setFromObject(model);
   const size=new THREE.Vector3();bounds.getSize(size);
   if(!Number.isFinite(size.y)||size.y<.01)return;
   model.scale.setScalar(1.95/size.y);
   const updatedBounds=new THREE.Box3().setFromObject(model);
   model.position.y=-updatedBounds.min.y;
   model.traverse(obj=>{if(obj.isMesh){obj.castShadow=true;obj.receiveShadow=true}});
   actor.g.add(model);
   actor.g.children.forEach(child=>{if(child!==model)child.visible=false});
   actor.model=model;
   const mixer=new THREE.AnimationMixer(model);
   const actions={};
   gltf.animations.forEach(clip=>{
     const name=clip.name.toLowerCase();
     const kind=/walk|run/.test(name)?'walk':/sit|type|work|idle|talk/.test(name)?'idle':null;
     if(kind&&!actions[kind])actions[kind]=mixer.clipAction(clip);
   });
   if(!actions.idle&&gltf.animations.length)actions.idle=mixer.clipAction(gltf.animations.find(c=>/idle/i.test(c.name))||gltf.animations[0]);
   actor.actions=actions;
   actor.activeAction=null;
   characterMixers.push(mixer);
 },undefined,()=>{/* The included geometric character remains visible. */});
});
const paths=[
 [[-4.5,-3.05],[-4.5,-1.1],[-2.2,-1.1],[-4.5,-3.05]],
 [[4.5,-3.05],[4.5,-1.1],[2.2,-1.1],[4.5,-3.05]],
 [[-4.5,5.95],[-4.5,3.0],[-2.1,3.0],[-4.5,5.95]],
 [[4.5,5.95],[4.5,3.0],[2.1,3.0],[4.5,5.95]],
 [[0,2.1],[0,0],[0,-2.3],[2,0],[-2,0],[0,2.1]]
];
let orbit=-.76,elevation=.89,distance=30,lightMode=0,floorLevel=0;
const orbitTarget=new THREE.Vector3(0,0,0);
function updateCamera(){
 camera.position.set(Math.sin(orbit)*distance*Math.cos(elevation),Math.sin(elevation)*distance,Math.cos(orbit)*distance*Math.cos(elevation));
 camera.lookAt(orbitTarget);
}
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
const ro=new ResizeObserver(resize);ro.observe(host);resize();updateCamera();
// Room expansion is visual-only. Never infer that an SEO agent exists from a rendered room.
const floorButton=document.getElementById('world-floor');
floorButton?.addEventListener('click',()=>{
 floorLevel=(floorLevel+1)%2;
 upperFloor.visible=Boolean(floorLevel);
 root.children.forEach(obj=>{if(obj!==upperFloor && obj.material && obj.material.transparent)obj.visible=!floorLevel});
 orbitTarget.y=floorLevel?5.4:0;
 distance=floorLevel?34:30;
 updateCamera();
 floorButton.textContent=floorLevel?'⌂ Verdieping 2 · preview':'⌂ Begane grond';
 floorButton.setAttribute('aria-pressed',String(Boolean(floorLevel)));
});
function bind(id,fn){document.getElementById(id)?.addEventListener('click',fn)}
bind('world-left',()=>{orbit-=.22;updateCamera()});
bind('world-right',()=>{orbit+=.22;updateCamera()});
bind('world-zoom-in',()=>{distance=Math.max(17,distance-2.5);updateCamera()});
bind('world-zoom-out',()=>{distance=Math.min(46,distance+2.5);updateCamera()});
bind('world-light',()=>{
 lightMode=(lightMode+1)%3;
 const states=[{sun:3,amb:2.15,ex:1.45},{sun:1.6,amb:1.4,ex:1.2},{sun:.45,amb:.9,ex:1.05}];
 sun.intensity=states[lightMode].sun;ambient.intensity=states[lightMode].amb;renderer.toneMappingExposure=states[lightMode].ex;
});
let pointer=null;
canvas.addEventListener('pointerdown',e=>{pointer={x:e.clientX,y:e.clientY,orbit,elevation};canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!pointer)return;orbit=pointer.orbit-(e.clientX-pointer.x)*.006;elevation=Math.max(.35,Math.min(1.37,pointer.elevation+(e.clientY-pointer.y)*.004));updateCamera()});
canvas.addEventListener('pointerup',()=>{pointer=null});
canvas.addEventListener('pointercancel',()=>{pointer=null});
canvas.addEventListener('wheel',e=>{e.preventDefault();distance=Math.max(17,Math.min(46,distance+e.deltaY*.018));updateCamera()},{passive:false});
const raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2();
canvas.addEventListener('click',e=>{
 const rect=canvas.getBoundingClientRect();mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
 raycaster.setFromCamera(mouse,camera);
 const hits=raycaster.intersectObjects(characters.map(c=>c.g),true);
 if(!hits.length)return;
 let object=hits[0].object;
 while(object.parent&&!characters.some(c=>c.g===object))object=object.parent;
 const idx=characters.findIndex(c=>c.g===object);
 const key=['technical','content','wordpress','analytics'][idx];
 if(key)document.querySelector('.label[data-agent="'+key+'"]')?.click();
});
let elapsed=0,last=0;
const activity=['wandelt','werkt','overlegt'];
const activityStatus=document.getElementById('world-activity');

function frame(t){
 const dt=Math.min(.06,(t-last)/1000||0);last=t;elapsed+=dt;
 characterMixers.forEach(mixer=>mixer.update(dt));
 if(!reduce.matches){
 characters.forEach((person,i)=>{
  const path=paths[i],period=i===4?22:18+i*2;
  const segment=(elapsed/period*path.length+i*.45)%path.length;
  const k=Math.floor(segment),f=segment-k;
  const a=path[k],b=path[(k+1)%path.length];
  const x=a[0]+(b[0]-a[0])*f,z=a[1]+(b[1]-a[1])*f;
  const moving=Math.abs(b[0]-a[0])+Math.abs(b[1]-a[1])>.2;
  person.g.position.set(x,moving?.035*Math.sin(elapsed*11+i):0,z);
  if(moving)person.g.rotation.y=Math.atan2(b[0]-a[0],b[1]-a[1]);
  if(person.actions){
    const next=moving?(person.actions.walk||person.actions.idle):person.actions.idle;
    if(next&&next!==person.activeAction){
      if(person.activeAction)person.activeAction.fadeOut(.3);
      next.reset().fadeIn(.3).play();person.activeAction=next;
    }
  }
  if(!person.model)person.legs.forEach((leg,j)=>{leg.rotation.x=moving?Math.sin(elapsed*9+i+j*Math.PI)*.27:0});
  if(!person.model)person.arms.forEach((arm,j)=>{arm.rotation.x=moving?Math.sin(elapsed*9+i+(1-j)*Math.PI)*.28:-.2});
  if(!person.model)person.shoes.forEach((shoe,j)=>{shoe.position.z=moving?.1+Math.sin(elapsed*9+i+j*Math.PI)*.12:.1});
 });
 }
 if(activityStatus&&Math.floor(elapsed)%6===0)activityStatus.textContent='3D-simulatie · medewerkers bewegen onafhankelijk van echte SEO-taken';
 renderer.render(scene,camera);
 requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
