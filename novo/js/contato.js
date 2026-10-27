(function () {
  var f = document.getElementById("contato-f"); if (!f) return;
  var msg = document.getElementById("c-aviso"), btn = f.querySelector('button[type="submit"]');
  TCForm.limpaAoDigitar(f);
  function aviso(t, ok) { msg.textContent = t; msg.className = "msg" + (ok ? " ok" : ""); }
  f.addEventListener("submit", function (e) {
    e.preventDefault(); if (f.site.value) return;
    TCForm.limpaTudo(f); aviso("", true);
    var nome = f.nome.value.trim(), contato = f.contato.value.trim(), texto = f.msg.value.trim(), ok = true;
    if (!nome) { TCForm.erro(f.nome, "Digite o seu nome."); ok = false; }
    if (!contato) { TCForm.erro(f.contato, "Digite um e-mail ou um WhatsApp."); ok = false; }
    else if (!TCForm.email(contato) && !TCForm.telefone(contato)) { TCForm.erro(f.contato, "Digite um e-mail válido ou um WhatsApp com DDD, como (13) 99999-9999."); ok = false; }
    if (texto.length < 5) { TCForm.erro(f.msg, "Escreva a sua mensagem."); ok = false; }
    if (!f.ok.checked) { TCForm.erro(f.ok, "Marque a caixa para podermos responder."); ok = false; }
    if (!ok) { TCForm.foco(f); return; }
    TCForm.enviando(btn, true, "Enviando…");
    TC.registrarContato({ nome: nome, contato: contato, assunto: f.assunto.value, msg: texto }).then(function () {
      TCForm.enviando(btn, false); aviso("Mensagem enviada! Vamos responder pelo contato que você deixou.", true);
    }).catch(function () { TCForm.enviando(btn, false); aviso("Algo não deu certo agora. Tente de novo em instantes.", false); });
  });
})();
