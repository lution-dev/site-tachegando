const {chromium}=require('playwright');
const W=[360,390,430,600,768,820,1024,1100,1280,1440,1920,2560];
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const falhas=[];
for(const w of W){const h=w<700?844:(w<1100?1000:900);
 for(const modo of ['','?modo=criar']){const c=await b.newContext({viewport:{width:w,height:h}});const p=await c.newPage();const erros=[];p.on('pageerror',e=>erros.push(e.message));
  await p.goto('http://localhost:8137/entrar'+modo);await p.waitForTimeout(600);
  const r=await p.evaluate(()=>{const o=[];const vw=innerWidth;if(location.pathname.indexOf('painel')>-1)o.push('redirecionou');
   const ov=document.documentElement.scrollWidth-vw;if(ov>0)o.push('rolagem lateral '+ov);
   const bad=[];document.querySelectorAll('body *').forEach(e=>{const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden')return;const r=e.getBoundingClientRect();if(r.width===0)return;if(e.closest('svg,[aria-hidden="true"]'))return;if(r.right>vw+1||r.left<-1)bad.push(e.tagName+'.'+(e.className||'').toString().slice(0,18))});if(bad.length)o.push('fora da tela: '+[...new Set(bad)].slice(0,3).join(','));
   if(vw<=900){const pq=[...document.querySelectorAll('button,a.btn,input,select')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.height<43&&e.type!=='checkbox'&&e.type!=='radio'&&getComputedStyle(e).visibility!=='hidden'});if(pq.length)o.push(pq.length+' alvos <43px: '+pq.slice(0,2).map(e=>(e.className||e.tagName).toString().slice(0,14)).join(','))}
   const f=document.querySelector('form');if(f){const fr=f.getBoundingClientRect();if(fr.width<260)o.push('formulário estreito '+Math.round(fr.width))}
   return o});
  if(erros.length)r.push('js: '+erros[0]);if(r.length)falhas.push(`${w}px entrar${modo}: ${r.join(' | ')}`);
  if([390,768,1280,1920].includes(w)&&modo==='')await p.screenshot({path:`mt/se-${w}.png`});await c.close()}}
console.log('Entrar: 24 verificações | com problema:',falhas.length);falhas.forEach(f=>console.log(' -',f));await b.close()})()
