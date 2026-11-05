import React,{useEffect,useRef,useState} from 'react';
import {useDemo} from './DemoContext';
import {getPeriod,INITIAL_BALANCE,money,recipients,validateTransfer,parseCents} from './demo';
import {Icon} from './Icons';

export default function TransferPanel({onClose}){
 const {state,dispatch}=useDemo();
 const [draft,setDraft]=useState(()=>({id:crypto.randomUUID(),recipient:'sol',amount:'',concept:'',period:state.period}));
 const [step,setStep]=useState('edit');
 const [error,setError]=useState('');
 const dialog=useRef(null),heading=useRef(null),locked=useRef(false);
 const receipt=state.receipt?.id===draft.id?state.receipt:null;
 const successful=Boolean(receipt);
 const recipient=recipients.find(r=>r.id===draft.recipient);
 const balance=getPeriod(state,draft.period).balance;
 const cents=parseCents(draft.amount)||0;
 useEffect(()=>{
   const origin=document.activeElement;

   dialog.current.showModal();
   heading.current.focus({preventScroll:true});
   return ()=>{origin?.focus({preventScroll:true})};
 },[]);
 useEffect(()=>{if(step==='review'||successful) heading.current.focus({preventScroll:true})},[step,successful]);
 function review(e){e.preventDefault();const message=validateTransfer(state,draft);setError(message);if(!message)setStep('review')}
 function confirm(){
   if(locked.current)return;
   const message=validateTransfer(state,draft);
   if(message){setError(message);return}
   locked.current=true;
   dispatch({type:'transfer',draft});
 }
 function another(){locked.current=false;setDraft({id:crypto.randomUUID(),recipient:'sol',amount:'',concept:'',period:state.period});setStep('edit');setError('');requestAnimationFrame(()=>heading.current?.focus())}
 return <dialog ref={dialog} className={`transfer-dialog ${successful?'is-receipt':''}`} aria-labelledby="transfer-heading" onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
  <div className="transfer-surface">
   <header className="transfer-topline"><span>PLENA / {successful?'COMPROBANTE':'TRANSFERENCIA'}</span><button className="icon-button" onClick={onClose} aria-label="Cerrar transferencia"><Icon name="close"/></button></header>
   <div className="transfer-title"><span className="eyebrow">{draft.period.toUpperCase()} 2026 · PERÍODO DEMO</span><h2 id="transfer-heading" tabIndex="-1" ref={heading}>{successful?'Un movimiento. Todo claro.':step==='review'?'Revisá tu demo.':'¿A quién le enviarías?'}</h2><p>Demostración: no se envía dinero</p></div>
   {!successful&&step==='edit'?<form onSubmit={review} noValidate>
    <fieldset className="recipients"><legend>Destinatarios ficticios</legend>{recipients.map(r=><label className={`recipient ${draft.recipient===r.id?'chosen':''}`} key={r.id}><input type="radio" name="recipient" value={r.id} checked={draft.recipient===r.id} onChange={()=>setDraft({...draft,recipient:r.id})}/><span className={`avatar ${r.color}`}>{r.initials}</span><span>{r.name}<small>Perfil de muestra</small></span><span className="recipient-check">{draft.recipient===r.id?<Icon name="check"/>:null}</span></label>)}</fieldset>
    <label className="transfer-amount-label" htmlFor="transfer-amount">Monto en USD</label><div className="transfer-amount"><span>$</span><input id="transfer-amount" inputMode="decimal" type="text" placeholder="0.00" autoComplete="off" value={draft.amount} onChange={e=>{setDraft({...draft,amount:e.target.value});setError('')}} aria-invalid={Boolean(error)} aria-describedby="transfer-available transfer-error"/></div><p className="available" id="transfer-available">Disponible en {draft.period}: <strong>{money(balance)}</strong></p>
    <label className="concept-label" htmlFor="transfer-concept">Concepto <span>opcional</span></label><input id="transfer-concept" className="concept-input" value={draft.concept} maxLength={80} placeholder="Por ejemplo: almuerzo compartido" onChange={e=>setDraft({...draft,concept:e.target.value})}/>
    <p className="transfer-error" id="transfer-error" role="alert">{error}</p>
    <button className="action-button" type="submit">Revisar transferencia <Icon/></button>
   </form>:<div className={`operation-summary ${successful?'receipt-complete':''}`}>
    <div className="receipt-recipient"><span className={`avatar ${recipient.color}`}>{recipient.initials}</span><span>{successful?'Demo registrada para':'Destinatario ficticio'}<strong>{recipient.name}</strong></span>{successful&&<svg className="receipt-seal" viewBox="0 0 64 64" aria-hidden="true"><path className="seal-frame" d="m32 3 25 14v30L32 61 7 47V17Z"/><path className="seal-check" d="m20 32 8 8 17-18"/></svg>}</div>
    <div className="receipt-amount">{money(receipt?.cents??cents)}<span>USD · DEMO</span></div>
    <p className="receipt-concept">{receipt?.concept||draft.concept.trim()||'Transferencia demo'}</p>
    <dl className="receipt-details"><div><dt>Período de muestra</dt><dd>{draft.period} 2026</dd></div><div><dt>Saldo resultante</dt><dd>{money(receipt?.balance??balance-cents)}</dd></div><div><dt>{successful?'Referencia ficticia':'Estado'}</dt><dd>{successful?receipt.reference:'Pendiente de confirmar'}</dd></div></dl>
    {successful?<><p className="receipt-note">Este comprobante no tiene validez financiera.<br/>Ningún dinero fue enviado.</p><button className="action-button" onClick={()=>{dispatch({type:'view',value:'Resumen'});onClose()}}>Volver al resumen <Icon/></button><button className="secondary-button" onClick={another}>Hacer otra demo</button></>:<><p className="transfer-error" role="alert">{error||state.error}</p><button className="action-button" onClick={confirm}>Confirmar transferencia demo <Icon name="check"/></button><button className="secondary-button" onClick={()=>{setStep('edit');setError('')}}>Editar detalles</button></>}
   </div>}
   <span role="status" className="sr-only">{successful?`Transferencia demo confirmada. ${money(receipt.cents)} para ${recipient.name}.`:''}</span>
  </div>
 </dialog>
}
