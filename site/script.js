document.querySelectorAll("form[data-tipo]").forEach(function (form) {
  var msg = form.querySelector(".msg");
  function aviso(texto, ok) { msg.textContent = texto; msg.className = "msg " + (ok ? "ok" : "erro"); }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var dados = Object.fromEntries(new FormData(form).entries());
    if (dados.site) return; // honeypot
    delete dados.site;
    var faltando = Array.from(form.querySelectorAll("[required]")).some(function (c) { return !c.value.trim(); });
    if (faltando) return aviso("Preencha os campos obrigatórios.", false);
    var url = (window.TC_CONFIG || {}).formEndpoint;
    if (!url) return aviso("O envio ainda não está ativo. Tente novamente em breve.", false);
    dados.tipo = form.dataset.tipo;
    aviso("Enviando...", true);
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); aviso("Recebemos seus dados. Obrigado!", true); })
      .catch(function () { aviso("Não foi possível enviar. Tente novamente.", false); });
  });
});
