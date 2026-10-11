/* NEST mobile menu (build2 phase 4). At <=720px the Primary nav becomes a slide-down panel. */
(function () {
  var btn = document.querySelector(".menu-btn"), nav = document.getElementById("primary-nav");
  if (!btn || !nav) return;
  var root = document.documentElement, mq = window.matchMedia("(max-width: 720px)");
  var back = document.createElement("div");
  back.className = "menu-backdrop"; back.hidden = true;
  document.body.appendChild(back);
  function links() { return Array.prototype.slice.call(nav.querySelectorAll("a")); }
  function isOpen() { return btn.getAttribute("aria-expanded") === "true"; }
  function behind() {   /* everything except the header, the backdrop and scripts */
    return Array.prototype.filter.call(document.body.children, function (el) {
      return el.tagName !== "HEADER" && el !== back && el.tagName !== "SCRIPT";
    });
  }
  function open() {
    btn.setAttribute("aria-expanded", "true");
    nav.classList.add("open"); back.hidden = false; root.classList.add("menu-open");
    behind().forEach(function (el) { el.setAttribute("inert", ""); });
    var first = links()[0]; if (first) first.focus();
  }
  function close(focusBtn) {
    if (!isOpen()) return;
    btn.setAttribute("aria-expanded", "false");
    nav.classList.remove("open"); back.hidden = true; root.classList.remove("menu-open");
    behind().forEach(function (el) { el.removeAttribute("inert"); });
    if (focusBtn) btn.focus();
  }
  btn.addEventListener("click", function () { if (isOpen()) close(true); else open(); });
  back.addEventListener("click", function () { close(true); });
  document.addEventListener("click", function (e) {
    if (isOpen() && !nav.contains(e.target) && !btn.contains(e.target)) close(false);
  });
  nav.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("a")) close(false); });
  document.addEventListener("keydown", function (e) {
    if (!isOpen()) return;
    if (e.key === "Escape" || e.key === "Esc") { e.preventDefault(); close(true); return; }
    if (e.key !== "Tab") return;
    var f = [btn].concat(links()), i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && (i === f.length - 1 || i < 0)) { e.preventDefault(); f[0].focus(); }
  });
  function onChange() { if (!mq.matches) close(false); }
  if (mq.addEventListener) mq.addEventListener("change", onChange); else mq.addListener(onChange);
  window.addEventListener("pageshow", function () { close(false); });   /* back/forward cache */
})();
