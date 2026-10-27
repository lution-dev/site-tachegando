(function () {
  var topo = document.querySelector("header.topo"), raiz = document.documentElement;
  function rola() { topo.classList.toggle("rolou", window.scrollY > 24); }
  rola(); window.addEventListener("scroll", rola, { passive: true });

  var b = document.querySelector(".menu-btn"), n = document.getElementById("nav-principal");
  function define(abre) {
    b.setAttribute("aria-expanded", String(abre)); b.setAttribute("aria-label", abre ? "Fechar menu" : "Abrir menu");
    n.classList.toggle("aberto", abre); raiz.classList.toggle("menu-aberto", abre);
  }
  b.addEventListener("click", function () { var abre = b.getAttribute("aria-expanded") !== "true"; define(abre); if (abre) { var p = n.querySelector("a"); if (p) p.focus({ preventScroll: true }); } });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && b.getAttribute("aria-expanded") === "true") { define(false); b.focus(); } });
  n.addEventListener("click", function (e) { if (e.target.closest("a")) define(false); });
  matchMedia("(min-width:901px)").addEventListener("change", function (m) { if (m.matches) define(false); });

  // só anima o que está na tela
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.target.classList.contains("rev")) { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } }
        else e.target.classList.toggle("vivo", e.isIntersecting);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".rev,.deco").forEach(function (x) { io.observe(x); });
  } else document.querySelectorAll(".rev").forEach(function (x) { x.classList.add("on"); });
})();
