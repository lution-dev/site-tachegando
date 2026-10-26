(function () {
  var user = TC.usuarioAtual();
  if (!user) { location.replace("entrar.html"); return; }
  var el = document.getElementById("conteudo");
  var ehVend = user.tipo === "vendedor";
  document.getElementById("quem").textContent = user.email + " · " + (ehVend ? "Vendedor" : "Rede de Apoio");
  document.getElementById("sair").onclick = function () { TC.sair(); location.href = "index.html"; };

  var VENDE = ["Frutas e verduras", "Ovos", "Pão", "Doces", "Queijo", "Artesanato", "Flores", "Roupas", "Picolé", "Serviços", "Outro"];
  var MEIO = ["A pé", "Bicicleta", "Moto", "Carro ou caminhonete", "Carrinho", "Outro"];
  var DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  var AREAS = ["Contabilidade", "Orientação financeira", "Design", "Comunicação", "Assessoria jurídica", "Outra"];
  var TIPOS = ["Empresa", "Profissional autônomo"];

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function opc(nome, lista, sel, tipo) {
    return '<div class="opcoes">' + lista.map(function (o) {
      return '<label><input type="' + (tipo || "checkbox") + '" name="' + nome + '" value="' + esc(o) + '"' + ((sel || []).indexOf(o) > -1 ? " checked" : "") + '><span>' + esc(o) + '</span></label>';
    }).join("") + '</div>';
  }
  function marcados(f, n) { return Array.from(f.querySelectorAll('input[name="' + n + '"]:checked')).map(function (i) { return i.value; }); }
  function campo(id, rot, val, extra, tipo) { return '<label class="l" for="' + id + '">' + rot + '</label><input type="' + (tipo || "text") + '" id="' + id + '" name="' + id + '" value="' + esc(val) + '" ' + (extra || "") + '>'; }

  var PASSOS = ehVend ? [
    { t: "Quem é você", h: function (p) { return campo("nome", "Seu nome", p.nome, "required autocomplete=name") + campo("telefone", "Telefone com DDD", p.telefone, 'required autocomplete=tel inputmode=tel', "tel") + '<p class="nota-m">Usamos só para falar sobre o seu cadastro.</p>'; },
      l: function (f, p) { p.nome = f.nome.value.trim(); p.telefone = f.telefone.value.trim(); return p.nome && p.telefone ? "" : "Preencha seu nome e telefone."; } },
    { t: "O que você vende", h: function (p) { return '<span class="rot l">Escolha o que você vende (pode marcar vários)</span>' + opc("vende", VENDE, p.vende) + '<span class="rot l">Como você se desloca?</span>' + opc("meio", MEIO, p.meio ? [p.meio] : [], "radio"); },
      l: function (f, p) { p.vende = marcados(f, "vende"); p.meio = marcados(f, "meio")[0] || ""; return p.vende.length && p.meio ? "" : "Marque o que você vende e como se desloca."; } },
    { t: "Sua rota", h: function (p) { return campo("cidade", "Cidade", p.cidade, "required") + campo("bairros", "Bairros onde você costuma passar", p.bairros, 'placeholder="Ex.: Centro, Vila Nova"') + '<span class="rot l">Dias em que você circula</span>' + opc("dias", DIAS, p.dias); },
      l: function (f, p) { p.cidade = f.cidade.value.trim(); p.bairros = f.bairros.value.trim(); p.dias = marcados(f, "dias"); return p.cidade ? "" : "Informe sua cidade."; } }
  ] : [
    { t: "Você é…", h: function (p) { return '<span class="rot l">Escolha o seu tipo</span>' + opc("tipoApoio", TIPOS, p.tipoApoio ? [p.tipoApoio] : [], "radio"); },
      l: function (f, p) { p.tipoApoio = marcados(f, "tipoApoio")[0] || ""; return p.tipoApoio ? "" : "Escolha empresa ou profissional autônomo."; } },
    { t: "Quem é você", h: function (p) { return campo("nome", "Nome da empresa ou do profissional", p.nome, "required") + campo("responsavel", "Nome do responsável", p.responsavel, "required autocomplete=name") + campo("documento", "CNPJ ou CPF (opcional)", p.documento, 'inputmode=numeric'); },
      l: function (f, p) { p.nome = f.nome.value.trim(); p.responsavel = f.responsavel.value.trim(); p.documento = f.documento.value.trim(); return p.nome && p.responsavel ? "" : "Preencha o nome e o responsável."; } },
    { t: "Como você pode apoiar", h: function (p) { return '<span class="rot l">Áreas em que você atua (pode marcar várias)</span>' + opc("areas", AREAS, p.areas) + '<label class="l" for="apoio">Conte, em poucas palavras, como pode apoiar vendedores</label><textarea id="apoio" name="apoio" rows="4">' + esc(p.apoio) + '</textarea>'; },
      l: function (f, p) { p.areas = marcados(f, "areas"); p.apoio = f.apoio.value.trim(); return p.areas.length ? "" : "Marque ao menos uma área."; } },
    { t: "Contato", h: function (p) { return campo("cidade", "Cidade", p.cidade, "required") + campo("telefone", "Telefone com DDD", p.telefone, 'required autocomplete=tel inputmode=tel', "tel"); },
      l: function (f, p) { p.cidade = f.cidade.value.trim(); p.telefone = f.telefone.value.trim(); return p.cidade && p.telefone ? "" : "Preencha cidade e telefone."; } }
  ];

  function completo() { var p = user.perfil; return !!p && (ehVend ? p.vende && p.vende.length && p.cidade : p.areas && p.areas.length && p.telefone); }

  function cadastro(editando) {
    var p = JSON.parse(JSON.stringify(user.perfil || {})), i = 0;
    function pinta() {
      var ultimo = i === PASSOS.length - 1;
      el.innerHTML = '<span class="eyebrow">' + (editando ? "Meu cadastro" : "Vamos começar") + '</span><h1>' + PASSOS[i].t + '</h1>' +
        '<div class="etapas-i" role="img" aria-label="Passo ' + (i + 1) + ' de ' + PASSOS.length + '">' + PASSOS.map(function (_, k) { return '<i class="' + (k <= i ? "on" : "") + '"></i>'; }).join("") + '</div>' +
        '<form id="pf" novalidate>' + PASSOS[i].h(p) + '<div class="msg" role="alert" id="pm"></div>' +
        '<div class="nav-b">' + (i > 0 ? '<button type="button" class="btn ln-d" id="volta">Voltar</button>' : '<span></span>') +
        '<button class="btn or" type="submit">' + (ultimo ? "Salvar cadastro" : "Continuar") + '</button></div></form>';
      el.focus({ preventScroll: true });
      var v = document.getElementById("volta");
      if (v) v.onclick = function () { PASSOS[i].l(document.getElementById("pf"), p); i--; pinta(); };
      document.getElementById("pf").onsubmit = function (e) {
        e.preventDefault();
        var erro = PASSOS[i].l(this, p);
        if (erro) { document.getElementById("pm").textContent = erro; return; }
        if (!ultimo) { i++; pinta(); return; }
        TC.salvarPerfil(p).then(function (u) { user = u; ir("inicio"); })
          .catch(function () { document.getElementById("pm").textContent = "Algo não deu certo agora. Tente de novo em instantes."; });
      };
    }
    pinta();
  }

  function inicio() {
    var p = user.perfil || {};
    var nome = esc((p.nome || "").split(" ")[0] || "por aqui");
    var linhas = ehVend
      ? '<dt>Vende</dt><dd>' + esc((p.vende || []).join(", ")) + '</dd><dt>Desloca-se</dt><dd>' + esc(p.meio) + '</dd><dt>Região</dt><dd>' + esc(p.cidade) + (p.bairros ? " · " + esc(p.bairros) : "") + '</dd><dt>Dias</dt><dd>' + esc((p.dias || []).join(", ") || "Não informado") + '</dd>'
      : '<dt>Tipo</dt><dd>' + esc(p.tipoApoio) + '</dd><dt>Áreas</dt><dd>' + esc((p.areas || []).join(", ")) + '</dd><dt>Cidade</dt><dd>' + esc(p.cidade) + '</dd><dt>Contato</dt><dd>' + esc(p.telefone) + '</dd>';
    var kp = ehVend ? ["Paradas pedidas", "Regiões com interesse", "Rotas"] : ["Vendedores na rede", "Conexões", "Áreas"];
    el.innerHTML = '<span class="eyebrow">Início</span><h1>Oi, ' + nome + '!</h1>' +
      '<p class="lead">' + (ehVend ? "Seu cadastro está pronto. Quando o app for lançado, é por ele que você usa a sua rota." : "Seu cadastro está pronto. Avisaremos você conforme a Rede de Apoio avançar.") + '</p>' +
      '<div class="cards">' +
      '<section class="card2"><h3>Seus próximos passos</h3><ul class="passos-l"><li class="ok"><i>✓</i>Conta criada</li><li class="ok"><i>✓</i>Cadastro completo</li><li><i>3</i>' + (ehVend ? "Usar o app na sua rota (no lançamento)" : "Acompanhar as novidades da rede") + '</li></ul></section>' +
      '<section class="card2 dest"><h3>' + (ehVend ? "Baixe o app" : "Rede de Apoio") + '</h3><p>' + (ehVend ? "O app será liberado no lançamento oficial. Você será avisado." : "A rede está em desenvolvimento. A participação depende de definição e formalização.") + '</p><span class="soon" style="background:#06175c;color:#fff;display:inline-block;padding:6px 12px;border-radius:99px;font-weight:800;font-size:.8rem">' + (ehVend ? "Em breve" : "Em desenvolvimento") + '</span></section>' +
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
