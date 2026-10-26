(function () {
  // menu do celular (tela cheia com vidro)
  var b = document.querySelector(".menu-btn"), n = document.getElementById("nav-principal");
  if (b && n) {
    var raiz = document.documentElement;
    function define(abre) {
      b.setAttribute("aria-expanded", String(abre)); b.setAttribute("aria-label", abre ? "Fechar menu" : "Abrir menu");
      n.classList.toggle("aberto", abre); raiz.classList.toggle("menu-aberto", abre);
    }
    b.addEventListener("click", function () {
      var abre = b.getAttribute("aria-expanded") !== "true"; define(abre);
      if (abre) { var p = n.querySelector("a"); if (p) p.focus({ preventScroll: true }); }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && b.getAttribute("aria-expanded") === "true") { define(false); b.focus(); } });
    n.addEventListener("click", function (e) { if (e.target.closest("a")) define(false); });
    matchMedia("(min-width:901px)").addEventListener("change", function (m) { if (m.matches) define(false); });
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
