/* NEST nav (build2 phase 6), ported from kinetic.curiosta.com: edge fades on the
   swipeable pill strip + keep the current page's pill in view. The nav works without this file. */
(function () {
  var snav = document.querySelector(".sectionnav");
  if (!snav) return;
  function fades() {
    var max = snav.scrollWidth - snav.clientWidth;
    snav.classList.toggle("fade-l", max > 4 && snav.scrollLeft > 4);
    snav.classList.toggle("fade-r", max > 4 && snav.scrollLeft < max - 4);
  }
  function keep() {
    var a = snav.querySelector('a[aria-current="page"]');
    if (!a || snav.scrollWidth <= snav.clientWidth + 4) return;
    var r = a.getBoundingClientRect(), n = snav.getBoundingClientRect();
    if (r.left < n.left + 16 || r.right > n.right - 40) snav.scrollLeft += r.left - n.left - 20;
  }
  snav.addEventListener("scroll", fades, { passive: true });
  window.addEventListener("resize", function () { fades(); keep(); });
  snav.addEventListener("focusin", function (e) {   /* keyboard users: bring the focused pill into view */
    var r = e.target.getBoundingClientRect(), n = snav.getBoundingClientRect();
    /* align to the pill's start: that is a scroll-snap point, so snapping cannot push it back out */
    if (r.left < n.left + 4 || r.right > n.right - 4) snav.scrollLeft += r.left - n.left - 20;
  });
  keep(); fades();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { keep(); fades(); });
})();
