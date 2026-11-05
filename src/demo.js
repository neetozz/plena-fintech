import {transactions} from './calculations.js';
export const INITIAL_BALANCE = 150000;
export const periods = ['Octubre','Septiembre'];
export const recipients = [
  {id:'sol',name:'Sol Rivera',initials:'SR',color:'sol'},
  {id:'leo',name:'Leo Vidal',initials:'LV',color:'leo'},
  {id:'ines',name:'Inés Mora',initials:'IM',color:'ines'},
];
export const goalTypes = [
  {id:'viaje',name:'Viaje',description:'Un cambio de horizonte.',goal:'5000',initial:'1200',monthly:'300'},
  {id:'equipo',name:'Equipo',description:'Herramientas para tus ideas.',goal:'2400',initial:'600',monthly:'200'},
  {id:'fondo',name:'Fondo personal',description:'Espacio para lo inesperado.',goal:'6000',initial:'1500',monthly:'250'},
];
export const money = cents => new Intl.NumberFormat('es-GT',{style:'currency',currency:'USD',minimumFractionDigits:2}).format(cents/100);
export function parseCents(value) {
  const text=String(value).trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) return null;
  const [whole,fraction='']=text.split('.');
  const cents=Number(whole)*100+Number(fraction.padEnd(2,'0'));
  return Number.isSafeInteger(cents) && cents<=100000000000 ? cents : null;
}
export function createDemoState(){return {
  entries:transactions.map(t=>({id:`seed-${t.id}`,month:t.month,date:t.day,name:t.name,category:t.category,cents:Math.round(t.amount*100)})),
  goals:Object.fromEntries(goalTypes.map(({id,goal,initial,monthly})=>[id,{goal,initial,monthly}])),
  selectedGoal:'viaje',period:'Octubre',view:'Resumen',filter:'Todos',receipt:null,error:'',revision:0,
};}
export function getPeriod(state,period=state.period){
  const rows=state.entries.filter(t=>t.month===period);
  const income=rows.reduce((a,t)=>a+Math.max(0,t.cents),0);
  const expenses=rows.reduce((a,t)=>a+Math.max(0,-t.cents),0);
  let running=INITIAL_BALANCE;
  const points=[running,...[...rows].reverse().map(t=>running+=t.cents)];
  return {rows,income,expenses,balance:INITIAL_BALANCE+income-expenses,points};
}
export function validateTransfer(state,draft){
  const cents=parseCents(draft.amount);
  if (!recipients.some(r=>r.id===draft.recipient)) return 'Elegí un destinatario de muestra.';
  if (!periods.includes(draft.period)) return 'Elegí un período de demostración válido.';
  if (cents===null || cents<=0) return 'Ingresá un monto positivo con hasta dos decimales.';
  if (cents>getPeriod(state,draft.period).balance) return 'El saldo de muestra no alcanza para ese monto.';
  if (String(draft.concept??'').length>80) return 'El concepto puede tener hasta 80 caracteres.';
  return '';
}
export function demoReducer(state,action){
  switch(action.type){
    case 'period':return periods.includes(action.value)?{...state,period:action.value}:state;
    case 'view':return ['Resumen','Movimientos','Metas'].includes(action.value)?{...state,view:action.value}:state;
    case 'filter':return {...state,filter:action.value};
    case 'selectGoal':return goalTypes.some(g=>g.id===action.value)?{...state,selectedGoal:action.value}:state;
    case 'goal':return {...state,goals:{...state.goals,[state.selectedGoal]:{...state.goals[state.selectedGoal],[action.field]:action.value}}};
    case 'reset':return {...createDemoState(),revision:state.revision+1};
    case 'transfer': {
      const {draft}=action;
      if (!draft.id || state.entries.some(t=>t.id===draft.id)) return state;
      const error=validateTransfer(state,draft);
      if(error) return {...state,error};
      const recipient=recipients.find(r=>r.id===draft.recipient);
      const cents=parseCents(draft.amount);
      const reference=`PL-DEMO-${String(state.entries.length-9).padStart(4,'0')}`;
      const receipt={...draft,cents,recipient,reference,balance:getPeriod(state,draft.period).balance-cents,concept:String(draft.concept??'').trim()||'Transferencia demo'};
      const entry={id:draft.id,month:draft.period,date:draft.period==='Octubre'?'31 oct':'30 sep',name:recipient.name,category:'Transferencias',cents:-cents,concept:receipt.concept};
      return {...state,entries:[entry,...state.entries],receipt,period:draft.period,error:''};
    }
    default:return state;
  }
}
