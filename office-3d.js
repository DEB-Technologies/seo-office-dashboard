/* Immersive Three.js SEO Office World. Visual-only, zero WordPress mutations. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

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
 const legs=[];
 for(const side of [-1,1]){
  const leg=cyl(g,.105,.11,.57,side*.18,.31,0,pants);legs.push(leg);
  const arm=cyl(g,.095,.09,.64,side*.41,1.05,0,shirt);arm.rotation.z=side*.16;
  ball(g,.105,side*.41,.7,0,materials.skin);
 }
 return {g,legs};
}
const characters=[
 character('#6498db',-4.5,-3.05),
 character('#aa8ed6',4.5,-3.05),
 character('#e4a870',-4.5,5.95),
 character('#6ebda0',4.5,5.95),
 character('#536f99',0,2.1)
];
const paths=[
 [[-4.5,-3.05],[-4.5,-1.1],[-2.2,-1.1],[-4.5,-3.05]],
 [[4.5,-3.05],[4.5,-1.1],[2.2,-1.1],[4.5,-3.05]],
 [[-4.5,5.95],[-4.5,3.0],[-2.1,3.0],[-4.5,5.95]],
 [[4.5,5.95],[4.5,3.0],[2.1,3.0],[4.5,5.95]],
 [[0,2.1],[0,0],[0,-2.3],[2,0],[-2,0],[0,2.1]]
];
let orbit=-.76,elevation=.89,distance=30,lightMode=0;
const orbitTarget=new THREE.Vector3(0,0,0);
function updateCamera(){
 camera.position.set(Math.sin(orbit)*distance*Math.cos(elevation),Math.sin(elevation)*distance,Math.cos(orbit)*distance*Math.cos(elevation));
 camera.lookAt(orbitTarget);
}
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
const ro=new ResizeObserver(resize);ro.observe(host);resize();updateCamera();
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
function frame(t){
 const dt=Math.min(.06,(t-last)/1000||0);last=t;elapsed+=dt;
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
  person.legs.forEach((leg,j)=>{leg.rotation.x=moving?Math.sin(elapsed*9+i+j*Math.PI)*.27:0});
 });
 }
 renderer.render(scene,camera);
 requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
