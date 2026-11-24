const node=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls;if(text)n.textContent=text;return n;};
export function createProjectDetail(){
 const page=node('dialog','case-page');page.setAttribute('aria-labelledby','case-title');document.body.append(page);
 const lightbox=node('dialog','case-lightbox');lightbox.setAttribute('aria-label','项目图片放大预览');document.body.append(lightbox);
 let origin,observer;
 function close(){lightbox.open&&lightbox.close();observer?.disconnect();page.close();origin?.focus({preventScroll:true});}
 function image(data,caption){
  const figure=node('figure','case-image');
  if(data?.src){const button=node('button','case-image-button');button.type='button';button.setAttribute('aria-label','放大：'+data.alt);const img=node('img','');img.src=data.src;img.alt=data.alt;img.decoding='async';if(data.aspectRatio){button.style.aspectRatio=data.aspectRatio;img.style.height='100%';img.style.objectFit='contain';}button.append(img);button.onclick=()=>{const large=node('img','');large.src=data.src;large.alt=data.alt;const exit=node('button','case-lightbox-close','× CLOSE');exit.type='button';exit.onclick=()=>lightbox.close();lightbox.replaceChildren(exit,large);lightbox.showModal();exit.focus();};figure.append(button);}
  else figure.append(node('div','case-missing',caption+' · 待补充确认素材'));
  if(data?.fit)figure.dataset.fit=data.fit;if(caption)figure.append(node('figcaption','',caption));return figure;
 }
 function section(number,label,title,zh){const s=node('section','case-section case-reveal');s.append(node('p','case-label',number+' / '+label));if(title)s.append(node('h2','',title));if(zh)s.append(node('p','case-subtitle',zh));return s;}
 function render(data){
  page.replaceChildren();const nav=node('nav','case-nav');nav.append(node('span','case-label',data.eyebrow));const back=node('button','case-back','← BACK TO EXHIBITION DESIGN');back.type='button';back.onclick=close;nav.append(back);page.append(nav);
  const hero=node('header','case-hero');hero.append(node('p','case-label','01 / HERO'));const title=node('h1','',data.title);title.id='case-title';hero.append(title,node('p','case-hero-zh',data.zh),image(data.hero,'企业介绍墙 / 空间效果'));page.append(hero);
  const overview=section('02','PROJECT OVERVIEW','A narrative in physical space.','项目概览');overview.append(node('p','case-body',data.overview.intro));const dl=node('dl','case-facts');for(const [label,value] of [['项目名称',data.overview.name],['项目类型',data.overview.type],['项目年份',data.overview.year],['设计职责',data.overview.role??'待确认']]){const group=node('div','');group.append(node('dt','',label),node('dd','',value));dl.append(group);}overview.append(dl);page.append(overview);
  const challenge=section('03','THE CHALLENGE',data.challenge.title,data.challenge.zh);challenge.append(node('p','case-body',data.challenge.text));const facts=node('div','case-metrics');for(const [v,l] of data.challenge.facts){const m=node('div','');m.append(node('strong','',v),node('span','',l));facts.append(m);}challenge.append(facts,image(data.challenge.image,'空间限制与阅读高度分析'),node('p','case-source',data.challenge.source));page.append(challenge);
  const strategy=section('04','DESIGN STRATEGY',data.strategy.title,data.strategy.zh);const split=node('div','case-split');const copy=node('div','case-sticky');copy.append(node('p','case-body',data.strategy.text));const list=node('ul','case-list');data.strategy.points.forEach(t=>list.append(node('li','',t)));copy.append(list);split.append(copy,image(data.strategy.image,'参观动线与区域划分'));strategy.append(split);page.append(strategy);
  const process=section('05','DESIGN DEVELOPMENT','From surface to space.','从展墙设计到空间应用');data.process.forEach((p,i)=>{const item=node('article','case-process');const text=node('div','');text.append(node('p','case-label',String(i+1).padStart(2,'0')+' / '+p.zh),node('h3','',p.title),node('p','case-body',p.text),node('p','case-source',p.source));const gallery=node('div','case-process-images');gallery.append(image(p.design,'展墙设计'),image(p.scene,'空间应用'));item.append(text,gallery);process.append(item);});page.append(process);
  const final=section('06','FINAL EXPERIENCE','An environment to explore.','最终空间体验');const gallery=node('div','case-gallery');gallery.append(image(data.hero,'企业介绍展墙与走廊'));data.gallery.forEach(x=>gallery.append(image(x,x.alt)));final.append(gallery);page.append(final);
  const footer=node('footer','case-footer');const exit=node('button','case-back case-exit','← BACK TO EXHIBITION DESIGN');exit.type='button';exit.onclick=close;footer.append(exit);page.append(footer);
 }
 page.addEventListener('cancel',event=>{event.preventDefault();close();});
 lightbox.addEventListener('click',event=>{if(event.target===lightbox)lightbox.close();});
 // Keep Escape inside the case/lightbox instead of resetting the sculpture beneath it.
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&page.open){event.stopImmediatePropagation();event.preventDefault();if(lightbox.open)lightbox.close();else close();}},true);
 return {open(data,trigger){origin=trigger;render(data);page.showModal();page.scrollTop=0;page.querySelector('.case-back').focus({preventScroll:true});if(!matchMedia('(prefers-reduced-motion: reduce)').matches){observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{root:page,threshold:.06});page.querySelectorAll('.case-reveal').forEach(x=>observer.observe(x));}else page.querySelectorAll('.case-reveal').forEach(x=>x.classList.add('is-visible'));}};
}
