export function calculateGoal(goal, initial, monthly) {
  if ([goal, initial, monthly].some(v => !Number.isFinite(v) || v < 0) || goal <= 0) return {error: 'Ingresá un objetivo mayor a cero e importes válidos, sin valores negativos.'};
  if ([goal, initial, monthly].some(v => v > 1e9)) return {error: 'Usá importes de hasta 1.000.000.000.'};
  if ([goal, initial, monthly].some(v => Math.abs(v * 100 - Math.round(v * 100)) > 0.00001)) return {error: 'Usá importes con hasta dos decimales.'};
  const remaining = Math.max(0, Math.round((goal - initial) * 100) / 100);
  return {remaining, months: remaining === 0 ? 0 : monthly === 0 ? null : Math.ceil(Math.round(remaining * 100) / Math.round(monthly * 100)), progress: Math.min(initial / goal, 1) * 100};
}
export const transactions = [
{id:1,month:'Octubre',day:'28 oct',name:'Proyecto editorial',category:'Trabajo',amount:2400,icon:'↙'},
{id:2,month:'Octubre',day:'26 oct',name:'Mercado de barrio',category:'Compras',amount:-86.50,icon:'◇'},
{id:3,month:'Octubre',day:'24 oct',name:'Café Botánico',category:'Comida',amount:-12,icon:'☕'},
{id:4,month:'Octubre',day:'21 oct',name:'Estudio Nube',category:'Trabajo',amount:850,icon:'↙'},
{id:5,month:'Octubre',day:'18 oct',name:'Librería Central',category:'Compras',amount:-42,icon:'▤'},
{id:6,month:'Octubre',day:'12 oct',name:'Mesa compartida',category:'Comida',amount:-59.50,icon:'↗'},
{id:7,month:'Septiembre',day:'28 sep',name:'Diseño de identidad',category:'Trabajo',amount:1800,icon:'↙'},
{id:8,month:'Septiembre',day:'22 sep',name:'Mercado de barrio',category:'Compras',amount:-120,icon:'◇'},
{id:9,month:'Septiembre',day:'15 sep',name:'Café Botánico',category:'Comida',amount:-24,icon:'☕'},
{id:10,month:'Septiembre',day:'10 sep',name:'Libros y objetos',category:'Compras',amount:-76,icon:'▤'}];
export function summarize(rows) {const income=rows.reduce((a,t)=>a+Math.max(0,t.amount),0); const expenses=rows.reduce((a,t)=>a+Math.max(0,-t.amount),0);return {income,expenses,net:income-expenses};}

