(function () {
  var user = TC.usuarioAtual();
  if (!user) { location.replace("entrar.html"); return; }
  var el = document.getElementById("conteudo");
  var ehVend = user.tipo === "vendedor";
  document.getElementById("quem").textContent = user.email + " · " + (ehVend ? "Vendedor" : "Rede de Apoio");
  document.getElementById("sair").onclick = function () { TC.sair(); location.href = "index.html"; };

  var VENDE = ["Frutas e verduras", "Ovos", "Pão", "Doces", "Queijo", "Artesanato", "Flores", "Roupas", "Picolé", "Serviços", "Outro"];
  var MEIO = ["A pé", "Bicicleta", "Moto", "Carro ou caminhonete", "Outro"];
  var DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  var AREAS = ["Contabilidade", "Orientação financeira", "Design", "Comunicação", "Assessoria jurídica", "Outra"];

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function chk(nome, lista, sel, tipo) {
    return '<div class="opcoes">' + lista.map(function (o) {
      return '<label><input type="' + (tipo || "checkbox") + '" name="' + nome + '" value="' + esc(o) + '"' + ((sel || []).indexOf(o) > -1 ? " checked" : "") + '><span>' + esc(o) + '</span></label>';
    }).join("") + '</div>';
  }
  function marcados(form, nome) { return Array.from(form.querySelectorAll('input[name="' + nome + '"]:checked')).map(function (i) { return i.value; }); }
  function campo(id, rot, val, extra) { return '<label for="' + id + '">' + rot + '</label><input type="text" id="' + id + '" name="' + id + '" value="' + esc(val) + '" ' + (extra || "") + '>'; }

  // ---------- formulário de cadastro (onboarding e edição) ----------
  var PASSOS = ehVend ? [
    { t: "Quem é você", h: function (p) { return campo("nome", "Seu nome", p.nome, "required autocomplete=name") + '<label for="telefone">Telefone com DDD</label><input type="tel" id="telefone" name="telefone" value="' + esc(p.telefone) + '" required autocomplete="tel">'; },
      l: function (f, p) { p.nome = f.nome.value.trim(); p.telefone = f.telefone.value.trim(); return p.nome && p.telefone ? "" : "Preencha nome e telefone."; } },
    { t: "O que você vende", h: function (p) { return '<span class="rot">Escolha o que você vende (pode marcar vários)</span>' + chk("vende", VENDE, p.vende) + '<span class="rot">Como você se desloca?</span>' + chk("meio", MEIO, p.meio ? [p.meio] : [], "radio"); },
      l: function (f, p) { p.vende = marcados(f, "vende"); p.meio = marcados(f, "meio")[0] || ""; return p.vende.length && p.meio ? "" : "Marque o que vende e como se desloca."; } },
    { t: "Sua rota", h: function (p) { return campo("cidade", "Cidade", p.cidade, "required") + campo("bairros", "Bairros onde você costuma passar", p.bairros, 'placeholder="Ex.: Centro, Vila Nova"') + '<span class="rot">Dias em que você circula</span>' + chk("dias", DIAS, p.dias); },
      l: function (f, p) { p.cidade = f.cidade.value.trim(); p.bairros = f.bairros.value.trim(); p.dias = marcados(f, "dias"); return p.cidade ? "" : "Informe sua cidade."; } }
  ] : [
    { t: "Quem é você", h: function (p) { return campo("nome", "Nome da empresa ou profissional", p.nome, "required") + campo("responsavel", "Nome do responsável", p.responsavel, "required autocomplete=name") + campo("documento", "CNPJ ou CPF (opcional)", p.documento, 'inputmode="numeric"'); },
      l: function (f, p) { p.nome = f.nome.value.trim(); p.responsavel = f.responsavel.value.trim(); p.documento = f.documento.value.trim(); return p.nome && p.responsavel ? "" : "Preencha o nome e o responsável."; } },
    { t: "Como pode apoiar", h: function (p) { return '<span class="rot">Área de atuação (pode marcar várias)</span>' + chk("areas", AREAS, p.areas) + '<label for="apoio">Conte, em poucas palavras, como pode apoiar vendedores</label><textarea id="apoio" name="apoio" rows="4">' + esc(p.apoio) + '</textarea>'; },
      l: function (f, p) { p.areas = marcados(f, "areas"); p.apoio = f.apoio.value.trim(); return p.areas.length ? "" : "Marque ao menos uma área."; } },
    { t: "Contato", h: function (p) { return campo("cidade", "Cidade", p.cidade, "required") + '<label for="telefone">Telefone com DDD</label><input type="tel" id="telefone" name="telefone" value="' + esc(p.telefone) + '" required autocomplete="tel">'; },
      l: function (f, p) { p.cidade = f.cidade.value.trim(); p.telefone = f.telefone.value.trim(); return p.cidade && p.telefone ? "" : "Preencha cidade e telefone."; } }
  ];

  function onboarding(editando) {
    var p = JSON.parse(JSON.stringify(user.perfil || {})), i = 0;
    function pinta() {
      var ultimo = i === PASSOS.length - 1;
      el.innerHTML = '<span class="eyebrow">' + (editando ? "Meu cadastro" : "Vamos começar") + '</span><h1>' + PASSOS[i].t + '</h1>' +
        '<div class="passo-ind" aria-label="Passo ' + (i + 1) + ' de ' + PASSOS.length + '">' + PASSOS.map(function (_, k) { return '<i class="' + (k <= i ? "on" : "") + '"></i>'; }).join("") + '</div>' +
        '<form id="pf" novalidate>' + PASSOS[i].h(p) + '<div class="msg" role="alert" id="pm"></div>' +
        '<div class="nav-btns">' + (i > 0 ? '<button type="button" class="btn btn-line" id="volta">Voltar</button>' : '<span></span>') +
        '<button class="btn btn-or" type="submit">' + (ultimo ? "Salvar cadastro" : "Continuar") + '</button></div></form>';
      el.focus();
      document.getElementById("volta") && (document.getElementById("volta").onclick = function () { PASSOS[i].l(document.getElementById("pf"), p); i--; pinta(); });
      document.getElementById("pf").onsubmit = function (e) {
        e.preventDefault();
        var erro = PASSOS[i].l(this, p);
        if (erro) { document.getElementById("pm").textContent = erro; return; }
        if (!ultimo) { i++; pinta(); return; }
        TC.salvarPerfil(p).then(function (u) { user = u; ir("inicio"); });
      };
    }
    pinta();
  }

  // ---------- telas ----------
  function completo() { return user.perfil && (ehVend ? user.perfil.vende && user.perfil.cidade : user.perfil.areas); }
  function inicio() {
    var p = user.perfil || {};
    var nome = esc((p.nome || "").split(" ")[0] || "por aqui");
    var linhas = ehVend
      ? '<dt>Vende</dt><dd>' + esc((p.vende || []).join(", ")) + '</dd><dt>Desloca-se</dt><dd>' + esc(p.meio) + '</dd><dt>Região</dt><dd>' + esc(p.cidade) + (p.bairros ? " · " + esc(p.bairros) : "") + '</dd><dt>Dias</dt><dd>' + esc((p.dias || []).join(", ") || "Não informado") + '</dd>'
      : '<dt>Áreas</dt><dd>' + esc((p.areas || []).join(", ")) + '</dd><dt>Cidade</dt><dd>' + esc(p.cidade) + '</dd><dt>Contato</dt><dd>' + esc(p.telefone) + '</dd>';
    el.innerHTML = '<span class="eyebrow">Início</span><h1>Oi, ' + nome + '!</h1>' +
      '<p class="lead">Seu cadastro está pronto' + (ehVend ? '. Quando o app estiver disponível, é por ele que você acompanha o dia a dia.' : '. A Rede de Apoio é uma iniciativa em desenvolvimento e entraremos em contato conforme ela avançar.') + '</p>' +
      '<div class="prog" aria-hidden="true"><i style="width:100%"></i></div>' +
      '<div class="cards"><section class="card2"><h3>Seu cadastro</h3><dl class="resumo" style="margin:0">' + linhas + '</dl><p style="margin-top:16px"><button class="btn btn-line btn-sm" id="edit">Editar cadastro</button></p></section>' +
      '<section class="card2 dest"><h3>Baixe o app</h3><p>O app ainda não está disponível. Quando for liberado, você acessa o restante por ele, já com este cadastro.</p><span class="soon">Em breve</span></section></div>' +
      '<div class="kpis">' + (ehVend ? ['Paradas pedidas', 'Regiões com interesse', 'Rotas'] : ['Vendedores na rede', 'Conexões', 'Áreas']).map(function (k) { return '<div><small>' + k + '</small><b>—</b></div>'; }).join("") + '</div>' +
      '<p style="color:var(--suave);font-size:.9rem;margin-top:10px">Sem dados ainda. Os números aparecem quando houver uso real.</p>';
    document.getElementById("edit").onclick = function () { ir("perfil"); };
  }
  function metricas() {
    el.innerHTML = '<span class="eyebrow">Métricas</span><h1>Indicadores</h1><div class="card2 vazio"><h3>Disponível com o app</h3><p>Aqui vão aparecer seus números reais, conectados ao app, assim que ele for liberado. Hoje este painel é um protótipo, sem dados.</p></div>';
  }

  function ir(v) {
    document.querySelectorAll(".lateral [data-v]").forEach(function (b) { b.toggleAttribute("aria-current", b.dataset.v === v); if (b.dataset.v === v) b.setAttribute("aria-current", "page"); });
    if (!completo()) { onboarding(false); return; }
    if (v === "perfil") onboarding(true); else if (v === "metricas") metricas(); else inicio();
    if (v !== "perfil") el.focus();
  }
  document.querySelectorAll(".lateral [data-v]").forEach(function (b) { b.onclick = function () { ir(b.dataset.v); }; });
  ir("inicio");
})();
