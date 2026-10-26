(function () {
  // menu do celular
  var b = document.querySelector(".menu-btn"), n = document.getElementById("nav-principal");
  if (b && n) {
    function fecha() { b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-label", "Abrir menu"); n.classList.remove("aberto"); }
    b.addEventListener("click", function () {
      var abre = b.getAttribute("aria-expanded") !== "true";
      b.setAttribute("aria-expanded", String(abre)); b.setAttribute("aria-label", abre ? "Fechar menu" : "Abrir menu"); n.classList.toggle("aberto", abre);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { fecha(); b.focus(); } });
    n.addEventListener("click", function (e) { if (e.target.closest("a")) fecha(); });
  }
  // pausar animações (WCAG 2.2.2): botão no rodapé e na faixa em movimento
  var pausado = false;
  try { pausado = localStorage.getItem("tc_pausa") === "1"; } catch (e) {}
  function aplica() {
    document.documentElement.classList.toggle("sem-anim", pausado);
    document.querySelectorAll("svg").forEach(function (s) { try { pausado ? s.pauseAnimations() : s.unpauseAnimations(); } catch (e) {} });
    document.querySelectorAll(".anim-btn").forEach(function (x) { x.setAttribute("aria-pressed", String(pausado)); x.textContent = pausado ? "Retomar animações" : "Pausar animações"; });
    try { localStorage.setItem("tc_pausa", pausado ? "1" : "0"); } catch (e) {}
  }
  document.querySelectorAll(".faixa").forEach(function (f) {
    var x = document.createElement("button"); x.type = "button"; x.className = "anim-btn faixa-btn"; x.setAttribute("aria-pressed", "false"); x.textContent = "Pausar animações"; f.appendChild(x);
  });
  document.querySelectorAll(".anim-btn").forEach(function (x) { x.addEventListener("click", function () { pausado = !pausado; aplica(); }); });
  aplica();
  // mostrar/ocultar senha
  var v = document.querySelector(".ver-senha");
  if (v) v.addEventListener("click", function () {
    var i = document.getElementById("senha"), mostra = i.type === "password";
    i.type = mostra ? "text" : "password"; v.setAttribute("aria-pressed", String(mostra)); v.textContent = mostra ? "Ocultar" : "Mostrar";
  });
})();
