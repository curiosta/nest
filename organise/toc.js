/* /organise/ table of contents (build2 phase 8). Without JS the list is simply open, no highlight. */
(function () {
  var nav = document.getElementById("org-toc"); if (!nav) return;
  var d = nav.querySelector("details"), links = [].slice.call(nav.querySelectorAll('a[href^="#"]'));
  var mq = window.matchMedia("(min-width: 1024px)");
  function sync() { d.open = mq.matches; }            /* sidebar on desktop, collapsed "Jump to" below */
  sync();
  if (mq.addEventListener) mq.addEventListener("change", sync); else mq.addListener(sync);
  links.forEach(function (a) { a.addEventListener("click", function () { if (!mq.matches) d.open = false; }); });
  var heads = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
  function spy() {
    var off = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 60) + 48, cur = 0;
    for (var i = 0; i < heads.length; i++) if (heads[i] && heads[i].getBoundingClientRect().top <= off) cur = i;
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      for (var j = heads.length - 1; j >= 0; j--) if (heads[j] && heads[j].getBoundingClientRect().top < window.innerHeight) { cur = j; break; }
    }
    links.forEach(function (a, i) { if (i === cur) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current"); });
  }
  var queued = false;
  window.addEventListener("scroll", function () { if (!queued) { queued = true; requestAnimationFrame(function () { queued = false; spy(); }); } }, { passive: true });
  window.addEventListener("resize", spy); window.addEventListener("hashchange", spy);
  spy();
})();
