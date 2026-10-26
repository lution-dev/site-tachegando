(function () {
  if (TC.usuarioAtual()) { location.replace("/painel"); return; }
  var q = new URLSearchParams(location.search);
  var criar = q.get("modo") === "criar";
  var f = document.getElementById("f"), msg = document.getElementById("msg"), btn = document.getElementById("enviar");
  var tEntrar = document.getElementById("t-entrar"), tCriar = document.getElementById("t-criar");
  TCForm.limpaAoDigitar(f);

  function modo(c) {
    criar = c;
    tEntrar.setAttribute("aria-selected", String(!c)); tCriar.setAttribute("aria-selected", String(c));
    document.getElementById("titulo").textContent = c ? "Criar conta" : "Entrar";
    document.getElementById("apoio").textContent = c ? "Já deixamos preenchido. É só continuar." : "Acesse seu painel.";
    document.getElementById("bloco-tipo").hidden = !c;
    document.getElementById("legal").hidden = !c;
    document.getElementById("demo-box").hidden = c;
    btn.textContent = c ? "Criar conta" : "Entrar";
    f.senha.autocomplete = c ? "new-password" : "current-password";
    f.email.value = c ? TC.emailNovo() : TC.demo.vendedor.email; f.senha.value = "demo123";
    TCForm.limpaTudo(f); msg.textContent = "";
  }
  tEntrar.onclick = function () { modo(false); };
  tCriar.onclick = function () { modo(true); };
  if (q.get("tipo") === "apoio") f.querySelector('input[value="apoio"]').checked = true;
  modo(criar);

  function vai(p) { return p.then(function () { location.href = "/painel"; }); }
  document.querySelectorAll("[data-demo]").forEach(function (b) {
    b.addEventListener("click", function () {
      var d = TC.demo[b.dataset.demo]; TCForm.enviando(b, true, "Entrando…");
      vai(TC.entrar(d.email, d.senha)).catch(function () { TCForm.enviando(b, false); msg.textContent = "Algo não deu certo agora. Tente de novo em instantes."; });
    });
  });

  f.addEventListener("submit", function (e) {
    e.preventDefault(); TCForm.limpaTudo(f); msg.textContent = "";
    var email = f.email.value, senha = f.senha.value, ok = true;
    if (!email.trim()) { TCForm.erro(f.email, "Digite seu e-mail."); ok = false; }
    else if (!TCForm.email(email)) { TCForm.erro(f.email, "Digite um e-mail válido, como nome@exemplo.com."); ok = false; }
    if (!senha) { TCForm.erro(f.senha, "Digite sua senha."); ok = false; }
    else if (senha.length < 6) { TCForm.erro(f.senha, "A senha precisa ter pelo menos 6 caracteres."); ok = false; }
    if (!ok) { TCForm.foco(f); return; }
    TCForm.enviando(btn, true, criar ? "Criando conta…" : "Entrando…");
    vai(criar ? TC.criarConta(email, senha, f.tipo.value) : TC.entrar(email, senha)).catch(function (err) {
      TCForm.enviando(btn, false);
      msg.textContent = err.message === "E-mail ou senha incorretos." ? "Não achamos essa combinação de e-mail e senha. Quer tentar de novo?"
        : err.message === "Já existe uma conta com esse e-mail." ? "Esse e-mail já tem conta. Que tal entrar?" : "Algo não deu certo agora. Tente de novo em instantes.";
    });
  });
})();
