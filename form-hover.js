import * as THREE from 'three';

// Detach only the shoulder's scan triangles. Close their boundaries inward.
export function createFormHover(scan){
 const original=scan.geometry, material=scan.material;
 const position=original.attributes.position, normal=original.attributes.normal;
 const read=i=>new THREE.Vector3().fromBufferAttribute(position,i);
 const regions=[
  [-.675,.742,.13,.110,.096],
  [-.812,.500,.13,.130,.168],
  [-.915,.245,.10,.117,.123]
 ];
 const faces=regions.map(()=>[]),keep=[];
 for(let i=0;i<original.index.count;i+=3){
  const ids=[0,1,2].map(j=>original.index.getX(i+j));
  const c=ids.reduce((sum,id)=>sum.add(read(id)),new THREE.Vector3()).divideScalar(3);
  const region=regions.findIndex(([x,y,z,rx,ry])=>
   ((c.x-x)/rx)**2+((c.y-y)/ry)**2<1+.12*Math.sin(c.x*63+c.y*39)&&c.z>z-.12);
  (region<0?keep:faces[region]).push(...ids);
 }
 const shell=original.clone();shell.setIndex(keep);
 const group=new THREE.Group();scan.add(group);group.visible=false;
 const cut=new THREE.MeshStandardMaterial({color:0x696d65,roughness:.94,side:THREE.DoubleSide});
 const inside=new THREE.MeshStandardMaterial({color:0x81817b,roughness:.94,side:THREE.DoubleSide,
  vertexColors:true});
 const cavityMaterial=new THREE.MeshStandardMaterial({color:0x62645d,roughness:1,
  vertexColors:true,side:THREE.DoubleSide});
 const pieces=[];
 for(const [region,ids] of faces.entries()){
  if(!ids.length)continue;
  const unique=[...new Set(ids)];
  const center=unique.reduce((sum,id)=>sum.add(read(id)),new THREE.Vector3()).divideScalar(unique.length);
  const vertices=[],normals=[],indices=[],edges=new Map();
  const front=unique.reduce((sum,id)=>sum.add(new THREE.Vector3().fromBufferAttribute(normal,id)),new THREE.Vector3()).normalize();
  const map=new Map(unique.map((id,i)=>[id,i]));
  const backing=id=>read(id).lerp(center,.026).addScaledVector(front,-.027);
  for(const id of unique){
   const p=read(id).sub(center),n=new THREE.Vector3().fromBufferAttribute(normal,id);
   vertices.push(...p);normals.push(...n);
  }
  for(const id of unique){vertices.push(...backing(id).sub(center));normals.push(...front.clone().negate());}
  indices.push(...ids.map(id=>map.get(id)));
  const frontCount=indices.length;
  for(let i=0;i<ids.length;i+=3){
   const [a,b,c]=ids.slice(i,i+3);
   indices.push(map.get(c)+unique.length,map.get(b)+unique.length,map.get(a)+unique.length);
   for(const [u,v] of [[a,b],[b,c],[c,a]]){
    const key=Math.min(u,v)*position.count+Math.max(u,v);
    if(edges.has(key))edges.get(key).count++;
    else edges.set(key,{u,v,count:1});
   }
  }
  const backCount=indices.length;
  for(const {u,v,count} of edges.values()){
   if(count!==1)continue;
   const points=[read(u),read(v),backing(v),backing(u)].map(p=>p.sub(center));
   const n=points[3].clone().sub(points[0]).cross(points[1].clone().sub(points[0])).normalize();
   const start=vertices.length/3;
   for(const p of points){vertices.push(...p);normals.push(...n);}
   indices.push(start,start+3,start+1,start+1,start+3,start+2);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));
  geometry.setIndex(indices);
  geometry.addGroup(0,frontCount,0);
  geometry.addGroup(frontCount,backCount-frontCount,1);
  geometry.addGroup(backCount,indices.length-backCount,2);
  const stoneTint=[];
  for(let i=0;i<vertices.length/3;i++)stoneTint.push(.68,.69,.66);
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(stoneTint,3));
  const plate=new THREE.Mesh(geometry,[material,cut,inside]);

  // The scan shell really loses these triangles. The stationary cavity replaces them
  // with inward-facing walls and a deep stone floor behind the digital structure.
  const cavityPos=[],cavityTint=[];
  const push=(p,color)=>{cavityPos.push(...p);cavityTint.push(...color);};
  const floor=id=>read(id).lerp(center,.035).addScaledVector(front,-.096);
  const dark=[.105,.115,.108], contact=[.22,.235,.22],lip=[.57,.59,.56];
  for(let i=0;i<ids.length;i+=3){
   for(const id of ids.slice(i,i+3))push(floor(id),dark);
  }
  for(const {u,v,count} of edges.values()){
   if(count!==1)continue;
   const a=read(u),b=read(v),c=floor(v),d=floor(u);
   const p=a.clone().lerp(d,.27),q=b.clone().lerp(c,.27);
   for(const [A,B,C,shadeA,shadeB,shadeC] of [
    [a,b,p,lip,lip,contact],[b,q,p,lip,contact,contact],
    [p,q,d,contact,contact,dark],[q,c,d,contact,dark,dark]
   ]){push(A,shadeA);push(B,shadeB);push(C,shadeC);}
  }
  const hollow=new THREE.BufferGeometry();
  hollow.setAttribute('position',new THREE.Float32BufferAttribute(cavityPos,3));
  hollow.setAttribute('color',new THREE.Float32BufferAttribute(cavityTint,3));
  hollow.computeVertexNormals();
  group.add(new THREE.Mesh(hollow,cavityMaterial));
  plate.position.copy(center);group.add(plate);
  pieces.push({plate,center,front,region});
 }
 const structure=new THREE.Group();group.add(structure);
 const green=new THREE.LineBasicMaterial({color:0x37e494,transparent:true,opacity:0,depthWrite:false});
 const points=[];
 const probe=new THREE.Mesh(original,material);
 const ray=new THREE.Raycaster();
 const frontDirection=new THREE.Vector3(0,0,-1);
 function arm(t,a){
  const y=.83-.82*t,x=-.607-.366*t;
  const radius=.115-.025*t;
  const px=x+Math.cos(a)*radius;
  ray.set(new THREE.Vector3(px,y,2),frontDirection);
  const hit=ray.intersectObject(probe,false)[0];
  const depth=hit?hit.point.z-.031:-.12;
  return new THREE.Vector3(px,y,depth-.012*(1-Math.sin(a)));
 }
 const line=pts=>{
  const geometry=new THREE.BufferGeometry().setFromPoints(pts);
  structure.add(new THREE.Line(geometry,green));
 };
 for(let i=0;i<13;i++)line(Array.from({length:48},(_,j)=>arm(j/47,i*Math.PI*2/13)));
 for(let i=0;i<17;i++){
  line(Array.from({length:45},(_,j)=>arm(i/16,j*Math.PI*2/44)));
  if(i%3===0)for(const a of [1.05,2.1])points.push(arm(i/16,a));
 }
 const nodes=new THREE.Points(new THREE.BufferGeometry().setFromPoints(points),
  new THREE.PointsMaterial({color:0xd7ffe6,size:.009,transparent:true,opacity:0,depthWrite:false}));
 structure.add(nodes);
 const light=new THREE.PointLight(0x56ffab,0,.42,2);
 light.position.set(-.82,.49,.09);group.add(light);
 let amount=0;
 return function update(level,awaken,dt,reduced){
  const input=Math.max(level/.65,awaken);
  const target=input<.002?0:Math.min(1,input);
  const step=reduced?1:dt/.50;
  amount+=THREE.MathUtils.clamp(target-amount,-step,step);
  const t=THREE.MathUtils.smootherstep(amount,0,1);
  const active=t>0;
  scan.geometry=active?shell:original;
  group.visible=active;
  if(!active)return;
  for(const {plate,center,front,region} of pieces){
   plate.position.copy(center).addScaledVector(front,t*(region===0?.031:.027));
   plate.position.x-=t*.004;
   plate.scale.setScalar(1-t*.082);
   plate.rotation.z=t*(region%2?-.046:.040);
  }
  green.opacity=t*.87;nodes.material.opacity=t*.85;

  light.intensity=t*.014;
 };
}




