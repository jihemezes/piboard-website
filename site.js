/* PiBoard — onglets de familles et popup de detail des tuiles. */
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
