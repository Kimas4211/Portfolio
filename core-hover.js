import * as THREE from 'three';

const clamp=THREE.MathUtils.clamp;
const ramp=THREE.MathUtils.smootherstep;

export function createCoreHover(scan){
 const original=scan.geometry;
 const {position,normal}=original.attributes;
 const center=new THREE.Vector3(-.115,.655,.17);
 const read=id=>new THREE.Vector3().fromBufferAttribute(position,id);
 const portions=Array.from({length:8},()=>[]);
 const keep=[];
 for(let i=0;i<original.index.count;i+=3){
  const ids=[0,1,2].map(j=>original.index.getX(i+j));
  const p=ids.reduce((s,id)=>s.add(read(id)),new THREE.Vector3()).divideScalar(3);
  const x=(p.x-center.x)/.145,y=(p.y-center.y)/.166;
  const angle=Math.atan2(y,x),r=Math.hypot(x,y);
  const boundary=1+.075*Math.sin(angle*5+.6)+.055*Math.sin(angle*9-1);
  if(p.z<.035||r>boundary){keep.push(...ids);continue;}
  const section=r<.52?0:1+Math.min(6,Math.floor((angle+Math.PI)/(2*Math.PI)*7));
  portions[section].push(...ids);
 }
 const originalRaycast=scan.raycast;
 const pickSurface=new THREE.Mesh(original,scan.material);
 function intactRaycast(raycaster,hits){
  pickSurface.matrixWorld.copy(scan.matrixWorld);
  const found=[];
  pickSurface.raycast(raycaster,found);
  for(const hit of found){hit.object=scan;hits.push(hit);}
 }
 const shell=original.clone();
 shell.setIndex(keep);
 const group=new THREE.Group();
 scan.add(group);
 group.visible=false;
 const cut=new THREE.MeshStandardMaterial({color:0x777373,roughness:.96,side:THREE.DoubleSide});
 const cavityMaterial=new THREE.MeshStandardMaterial({
  color:0x32272b,roughness:1,vertexColors:true,side:THREE.DoubleSide
 });
 const pieces=[];
 const boundaryEdges=new Map();
 for(const ids of portions){
  for(let i=0;i<ids.length;i+=3)for(const [u,v] of [[ids[i],ids[i+1]],[ids[i+1],ids[i+2]],[ids[i+2],ids[i]]]){
   const key=Math.min(u,v)*position.count+Math.max(u,v);
   if(boundaryEdges.has(key))boundaryEdges.get(key).count++;
   else boundaryEdges.set(key,{u,v,count:1});
  }
 }
 for(const [section,ids] of portions.entries()){
  if(!ids.length)continue;
  const unique=[...new Set(ids)];
  const anchors=section===0?unique:unique.slice().sort((a,b)=>{
   const A=read(a),B=read(b);
   return Math.hypot(B.x-center.x,B.y-center.y)-Math.hypot(A.x-center.x,A.y-center.y);
  }).slice(0,Math.max(2,Math.floor(unique.length*.16)));
  const pivot=anchors.reduce((sum,id)=>sum.add(read(id)),new THREE.Vector3()).divideScalar(anchors.length);
  const edges=new Map(),vertices=[],normals=[],indices=[];
  const map=new Map(unique.map((id,i)=>[id,i]));
  for(const id of unique){
   vertices.push(...read(id).sub(pivot));
   normals.push(normal.getX(id),normal.getY(id),normal.getZ(id));
  }
  indices.push(...ids.map(id=>map.get(id)));
  const surfaceCount=indices.length;
  for(let i=0;i<ids.length;i+=3){
   const [a,b,c]=ids.slice(i,i+3);
   for(const [u,v] of [[a,b],[b,c],[c,a]]){
    const key=Math.min(u,v)*position.count+Math.max(u,v);
    if(edges.has(key))edges.get(key).count++;
    else edges.set(key,{u,v,count:1});
   }
  }
  const back=p=>p.clone().add(new THREE.Vector3(0,0,-.025));
  for(const {u,v,count} of edges.values()){
   if(count!==1)continue;
   const a=read(u).sub(pivot),b=read(v).sub(pivot),c=back(b),d=back(a);
   const n=d.clone().sub(a).cross(b.clone().sub(a)).normalize();
   const start=vertices.length/3;
   for(const p of [a,b,c,d]){vertices.push(...p);normals.push(...n);}
   indices.push(start,start+3,start+1,start+1,start+3,start+2);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));
  geometry.setIndex(indices);
  geometry.addGroup(0,surfaceCount,0);
  geometry.addGroup(surfaceCount,indices.length-surfaceCount,1);
  const mesh=new THREE.Mesh(geometry,[scan.material,cut]);
  mesh.position.copy(pivot);group.add(mesh);
  const inward=center.clone().sub(pivot);
  inward.z=0;
  pieces.push({mesh,pivot,inward,section});
 }
 const walls=[],wallColor=[];
 function add(p,c){walls.push(...p);wallColor.push(...c);}
 const floor=p=>new THREE.Vector3(center.x+(p.x-center.x)*.65,center.y+(p.y-center.y)*.65,.002);
 for(const {u,v,count} of boundaryEdges.values()){
  if(count!==1)continue;
  const a=read(u),b=read(v),c=floor(b),d=floor(a);
  const m=a.clone().lerp(d,.34),n=b.clone().lerp(c,.34);
  for(const [A,B,C,ca,cb,cc] of [
   [a,b,m,[.74,.69,.69],[.74,.69,.69],[.26,.19,.21]],
   [b,n,m,[.74,.69,.69],[.26,.19,.21],[.26,.19,.21]],
   [m,n,d,[.26,.19,.21],[.26,.19,.21],[.065,.012,.025]],
   [n,c,d,[.26,.19,.21],[.065,.012,.025],[.065,.012,.025]]
  ]){add(A,ca);add(B,cb);add(C,cc);}
 }
 const wallGeometry=new THREE.BufferGeometry();
 wallGeometry.setAttribute('position',new THREE.Float32BufferAttribute(walls,3));
 wallGeometry.setAttribute('color',new THREE.Float32BufferAttribute(wallColor,3));
 wallGeometry.computeVertexNormals();
 group.add(new THREE.Mesh(wallGeometry,cavityMaterial));
 // A shallow concave radiance bed remains deep behind the outer stone shell.
 // Its broad falloff has no sprite silhouette, white highlight or physical bead.
 const floorMaterial=new THREE.ShaderMaterial({
  side:THREE.DoubleSide,
  uniforms:{strength:{value:0}},
  vertexShader:`
   varying vec2 chamberUv;
   void main(){
    chamberUv=uv;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
   }
  `,
  fragmentShader:`
   uniform float strength;
   varying vec2 chamberUv;
   void main(){
    vec2 p=(chamberUv-.5)*2.;
    float distance=length(p*vec2(1.,.97));
    float irregular=.026*sin(p.y*11.+p.x*5.)*distance;
    float r=max(0.,distance+irregular);
    float deepGlow=exp(-pow(r*3.40,1.43));
    float diffuseGlow=exp(-r*r*6.4);
    float edge=1.-smoothstep(.62,1.,r);
    vec3 color=vec3(.009,.00018,.0006);
    color+=vec3(1.35,.0008,.006)*deepGlow*strength*edge;
    color+=vec3(.23,.0004,.003)*diffuseGlow*strength*edge;
    gl_FragColor=vec4(color,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }
  `
 });
 const bedPosition=[],bedUv=[],bedIndices=[];
 const segments=72,rows=14;
 for(let row=0;row<=rows;row++){
  const radius=row/rows;
  for(let i=0;i<=segments;i++){
   const angle=i/segments*Math.PI*2;
   const x=Math.cos(angle)*radius,y=Math.sin(angle)*radius;
   bedPosition.push(x*.115,y*.115,.038+.020*Math.pow(radius,1.5));
   bedUv.push(.5+x*.5,.5+y*.5);
   if(row<rows&&i<segments){
    const p=row*(segments+1)+i,q=p+segments+1;
    bedIndices.push(p,q,p+1,p+1,q,q+1);
   }
  }
 }
 const bedGeometry=new THREE.BufferGeometry();
 bedGeometry.setAttribute('position',new THREE.Float32BufferAttribute(bedPosition,3));
 bedGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(bedUv,2));
 bedGeometry.setIndex(bedIndices);
 const floorMesh=new THREE.Mesh(bedGeometry,floorMaterial);
 floorMesh.position.set(center.x,center.y,0);
 floorMesh.scale.y=1.12;
 group.add(floorMesh);

 const ringMaterial=new THREE.LineBasicMaterial({color:0x9e0730,transparent:true,opacity:0,depthWrite:false});
 for(const [i,radius] of [.025,.043,.062].entries()){
  const pts=Array.from({length:85},(_,j)=>{
   const a=j/84*Math.PI*2;
   return new THREE.Vector3(center.x+Math.cos(a)*radius,center.y+Math.sin(a)*radius*1.08,.041+.020*Math.pow(radius/.115,1.5));
  });
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),ringMaterial));
 }
 const spokes=[];
 for(let i=0;i<11;i++){
  const a=i*Math.PI*2/11+.17;
  for(const r of [.079,.095])spokes.push(new THREE.Vector3(center.x+Math.cos(a)*r,center.y+Math.sin(a)*r*1.07,.021));
 }
 group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(spokes),ringMaterial));
 const particles=new THREE.BufferGeometry();
 const positions=new Float32Array(18);
 particles.setAttribute('position',new THREE.BufferAttribute(positions,3));
 const particleMaterial=new THREE.PointsMaterial({color:0xf34b75,size:.004,transparent:true,opacity:0,depthWrite:false});
 group.add(new THREE.Points(particles,particleMaterial));
 const light=new THREE.PointLight(0xff123c,0,.30,2);
 light.position.set(center.x,center.y,.10);group.add(light);
 let amount=0;
 return function update(level,time,dt,reduced){
  const input=clamp(level/.56,0,1);
  const target=input<.002?0:input;
  amount+=clamp(target-amount,-(reduced?1:dt/.48),reduced?1:dt/.48);
  const t=ramp(amount,0,1);
  group.visible=t>0;
  scan.raycast=t>0?intactRaycast:originalRaycast;
  if(t>0)scan.geometry=shell;
  else if(scan.geometry===shell)scan.geometry=original;
  if(t===0)return;
  for(const {mesh,pivot,inward,section} of pieces){
   const fall=ramp(t,section===0?.03:.10,section===0?.87:1);
   mesh.position.copy(pivot).addScaledVector(inward,fall*(section===0?.15:0));
   mesh.position.z-=fall*(section===0?.143:0);
   mesh.scale.setScalar(1-fall*(section===0?.92:0));
   mesh.rotation.x=section===0?0:-fall*inward.y*3.3;
   mesh.rotation.y=section===0?0:fall*inward.x*3.3;
  }
  const energy=ramp(t,.26,.91);
  const pulse=reduced?1:.94+.06*Math.sin(time*1.6);
  floorMaterial.uniforms.strength.value=ramp(t,.06,.80)*pulse;
  ringMaterial.opacity=energy*.15;
  particleMaterial.opacity=energy*.58;
  light.intensity=energy*.015*pulse;
  for(let i=0;i<6;i++){
   const a=i*Math.PI/3+.27,progress=reduced?.5:(time*.085+i/6)%1;
   const radius=.087*(1-progress)+.010;
   particles.attributes.position.setXYZ(i,center.x+Math.cos(a)*radius,center.y+Math.sin(a)*radius*1.08,.047);
  }
  particles.attributes.position.needsUpdate=true;
 };
}



