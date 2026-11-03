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

  // carrossel de vendedores
  var pista = document.querySelector(".car-pista");
  if (pista) {
    var bs = document.querySelectorAll(".car-b"), itens = Array.prototype.slice.call(pista.querySelectorAll("li")), cont = document.querySelector(".car-n");
    function atual() { var x = pista.scrollLeft + 4, i = 0, base = itens[0].offsetLeft; itens.forEach(function (li, k) { if (li.offsetLeft - base <= x) i = k; }); return i; }
    function atualiza() {
      var i = atual(), fim = pista.scrollLeft >= pista.scrollWidth - pista.clientWidth - 2;
      if (fim) i = itens.length - 1;
      cont.textContent = (i + 1) + " de " + itens.length; bs[0].disabled = pista.scrollLeft <= 2; bs[1].disabled = fim;
    }
    function move(d) {
      var i = Math.max(0, Math.min(itens.length - 1, atual() + d)), reduz = matchMedia("(prefers-reduced-motion:reduce)").matches;
      pista.scrollTo({ left: itens[i].offsetLeft - itens[0].offsetLeft, behavior: reduz ? "auto" : "smooth" });
    }
    bs.forEach(function (b) { b.addEventListener("click", function () { move(Number(b.dataset.dir)); }); });
    pista.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") { e.preventDefault(); move(1); } if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); } });
    pista.addEventListener("scroll", atualiza, { passive: true }); window.addEventListener("resize", atualiza); atualiza();
  }
})();
