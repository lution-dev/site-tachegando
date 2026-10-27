import re,json,html as H
BASE='https://tachegandoapp.com.br'
IMG={'':'og.png','vendedores':'og-vendedores.png','consumidores':'og-consumidores.png','rede-de-apoio':'og-rede-de-apoio.png','contato':'og-contato.png','privacidade':'og.png','termos':'og.png'}
IMG_ALT={'':'Tá Chegando: quem vende circula, quem procura descobre.','vendedores':'Tá Chegando para vendedores: você já está na rua, agora deixe que encontrem você.','consumidores':'Tá Chegando para quem procura: o vendedor que você procura pode estar passando por aí.','rede-de-apoio':'Rede de Apoio do Tá Chegando: sua empresa pode ajudar quem vende na rua.','contato':'Fale com a equipe do Tá Chegando.','privacidade':'Tá Chegando: quem vende circula, quem procura descobre.','termos':'Tá Chegando: quem vende circula, quem procura descobre.'}
META={
 '':('Tá Chegando | Quem vende circula. Quem procura descobre.','Veja quem está vendendo perto de você e peça pra ser avisado quando chegar. Quem vende vê onde tem cliente na rota. O app ainda não está nas lojas.','Tá Chegando'),
 'vendedores':('Para vendedores ambulantes | Tá Chegando','Vende a pé, de bicicleta, moto, carro ou carrinho? Grave sua rota, escolha os dias e veja onde tem clientes. Sem taxa por venda. Crie sua conta.','Para vendedores'),
 'consumidores':('Para quem procura vendedor ambulante | Tá Chegando','Veja no mapa quem vende perto de você e toque em “Me avise quando chegar”. Pra quem procura, é grátis. Deixe seu contato e avisamos quando o app sair.','Para quem procura'),
 'rede-de-apoio':('Rede de Apoio para empresas verificadas | Tá Chegando','Empresas de contabilidade, design, jurídico e outras áreas podem se candidatar à Rede de Apoio do Tá Chegando. Todas passam por verificação antes de entrar.','Rede de Apoio'),
 'contato':('Fale com a gente | Tá Chegando','Tem dúvida, quer candidatar ou indicar uma empresa para a Rede de Apoio? Escreva pra equipe do Tá Chegando. A gente responde.','Fale com a gente'),
 'privacidade':('Política de Privacidade | Tá Chegando','Como o Tá Chegando cuida dos seus dados pessoais: o que coletamos, para quê, por quanto tempo e quais são os seus direitos.','Política de Privacidade'),
 'termos':('Termos de Uso | Tá Chegando','As regras para usar o site e o aplicativo do Tá Chegando, em linguagem direta: quem pode usar, regras para vendedores e o que o app não garante.','Termos de Uso')}
ORG={"@type":"Organization","@id":BASE+"/#organizacao","name":"Tá Chegando","url":BASE+"/","slogan":"Quem vende circula. Quem procura descobre.",
 "description":"Aplicativo que ajuda quem vende em movimento (a pé, de bicicleta, moto, carro ou carrinho) a ser encontrado, e quem procura a ver quem está vendendo por perto e pedir pra ser avisado quando chegar.",
 "logo":{"@type":"ImageObject","url":BASE+"/icon-512.png","width":512,"height":512},"image":BASE+"/img/og.png",
 "parentOrganization":{"@type":"Organization","name":"Argo Apps","identifier":"CNPJ 66.543.238/0001-71"},"areaServed":{"@type":"Country","name":"Brasil"},"inLanguage":"pt-BR"}
SITE={"@type":"WebSite","@id":BASE+"/#site","url":BASE+"/","name":"Tá Chegando","inLanguage":"pt-BR","publisher":{"@id":BASE+"/#organizacao"}}
def faq(h):
    qs=[]
    for m in re.finditer(r'<details[^>]*><summary>(.*?)</summary>(.*?)</details>',h,re.S):
        q=re.sub(r'<[^>]+>','',m.group(1)).strip();a=H.unescape(re.sub(r'<[^>]+>','',m.group(2))).strip();a=re.sub(r'\s+',' ',a)
        qs.append({"@type":"Question","name":H.unescape(q),"acceptedAnswer":{"@type":"Answer","text":a}})
    return qs
def build(slug,h):
    t,d,nome=META[slug];url=BASE+('/'+slug if slug else '/')
    g=[ORG,SITE]
    wp={"@type":"CollectionPage" if False else ("ContactPage" if slug=='contato' else "WebPage"),"@id":url+"#pagina","url":url,"name":t,"description":d,"inLanguage":"pt-BR","isPartOf":{"@id":BASE+"/#site"},"about":{"@id":BASE+"/#organizacao"},"primaryImageOfPage":{"@type":"ImageObject","url":BASE+"/img/"+IMG[slug],"width":1200,"height":630}}
    if slug:
        wp["breadcrumb"]={"@id":url+"#trilha"}
        g.append({"@type":"BreadcrumbList","@id":url+"#trilha","itemListElement":[{"@type":"ListItem","position":1,"name":"Início","item":BASE+"/"},{"@type":"ListItem","position":2,"name":nome,"item":url}]})
        q=faq(h)
        if q: g.append({"@type":"FAQPage","@id":url+"#perguntas","url":url,"inLanguage":"pt-BR","mainEntity":q}); wp["mainEntity"]={"@id":url+"#perguntas"}
    g.insert(2,wp)
    return {"@context":"https://schema.org","@graph":g}
def head(slug,h):
    t,d,nome=META[slug];url=BASE+('/'+slug if slug else '/');img=BASE+'/img/'+IMG[slug]
    e=lambda s:H.escape(s,quote=True)
    L=[f'<title>{e(t)}</title>',f'<meta name="description" content="{e(d)}">',
     '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">',
     '<meta name="author" content="Argo Apps">','<meta name="application-name" content="Tá Chegando">','<meta name="apple-mobile-web-app-title" content="Tá Chegando">',
     '<meta name="format-detection" content="telephone=no">','<meta name="referrer" content="strict-origin-when-cross-origin">','<meta name="theme-color" content="#BB4938">',
     f'<link rel="canonical" href="{url}">',f'<link rel="alternate" hreflang="pt-BR" href="{url}">',f'<link rel="alternate" hreflang="x-default" href="{url}">',
     '<meta property="og:type" content="website">','<meta property="og:site_name" content="Tá Chegando">','<meta property="og:locale" content="pt_BR">',
     f'<meta property="og:title" content="{e(t)}">',f'<meta property="og:description" content="{e(d)}">',f'<meta property="og:url" content="{url}">',
     f'<meta property="og:image" content="{img}">',f'<meta property="og:image:secure_url" content="{img}">','<meta property="og:image:type" content="image/png">','<meta property="og:image:width" content="1200">','<meta property="og:image:height" content="630">',f'<meta property="og:image:alt" content="{e(IMG_ALT[slug])}">',
     '<meta name="twitter:card" content="summary_large_image">',f'<meta name="twitter:title" content="{e(t)}">',f'<meta name="twitter:description" content="{e(d)}">',f'<meta name="twitter:image" content="{img}">',f'<meta name="twitter:image:alt" content="{e(IMG_ALT[slug])}">']
    return '\n'.join(L)
for slug in META:
    f=(slug or 'index')+'.html';h=open(f).read()
    a=h.index('<title>');b=h.index('<link rel="icon"')
    ini=h[:a];fim=h[b:]
    fim=re.sub(r'\n?<script type="application/ld\+json">.*?</script>','',fim,flags=re.S)
    ld='<script type="application/ld+json">'+json.dumps(build(slug,h),ensure_ascii=False,separators=(',',':'))+'</script>'
    fim=fim.replace('</head>',ld+'\n</head>',1)
    open(f,'w').write(ini+head(slug,h)+'\n'+fim)
    print('ok',f)
# noindex nas páginas que não devem aparecer
for f,t in (('404.html',None),('entrar.html',None),('painel.html',None)):
    h=open(f).read()
    if 'name="robots"' not in h: h=h.replace('<title>','<meta name="robots" content="noindex, nofollow">\n<title>',1)
    if 'name="theme-color"' not in h: h=h.replace('</title>','</title>\n<meta name="theme-color" content="#BB4938">',1)
    open(f,'w').write(h)
