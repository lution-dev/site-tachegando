(function () {
  if (TC.usuarioAtual()) { location.replace("painel.html"); return; }
  var q = new URLSearchParams(location.search);
  var criar = q.get("modo") === "criar";
  var f = document.getElementById("f"), msg = document.getElementById("msg");
  var tEntrar = document.getElementById("t-entrar"), tCriar = document.getElementById("t-criar");

  function modo(c) {
    criar = c;
    tEntrar.setAttribute("aria-selected", !c); tCriar.setAttribute("aria-selected", c);
    document.getElementById("titulo").textContent = c ? "Criar conta" : "Entrar";
    document.getElementById("bloco-tipo").hidden = !c;
    document.getElementById("enviar").textContent = c ? "Criar conta" : "Entrar";
    document.getElementById("senha").autocomplete = c ? "new-password" : "current-password";
    msg.textContent = "";
  }
  tEntrar.onclick = function () { modo(false); };
  tCriar.onclick = function () { modo(true); };
  if (q.get("tipo") === "apoio") f.querySelector('input[value="apoio"]').checked = true;
  modo(criar);

  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = f.email.value, senha = f.senha.value;
    if (!/^\S+@\S+\.\S+$/.test(email)) { msg.textContent = "Digite um e-mail válido."; return; }
    if (senha.length < 6) { msg.textContent = "A senha precisa ter pelo menos 6 caracteres."; return; }
    var p = criar ? TC.criarConta(email, senha, f.tipo.value) : TC.entrar(email, senha);
    p.then(function () { location.href = "painel.html"; })
     .catch(function (err) { msg.textContent = err.message; });
  });
})();
