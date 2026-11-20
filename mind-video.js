const firstVisibleTime=.04;
const startupLimit=2600;
const stallLimit=3600;

export function createMindVideo({layer,plane,video,still,source,endFrame,fallback,getLandmarks,onCover,onInteractive,startTime=firstVisibleTime}){
 let state='idle',attempt=0,covering=false,failed=false,stillDecoded=false,timer=0,videoFrame=0;

 still.src=endFrame;
 still.decode().catch(()=>{
  still.src=fallback;
  return still.decode();
 }).then(()=>{
  stillDecoded=true;
  if(state==='interactive')showStill();
 },()=>{});

 let mapping, width=0, height=0, lastTime=-1;
 function layout(){
  width=layer.clientWidth;
  height=layer.clientHeight;
  const sourceWidth=video.videoWidth||1758;
  const sourceHeight=video.videoHeight||1080;
  const coverScale=Math.max(width/sourceWidth,height/sourceHeight);
  const zoomed={scale:coverScale,x:(width-sourceWidth*coverScale)/2,y:(height-sourceHeight*coverScale)/2};
  const samples=getLandmarks?.()||[];
  const mean=(kind,axis)=>samples.reduce((sum,m)=>sum+m[kind][axis],0)/samples.length;
  let aligned=zoomed;
  if(samples.length){
   const sx=mean('source',0),sy=mean('source',1),tx=mean('screen',0),ty=mean('screen',1);
   let cross=0,squared=0;
   for(const {source:[x,y],screen:[u,v]} of samples){
    const dx=x-sx,dy=y-sy;
    cross+=dx*(u-tx)+dy*(v-ty);
    squared+=dx*dx+dy*dy;
   }
   const scale=Math.min(coverScale,cross/squared);
   aligned={scale,x:tx-sx*scale,y:ty-sy*scale};
  }
  mapping={aligned,zoomed};
  plane.style.width=sourceWidth+'px';
  plane.style.height=sourceHeight+'px';
 }
 function position(time,final=false){
  if(!mapping||width!==layer.clientWidth||height!==layer.clientHeight){layout();lastTime=-1;}
  const key=final?Infinity:time;
  if(key===lastTime)return;
  lastTime=key;
  const duration=Number.isFinite(video.duration)?video.duration:5.085;
  const t=final?1:Math.max(0,Math.min(1,(time-.10)/Math.max(.1,duration-.44)));
  const eased=t*t*(3-2*t);
  const {aligned,zoomed}=mapping;
  const mix=(from,to)=>from+(to-from)*eased;
  plane.style.transform='translate('+mix(aligned.x,zoomed.x)+'px,'+mix(aligned.y,zoomed.y)+'px) scale('+mix(aligned.scale,zoomed.scale)+')';
  plane.style.setProperty('--side-feather',7*(1-eased)+'%');
  plane.style.setProperty('--top-feather',5*(1-eased)+'%');
  plane.style.setProperty('--base-feather',2.6*(1-eased)+'%');
 }

 function cancelPending(){
  clearTimeout(timer);
  timer=0;
  if(videoFrame){
   video.cancelVideoFrameCallback?.(videoFrame);
   videoFrame=0;
  }
 }
 function setState(next){
  state=next;
  layer.dataset.state=next;
 }
 function cover(videoFrame=false){
  if(covering)return;
  covering=true;
  onCover(videoFrame);
 }
 function showStill(){
  cover();
  layer.classList.add('has-still');
 }
 function finish(){
  if(state!=='playing')return;
  cancelPending();
  video.pause();
  position(video.currentTime,true);
  setState('handoff');
  // Keep the displayed video frame if the still has not finished decoding.
  if(stillDecoded)showStill();
  setState('interactive');
  onInteractive();
 }
 function watchProgress(limit){
  clearTimeout(timer);
  timer=setTimeout(finish,limit);
 }
 function present(){
  if(state!=='playing'||covering||video.paused||video.seeking||
    video.readyState<HTMLMediaElement.HAVE_CURRENT_DATA)return;
  position(video.currentTime);
  cover(true);
  layer.classList.add('has-video-frame');
 }
 function prime(){
  if(state==='idle'&&video.currentTime<startTime)video.currentTime=startTime;
 }
 video.defaultMuted=true;
 video.muted=true;
 video.playsInline=true;
 video.addEventListener('loadedmetadata',prime);
 video.addEventListener('playing',()=>{
  if(state==='playing'&&!video.requestVideoFrameCallback&&video.currentTime>=startTime)present();
 });
 video.addEventListener('timeupdate',()=>{
  if(state!=='playing')return;
  if(!video.requestVideoFrameCallback&&video.currentTime>=startTime)present();
  watchProgress(covering?stallLimit:startupLimit);
 });
 video.addEventListener('ended',finish);
 video.addEventListener('error',()=>{
  failed=true;
  finish();
 });
 function preload(){
  if(!video.hasAttribute('src'))video.src=source;
 }
 return {
  get covering(){return covering;},
  preload,
  update(){
   if(covering)position(video.currentTime,state==='interactive');
  },
  play(skip){
   if(state!=='idle')return;
   attempt++;
   mapping=null;
   setState('playing');
   if(skip||failed){finish();return;}
   preload();
   const current=attempt;
   if(video.readyState>=HTMLMediaElement.HAVE_METADATA&&video.currentTime<startTime){
    video.currentTime=startTime;
   }
   if(video.requestVideoFrameCallback){
    const frame=(_,metadata)=>{
     if(current!==attempt||state!=='playing')return;
     if(metadata.mediaTime>=startTime-.012)present();
     if(!covering)videoFrame=video.requestVideoFrameCallback(frame);
     else videoFrame=0;
    };
    videoFrame=video.requestVideoFrameCallback(frame);
   }
   watchProgress(startupLimit);
   video.play().catch(()=>{if(current===attempt)finish();});
  },
  reset(){
   attempt++;
   cancelPending();
   setState('idle');
   video.pause();
   layer.classList.remove('has-video-frame','has-still');
   if(video.readyState>=HTMLMediaElement.HAVE_METADATA)video.currentTime=startTime;
   covering=false;
  }
 };
}
