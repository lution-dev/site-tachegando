(function () {
  var user = TC.usuarioAtual();
  if (!user) { location.replace("/entrar"); return; }
  var el = document.getElementById("conteudo");
  var ehVend = user.tipo === "vendedor";
  var CH_RASC = "tc_rascunho_" + user.email;
  document.getElementById("quem").textContent = user.email + " · " + (ehVend ? "Vendedor" : "Rede de Apoio");
  document.getElementById("sair").onclick = function () { TC.sair(); location.href = "/"; };

  var VENDE = ["Frutas e verduras", "Ovos", "Pão", "Doces", "Queijo", "Artesanato", "Flores", "Roupas", "Picolé", "Serviços", "Outro"];
  var MEIO = ["A pé", "Bicicleta", "Moto", "Carro ou caminhonete", "Carrinho", "Outro"];
  var DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  var AREAS = ["Contabilidade", "Orientação financeira", "Design", "Comunicação", "Assessoria jurídica", "Outra"];
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
      h: function (p) { return campo("nome", "Seu nome", p.nome, "autocomplete=name") + campo("telefone", "Telefone com DDD", p.telefone, "autocomplete=tel inputmode=tel placeholder=\"(00) 00000-0000\"", "tel") + '<p class="nota-m">Usamos só para falar sobre o seu cadastro.</p>'; },
      l: function (f, p) { var e = []; p.nome = f.nome.value.trim(); p.telefone = f.telefone.value.trim();
        if (!p.nome) e.push(["nome", "Digite o seu nome."]);
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
      h: function (p) { return campo("cidade", "Cidade", p.cidade, "") + campo("bairros", "Bairros onde você costuma passar", p.bairros, 'placeholder="Ex.: Centro, Vila Nova"') + '<span class="rot l">Dias em que você circula</span>' + opc("dias", DIAS, p.dias); },
      l: function (f, p) { var e = []; p.cidade = f.cidade.value.trim(); p.bairros = f.bairros.value.trim(); p.dias = marcados(f, "dias");
        if (!p.cidade) e.push(["cidade", "Digite a sua cidade."]);
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

  function completo() { var p = user.perfil; return !!p && (ehVend ? p.vende && p.vende.length && p.cidade : p.areas && p.areas.length && p.telefone); }
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
      el.innerHTML = '<span class="eyebrow">' + (editando ? "Meu cadastro" : "Vamos começar") + '</span><h1>' + PASSOS[i].t + '</h1><p class="etapa-txt">Passo ' + (i + 1) + ' de ' + PASSOS.length + '</p>' +
        '<div class="etapas-i" role="img" aria-label="Passo ' + (i + 1) + ' de ' + PASSOS.length + '">' + PASSOS.map(function (_, k) { return '<i class="' + (k <= i ? "on" : "") + '"></i>'; }).join("") + '</div>' +
        (preenchido && i === 0 ? '<p class="rascunho-nota">Protótipo: já deixamos tudo preenchido. É só continuar, ou mudar o que quiser.</p>' : '') +
        '<form id="pf" novalidate>' + PASSOS[i].h(p) +
        '<div class="nav-b">' + (i > 0 ? '<button type="button" class="btn ln-d" id="volta">Voltar</button>' : '<span></span>') +
        '<button class="btn or" type="submit" id="prox">' + (ultimo ? "Salvar cadastro" : "Continuar") + '</button></div></form>';
      el.focus({ preventScroll: true });
      var f = document.getElementById("pf");
      TCForm.ativaMascara(f); TCForm.limpaAoDigitar(f);
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

  function inicio() {
    var p = user.perfil || {};
    var nome = esc((p.nome || "").split(" ")[0] || "por aqui");
    var vende = (p.vende || []).map(function (x) { return x === "Outro" && p.vendeOutro ? "Outro: " + p.vendeOutro : x; }).join(", ");
    var linhas = ehVend
      ? '<dt>Vende</dt><dd>' + esc(vende) + '</dd><dt>Desloca-se</dt><dd>' + esc(p.meio) + '</dd><dt>Região</dt><dd>' + esc(p.cidade) + (p.bairros ? " · " + esc(p.bairros) : "") + '</dd><dt>Dias</dt><dd>' + esc((p.dias || []).join(", ") || "Não informado") + '</dd><dt>Telefone</dt><dd>' + esc(p.telefone) + '</dd>'
      : '<dt>Tipo</dt><dd>' + esc(p.tipoApoio) + '</dd><dt>Áreas</dt><dd>' + esc((p.areas || []).join(", ")) + '</dd><dt>Cidade</dt><dd>' + esc(p.cidade) + '</dd><dt>Contato</dt><dd>' + esc(p.telefone) + '</dd>';
    var kp = ehVend ? ["Paradas pedidas", "Regiões com interesse", "Rotas"] : ["Vendedores na rede", "Conexões", "Áreas"];
    el.innerHTML = '<span class="eyebrow">Início</span><h1>Oi, ' + nome + '!</h1>' +
      '<p class="lead">' + (ehVend ? "Seu cadastro está pronto. Quando o app for lançado, é por ele que você usa a sua rota." : "Seu cadastro está pronto. Avisaremos você conforme a Rede de Apoio avançar.") + '</p>' +
      '<div class="cards">' +
      '<section class="card2"><h3>Seus próximos passos</h3><ul class="passos-l"><li class="ok"><i>✓</i>Conta criada</li><li class="ok"><i>✓</i>Cadastro completo</li><li><i>3</i>' + (ehVend ? "Usar o app na sua rota (no lançamento)" : "Acompanhar as novidades da rede") + '</li></ul></section>' +
      '<section class="card2 dest"><h3>' + (ehVend ? "Baixe o app" : "Rede de Apoio") + '</h3><p>' + (ehVend ? "O app será liberado no lançamento oficial. Você será avisado." : "A rede está em desenvolvimento. A participação depende de definição e formalização.") + '</p><span class="soon" style="background:#01172E;color:#fff;display:inline-block;padding:6px 12px;border-radius:99px;font-weight:800;font-size:.8rem">' + (ehVend ? "Em breve" : "Em desenvolvimento") + '</span></section>' +
      '<section class="card2"><h3>Seu cadastro</h3><dl class="resumo">' + linhas + '</dl><p style="margin-top:16px"><button class="btn az sm" id="edit">Editar cadastro</button></p></section></div>' +
      '<div class="kpis">' + kp.map(function (k) { return '<div><small>' + k + '</small><b>—</b></div>'; }).join("") + '</div>' +
      '<p class="nota-m">Ainda sem números por aqui. Eles aparecem quando houver uso real.</p>';
    document.getElementById("edit").onclick = function () { ir("perfil"); };
  }
  function metricas() {
    el.innerHTML = '<span class="eyebrow">Métricas</span><h1>Seus números</h1><div class="card2 vazio"><h3>Ainda sem números por aqui</h3><p>Eles aparecem quando você usar o app. Hoje este painel é um protótipo, sem dados reais.</p></div>';
    el.focus({ preventScroll: true });
  }
  function ir(v) {
    document.querySelectorAll(".pn-lat [data-v]").forEach(function (b) { if (b.dataset.v === v) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current"); });
    if (!completo()) { cadastro(false); return; }
    if (v === "perfil") cadastro(true); else if (v === "metricas") metricas(); else { inicio(); el.focus({ preventScroll: true }); }
  }
  document.querySelectorAll(".pn-lat [data-v]").forEach(function (b) { b.onclick = function () { ir(b.dataset.v); }; });
  ir("inicio");
})();
