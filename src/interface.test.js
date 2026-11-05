import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
const bundle=await build({entryPoints:['src/main.jsx'],bundle:true,write:false,format:'iife',loader:{'.css':'empty'},define:{'process.env.NODE_ENV':'"development"'}});
const tick=()=>new Promise(r=>setTimeout(r,20));
async function mount(){
 const dom=new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',{url:'http://localhost:5175/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;
 w.matchMedia=()=>({matches:false});
 // jsdom no implementa el top layer. Este sustituto sólo permite probar React;
 // no se usa para afirmar foco atrapado, Escape nativo ni layout real.
 w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};
 w.eval(bundle.outputFiles[0].text);await tick();
 const d=w.document;
 const button=text=>[...d.querySelectorAll('button')].find(b=>b.textContent.trim()===text);
 async function click(text){const b=button(text);assert.ok(b,`Existe botón: ${text}`);b.click();await tick();return b}
 async function input(id,value){const el=d.getElementById(id);assert.ok(el,id);Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype,'value').set.call(el,value);el.dispatchEvent(new w.Event('input',{bubbles:true}));await tick()}
 return {dom,w,d,button,click,input};
}
test('DOM: navegación, filtros y período comparten el saldo',async()=>{
 const h=await mount();try{
 assert.match(h.d.querySelector('[data-testid="balance"]').textContent,/4,550/);
 await h.click('Movimientos');assert.match(h.d.querySelector('.app-view').textContent,/6 movimientos/);
 await h.click('Transferencias');assert.match(h.d.querySelector('.app-view').textContent,/Todavía no hay/);
 await h.click('Metas');assert.equal(h.d.querySelectorAll('.goal-overview-item').length,3);
 const select=h.d.querySelector('.period-label select');select.value='Septiembre';select.dispatchEvent(new h.w.Event('change',{bubbles:true}));await tick();
 await h.click('Resumen');assert.match(h.d.querySelector('[data-testid="balance"]').textContent,/3,080/);
 }finally{h.dom.window.close()}
});
test('DOM: transferencia validada, revisión, comprobante y coherencia del historial',async()=>{
 const h=await mount();try{
 const trigger=h.button('Transferir');trigger.focus();await h.click('Transferir');
 assert.ok(h.d.querySelector('dialog[open]'));assert.equal(h.d.activeElement.id,'transfer-heading');
 assert.match(h.d.querySelector('dialog').textContent,/Demostración: no se envía dinero/);
 for(const amount of ['0','-1','1.001','4550.01','texto']){await h.input('transfer-amount',amount);await h.click('Revisar transferencia');assert.ok(h.d.getElementById('transfer-error').textContent);assert.equal(h.button('Confirmar transferencia demo'),undefined)}
 await h.input('transfer-amount','100.25');await h.input('transfer-concept','Cena demo');await h.click('Revisar transferencia');
 assert.match(h.d.querySelector('.receipt-details').textContent,/4,449.75/);
 const confirm=h.button('Confirmar transferencia demo');confirm.click();confirm.click();await tick();
 assert.match(h.d.querySelector('.receipt-details').textContent,/PL-DEMO-0001/);assert.match(h.d.querySelector('.receipt-concept').textContent,/Cena demo/);
 assert.ok(h.d.querySelector('.receipt-seal'));await h.click('Volver al resumen');
 assert.equal(h.d.activeElement,trigger);assert.match(h.d.querySelector('[data-testid="balance"]').textContent,/4,449.75/);assert.match(h.d.querySelector('.chart-text').textContent,/4,449.75/);
 await h.click('Movimientos');await h.click('Transferencias');assert.equal(h.d.querySelectorAll('.app-view .transaction').length,1);assert.match(h.d.querySelector('.filtered-total').textContent,/-.*100\.25/);
 await h.click('Reiniciar demo');assert.match(h.d.querySelector('[data-testid="balance"]').textContent,/4,550/);await h.click('Movimientos');await h.click('Transferencias');assert.match(h.d.querySelector('.empty-state').textContent,/Todavía no hay/);
 }finally{h.dom.window.close()}
});
test('DOM: cancelar panel devuelve el foco y hacer otra demo limpia el formulario',async()=>{
 const h=await mount();try{
 const trigger=h.button('Transferir');trigger.focus();await h.click('Transferir');
 h.d.querySelector('dialog').dispatchEvent(new h.w.Event('cancel',{cancelable:true}));await tick();assert.equal(h.d.querySelector('dialog'),null);assert.equal(h.d.activeElement,trigger);
 await h.click('Transferir');await h.input('transfer-amount','10');await h.click('Revisar transferencia');await h.click('Editar detalles');assert.equal(h.d.getElementById('transfer-amount').value,'10');await h.click('Revisar transferencia');await h.click('Confirmar transferencia demo');await h.click('Hacer otra demo');assert.equal(h.d.getElementById('transfer-amount').value,'');assert.match(h.d.getElementById('transfer-available').textContent,/4,540/);
 }finally{h.dom.window.close()}
});
test('DOM: tres metas, sincronización de campo/slider, extremos y reinicio',async()=>{
 const h=await mount();try{
 const picker=name=>[...h.d.querySelectorAll('.goal-picker button')].find(b=>b.textContent.startsWith(name));
 picker('Equipo').click();await tick();assert.equal(h.d.getElementById('goal-goal').value,'2400');
 await h.input('goal-monthly','123.45');assert.equal(h.d.getElementById('monthly-slider').value,'123.45');
 await h.input('monthly-slider','250');assert.equal(h.d.getElementById('goal-monthly').value,'250');
 await h.input('goal-monthly','0');assert.match(h.d.querySelector('.goal-result').textContent,/Sin fecha/);
 await h.input('goal-initial','2400');assert.match(h.d.querySelector('.goal-result').textContent,/¡Bien ahí!/);
 await h.input('goal-goal','-1');assert.ok(h.d.getElementById('goal-error'));
 picker('Fondo personal').click();await tick();assert.equal(h.d.getElementById('goal-goal').value,'6000');
 picker('Viaje').click();await tick();assert.equal(h.d.getElementById('goal-goal').value,'5000');
 await h.click('Reiniciar demo');picker('Equipo').click();await tick();assert.equal(h.d.getElementById('goal-initial').value,'600');assert.equal(h.d.getElementById('goal-monthly').value,'200');
 }finally{h.dom.window.close()}
});
test('DOM: tarjeta original conserva giro, acabados y congelado',async()=>{
 const h=await mount();try{
 await h.click('↻ Girar tarjeta');assert.ok(h.d.querySelector('.payment-card.is-back'));
 for(const finish of ['hueso','cobalto','grafito']){h.d.querySelector(`[aria-label="Acabado ${finish}"]`).click();await tick();assert.ok(h.d.querySelector(`.payment-card.${finish}`));assert.equal(h.d.querySelector(`[aria-label="Acabado ${finish}"]`).getAttribute('aria-pressed'),'true')}
 const freeze=h.d.querySelector('[role="switch"]');freeze.click();await tick();assert.equal(freeze.getAttribute('aria-checked'),'true');assert.ok(h.d.querySelector('.payment-card.frozen'));freeze.click();await tick();assert.equal(freeze.getAttribute('aria-checked'),'false');
 await h.click('↻ Ver frente');assert.equal(h.d.querySelector('.payment-card.is-back'),null);
 }finally{h.dom.window.close()}
});
