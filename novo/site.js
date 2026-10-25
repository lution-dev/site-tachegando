(function(){
  var reduzir=matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".manifesto p.big").forEach(function(p){
    p.innerHTML=p.textContent.trim().split(/\s+/).map(function(w){return '<span class="w">'+w+'</span>';}).join(" ");
  });
  var ws=Array.from(document.querySelectorAll(".manifesto .w"));
  function acende(){var vh=innerHeight;ws.forEach(function(w){w.classList.toggle("on",reduzir||w.getBoundingClientRect().top<vh*0.75);});}
  addEventListener("scroll",acende,{passive:true});acende();
})();
