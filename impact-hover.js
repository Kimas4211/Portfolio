import * as THREE from 'three';

// The scan stays intact. Thin, closed optical surfaces unfold from the hand.
export function createImpactHover(scan){
 const group=new THREE.Group();
 scan.add(group);
 group.visible=false;
 const clock={value:0},activation={value:0};
 const material=new THREE.ShaderMaterial({
  transparent:true,depthWrite:false,side:THREE.DoubleSide,
  uniforms:{clock,activation},
  vertexShader:`
   uniform float clock,activation;
   varying vec2 coordinate;
   varying vec3 viewPoint;
   void main(){
    coordinate=uv;
    vec3 p=position;
    float root=smoothstep(0.,.24,uv.x);
    p.y+=root*.007*sin(uv.x*8.+uv.y*3.+clock*.61);
    p.z+=root*.009*sin(uv.x*6.-clock*.43);
    vec4 viewed=modelViewMatrix*vec4(p,1.);
    viewPoint=viewed.xyz;
    gl_Position=projectionMatrix*viewed;
   }`,
  fragmentShader:`
   uniform float clock,activation;
   varying vec2 coordinate;
   varying vec3 viewPoint;
   void main(){
    vec3 n=normalize(cross(dFdx(viewPoint),dFdy(viewPoint)));
    float fresnel=pow(1.-abs(dot(n,normalize(-viewPoint))),2.2);
    float across=abs(coordinate.y*2.-1.);
    float rim=smoothstep(.70,.98,across);
    float endRim=smoothstep(.94,.995,coordinate.x);
    float longitudinal=smoothstep(0.,.07,coordinate.x)*(1.-smoothstep(.96,1.,coordinate.x));
    float activationFront=1.-smoothstep(activation*1.4-.15,activation*1.4+.06,coordinate.x);
    float fold=.5+.5*sin(coordinate.y*13.+coordinate.x*10.-clock*.41);
    float caustic=pow(fold,16.)*(.68+.32*sin(coordinate.x*12.+clock*.47));
    float glass=.075+fresnel*.20+rim*.60+caustic*.18+endRim*.15;
    float alpha=glass*activation*activationFront*longitudinal;
    vec3 violet=mix(vec3(.20,.025,.54),vec3(.44,.105,1.),fold*.59+fresnel*.29);
    violet=mix(violet,vec3(.80,.53,1.),clamp(rim*.83+caustic*.48+fresnel*.30,0.,1.));
    gl_FragColor=vec4(violet,alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`
 });
 const waves=[];
 function opticalSurface(points,widths,twist,index){
  const path=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  const positions=[],uv=[],indices=[],rows=64,columns=10,stride=(columns+1)*2;
  for(let row=0;row<=rows;row++){
   const t=row/rows,point=path.getPoint(t),tangent=path.getTangent(t);
   const across=new THREE.Vector3(0,0,1).cross(tangent).normalize();
   across.applyAxisAngle(tangent,twist*t+.28*Math.sin(t*6+index));
   const n=new THREE.Vector3().crossVectors(tangent,across).normalize();
   const k=t*(widths.length-1),segment=Math.min(widths.length-2,Math.floor(k));
   const width=THREE.MathUtils.lerp(widths[segment],widths[segment+1],k-segment);
   for(const side of [-1,1])for(let j=0;j<=columns;j++){
    const u=j/columns*2-1;
    const fold=width*(.28*Math.sin(u*2.8+t*4.5)+.11*Math.cos(u*7-t*8));
    const vertex=point.clone().addScaledVector(across,u*width*(1+.06*Math.sin(t*19+u*3)))
     .addScaledVector(n,fold+side*.0025);
    positions.push(...vertex);uv.push(t,j/columns);
   }
   if(row===rows)continue;
   const start=row*stride,next=start+stride,half=columns+1;
   for(let j=0;j<columns;j++){
    indices.push(start+j,next+j,start+j+1,start+j+1,next+j,next+j+1);
    indices.push(start+half+j,start+half+j+1,next+half+j,
     start+half+j+1,next+half+j+1,next+half+j);
   }
   for(const j of [0,columns]){
    indices.push(start+j,start+half+j,next+j,next+j,start+half+j,next+half+j);
   }
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  geometry.setIndex(indices);
  const mesh=new THREE.Mesh(geometry,material);
  mesh.frustumCulled=false;group.add(mesh);
  waves.push({mesh,root:new THREE.Vector3(...points[0]),index});
 }
 opticalSurface([[.388,.999,.49],[.497,1.001,.67],[.749,1.054,.73],[1.018,1.031,.57],[1.215,1.126,.31]],
  [.003,.038,.096,.053,.002],1.75,0);
 opticalSurface([[.453,.862,.50],[.585,.838,.72],[.811,.788,.79],[1.074,.716,.67],[1.227,.799,.42]],
  [.002,.049,.115,.067,.002],-1.83,1);
 opticalSurface([[.485,.829,.21],[.626,.758,.23],[.841,.640,.39],[1.011,.573,.48]],
  [.002,.029,.062,.002],1.35,2);

 const probe=new THREE.Mesh(scan.geometry,scan.material),ray=new THREE.Raycaster();
 const direction=new THREE.Vector3(0,0,-1);
 function surface(x,y,lift=.003){
  ray.set(new THREE.Vector3(x,y,2),direction);
  const hit=ray.intersectObject(probe,false)[0];
  return hit?hit.point.addScaledVector(hit.face.normal,lift):null;
 }
 const traceMaterial=new THREE.LineBasicMaterial({color:0xc58aff,transparent:true,opacity:0,depthWrite:false});
 for(const anchors of [
  [[.30,1.10],[.324,1.058],[.309,1.005],[.333,.965],[.408,.889],[.464,.829]],
  [[.383,1.064],[.419,1.02],[.409,.967],[.446,.917],[.478,.859]]
 ]){
  const curve=new THREE.CatmullRomCurve3(anchors.map(([x,y])=>new THREE.Vector3(x,y,0)));
  const points=curve.getPoints(70).map(p=>surface(p.x,p.y)).filter(Boolean);
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),traceMaterial));
 }
 const facets=[];
 for(const [x,y,size,angle] of [[.326,1.039,.024,-.31],[.404,.982,.031,.37],[.449,.921,.022,-.25]]){
  const p=surface(x,y,.009);
  if(!p)continue;
  const geometry=new THREE.BufferGeometry();
  const prism=[
   [-.4,-1,0],[.55,-.52,.22],[.32,.85,-.08],[-.46,.45,.03],
   [-.4,-1,-.16],[.55,-.52,.06],[.32,.85,-.24],[-.46,.45,-.13]
  ].flatMap(v=>v.map(n=>n*size));
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(prism,3));
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,.2,.8,1,0,.7,0,0,1,.2,.8,1,0,.7],2));
  geometry.setIndex([0,1,2,0,2,3,4,6,5,4,7,6,0,4,1,1,4,5,1,5,2,2,5,6,2,6,3,3,6,7,3,7,0,0,7,4]);
  const facet=new THREE.Mesh(geometry,material);
  facet.position.copy(p);facet.rotation.z=angle;
  group.add(facet);facets.push(facet);
 }
 const lights=[
  new THREE.PointLight(0x9945ff,0,.53,2),
  new THREE.PointLight(0xc58aff,0,.34,2)
 ];
 lights[0].position.set(.48,.96,.62);
 lights[1].position.set(.33,1.08,.57);
 group.add(...lights);
 let amount=0;
 return function update(level,time,dt,reduced){
  const input=Math.min(1,level/.56),target=input<.002?0:input;
  const step=reduced?1:dt/.47;
  amount+=THREE.MathUtils.clamp(target-amount,-step,step);
  const t=THREE.MathUtils.smootherstep(amount,0,1);
  group.visible=t>0;
  activation.value=t;clock.value=reduced?0:time;
  traceMaterial.opacity=t*.62;
  lights[0].intensity=t*.115;
  lights[1].intensity=t*.045;
  if(!group.visible)return;
  for(const {mesh,root,index} of waves){
   const growth=THREE.MathUtils.smoothstep(t,.13,.97);
   const scale=.19+.81*growth;
   mesh.scale.setScalar(scale);
   mesh.position.copy(root).multiplyScalar(1-scale);
   mesh.rotation.z=reduced?0:.006*Math.sin(time*.48+index*1.8)*growth;
  }
  for(const facet of facets)facet.scale.setScalar(.72+.28*THREE.MathUtils.smoothstep(t,.25,1));
 };
}

