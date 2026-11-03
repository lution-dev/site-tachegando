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

  // entrada suave de cada bloco ao aparecer na tela
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".rev").forEach(function (x) { io.observe(x); });
  } else document.querySelectorAll(".rev").forEach(function (x) { x.classList.add("on"); });

  // carrossel de vendedores: rolagem contínua, só roda enquanto está visível
  var pista = document.querySelector(".car-pista"), car = document.querySelector(".carrossel");
  if (pista && car) {
    var reduz = matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (!reduz) {
      Array.prototype.slice.call(pista.children).forEach(function (li) { var c = li.cloneNode(true); c.setAttribute("aria-hidden", "true"); Array.prototype.forEach.call(c.querySelectorAll("img"), function (i) { i.alt = ""; }); pista.appendChild(c); });
      function mede() { pista.style.setProperty("--dur", Math.max(30, Math.round(pista.scrollWidth / 2 / 45)) + "s"); }
      pista.classList.add("auto"); mede(); window.addEventListener("load", mede); window.addEventListener("resize", mede);
      if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { pista.classList.toggle("rodando", es[0].isIntersecting); }, { threshold: 0.05 }).observe(car);
      else pista.classList.add("rodando");
    }
  }
})();
