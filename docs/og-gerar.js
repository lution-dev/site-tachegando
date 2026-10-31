const {chromium}=require('playwright');const fs=require('fs');
const B='http://localhost:8137';
const PIN=(x,y,t,c='#BB4938')=>`<svg style="position:absolute;left:${x};top:${y};width:${t}px;filter:drop-shadow(0 5px 5px rgba(41,37,45,.3))" viewBox="100 150 360 460"><path fill="${c}" fill-rule="evenodd" d="M150.11 443.68A170 170 0 1 1 409.89 443.68L280 597.5ZM174 334a106 106 0 1 0 212 0a106 106 0 1 0-212 0Z"/><circle fill="${c}" cx="280" cy="334" r="50"/></svg>`;
const MAPA=`<svg viewBox="0 0 300 560" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%"><rect width="300" height="560" fill="#EDE3D3"/><rect x="196" y="60" width="86" height="70" rx="10" fill="#D3DDCB"/><rect x="18" y="360" width="70" height="60" rx="10" fill="#D3DDCB"/><g stroke="#fff" stroke-width="15" stroke-linecap="round" fill="none"><path d="M-10 120 L310 90"/><path d="M-10 250 L310 225"/><path d="M-10 380 L310 352"/><path d="M-10 500 L310 478"/><path d="M60 -10 L40 570"/><path d="M165 -10 L150 570"/><path d="M262 -10 L248 570"/></g></svg>`;
const FONE=(w,extra='')=>`<div style="position:relative;width:${w}px;aspect-ratio:9/18.2;border-radius:${w*.15}px;background:#29252D;padding:${w*.038}px;box-shadow:0 30px 50px -24px rgba(15,25,24,.7);${extra}"><div style="position:relative;height:100%;border-radius:${w*.115}px;overflow:hidden;background:#EDE3D3">${MAPA}${PIN('22%','14%',w*.11)}${PIN('63%','7%',w*.1)}${PIN('68%','44%',w*.11)}${PIN('28%','62%',w*.11)}
<div style="position:absolute;left:46%;top:46%;width:${w*.17}px;height:${w*.17}px;margin:-${w*.085}px;border-radius:50%;background:rgba(41,37,45,.14);display:grid;place-items:center"><div style="width:${w*.05}px;height:${w*.05}px;border-radius:50%;background:#173F3C;border:${w*.01}px solid #fff"></div></div>
<div style="position:absolute;left:${w*.035}px;right:${w*.035}px;bottom:${w*.045}px;display:flex;align-items:center;gap:${w*.03}px;padding:${w*.03}px ${w*.04}px;border-radius:${w*.065}px;background:#fff;box-shadow:0 12px 20px -10px rgba(41,37,45,.5)"><div style="flex:none;width:${w*.12}px;height:${w*.12}px;border-radius:50%;background:#F0B34F;display:grid;place-items:center"><img src="${B}/marca/simbolo-petroleo.svg" style="width:${w*.085}px"></div><div><div style="font:800 ${w*.052}px/1.1 'Baloo 2';color:#29252D">Seu vendedor tá chegando</div><div style="font:600 ${w*.04}px/1.3 'Nunito Sans';color:#5F5A63">Açaí do Seu Zé · perto de você</div></div></div></div></div>`;
const TOLDO=(c)=>`<div style="z-index:0;position:absolute;left:0;right:0;bottom:-1px;height:30px;background:radial-gradient(circle at 50% 100%,${c} 0 30px,transparent 30.5px) 0 0/60px 30px repeat-x"></div>`;
const CARD=(img,w,h,rot,pos='center')=>{const m="radial-gradient(circle at 50% 0,#000 0 14px,transparent 14.5px) 0 100%/28px 14px repeat-x,linear-gradient(#000,#000) 0 0/100% calc(100% - 13px) no-repeat";return `<div style="width:${w}px;height:${h}px;transform:rotate(${rot}deg);filter:drop-shadow(0 18px 22px rgba(30,15,10,.45))"><div style="width:100%;height:100%;background:url(${img}) ${pos}/cover;border-radius:22px 22px 0 0;-webkit-mask:${m};mask:${m}"></div></div>`};
const LOGO=(c)=>`<img src="${B}/marca/logo/logo-compacta-${c}.svg" style="height:54px;display:block">`;
const H1=(t,s,c='#FFF7EF')=>`<div style="font:800 ${s}px/1.04 'Baloo 2';color:${c}">${t}</div>`;
const SUB=(t,c='#FFF7EF')=>`<div style="font:700 25px 'Nunito Sans';margin-top:22px;color:${c};opacity:.95">${t}</div>`;
const SEL=`<div style="display:inline-flex;margin-top:26px;padding:12px 22px;border-radius:99px;background:#F0B34F;color:#29252D;font:800 24px 'Nunito Sans'">Em breve nas lojas</div>`;

const ROTA=(c)=>`<svg style="position:absolute;left:0;top:0;width:1200px;height:630px;z-index:1;opacity:.55" viewBox="0 0 1200 630"><path d="M560 560 C700 470 640 330 770 290 S930 160 1130 90" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 16"/></svg>`;
const PAGE=(bg,logo,txt,size,toldo,acc,sim)=>`<body style="background:${bg}">${ROTA(acc)}<div style="position:absolute;left:84px;top:76px;z-index:2">${LOGO(logo)}</div>
<div style="position:absolute;left:84px;top:0;bottom:30px;width:640px;display:flex;align-items:center;z-index:2"><div>${H1(txt,size)}</div></div>
<div style="position:absolute;right:140px;top:32px;z-index:3">${FONE(278,'transform:rotate(4deg)')}</div>
<div style="position:absolute;right:76px;top:430px;z-index:2">${PIN('0','0',40,acc)}</div>${TOLDO(toldo)}</body>`;
const V={
 'og.png':PAGE('#BB4938','creme','Quem vende circula. Quem procura descobre.',76,'#F0B34F','#F0B34F'),
 'og-vendedores.png':PAGE('#BB4938','creme','Você já está na rua. Agora deixe que encontrem você.',66,'#F0B34F','#F0B34F'),
 'og-consumidores.png':PAGE('#173F3C','creme','O vendedor que você procura pode estar passando por aí.',64,'#F0B34F','#F0B34F'),
 'og-rede-de-apoio.png':PAGE('#173F3C','creme','Sua empresa pode ajudar quem vende na rua.',68,'#BB4938','#F0B34F'),
 'og-contato.png':PAGE('#BB4938','creme','Fale com a gente.',70,'#F0B34F','#F0B34F'),
 'og-avaasp.png':PAGE('#173F3C','creme','A AVAASP é nossa parceira.',72,'#F0B34F','#F0B34F')};
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1200,height:630}});
const OUT=process.argv[2];for(const [k,v] of Object.entries(V)){await p.goto(B+'/404.html');await p.setContent(`<html><body style="margin:0"></body></html>`);
await p.setContent(`<html><head><style>*{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden;position:relative}</style></head>${v}</html>`);
await p.evaluate(async()=>{await document.fonts.load("800 70px 'Baloo 2'");await document.fonts.load("700 25px 'Nunito Sans'");await document.fonts.ready});
await p.addStyleTag({url:B+'/fonts.css'});await p.evaluate(async()=>{await document.fonts.load("800 70px 'Baloo 2'");await document.fonts.load("700 25px 'Nunito Sans'");await document.fonts.ready});await p.waitForTimeout(1200);
await p.screenshot({path:OUT+'/'+k});console.log(k)}
await b.close()})()
