import React,{useEffect,useRef} from 'react';

export default function Navigation({Brand}){
 const menu=useRef(null);
 const close=()=>{if(menu.current)menu.current.open=false};
 useEffect(()=>{
  const outside=e=>{if(menu.current&&!menu.current.contains(e.target))close()};
  document.addEventListener('pointerdown',outside);
  return ()=>document.removeEventListener('pointerdown',outside);
 },[]);
 const links=<><a href="#tarjeta">La tarjeta</a><a href="#demo">Tu espacio</a><a href="#simulador">Tus metas</a></>;
 return <header className="nav-wrap"><nav aria-label="Navegación principal"><a href="#" aria-label="Plena, inicio"><Brand/></a><div className="nav-links">{links}</div><a className="nav-cta" href="#demo">Probar la demo <span>↗</span></a><details className="mobile-navigation" ref={menu} onKeyDown={e=>{if(e.key==='Escape'&&menu.current.open){close();menu.current.querySelector('summary').focus();e.preventDefault()}}}><summary aria-label="Menú de navegación"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg></summary><div className="mobile-navigation-links" onClick={e=>{if(e.target.closest('a'))close()}}>{links}</div></details></nav></header>
}
