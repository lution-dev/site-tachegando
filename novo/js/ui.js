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
  // mostrar/ocultar senha
  var v = document.querySelector(".ver-senha");
  if (v) v.addEventListener("click", function () {
    var i = document.getElementById("senha"), mostra = i.type === "password";
    i.type = mostra ? "text" : "password"; v.setAttribute("aria-pressed", String(mostra)); v.textContent = mostra ? "Ocultar" : "Mostrar";
  });
})();
