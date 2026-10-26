(function () {
  var user = TC.usuarioAtual();
  if (!user) { location.replace("/entrar"); return; }
  var el = document.getElementById("tela"), foco = document.getElementById("conteudo");
  var ehVend = user.tipo === "vendedor";
  var CH_RASC = "tc_rascunho_" + user.email;
  function cartaoUsuario() {
    var n = (user.perfil && user.perfil.nome) || "Sua conta";
    document.getElementById("quem").innerHTML = "<b>" + esc(n) + "</b>" + (ehVend ? "Vendedor" : "Rede de Apoio") + " · " + esc(user.email);
  }
  function sair() { TC.sair(); location.href = "/"; }
  document.getElementById("sair").onclick = sair; document.getElementById("sair-m").onclick = sair;

  var VENDE = ["Frutas e verduras", "Ovos", "Pão", "Doces", "Queijo", "Artesanato", "Flores", "Roupas", "Picolé", "Serviços", "Outro"];
  var MEIO = ["A pé", "Bicicleta", "Moto", "Carro ou caminhonete", "Carrinho", "Outro"];
  var DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  var AREAS = ["Contabilidade", "Orientação financeira", "Design", "Comunicação", "Assessoria jurídica", "Outra"];
  var FOTO = ehVend ? '' : ' style="--foto:url(img/hero-apoio.webp)"';
  var DIST = ["Perto", "Normal", "Mais longe"];
  var DISTDICA = { "Perto": "Avisa clientes bem próximos.", "Normal": "Bom para a maioria das rotas.", "Mais longe": "Avisa clientes um pouco mais distantes." };
  var TIPOS = ["Empresa", "Profissional autônomo"];

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function opc(nome, lista, sel, tipo) {
    return '<div class="opcoes" data-g="' + nome + '">' + lista.map(function (o) {
      return '<label><input type="' + (tipo || "checkbox") + '" name="' + nome + '" value="' + esc(o) + '"' + ((sel || []).indexOf(o) > -1 ? " checked" : "") + '><span>' + esc(o) + '</span></label>';
    }).join("") + '</div>';
  }
  function marcados(f, n) { return Array.from(f.querySelectorAll('input[name="' + n + '"]:checked')).map(function (i) { return i.value; }); }
  function campo(id, rot, val, extra, tipo) { return '<label class="l" for="' + id + '">' + rot + '</label><input type="' + (tipo || "text") + '" id="' + id + '" name="' + id + '" value="' + esc(val) + '" ' + (extra || "") + '>'; }

  // cada validação devolve uma lista de [campo, mensagem]
  var PASSOS = ehVend ? [
    { t: "Quem é você",
      h: function (p) { return campo("nome", "Seu nome", p.nome, "autocomplete=name") + campo("negocio", "Nome do seu negócio", p.negocio, "placeholder=\"Ex.: Frutas do João\"") + campo("telefone", "Telefone com DDD", p.telefone, "autocomplete=tel inputmode=tel placeholder=\"(00) 00000-0000\"", "tel") + '<p class="nota-m">Usamos só para falar sobre o seu cadastro.</p>'; },
      l: function (f, p) { var e = []; p.nome = f.nome.value.trim(); p.negocio = f.negocio.value.trim(); p.telefone = f.telefone.value.trim();
        if (!p.nome) e.push(["nome", "Digite o seu nome."]);
        if (!p.negocio) e.push(["negocio", "Digite o nome do seu negócio."]);
        if (!p.telefone) e.push(["telefone", "Digite seu telefone com DDD."]); else if (!TCForm.telefone(p.telefone)) e.push(["telefone", "Telefone incompleto. Use DDD + número, como (13) 99999-9999."]);
        return e; } },
    { t: "O que você vende",
      h: function (p) { return '<span class="rot l">Escolha o que você vende (pode marcar vários)</span>' + opc("vende", VENDE, p.vende) +
          '<div id="outro-w"' + ((p.vende || []).indexOf("Outro") > -1 ? "" : " hidden") + '>' + campo("vendeOutro", "O que mais você vende?", p.vendeOutro, "") + '</div>' +
          '<span class="rot l">Como você se desloca?</span>' + opc("meio", MEIO, p.meio ? [p.meio] : [], "radio"); },
      l: function (f, p) { var e = []; p.vende = marcados(f, "vende"); p.meio = marcados(f, "meio")[0] || ""; p.vendeOutro = f.vendeOutro ? f.vendeOutro.value.trim() : "";
        if (!p.vende.length) e.push(["vende", "Marque pelo menos um produto ou serviço."]);
        if (p.vende.indexOf("Outro") > -1 && !p.vendeOutro) e.push(["vendeOutro", "Conte o que mais você vende."]);
        if (!p.meio) e.push(["meio", "Escolha como você se desloca."]);
        return e; } },
    { t: "Sua rota",
      h: function (p) { return campo("rota", "Nome da rota", p.rota, "placeholder=\"Ex.: Centro\"") + campo("cidade", "Cidade", p.cidade, "") + campo("bairros", "Bairros onde você costuma passar", p.bairros, 'placeholder="Ex.: Centro, Vila Nova"') +
          '<span class="rot l">Dias em que você circula</span>' + opc("dias", DIAS, p.dias) +
          '<span class="rot l">Avisar clientes até qual distância da rota?</span>' + opc("distancia", DIST, p.distancia ? [p.distancia] : ["Normal"], "radio") + '<p class="nota-m" id="dist-dica">' + (DISTDICA[p.distancia || "Normal"]) + '</p>'; },
      l: function (f, p) { var e = []; p.rota = f.rota.value.trim(); p.cidade = f.cidade.value.trim(); p.bairros = f.bairros.value.trim(); p.dias = marcados(f, "dias"); p.distancia = marcados(f, "distancia")[0] || "Normal";
        if (!p.rota) e.push(["rota", "Dê um nome para a sua rota."]);
        if (!p.cidade) e.push(["cidade", "Digite a sua cidade."]);
        if (!p.dias.length) e.push(["dias", "Marque pelo menos um dia."]);
        return e; } }
  ] : [
    { t: "Você é…", h: function (p) { return '<span class="rot l">Escolha o seu tipo</span>' + opc("tipoApoio", TIPOS, p.tipoApoio ? [p.tipoApoio] : [], "radio"); },
      l: function (f, p) { p.tipoApoio = marcados(f, "tipoApoio")[0] || ""; return p.tipoApoio ? [] : [["tipoApoio", "Escolha empresa ou profissional autônomo."]]; } },
    { t: "Quem é você", h: function (p) { return campo("nome", "Nome da empresa ou do profissional", p.nome, "") + campo("responsavel", "Nome do responsável", p.responsavel, "autocomplete=name") + campo("documento", "CNPJ ou CPF (opcional)", p.documento, "inputmode=numeric"); },
      l: function (f, p) { var e = []; p.nome = f.nome.value.trim(); p.responsavel = f.responsavel.value.trim(); p.documento = f.documento.value.trim();
        if (!p.nome) e.push(["nome", "Digite o nome da empresa ou do profissional."]);
        if (!p.responsavel) e.push(["responsavel", "Digite o nome do responsável."]);
        return e; } },
    { t: "Como você pode apoiar", h: function (p) { return '<span class="rot l">Áreas em que você atua (pode marcar várias)</span>' + opc("areas", AREAS, p.areas) + '<label class="l" for="apoio">Conte, em poucas palavras, como pode apoiar vendedores</label><textarea id="apoio" name="apoio" rows="4">' + esc(p.apoio) + '</textarea>'; },
      l: function (f, p) { p.areas = marcados(f, "areas"); p.apoio = f.apoio.value.trim(); return p.areas.length ? [] : [["areas", "Marque pelo menos uma área."]]; } },
    { t: "Contato", h: function (p) { return campo("cidade", "Cidade", p.cidade, "") + campo("telefone", "Telefone com DDD", p.telefone, "autocomplete=tel inputmode=tel placeholder=\"(00) 00000-0000\"", "tel"); },
      l: function (f, p) { var e = []; p.cidade = f.cidade.value.trim(); p.telefone = f.telefone.value.trim();
        if (!p.cidade) e.push(["cidade", "Digite a sua cidade."]);
        if (!p.telefone) e.push(["telefone", "Digite seu telefone com DDD."]); else if (!TCForm.telefone(p.telefone)) e.push(["telefone", "Telefone incompleto. Use DDD + número, como (81) 99999-9999."]);
        return e; } }
  ];

  function completo() { var p = user.perfil; return !!p && (ehVend ? p.vende && p.vende.length && p.cidade && p.negocio : p.areas && p.areas.length && p.telefone); }
  function rascunho() { try { return JSON.parse(sessionStorage.getItem(CH_RASC)); } catch (e) { return null; } }
  function guarda(p, i) { try { sessionStorage.setItem(CH_RASC, JSON.stringify(Object.assign({}, p, { _i: i }))); } catch (e) {} }
  function limpaRascunho() { try { sessionStorage.removeItem(CH_RASC); } catch (e) {} }

  function mostraErros(form, erros) {
    TCForm.limpaTudo(form); form.querySelectorAll(".erro-grupo").forEach(function (g) { g.remove(); });
    var primeiro = null;
    erros.forEach(function (x) {
      var campoEl = form.elements[x[0]];
      if (campoEl && campoEl.tagName === "INPUT" || campoEl && campoEl.tagName === "TEXTAREA") { TCForm.erro(campoEl, x[1]); primeiro = primeiro || campoEl; }
      else { var g = form.querySelector('.opcoes[data-g="' + x[0] + '"]'); if (g) { var p = document.createElement("p"); p.className = "erro-campo erro-grupo"; p.setAttribute("role", "alert"); p.textContent = x[1]; g.insertAdjacentElement("afterend", p); primeiro = primeiro || g.querySelector("input"); } }
    });
    if (primeiro) { primeiro.focus(); primeiro.scrollIntoView({ block: "center", behavior: "smooth" }); }
  }

  function cadastro(editando) {
    var rasc = rascunho(), exemplo = TC.perfilExemplo(user.tipo);
    var p = JSON.parse(JSON.stringify(user.perfil || (rasc ? rasc : exemplo))), i = (!user.perfil && rasc && rasc._i) || 0; delete p._i;
    var preenchido = !user.perfil;
    function pinta() {
      var ultimo = i === PASSOS.length - 1;
      var pins = PASSOS.map(function (_, k) { return '<i class="' + (k < i ? "on" : k === i ? "at" : "") + '">' + (k < i ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>' : (k + 1)) + '</i>' + (k < PASSOS.length - 1 ? '<s class="' + (k < i ? "on" : "") + '"></s>' : ""); }).join("");
      el.innerHTML = '<section class="pn-ban curto" aria-label="Cadastro"' + FOTO + '><span class="eyebrow">' + (editando ? "Meu cadastro" : "Vamos começar") + '</span><h1>' + PASSOS[i].t + '</h1><p>Passo ' + (i + 1) + ' de ' + PASSOS.length + '</p></section>' +
        '<div class="pn-pins" role="img" aria-label="Passo ' + (i + 1) + ' de ' + PASSOS.length + '">' + pins + '</div>' +
        (preenchido && i === 0 ? '<p class="rascunho-nota">Protótipo: já deixamos tudo preenchido. É só continuar, ou mudar o que quiser.</p>' : '') +
        '<form id="pf" novalidate>' + PASSOS[i].h(p) +
        '<div class="nav-b">' + (i > 0 ? '<button type="button" class="btn ln-d" id="volta">Voltar</button>' : '<span></span>') +
        '<button class="btn or" type="submit" id="prox">' + (ultimo ? "Salvar cadastro" : "Continuar") + '</button></div></form>';
      foco.focus({ preventScroll: true });
      var f = document.getElementById("pf");
      TCForm.ativaMascara(f); TCForm.limpaAoDigitar(f);
      var dd = document.getElementById("dist-dica");
      if (dd) f.addEventListener("change", function (e) { if (e.target.name === "distancia") dd.textContent = DISTDICA[e.target.value]; });
      var ow = document.getElementById("outro-w");
      if (ow) f.addEventListener("change", function (e) { if (e.target.name === "vende") ow.hidden = !f.querySelector('input[name="vende"][value="Outro"]').checked; });
      f.addEventListener("change", function () { PASSOS[i].l(f, p); guarda(p, i); });
      var v = document.getElementById("volta");
      if (v) v.onclick = function () { PASSOS[i].l(f, p); guarda(p, i - 1); i--; pinta(); };
      f.onsubmit = function (e) {
        e.preventDefault();
        var erros = PASSOS[i].l(f, p);
        if (erros.length) { mostraErros(f, erros); return; }
        if (!ultimo) { guarda(p, i + 1); i++; pinta(); return; }
        var b = document.getElementById("prox"); TCForm.enviando(b, true, "Salvando…");
        TC.salvarPerfil(p).then(function (u) { limpaRascunho(); user = u; ir("inicio"); })
          .catch(function () { TCForm.enviando(b, false); mostraErros(f, [[Object.keys(f.elements)[0] && "nome", "Algo não deu certo agora. Tente de novo em instantes."]]); });
      };
    }
    pinta();
  }

  var CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';
  var SPARK = '<svg width="86" height="34" viewBox="0 0 86 34" aria-hidden="true"><path d="M2 28 C20 28 22 8 40 12 S66 30 84 6" fill="none" stroke="#FC4200" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 7"/></svg>';
  function lista(t) { return String(t || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean); }
  function pontosDaRota() {
    var p = user.perfil || {};
    var l = ehVend ? lista(p.bairros) : (p.areas || []);
    if (!l.length) l = ehVend ? [p.cidade || "Sua cidade"] : [p.cidade || "Sua cidade"];
    return l.slice(0, 5);
  }
  // posiciona os pins ao longo da linha pontilhada
  function colocaPins() {
    var svg = document.getElementById("rmap"); if (!svg) return;
    var path = svg.querySelector("path"), g = svg.querySelector("g"), pts = pontosDaRota(), len = path.getTotalLength(), ns = "http://www.w3.org/2000/svg";
    pts.forEach(function (nome, k) {
      var t = pts.length === 1 ? 0.5 : 0.1 + 0.8 * k / (pts.length - 1), pt = path.getPointAtLength(len * t);
      var gi = document.createElementNS(ns, "g"); gi.setAttribute("transform", "translate(" + pt.x.toFixed(1) + " " + pt.y.toFixed(1) + ")");
      var c1 = document.createElementNS(ns, "circle"); c1.setAttribute("r", 14); c1.setAttribute("fill", "#FC4200");
      var c2 = document.createElementNS(ns, "circle"); c2.setAttribute("r", 5); c2.setAttribute("fill", "#fff");
      var tx = document.createElementNS(ns, "text"); tx.textContent = nome; tx.setAttribute("y", k % 2 ? 40 : -24);
      gi.appendChild(c1); gi.appendChild(c2); gi.appendChild(tx); g.appendChild(gi);
    });
  }
  function inicio() {
    var p = user.perfil || {};
    var nome = esc((p.nome || "").split(" ")[0] || "por aqui");
    var vende = (p.vende || []).map(function (x) { return x === "Outro" && p.vendeOutro ? "Outro: " + p.vendeOutro : x; });
    var tags = function (arr) { return '<span class="pn-tags">' + arr.map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("") + "</span>"; };
    var chips = '<span class="pn-chip"><span class="ok">' + CHECK.replace('width="14" height="14"', 'width="12" height="12"') + '</span>Cadastro completo</span><span class="pn-chip">' + esc(p.cidade) + '</span>' + (ehVend ? '<span class="pn-chip">' + esc(p.meio) + '</span>' : '<span class="pn-chip">' + esc(p.tipoApoio) + '</span>');
    var dias = ehVend ? '<div class="pn-dias">' + DIAS.map(function (d) { return '<span class="' + ((p.dias || []).indexOf(d) > -1 ? "" : "off") + '">' + d + "</span>"; }).join("") + "</div>" : "";
    var rota = '<article class="pn-bc rota"><h2>' + (ehVend ? esc(p.rota || "Sua rota") : "Onde posso apoiar") + '</h2><p class="sub">' + (ehVend ? "Onde você costuma passar, e em quais dias." : "As áreas em que você atua, em " + esc(p.cidade) + ".") + '</p>' +
      '<svg class="pn-rmap" id="rmap" viewBox="0 0 600 190" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path d="M30 140 C120 140 130 50 230 60 S340 150 410 110 S520 40 570 60" fill="none" stroke="#FC4200" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 13"/><g font-family="Poppins" font-weight="700" font-size="14" fill="#fff" text-anchor="middle"></g></svg>' + dias + '</article>';
    var baixe = ehVend
      ? '<article class="pn-bc baixe"><div><span class="soon" style="display:inline-block;background:#01172E;color:#fff;padding:6px 12px;border-radius:99px;font-weight:800;font-size:.8rem">Em breve</span></div><div><p class="big">O app será liberado no lançamento oficial.</p><p style="margin-top:8px">Você será avisado.</p></div></article>'
      : '<article class="pn-bc baixe"><div><span class="soon" style="display:inline-block;background:#01172E;color:#fff;padding:6px 12px;border-radius:99px;font-weight:800;font-size:.8rem">Em desenvolvimento</span></div><div><p class="big">A Rede de Apoio ainda está sendo formada.</p><p style="margin-top:8px">A participação depende de definição e formalização. Avisaremos você.</p></div></article>';
    var prox = '<article class="pn-bc prox"><h2>Seus próximos passos</h2><ul class="pn-tl"><li class="ok"><span class="p">' + CHECK + '</span><div>Conta criada</div></li><li class="ok"><span class="p">' + CHECK + '</span><div>Cadastro completo</div></li><li class="prox"><span class="p"></span><div>' + (ehVend ? "Usar o app na sua rota" : "Acompanhar as novidades da rede") + '<small>' + (ehVend ? "No lançamento" : "Conforme a rede avançar") + '</small></div></li></ul></article>';
    var info = ehVend
      ? '<div><dt>Negócio</dt><dd>' + esc(p.negocio) + '</dd></div><div><dt>Vende</dt><dd>' + tags(vende) + '</dd></div><div><dt>Desloca-se</dt><dd>' + esc(p.meio) + '</dd></div><div><dt>Rota</dt><dd>' + esc(p.rota) + ' · ' + esc(p.cidade) + (p.bairros ? " · " + esc(p.bairros) : "") + '</dd></div><div><dt>Avisar clientes</dt><dd>' + esc(p.distancia || "Normal") + '</dd></div><div><dt>Telefone</dt><dd>' + esc(p.telefone) + '</dd></div>'
      : '<div><dt>Tipo</dt><dd>' + esc(p.tipoApoio) + '</dd></div><div><dt>Áreas</dt><dd>' + tags(p.areas || []) + '</dd></div><div><dt>Cidade</dt><dd>' + esc(p.cidade) + '</dd></div><div><dt>Contato</dt><dd>' + esc(p.telefone) + '</dd></div>';
    var cad = '<article class="pn-bc cad"><h2>Seu cadastro</h2><dl class="pn-info">' + info + '</dl><button class="btn az" id="edit">Editar cadastro</button></article>';
    var indica = '<article class="pn-bc indica"><div><h2>' + (ehVend ? "Conhece alguém que vende na rua?" : "Conhece alguém que poderia apoiar?") + '</h2><p>' + (ehVend ? "Mande o Tá Chegando para essa pessoa conhecer." : "Mande o Tá Chegando para essa pessoa conhecer a Rede de Apoio.") + '</p></div><div class="pn-acoes"><button class="btn az" id="copia" type="button">Copiar link</button><a class="btn ln-d" id="zap" target="_blank" rel="noopener" href="#">Enviar no WhatsApp</a></div><p class="pn-ok" id="copia-ok" role="status" aria-live="polite"></p></article>';
    var kp = ehVend ? ["Clientes esperando", "Regiões com clientes", "Rotas"] : ["Vendedores na rede", "Conexões", "Áreas"];
    var kpis = '<div class="pn-kpis">' + kp.map(function (k) { return '<article class="pn-bc kpi"><small>' + k + '</small><b>—</b>' + SPARK + '</article>'; }).join("") + '</div>';
    el.innerHTML = '<section class="pn-ban" aria-label="Boas-vindas"' + FOTO + '><span class="eyebrow">' + (ehVend ? "Painel do vendedor" : "Painel da Rede de Apoio") + '</span><h1>Oi, ' + nome + '!</h1><p>' + (ehVend ? "Seu cadastro está pronto. Quando o app for lançado, é por ele que você usa a sua rota." : "Seu cadastro está pronto. Avisaremos você conforme a Rede de Apoio avançar.") + '</p><div class="pn-chips">' + chips + '</div></section>' +
      '<div class="pn-bento">' + rota + baixe + prox + cad + indica + kpis + '</div><p class="nota-m">Ainda sem números por aqui. Eles aparecem quando houver uso real.</p>';
    document.getElementById("edit").onclick = function () { ir("perfil"); };
    colocaPins();
    var link = location.origin + (ehVend ? "/vendedores" : "/rede-de-apoio"), msg = (ehVend ? "Conhece o Tá Chegando? Ajuda quem vende na rua a ser encontrado: " : "Conhece a Rede de Apoio do Tá Chegando? ") + link;
    document.getElementById("zap").href = "https://wa.me/?text=" + encodeURIComponent(msg);
    document.getElementById("copia").onclick = function () {
      var ok = document.getElementById("copia-ok");
      function feito() { ok.textContent = "Link copiado!"; setTimeout(function () { ok.textContent = ""; }, 2500); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(feito, function () { ok.textContent = "Copie o link: " + link; });
      else ok.textContent = "Copie o link: " + link;
    };
  }
  function metricas() {
    el.innerHTML = '<section class="pn-ban curto" aria-label="Métricas"' + FOTO + '><span class="eyebrow">Métricas</span><h1>Seus números</h1><p>Indicadores do seu uso do app.</p></section>' +
      '<div class="pn-bento"><article class="pn-bc vazio"><h2>Ainda sem números por aqui</h2><p>Eles aparecem quando você usar o app. Hoje este painel é um protótipo, sem dados reais.</p>' + SPARK.replace('width="86" height="34"', 'width="160" height="64"') + '</article></div>';
    foco.focus({ preventScroll: true });
  }
  function ir(v) {
    cartaoUsuario();
    document.querySelectorAll("[data-v]").forEach(function (b) { if (b.dataset.v === v) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current"); });
    if (!completo()) { cadastro(false); return; }
    if (v === "perfil") cadastro(true); else if (v === "metricas") metricas(); else { inicio(); foco.focus({ preventScroll: true }); }
  }
  document.querySelectorAll("[data-v]").forEach(function (b) { b.onclick = function () { ir(b.dataset.v); window.scrollTo(0, 0); }; });
  ir("inicio");
})();
