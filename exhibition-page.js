import {createProjectDetail} from './project-detail.js';
import {kenyaCase} from './kenya-case.js';
export const exhibitionProjects = [
 {id:'kenya',category:'EXHIBITION ENVIRONMENT',title:'Kenya Exhibition Hall Design',zh:'肯尼亚展厅设计',image:'./assets/exhibition/kenya-hall.png',position:'72% center',detail:'kenya',missing:'待补充：EMPTECH 企业介绍展墙与参观走廊效果图'},
 {id:'clarciev',category:'BOOTH DESIGN',title:'CLARCIEV 2026 Booth Design',zh:'CLARCIEV 2026展台设计',image:'./assets/exhibition/clarciev-booth.png',position:'center',detail:null,missing:'待补充：CLARCIEV 2026 展台整体效果图'},
 {id:'nanshan',category:'EVENT DESIGN',title:'Shenzhen Nanshan Recruitment Fair',zh:'深圳南山招聘会',image:'./assets/exhibition/nanshan-fair.png',position:'center',detail:null,missing:'待补充：“雄心壮志，帝造未来”主视觉'},
 {id:'icao',category:'EVENT GRAPHIC SYSTEM',title:'ICAO 2026 Trade Show',zh:'ICAO 2026展会设计',image:'./assets/exhibition/icao-backdrop.jpg',position:'center 40%',detail:null}
];

// Keep the original FORM index, media and camera mounted while this view is open.
export function createExhibitionPage({background}) {
 const casePage=createProjectDetail();
 const page=document.createElement('dialog');page.className='exhibition-page';page.setAttribute('aria-labelledby','exhibition-title');
 const header=document.createElement('header');header.className='exhibition-header';
 header.innerHTML='<div class="exhibition-heading"><p class="exhibition-section">FORM / SELECTED WORK 01</p><h1 id="exhibition-title">EXHIBITION DESIGN</h1><p class="exhibition-intro">Translating brand narratives into physical environments, creating immersive spaces that communicate, demonstrate, and connect with global audiences.</p></div><button class="exhibition-back" type="button">← BACK TO INDEX</button>';
 const grid=document.createElement('div');grid.className='exhibition-grid';
 const node=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls;if(text)e.textContent=text;return e;};
 function artwork(data){
  const area=node('div','exhibition-artwork');
  if(data.image){
   const img=node('img','exhibition-image-original');img.src=data.image;img.alt=data.zh;img.decoding='async';img.style.objectPosition=data.position;area.append(img);}
  else{area.classList.add('is-missing');area.append(node('span','exhibition-missing',data.missing));}
  return area;
 }
 function arrow(data){
  // Set detail to a real route when its detail page is ready; never invent one.
  const a=node(data.detail?'a':'button','exhibition-arrow');
  const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');
  icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('fill','none');icon.setAttribute('stroke','currentColor');icon.setAttribute('stroke-width','1.5');icon.setAttribute('stroke-linecap','round');icon.setAttribute('stroke-linejoin','round');icon.setAttribute('aria-hidden','true');icon.setAttribute('focusable','false');
  const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M7 17 17 7M7 7h10v10');icon.append(path);a.append(icon);a.setAttribute('aria-label',data.zh+'：'+(data.detail?'查看作品':'详情尚未接入'));
  if(data.detail){a.href='#project/'+data.detail;a.onclick=event=>{event.preventDefault();event.stopPropagation();casePage.open(kenyaCase,a);};}else{a.type='button';a.disabled=true;}
  return a;
 }
 for(const data of exhibitionProjects){
  const card=node('article','exhibition-card exhibition-'+data.id);card.dataset.project=data.id;
  const copy=node('div','exhibition-card-copy');copy.append(node('p','exhibition-category',data.category),node('h2','',data.title),node('p','exhibition-zh',data.zh));card.append(copy);
  if(data.children){for(const child of data.children){const sub=node('section','exhibition-subproject');sub.append(artwork(child));const caption=node('div','exhibition-subcaption');caption.append(node('h3','',child.title),node('p','exhibition-zh',child.zh),arrow(child));sub.append(caption);card.append(sub);}}
  else card.append(artwork(data),arrow(data));
  if(data.detail==='kenya'){
   card.tabIndex=0;card.setAttribute('aria-label','查看 Kenya Exhibition Hall Design 案例');
   card.addEventListener('click',event=>{if(!event.target.closest('a,button'))casePage.open(kenyaCase,card);});
   card.addEventListener('keydown',event=>{if(event.target===card&&(event.key==='Enter'||event.key===' ')){event.preventDefault();casePage.open(kenyaCase,card);}});
  }
  grid.append(card);
 }
 page.append(header,grid);document.body.append(page);
 let origin=null,previousInert=false;
 function close(){page.close();background.inert=previousInert;origin?.focus();}
 page.querySelector('.exhibition-back').onclick=close;
 page.addEventListener('cancel',event=>{event.preventDefault();close();});
 return {open(button){origin=button;previousInert=background.inert;background.inert=true;page.showModal();page.scrollTop=0;page.querySelector('.exhibition-back').focus();}};
}
