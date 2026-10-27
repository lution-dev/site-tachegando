const {chromium}=require('playwright');
const W=[360,390,430,600,768,820,1024,1100,1280,1440,1920,2560];
const PAGES=[['home','/'],['vendedores','/vendedores'],['consumidores','/consumidores'],['rede','/rede-de-apoio'],['contato','/contato'],['entrar','/entrar'],['privacidade','/privacidade'],['termos','/termos'],['404','/404.html'],['painel-v','/painel#v'],['painel-a','/painel#a']];
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const falhas=[];let total=0;
for(const w of W){const h=w<700?844:(w<1100?1000:900);
 for(const [nome,url] of PAGES){const c=await b.newContext({viewport:{width:w,height:h}});
  const tipo=nome==='painel-a'?'apoio':'vendedor';
  await c.addInitScript(t=>{try{localStorage.setItem('tc_session',JSON.stringify(t+'@tachegando.demo'))}catch(e){}},tipo);
  const p=await c.newPage();const erros=[];p.on('pageerror',e=>erros.push('js:'+e.message));p.on('response',r=>{if(r.status()>=400&&r.url().includes('localhost'))erros.push(r.status()+' '+r.url().split('8137')[1])});
  const abas=nome.startsWith('painel')?['inicio','perfil','metricas']:['x'];
  await p.goto('http://localhost:8137'+url.split('#')[0]);await p.waitForTimeout(450);
  for(const aba of abas){total++;
   if(aba!=='x'&&aba!=='inicio'){await p.evaluate(v=>{const b=[...document.querySelectorAll('[data-v="'+v+'"]')].find(x=>x.getBoundingClientRect().width>0);if(b)b.click()},aba);await p.waitForTimeout(450)}
   await p.evaluate(async()=>{document.querySelectorAll('.rev').forEach(x=>x.classList.add('on'));for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,25))}scrollTo(0,0)});await p.waitForTimeout(250);
   const r=await p.evaluate(()=>{const out=[];const vw=innerWidth;
    const ov=document.documentElement.scrollWidth-vw;if(ov>0)out.push('rolagem lateral '+ov+'px');
    const hd=document.querySelector('header.top,header.topo,header.pn-top');const hb=hd?hd.getBoundingClientRect().bottom:0;
    const h1=document.querySelector('h1');
    if(h1&&h1.getBoundingClientRect().width>0){const hr=h1.getBoundingClientRect(),fs=parseFloat(getComputedStyle(h1).fontSize),lh=parseFloat(getComputedStyle(h1).lineHeight)||fs*1.1;const lines=Math.round(hr.height/lh),pal=h1.textContent.trim().split(/\s+/).length;
     if(pal>=4&&lines>=pal-1)out.push('título quebrado em '+lines+' linhas ('+pal+' palavras, '+Math.round(hr.width)+'px)');
     const hero=h1.closest('.hero,.doc-topo,.pg-hero');if(hero&&hd&&hd.className.indexOf('pn-')<0&&hr.top<hb-2)out.push('título sob a barra (top '+Math.round(hr.top)+' < '+Math.round(hb)+')');
     if(hero&&hero.classList.contains('hero')&&vw>900){const a=getComputedStyle(hero,'::after');if(a.content!=='none'&&a.position==='absolute'){const aw=parseFloat(a.width),ar=parseFloat(a.right),left=vw-ar-aw;const txt=[...hero.querySelectorAll('h1,.sub,.acoes,.passos-h')].map(e=>e.getBoundingClientRect().right);const mx=Math.max(...txt);if(mx>left-8)out.push('texto encosta na foto ('+Math.round(mx)+' > '+Math.round(left)+')')}}}
    const bad=[];document.querySelectorAll('body *').forEach(e=>{const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden')return;const r=e.getBoundingClientRect();if(r.width===0||r.height===0)return;if(e.closest('.cams,.passos-h,.trilho,.pn-kpis,.faixa,.deco,[aria-hidden="true"],nav#nav-principal,.pn-tabs,svg,.fone,.hero::after'))return;if(r.right>vw+1&&r.left<vw)bad.push(e.tagName.toLowerCase()+'.'+(e.className||'').toString().slice(0,20)+'→'+Math.round(r.right))});
    if(bad.length)out.push('estoura a tela: '+[...new Set(bad)].slice(0,3).join(', '));
    if(vw<=900){const peq=[...document.querySelectorAll('a.btn,button.btn,.menu-btn,nav a,.pn-tabs button')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.height<43&&getComputedStyle(e).visibility!=='hidden'});if(peq.length)out.push(peq.length+' alvos de toque < 43px');}
    const imgs=[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.getBoundingClientRect().width>0);if(imgs.length)out.push('imagem quebrada '+imgs[0].src.split('/').pop());
    return out});
   if(erros.length)r.push('erros: '+erros.slice(0,2).join(' ; '));
   if(r.length)falhas.push(`${w}px ${nome}${aba!=='x'?'/'+aba:''}: ${r.join(' | ')}`);
   if([390,768,1280,1920].includes(w)&&(nome!=='404'))await p.screenshot({path:`mt/sw-${w}-${nome}${aba!=='x'?'-'+aba:''}.png`});}
  await c.close()}}
console.log('verificações:',total,'| com problema:',falhas.length);falhas.forEach(f=>console.log(' -',f));await b.close()})()
