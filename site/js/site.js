(function(){
  var reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var top = document.querySelector("header.top");
  addEventListener("scroll", function(){ top.classList.toggle("stuck", scrollY > 8); }, {passive:true});

  // manifesto: palavras acendem conforme o scroll
  document.querySelectorAll(".manifesto p.big").forEach(function(p){
    p.innerHTML = p.textContent.trim().split(/\s+/).map(function(w){ return '<span class="w">'+w+'</span>'; }).join(" ");
  });
  var palavras = Array.from(document.querySelectorAll(".manifesto .w"));
  function acende(){
    var vh = innerHeight;
    palavras.forEach(function(w){
      var r = w.getBoundingClientRect();
      w.classList.toggle("on", reduzir || r.top < vh*0.72);
    });
  }
  addEventListener("scroll", acende, {passive:true}); acende();

  // reveal
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("on"); io.unobserve(e.target); } });
  }, {threshold:.15});
  document.querySelectorAll(".rv").forEach(function(el){ io.observe(el); });

  // abas
  var abas = document.querySelectorAll(".abas button");
  abas.forEach(function(b){
    b.addEventListener("click", function(){
      abas.forEach(function(x){ x.setAttribute("aria-selected", x===b); });
      document.querySelectorAll(".painel-aba").forEach(function(p){ p.hidden = p.id !== b.getAttribute("aria-controls"); });
    });
  });
})();
