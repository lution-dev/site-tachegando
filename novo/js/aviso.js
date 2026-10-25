(function () {
  var f = document.getElementById("aviso-f"); if (!f) return;
  var msg = document.getElementById("a-msg");
  function aviso(t, ok) { msg.textContent = t; msg.className = "msg" + (ok ? " ok" : ""); }
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (f.site.value) return; // honeypot
    var nome = f.nome.value.trim(), contato = f.contato.value.trim();
    if (!nome || !contato) { aviso("Preencha seu nome e um e-mail ou WhatsApp.", false); return; }
    var email = /^\S+@\S+\.\S+$/.test(contato), fone = contato.replace(/\D/g, "").length >= 10;
    if (!email && !fone) { aviso("Digite um e-mail válido ou um WhatsApp com DDD.", false); return; }
    if (!f.ok.checked) { aviso("Marque a caixa para receber o aviso de lançamento.", false); return; }
    TC.registrarInteresse({ nome: nome, contato: contato, local: f.local.value.trim() }).then(function () {
      f.reset(); aviso("Anotado! Quando o Tá Chegando for lançado, você fica sabendo.", true);
    }).catch(function () { aviso("Algo não deu certo agora. Tente de novo em instantes.", false); });
  });
})();
