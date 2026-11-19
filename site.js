/* PiBoard — accroches alternees de l'accueil, onglets de familles et popup de detail des tuiles. */
(function(){
var h=document.querySelector('[data-punch-seconds]');if(!h)return;
var spans=h.querySelectorAll('span'),cur=0,secs=+h.dataset.punchSeconds||6;if(spans.length<2)return;
if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)spans.forEach(function(s){s.style.transition='none';});
setInterval(function(){spans[cur].style.opacity=0;spans[cur].setAttribute('aria-hidden','true');cur=(cur+1)%spans.length;spans[cur].style.opacity=1;spans[cur].setAttribute('aria-hidden','false');},secs*1000);
})();
/* Illustration du mode classique : trois volets, un seul ouvert a la fois. */
(function(){
var root=document.querySelector('[data-classic]');if(!root)return;
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var open='left',swap=null;
var CLOSED={left:'translateX(-100%)',top:'translateY(-100%)',right:'translateX(100%)'};
var OPEN={left:'translateX(0)',top:'translateY(0)',right:'translateX(0)'};
var TAB={left:['left','42%'],top:['top','46%'],right:['right','42%']};
function apply(){
  ['left','top','right'].forEach(function(k){
    var d=root.querySelector('[data-drawer="'+k+'"]'),t=root.querySelector('[data-tab="'+k+'"]'),on=open===k;
    d.style.transform=on?OPEN[k]:CLOSED[k];d.setAttribute('aria-hidden',String(!on));
    t.style[TAB[k][0]]=on?TAB[k][1]:'0px';t.setAttribute('aria-expanded',String(on));
  });
  root.querySelector('[data-dim]').style.opacity=open?1:0;
}
root.querySelectorAll('[data-tab]').forEach(function(t){t.addEventListener('click',function(){
  root.querySelectorAll('[data-tab-bar]').forEach(function(b){b.style.animation='none';});
  var x=t.dataset.tab;clearTimeout(swap);
  if(open===x){open=null;apply();return;}
  if(open){open=null;apply();swap=setTimeout(function(){open=x;apply();},reduce?0:380);}
  else{open=x;apply();}
});});
if(reduce)root.querySelectorAll('[data-tab-bar]').forEach(function(b){b.style.animation='none';});
})();
/* Illustration du mode tableau de bord : pages a faire glisser. */
(function(){
var vp=document.querySelector('[data-dash]');if(!vp)return;
var track=vp.querySelector('[data-dash-track]'),pages=vp.querySelectorAll('[data-dash-page]'),n=pages.length;
var dots=document.querySelectorAll('[data-dash-dot]');
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var page=0,manual=false,dragging=false,startX=0,dx=0;
var anim=reduce?'none':'transform 0.5s ease';
function apply(){
  track.style.transition=dragging?'none':anim;
  track.style.transform='translateX(calc('+(-page*100/n)+'% + '+dx+'px))';
  pages.forEach(function(p,i){p.setAttribute('aria-hidden',String(i!==page));});
  dots.forEach(function(d,i){var on=i===page,b=d.firstElementChild;d.setAttribute('aria-current',String(on));b.style.width=on?'24px':'8px';b.style.background=on?'var(--accent)':'#4a555b';});
}
function go(i){page=((i%n)+n)%n;manual=true;dragging=false;dx=0;apply();}
document.querySelector('[data-dash-prev]').addEventListener('click',function(){go(page-1);});
document.querySelector('[data-dash-next]').addEventListener('click',function(){go(page+1);});
dots.forEach(function(d,i){d.addEventListener('click',function(){go(i);});});
vp.addEventListener('pointerdown',function(e){startX=e.clientX;dx=0;dragging=true;manual=true;try{vp.setPointerCapture(e.pointerId);}catch(err){}apply();});
vp.addEventListener('pointermove',function(e){if(!dragging)return;dx=e.clientX-startX;apply();});
function up(){if(!dragging)return;var d=dx;if(d<-50)go(page+1);else if(d>50)go(page-1);else{dragging=false;dx=0;apply();}}
vp.addEventListener('pointerup',up);vp.addEventListener('pointercancel',up);
vp.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(page+1);}else if(e.key==='ArrowLeft'){e.preventDefault();go(page-1);}});
var secs=+vp.dataset.dashSeconds||5;
if(!reduce)setInterval(function(){if(manual)return;page=(page+1)%n;apply();},secs*1000);
})();
(function(){
var cat=window.PIBOARD_CATALOG;if(!cat)return;
var tabs=document.querySelectorAll('.fam-tab'),panels=document.querySelectorAll('[data-panel]');
function pick(i){
  tabs.forEach(function(t){var on=+t.dataset.fam===i;t.setAttribute('aria-selected',on);
    t.style.borderColor=on?'var(--accent)':'#3a4348';t.style.background=on?'var(--accent)':'transparent';t.style.color=on?'#10130f':'#e9edef';});
  panels.forEach(function(p){p.hidden=+p.dataset.panel!==i;});
}
tabs.forEach(function(t){t.addEventListener('click',function(){pick(+t.dataset.fam);});});
var modal=document.getElementById('tile-modal'),last=null;
function shot(id,n){
  var img=new Image();img.alt='';img.src=window.PIBOARD_IMG+id+'-'+n+'.jpg';
  img.onerror=function(){var d=document.createElement('div');d.className='shot-missing';d.textContent=window.PIBOARD_MISSING+id+'-'+n+'.jpg]';img.replaceWith(d);};
  return img;
}
function open(f,i,from){
  var fam=cat[f],t=fam.tiles[i];last=from;
  document.getElementById('tile-modal-fam').textContent=fam.label;
  document.getElementById('tile-modal-title').textContent=t.name;
  var s=document.getElementById('tile-modal-shots');s.textContent='';s.appendChild(shot(t.id,1));s.appendChild(shot(t.id,2));
  var x=document.getElementById('tile-modal-text');x.textContent='';
  t.paras.forEach(function(p){var e=document.createElement('p');e.textContent=p;x.appendChild(e);});
  document.getElementById('tile-modal-req').textContent=t.req;
  modal.hidden=false;document.body.style.overflow='hidden';modal.querySelector('.modal-x').focus();
}
function close(){modal.hidden=true;document.body.style.overflow='';if(last)last.focus();}
document.querySelectorAll('.tile-card').forEach(function(b){b.addEventListener('click',function(){open(+b.dataset.fam,+b.dataset.tile,b);});});
modal.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',close);});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!modal.hidden)close();});
})();
