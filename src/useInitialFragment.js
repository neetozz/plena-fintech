import {useLayoutEffect} from 'react';

// Los destinos son elementos funcionales, sin offsets: el nav no es fijo.
export function useInitialFragment(){
 useLayoutEffect(()=>{
  const targetFor=hash=>{
   try{return hash?document.getElementById(decodeURIComponent(hash.slice(1))):null}catch{return null}
  };
  // Algunos motores no vuelven a desplazar al activar el mismo fragmento.
  // Sólo ese caso necesita ayuda; los demás enlaces conservan su acción nativa.
  const repeat=e=>{
   if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
   const link=e.target.closest?.('a[href]');
   if(!link||link.target||link.hasAttribute('download'))return;
   const url=new URL(link.href);
   if(url.origin!==location.origin||url.pathname!==location.pathname||url.search!==location.search||url.hash!==location.hash)return;
   const target=targetFor(url.hash);
   if(!target)return;
   e.preventDefault();
   target.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
   target.focus({preventScroll:true});
  };
  document.addEventListener('click',repeat);
  const hash=window.location.hash,target=targetFor(hash);
  let interrupted=false;
  const cancel=()=>{interrupted=true};
  const events=['pointerdown','wheel','touchstart','keydown'];
  if(target){
   const align=()=>target.scrollIntoView({block:'start',behavior:'instant'});
   align();
   events.forEach(type=>window.addEventListener(type,cancel,{once:true,passive:true}));
   document.fonts?.ready.then(()=>{if(!interrupted&&window.location.hash===hash)align()});
  }
  return ()=>{
   interrupted=true;
   document.removeEventListener('click',repeat);
   events.forEach(type=>window.removeEventListener(type,cancel));
  };
 },[]);
}
