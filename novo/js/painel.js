(function () {
  var user = TC.usuarioAtual();
  if (!user) { location.replace("/entrar"); return; }
  var el = document.getElementById("tela"), foco = document.getElementById("conteudo");
  var ehVend = user.tipo === "vendedor";
  var CH_RASC = "tc_rascunho_" + user.email;
  function cartaoUsuario() {
    var n = (user.perfil && user.perfil.nome) || "Sua conta";
    var ini = n.split(" ").filter(Boolean).slice(0, 2).map(function (x) { return x.charAt(0); }).join("").toUpperCase() || "TC";
    document.getElementById("quem").innerHTML = '<span class="av" aria-hidden="true">' + esc(ini) + '</span><span class="tx"><b>' + esc(n) + '</b><span class="fn">' + (ehVend ? "Vendedor" : "Rede de Apoio") + '</span><span class="em">' + esc(user.email) + '</span></span>';
  }
  function sair() { TC.sair(); location.href = "/"; }
  document.getElementById("sair").onclick = sair; document.getElementById("sair-m").onclick = sair;

  var VENDE = ["Frutas e verduras", "Ovos", "Pão", "Doces", "Queijo", "Artesanato", "Flores", "Roupas", "Picolé", "Serviços", "Outro"];
  var MEIO = ["A pé", "Bicicleta", "Moto", "Carro ou caminhonete", "Carrinho", "Outro"];
  var DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  var AREAS = ["Contabilidade", "Orientação financeira", "Design", "Comunicação", "Assessoria jurídica", "Outra"];
  var FOTO = ehVend ? '' : ' style="--foto:url(img/hero-apoio.webp)"';
  var DIST = ["Perto", "Normal", "Mais longe"];
  var DISTDICA = { "Perto": "Só avisa quem está bem perto de você.", "Normal": "Serve pra maioria das rotas.", "Mais longe": "Avisa também quem está um pouco mais longe." };
  function cnpjOk(v) {
    var d = String(v).replace(/\D/g, ""); if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
    function dv(n) { var s = 0, pos = n - 7; for (var i = n; i >= 1; i--) { s += d[n - i] * pos--; if (pos < 2) pos = 9; } var r = s % 11; return r < 2 ? 0 : 11 - r; }
    return dv(12) == d[12] && dv(13) == d[13];
  }
  function mascaraCnpj(v) { var d = String(v).replace(/\D/g, "").slice(0, 14); return d.replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2"); }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function opc(nome, lista, sel, tipo) {
    return '<div class="opcoes" data-g="' + nome + '">' + lista.map(function (o) {
      return '<label><input type="' + (tipo || "checkbox") + '" name="' + nome + '" value="' + esc(o) + '"' + ((sel || []).indexOf(o) > -1 ? " checked" : "") + '><span>' + esc(o) + '</span></label>';
    }).join("") + '</div>';
  }
  function marcados(f, n) { return Array.from(f.querySelectorAll('input[name="' + n + '"]:checked')).map(function (i) { return i.value; }); }
  function campo(id, rot, val, extra, tipo, largo) { return '<div class="cp' + (largo ? " largo" : "") + '"><label class="l" for="' + id + '">' + rot + '</label><input type="' + (tipo || "text") + '" id="' + id + '" name="' + id + '" value="' + esc(val) + '" ' + (extra || "") + '></div>'; }
  function grupo(rot, corpo, cls) { return '<div class="gp' + (cls ? " " + cls : "") + '"><span class="rot l">' + rot + '</span>' + corpo + '</div>'; }

  // cada validação devolve uma lista de [campo, mensagem]
  var PASSOS = ehVend ? [
    { t: "Seus dados", d: "Quem é você e como a gente chama o seu negócio.",
      h: function (p) { return campo("nome", "Seu nome", p.nome, "autocomplete=name") + campo("negocio", "Nome do seu negócio", p.negocio, "placeholder=\"Ex.: Frutas do João\" autocomplete=off") + campo("telefone", "Telefone com DDD", p.telefone, "autocomplete=tel inputmode=tel placeholder=\"(00) 00000-0000\"", "tel") + '<p class="nota-m largo">Só usamos pra falar do seu cadastro.</p>'; },
      l: function (f, p) { var e = []; p.nome = f.nome.value.trim(); p.negocio = f.negocio.value.trim(); p.telefone = f.telefone.value.trim();
        if (!p.nome) e.push(["nome", "Falta o seu nome."]);
        if (!p.negocio) e.push(["negocio", "Qual o nome do seu negócio?"]);
        if (!p.telefone) e.push(["telefone", "Falta o telefone, com DDD."]); else if (!TCForm.telefone(p.telefone)) e.push(["telefone", "Esse telefone tá faltando número. Use o DDD e o número, tipo (13) 99999-9999."]);
        return e; } },
    { t: "O que você vende", d: "Isso ajuda quem procura a achar você.",
      h: function (p) { return grupo("O que você vende? Pode marcar mais de um.", opc("vende", VENDE, p.vende)) +
          '<div id="outro-w" class="gp"' + ((p.vende || []).indexOf("Outro") > -1 ? "" : " hidden") + '>' + campo("vendeOutro", "O que mais você vende?", p.vendeOutro, "", "text", true) + '</div>' +
          grupo("Como você sai pra vender?", opc("meio", MEIO, p.meio ? [p.meio] : [], "radio")); },
      l: function (f, p) { var e = []; p.vende = marcados(f, "vende"); p.meio = marcados(f, "meio")[0] || ""; p.vendeOutro = f.vendeOutro ? f.vendeOutro.value.trim() : "";
        if (!p.vende.length) e.push(["vende", "Marque o que você vende, nem que seja uma coisa só."]);
        if (p.vende.indexOf("Outro") > -1 && !p.vendeOutro) e.push(["vendeOutro", "Escreva o que mais você vende."]);
        if (!p.meio) e.push(["meio", "Marque como você sai pra vender."]);
        return e; } },
    { t: "Sua rota", d: "Por onde você passa, em que dias e quem a gente avisa.",
      h: function (p) { return campo("rota", "Nome da rota", p.rota, "placeholder=\"Ex.: Centro\"") + campo("cidade", "Cidade", p.cidade, "autocomplete=address-level2") + campo("bairros", "Bairros onde você costuma passar", p.bairros, 'placeholder="Ex.: Centro, Vila Nova"', "text", true) +
          grupo("Em que dias você sai?", opc("dias", DIAS, p.dias), "dias") +
          grupo("A que distância da rota o cliente é avisado?", opc("distancia", DIST, p.distancia ? [p.distancia] : ["Normal"], "radio") + '<p class="nota-m dica" id="dist-dica" aria-live="polite">' + (DISTDICA[p.distancia || "Normal"]) + '</p>', "dist"); },
      l: function (f, p) { var e = []; p.rota = f.rota.value.trim(); p.cidade = f.cidade.value.trim(); p.bairros = f.bairros.value.trim(); p.dias = marcados(f, "dias"); p.distancia = marcados(f, "distancia")[0] || "Normal";
        if (!p.rota) e.push(["rota", "Dê um nome pra rota. Pode ser o do bairro."]);
        if (!p.cidade) e.push(["cidade", "Falta a cidade."]);
        if (!p.dias.length) e.push(["dias", "Marque os dias em que você sai."]);
        return e; } }
  ] : [
    { t: "Sua empresa", d: "O básico pra equipe conferir quem é a empresa.",
      h: function (p) { return campo("nome", "Nome da empresa", p.nome, "autocomplete=organization") + campo("cnpj", "CNPJ", p.cnpj, "inputmode=numeric autocomplete=off placeholder=\"00.000.000/0000-00\"") + campo("site", "Site ou rede social da empresa", p.site, "placeholder=\"Ex.: www.suaempresa.com.br\"", "text", true) + '<p class="nota-m largo">Com esses dados, a equipe confere se a empresa existe e está funcionando.</p>'; },
      l: function (f, p) { var e = []; p.nome = f.nome.value.trim(); p.cnpj = f.cnpj.value.trim(); p.site = f.site.value.trim();
        if (!p.nome) e.push(["nome", "Falta o nome da empresa."]);
        if (!p.cnpj) e.push(["cnpj", "Falta o CNPJ."]); else if (!cnpjOk(p.cnpj)) e.push(["cnpj", "Esse CNPJ não bateu. Confira os 14 números."]);
        if (!p.site) e.push(["site", "Coloque o site ou a rede social da empresa. A equipe usa pra conferir."]);
        return e; } },
    { t: "Contato da empresa", d: "Com quem a equipe pode falar.", h: function (p) { return campo("responsavel", "Nome do responsável", p.responsavel, "autocomplete=name") + campo("telefone", "Telefone com DDD", p.telefone, "autocomplete=tel inputmode=tel placeholder=\"(00) 00000-0000\"", "tel") + campo("cidade", "Cidade da empresa", p.cidade, "autocomplete=address-level2"); },
      l: function (f, p) { var e = []; p.responsavel = f.responsavel.value.trim(); p.telefone = f.telefone.value.trim(); p.cidade = f.cidade.value.trim();
        if (!p.responsavel) e.push(["responsavel", "Falta o nome do responsável."]);
        if (!p.telefone) e.push(["telefone", "Falta o telefone, com DDD."]); else if (!TCForm.telefone(p.telefone)) e.push(["telefone", "Esse telefone tá faltando número. Use o DDD e o número, tipo (81) 99999-9999."]);
        if (!p.cidade) e.push(["cidade", "Falta a cidade da empresa."]);
        return e; } },
    { t: "Como a empresa apoia", d: "Em que a empresa pode ajudar quem vende na rua.", h: function (p) { return grupo("Em que áreas a empresa atua? Pode marcar mais de uma.", opc("areas", AREAS, p.areas)) + '<div class="cp largo"><label class="l" for="apoio">Em poucas palavras, como a empresa pode ajudar vendedores?</label><textarea id="apoio" name="apoio" rows="4">' + esc(p.apoio) + '</textarea></div>'; },
      l: function (f, p) { p.areas = marcados(f, "areas"); p.apoio = f.apoio.value.trim(); return p.areas.length ? [] : [["areas", "Marque ao menos uma área."]]; } }
  ];

  function completo() { var p = user.perfil; return !!p && (ehVend ? p.vende && p.vende.length && p.cidade && p.negocio : p.areas && p.areas.length && p.telefone && p.cnpj); }
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
    function pinta() {
      var ultimo = i === PASSOS.length - 1;
      var pins = PASSOS.map(function (x, k) { return '<li class="' + (k < i ? "on" : k === i ? "at" : "") + '"' + (k === i ? ' aria-current="step"' : "") + '><i>' + (k < i ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>' : (k + 1)) + '</i><span>' + x.t + '</span></li>'; }).join("");
      el.innerHTML = '<section class="pn-ban curto" aria-label="Cadastro"' + FOTO + '><span class="eyebrow">' + (editando ? "Meu cadastro" : "Vamos começar") + '</span><h1>' + PASSOS[i].t + '</h1><p>Passo ' + (i + 1) + ' de ' + PASSOS.length + '. ' + PASSOS[i].d + '</p></section>' +
        '<ol class="pn-passos" aria-label="Passos do cadastro">' + pins + '</ol>' +
        '<form id="pf" novalidate>' + PASSOS[i].h(p) +
        '<div class="nav-b">' + (i > 0 ? '<button type="button" class="btn ln-d" id="volta">Voltar</button>' : '<span></span>') +
        '<button class="btn or" type="submit" id="prox">' + (ultimo ? "Salvar cadastro" : "Continuar") + '</button></div></form>';
      foco.focus({ preventScroll: true });
      var f = document.getElementById("pf");
      TCForm.ativaMascara(f); TCForm.limpaAoDigitar(f);
      var cj = f.querySelector("#cnpj"); if (cj) cj.classList.add("cnpj");
      cj = f.querySelector("#cnpj"); if (cj) { cj.value = mascaraCnpj(cj.value); cj.addEventListener("input", function () { cj.value = mascaraCnpj(cj.value); }); }
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
        if (!ehVend && !p.status) p.status = "em_verificacao";
        TC.salvarPerfil(p).then(function (u) { limpaRascunho(); user = u; ir("inicio"); })
          .catch(function () {
            TCForm.enviando(b, false);
            var ef = f.querySelector(".erro-form"); if (!ef) { ef = document.createElement("p"); ef.className = "erro-campo erro-form"; ef.setAttribute("role", "alert"); f.querySelector(".nav-b").insertAdjacentElement("beforebegin", ef); }
            ef.textContent = "Não deu pra salvar agora. Tente de novo daqui a pouco.";
          });
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
  // pins em HTML sobre a linha pontilhada: rótulos legíveis em qualquer largura
  var TRACO = "M30 140 C120 140 130 50 230 60 S340 150 410 110 S520 40 570 60";
  function colocaPins() {
    var box = document.getElementById("rmap"); if (!box) return;
    var path = box.querySelector("path"), pts = pontosDaRota(), len = path.getTotalLength();
    pts.forEach(function (nome, k) {
      var t = pts.length === 1 ? 0.5 : 0.08 + 0.84 * k / (pts.length - 1), pt = path.getPointAtLength(len * t);
      var x = pt.x / 6, y = pt.y / 1.9, pos = pts.length > 1 && k === 0 ? "ini" : pts.length > 1 && k === pts.length - 1 ? "fim" : "";
      var d = document.createElement("span"); d.className = "pin " + (k % 2 ? "baixo" : "cima") + (pos ? " " + pos : "");
      d.style.left = x.toFixed(2) + "%"; d.style.top = y.toFixed(2) + "%";
      d.innerHTML = '<i></i><b title="' + esc(nome) + '">' + esc(nome) + '</b>';
      box.appendChild(d);
    });
  }
  function inicio() {
    var p = user.perfil || {};
    var nome = esc(((ehVend ? p.nome : p.responsavel) || "").split(" ")[0] || "por aqui");
    var vende = (p.vende || []).map(function (x) { return x === "Outro" && p.vendeOutro ? "Outro: " + p.vendeOutro : x; });
    var tags = function (arr) { return '<span class="pn-tags">' + arr.map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("") + "</span>"; };
    var chips = '<span class="pn-chip"><span class="ok">' + CHECK.replace('width="14" height="14"', 'width="12" height="12"') + '</span>Cadastro completo</span><span class="pn-chip">' + esc(p.cidade) + '</span>' + (ehVend ? '<span class="pn-chip">' + esc(p.meio) + '</span>' : '<span class="pn-chip">Em verificação</span>');
    var dias = ehVend ? '<div class="pn-dias">' + DIAS.map(function (d) { return '<span class="' + ((p.dias || []).indexOf(d) > -1 ? "" : "off") + '">' + d + "</span>"; }).join("") + "</div>" : "";
    var rota = '<article class="pn-bc rota"><h2>' + (ehVend ? esc(p.rota || "Sua rota") : "Onde a empresa apoia") + '</h2><p class="sub">' + (ehVend ? "Por onde você passa e em que dias." : "Áreas em que a empresa atua, em " + esc(p.cidade) + ".") + '</p>' +
      '<div class="pn-rmap" id="rmap" role="img" aria-label="Pontos: ' + esc(pontosDaRota().join(", ")) + '"><svg viewBox="0 0 600 190" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="' + TRACO + '" fill="none" stroke="#FC4200" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 12" vector-effect="non-scaling-stroke"/></svg></div>' + dias + '</article>';
    var baixe = ehVend
      ? '<article class="pn-bc baixe"><div><span class="soon">Em breve</span></div><div><h2 class="big">O app sai no lançamento oficial.</h2><p class="txt">Quando chegar a hora, a gente avisa você.</p></div></article>'
      : '<article class="pn-bc baixe"><div><span class="soon">Em verificação</span></div><div><h2 class="big">Sua empresa está em verificação.</h2><p class="txt">Nossa equipe está conferindo se ela existe e está funcionando. Depois a gente entra em contato.</p></div></article>';
    var prox = ehVend
      ? '<article class="pn-bc prox"><h2>O que falta</h2><ul class="pn-tl"><li class="ok"><span class="p">' + CHECK + '</span><div>Conta criada</div></li><li class="ok"><span class="p">' + CHECK + '</span><div>Cadastro completo</div></li><li class="prox"><span class="p"></span><div>Usar o app na sua rota<small>No lançamento</small></div></li></ul></article>'
      : '<article class="pn-bc prox"><h2>O que falta</h2><ul class="pn-tl"><li class="ok"><span class="p">' + CHECK + '</span><div>Conta criada</div></li><li class="ok"><span class="p">' + CHECK + '</span><div>Candidatura enviada</div></li><li class="prox"><span class="p"></span><div>Equipe confere a empresa<small>Em andamento</small></div></li><li class="fut"><span class="p"></span><div>Entrada na Rede de Apoio<small>Depois de aprovada</small></div></li></ul></article>';
    var info = ehVend
      ? '<div><dt>Negócio</dt><dd>' + esc(p.negocio) + '</dd></div><div><dt>Vende</dt><dd>' + tags(vende) + '</dd></div><div><dt>Vai de</dt><dd>' + esc(p.meio) + '</dd></div><div><dt>Rota</dt><dd>' + esc(p.rota) + ' · ' + esc(p.cidade) + (p.bairros ? " · " + esc(p.bairros) : "") + '</dd></div><div><dt>Avisar clientes</dt><dd>' + esc(p.distancia || "Normal") + '</dd></div><div><dt>Telefone</dt><dd>' + esc(p.telefone) + '</dd></div>'
      : '<div><dt>Empresa</dt><dd>' + esc(p.nome) + '</dd></div><div><dt>CNPJ</dt><dd>' + esc(p.cnpj) + '</dd></div><div><dt>Site ou rede</dt><dd>' + esc(p.site) + '</dd></div><div><dt>Responsável</dt><dd>' + esc(p.responsavel) + '</dd></div><div><dt>Áreas</dt><dd>' + tags(p.areas || []) + '</dd></div><div><dt>Cidade</dt><dd>' + esc(p.cidade) + '</dd></div><div><dt>Contato</dt><dd>' + esc(p.telefone) + '</dd></div><div><dt>Situação</dt><dd>Em verificação</dd></div>';
    var cad = '<article class="pn-bc cad"><h2>Seu cadastro</h2><dl class="pn-info">' + info + '</dl><button class="btn az" id="edit">Editar cadastro</button></article>';
    var indica = '<article class="pn-bc indica"><div><h2>' + (ehVend ? "Conhece alguém que vende na rua?" : "Conhece uma empresa que poderia apoiar?") + '</h2><p>' + (ehVend ? "Manda o Tá Chegando pra ela dar uma olhada." : "Passe a Rede de Apoio pra ela. Quem é indicado passa pela mesma verificação.") + '</p></div><div class="pn-acoes"><button class="btn az" id="copia" type="button">Copiar link</button><a class="btn ln-d" id="zap" target="_blank" rel="noopener" href="#">Enviar no WhatsApp</a></div><p class="pn-ok" id="copia-ok" role="status" aria-live="polite"></p></article>';
    var kp = ehVend ? ["Clientes esperando", "Onde tem clientes", "Rotas"] : ["Vendedores na rede", "Contatos", "Áreas"];
    var kpis = '<div class="pn-sec"><h2>Seus números</h2><p>Eles aparecem quando você começar a usar o app.</p></div><div class="pn-kpis">' + kp.map(function (k) { return '<article class="pn-bc kpi"><small>' + k + '</small><b aria-label="sem dados ainda">&ndash;</b>' + SPARK + '</article>'; }).join("") + '</div>';
    el.innerHTML = '<section class="pn-ban" aria-label="Boas-vindas"' + FOTO + '><span class="eyebrow">' + (ehVend ? "Painel do vendedor" : "Candidatura da Rede de Apoio") + '</span><h1>Oi, ' + nome + '</h1><p>' + (ehVend ? "Cadastro pronto. Quando o app sair, é nele que você grava a sua rota." : "Recebemos a candidatura da sua empresa. Agora a equipe confere os dados.") + '</p><div class="pn-chips">' + chips + '</div></section>' +
      '<div class="pn-bento">' + rota + baixe + prox + cad + indica + kpis + '</div>';
    document.getElementById("edit").onclick = function () { ir("perfil"); };
    colocaPins();
    var link = location.origin + (ehVend ? "/vendedores" : "/rede-de-apoio"), msg = (ehVend ? "Olha o Tá Chegando, um app pra quem vende na rua ser encontrado: " : "Olha a Rede de Apoio do Tá Chegando: ") + link;
    document.getElementById("zap").href = "https://wa.me/?text=" + encodeURIComponent(msg);
    document.getElementById("copia").onclick = function () {
      var ok = document.getElementById("copia-ok");
      function feito() { ok.textContent = "Link copiado."; setTimeout(function () { ok.textContent = ""; }, 2500); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(feito, function () { ok.textContent = "Copie o link: " + link; });
      else ok.textContent = "Copie o link: " + link;
    };
  }
  function metricas() {
    var kp = ehVend ? ["Clientes esperando", "Onde tem clientes", "Rotas"] : ["Vendedores na rede", "Contatos", "Áreas"];
    var prev = '<div class="pn-kpis">' + kp.map(function (k) { return '<article class="pn-bc kpi"><small>' + k + '</small><b aria-label="sem dados ainda">&ndash;</b>' + SPARK + '</article>'; }).join("") + '</div>';
    el.innerHTML = '<section class="pn-ban curto" aria-label="Métricas"' + FOTO + '><span class="eyebrow">Métricas</span><h1>Seus números</h1><p>O que o app mostrar sobre o seu uso.</p></section>' +
      '<div class="pn-bento"><article class="pn-bc vazio"><div><span class="soon">Em breve</span><h2>Ainda não tem número por aqui</h2><p>Quando o app estiver em uso, os números aparecem nesta tela.</p></div>' + SPARK.replace('width="86" height="34"', 'width="160" height="64"') + '</article>' + prev + '</div>';
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
