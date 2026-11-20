import * as THREE from 'three';

export function createSignalHover(scan){
 const group=new THREE.Group();
 scan.add(group);
 group.visible=false;
 const amount={value:0}, clock={value:0};
 const rings=[];
 function ringPoint(theta,index){
  const radius=.315+index*.025;
  return new THREE.Vector3(
   -.17+Math.cos(theta)*radius,
   1.295-index*.127+Math.cos(theta)*(.053-index*.035)+Math.sin(theta)*(.032+index*.014)+.016*Math.sin(theta*2+index),
   .035+Math.sin(theta)*(.365+index*.017)
  );
 }
 function band(index,halo){
  const positions=[],uv=[],indices=[],segments=180;
  for(let i=0;i<=segments;i++){
   const theta=i/segments*Math.PI*2,p=ringPoint(theta,index);
   const patch=Math.pow(.5+.5*Math.sin(theta*2.0+index*1.7),3);
   const width=(halo?.018:.0075)*( .47+patch*1.47);
   const twist=.68*Math.sin(theta*1.8+index*.9);
   const across=new THREE.Vector3(Math.cos(theta)*Math.sin(twist),Math.cos(twist),Math.sin(theta)*Math.sin(twist));
   for(const side of [-1,1]){
    const vertex=p.clone().addScaledVector(across,side*width);
    positions.push(vertex.x,vertex.y,vertex.z);
    uv.push(i/segments,(side+1)/2);
   }
   if(i<segments){const j=i*2;indices.push(j,j+2,j+1,j+1,j+2,j+3);}
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  geometry.setIndex(indices);
  const material=new THREE.ShaderMaterial({
   transparent:true,depthWrite:false,side:THREE.DoubleSide,
   uniforms:{amount,clock,layer:{value:index},halo:{value:halo?1:0}},
   vertexShader:`
    varying vec2 vUv;
    void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
   `,
   fragmentShader:`
    uniform float amount,clock,layer,halo;
    varying vec2 vUv;
    void main(){
     float phase=fract(vUv.x-clock*(.019+layer*.003)+layer*.21);
     float spot=exp(-pow((phase-.37)/.031,2.));
     float highlight=exp(-pow((phase-.72)/.013,2.));
     float edge=1.-abs(vUv.y*2.-1.);
     float envelope=mix(.34,.84,.5+.5*sin(vUv.x*6.283+layer*2.));
     float rim=exp(-pow((abs(vUv.y-.5)-.36)/.057,2.));
     float alpha=amount*envelope*mix(.36+rim*.53,.11,halo)*pow(edge,mix(.22,1.4,halo));
     vec3 color=mix(vec3(.086,.545,1.),vec3(.45,.875,1.),spot*.72+highlight*.27);
     color*=1.+spot*.76;
     gl_FragColor=vec4(color,alpha);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
    }
   `
  });
  return new THREE.Mesh(geometry,material);
 }
 for(let i=0;i<3;i++){
  const pivot=new THREE.Group();
  pivot.position.set(-.17,1.295-i*.127,.035);
  for(const halo of [false,true]){
   const mesh=band(i,halo);
   mesh.position.copy(pivot.position).negate();
   pivot.add(mesh);
  }
  group.add(pivot);rings.push(pivot);
 }

 // Reuse precisely the scanned neck triangles and normals, with a submillimetric offset.
 const original=scan.geometry,position=original.attributes.position,normal=original.attributes.normal;
 const surfacePosition=[],surfaceNormal=[];
 for(let i=0;i<original.index.count;i+=3){
  const ids=[0,1,2].map(j=>original.index.getX(i+j));
  const c=ids.reduce((sum,id)=>sum.add(new THREE.Vector3().fromBufferAttribute(position,id)),new THREE.Vector3()).divideScalar(3);
  if(c.y<.81||c.y>1.46||c.x<-.65||c.x>.33||c.z<-.15)continue;
  const facing=ids.reduce((sum,id)=>sum+normal.getZ(id),0)/3;
  if(facing<.12)continue;
  for(const id of ids){
   const p=new THREE.Vector3().fromBufferAttribute(position,id);
   const n=new THREE.Vector3().fromBufferAttribute(normal,id);
   p.addScaledVector(n,.002);
   surfacePosition.push(...p);surfaceNormal.push(...n);
  }
 }
 const geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(surfacePosition,3));
 geometry.setAttribute('normal',new THREE.Float32BufferAttribute(surfaceNormal,3));
 const optical=new THREE.ShaderMaterial({
  transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1,
  uniforms:{amount,clock},
  vertexShader:`
   varying vec3 stone;
   void main(){stone=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
  `,
  fragmentShader:`
   uniform float amount,clock;
   varying vec3 stone;
   void main(){
    float y=stone.y;
    float neck=clamp((y-.91)/.51,0.,1.);
    float spread=.115+.109*neck+.21*pow(1.-neck,3.);
    float center=-.17+.029*sin(neck*3.14159);
    float u=(stone.x-center)/spread;
    // Fan the optical coordinates over the collarbone and follow the two SCM ridges.
    float curl=.075*sin(neck*5.2+u*1.8)+stone.z*.38*sin(neck*3.14159);
    float optical=(u+curl)*11.3;
    float grid=abs(fract(optical)-.5);
    float aa=max(fwidth(optical),.014);
    float lines=1.-smoothstep(.018,.018+aa,grid);
    float varied=.32+.48*(.5+.5*sin(floor(optical)*2.399));
    float rowCoordinate=(y+.017*sin(u*3.6))*64.;
    float rows=abs(fract(rowCoordinate)-.5);
    float horizontal=1.-smoothstep(.018,.018+fwidth(rowCoordinate),rows);
    float selection=step(.80,fract(optical*.173+y*1.7));
    float dots=(1.-smoothstep(.065,.12,grid))*(1.-smoothstep(.075,.14,rows))*selection;
    float edge=smoothstep(.875,.97,y)*(1.-smoothstep(1.37,1.46,y));
    edge*=1.-smoothstep(.84,1.18,abs(u));
    float moving=fract((1.44-y)/.50-clock*.065);
    float scan=exp(-pow((moving-.30)/.064,2.));
    float muscle=exp(-pow((abs(u)-(.26+.43*neck))/.045,2.));
    float centerLine=exp(-pow((u+.027*sin(neck*7.))/.019,2.));
    float activation=smoothstep((1.-neck)*.32,(1.-neck)*.32+.33,amount);
    float alpha=(lines*.36*varied+horizontal*.13*selection+dots*.42+
     muscle*(.12+.32*scan)+centerLine*.19*scan+scan*.028)*activation*edge;
    vec3 color=mix(vec3(.045,.39,1.),vec3(.45,.875,1.),max(dots,scan*.72));
    gl_FragColor=vec4(color,alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }
  `
 });
 group.add(new THREE.Mesh(geometry,optical));
 const dotGeometry=new THREE.BufferGeometry();
 const dotPosition=new Float32Array(9);
 dotGeometry.setAttribute('position',new THREE.BufferAttribute(dotPosition,3));
 const dotMaterial=new THREE.PointsMaterial({
  color:0x9aeaff,size:.008,transparent:true,opacity:0,depthWrite:false,
  onBeforeCompile(shader){
   shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`
    #include <color_fragment>
    float radius=length(gl_PointCoord-.5)*2.;
    diffuseColor.a*=1.-smoothstep(.25,1.,radius);
   `);
  }
 });
 const dots=new THREE.Points(dotGeometry,dotMaterial);
 dots.frustumCulled=false;group.add(dots);
 // The junction and its collarbone branches are ray-projected onto the scan.
 const ray=new THREE.Raycaster();
 const probe=new THREE.Mesh(original,scan.material);
 const direction=new THREE.Vector3(0,0,-1);
 function surface(x,y){
  ray.set(new THREE.Vector3(x,y,2),direction);
  const hit=ray.intersectObject(probe,false)[0];
  return hit?hit.point.addScaledVector(hit.face.normal,.003):null;
 }
 const convergence=surface(-.155,.963);
 const junctionMaterial=new THREE.ShaderMaterial({
  transparent:true,depthWrite:false,
  uniforms:{amount,clock},
  vertexShader:`
   uniform float amount;
   void main(){
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
    gl_PointSize=18.;
   }
  `,
  fragmentShader:`
   uniform float amount,clock;
   void main(){
    float radius=length(gl_PointCoord-.5)*2.;
    float glow=exp(-radius*radius*6.)*(1.-smoothstep(.65,1.,radius));
    float core=exp(-radius*radius*65.);
    float strength=smoothstep(.42,1.,amount)*(.87+.13*sin(clock*1.2));
    gl_FragColor=vec4(mix(vec3(.05,.46,1.),vec3(.63,.94,1.),core),glow*strength*.63);
   }
  `
 });
 const junction=new THREE.Points(new THREE.BufferGeometry().setFromPoints(convergence?[convergence]:[]),junctionMaterial);
 group.add(junction);
 const collarMaterial=new THREE.LineBasicMaterial({color:0x63ceff,transparent:true,opacity:0,depthWrite:false});
 for(const sign of [-1,1]){
  const paths=[];
  for(let i=0;i<30;i++){
   const t=i/29,x=-.155+sign*t*.32,y=.963-.038*t+.022*Math.sin(t*Math.PI);
   const p=surface(x,y);
   if(p)paths.push(p);
  }
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(paths),collarMaterial));
 }
 const wash=new THREE.PointLight(0x168bff,0,.66,2);
 wash.position.set(-.17,1.13,.20);group.add(wash);

 return function update(level,time,reduced){
  const t=THREE.MathUtils.smootherstep(level,0,.56);
  group.visible=t>.0001;
  amount.value=t;clock.value=reduced?0:time;
  dotMaterial.opacity=t*.77;
  wash.intensity=t*.016;
  collarMaterial.opacity=THREE.MathUtils.smoothstep(t,.40,1)*.25;
  if(!group.visible)return;
  for(let i=0;i<3;i++){
   const rotation=reduced?0:.015*Math.sin(time*.35+i*1.6);
   rings[i].rotation.z=rotation;
   const p=ringPoint((reduced?0:time*(.115+i*.019))+i*2.1,i);
   p.sub(rings[i].position).applyEuler(rings[i].rotation).add(rings[i].position);
   dotGeometry.attributes.position.setXYZ(i,p.x,p.y,p.z);
  }
  dotGeometry.attributes.position.needsUpdate=true;
 };
}



