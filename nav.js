/* NEST site script (P27, 24 Oct 2026). No dependencies, no inline code (CSP script-src 'self').
   1. Adds class "js" to <html> straight away (this file is a plain blocking script in <head>), so the CSS can show the
      one-row header with a Menu button only when the script works. Without JavaScript the six links stay visible.
   2. Menu button (phones/small tablets): toggles the primary nav; Esc, an outside click, a link click, or Tab leaving the menu closes it.
   3. Home only: while the Work with AI / Work for AI sections are in view the matching pill gets aria-current="location"
      and Home loses its "page" state.
   4. details.fold sections (long pages): server-rendered open (full content without JS). On phones they are closed on load;
      a link to anything inside one (hash, TOC, citation) opens it first. Desktop widths open them all again. */
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  function ready(fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }
  ready(function () {
    var btn = document.getElementById("menu-btn"), nav = document.getElementById("primary-nav");
    var narrow = window.matchMedia("(max-width:720px)");

    /* ---- menu ---- */
    function setMenu(open) {
      if (!btn) return;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      root.classList.toggle("nav-open", open);
    }
    if (btn && nav) {
      btn.addEventListener("click", function () { setMenu(btn.getAttribute("aria-expanded") !== "true"); });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && root.classList.contains("nav-open")) { setMenu(false); btn.focus(); }
      });
      document.addEventListener("click", function (e) {
        if (root.classList.contains("nav-open") && !nav.contains(e.target) && !btn.contains(e.target)) setMenu(false);
      });
      nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
      var bar = btn.parentNode;
      bar.addEventListener("focusout", function (e) {
        if (root.classList.contains("nav-open") && e.relatedTarget && !bar.contains(e.relatedTarget)) setMenu(false);
      });
      (narrow.addEventListener ? narrow.addEventListener.bind(narrow, "change") : narrow.addListener.bind(narrow))(function () { setMenu(false); });
    }

    /* ---- current section on Home ---- */
    if (nav && (location.pathname === "/" || location.pathname === "/index.html")) {
      var home = nav.querySelector('a[href="/"]'), aw = nav.querySelector('a[href="/#with"]'), af = nav.querySelector('a[href="/#for"]');
      var tick = false;
      var inside = function (id, y) { var e = document.getElementById(id); if (!e) return false; var r = e.getBoundingClientRect(); return r.top <= y && r.bottom > y; };
      var update = function () {
        tick = false;
        /* A line below the sticky header and the anchor offset (a hash link lands the section at about 150px). Sections are short when their folds are closed on a phone, so the old 40%-down line missed them. */
        var y = 200, cur = inside("with", y) ? aw : inside("for", y) ? af : null;
        if (!cur && window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 4) {
          /* at the very end of the page the last section cannot scroll up to the line: pick the last one still on screen */
          [[aw, "with"], [af, "for"]].forEach(function (p) { var e = document.getElementById(p[1]); if (!e) return; var r = e.getBoundingClientRect(); if (r.bottom > 60 && r.top < window.innerHeight * 0.7) cur = p[0]; });
        }
        [aw, af].forEach(function (a) { if (!a) return; if (a === cur) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current"); });
        if (home) { if (cur) home.removeAttribute("aria-current"); else home.setAttribute("aria-current", "page"); }
      };
      var queue = function () { if (!tick) { tick = true; window.requestAnimationFrame(update); } };
      window.addEventListener("scroll", queue, { passive: true });
      window.addEventListener("resize", queue);
      window.addEventListener("hashchange", queue);
      update();
    }

    /* ---- folds ---- */
    var folds = [].slice.call(document.querySelectorAll("details.fold"));
    function openAround(el) {
      var d = el && el.closest ? el.closest("details") : null, any = false;
      while (d) { if (!d.open) { d.open = true; any = true; } d = d.parentElement ? d.parentElement.closest("details") : null; }
      return any;
    }
    function target() {
      var id = location.hash ? decodeURIComponent(location.hash.slice(1)) : "";
      return id ? document.getElementById(id) : null;
    }
    function applySize() {
      if (narrow.matches) folds.forEach(function (d) { if (!d.hasAttribute("data-open")) d.open = false; });
      else folds.forEach(function (d) { d.open = true; });
      var t = target(); if (t && openAround(t)) t.scrollIntoView();
    }
    if (folds.length) {
      applySize();
      (narrow.addEventListener ? narrow.addEventListener.bind(narrow, "change") : narrow.addListener.bind(narrow))(function () {
        if (narrow.matches) folds.forEach(function (d) { if (!d.hasAttribute("data-open")) d.open = false; });
        else folds.forEach(function (d) { d.open = true; });
      });
      window.addEventListener("hashchange", function () { var t = target(); if (t && openAround(t)) t.scrollIntoView(); });
      document.addEventListener("click", function (e) {
        var a = e.target.closest ? e.target.closest('a[href*="#"]') : null; if (!a) return;
        var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
        if (u.pathname !== location.pathname || !u.hash || u.hash === location.hash) {
          if (u.pathname === location.pathname && u.hash) { var t = document.getElementById(decodeURIComponent(u.hash.slice(1))); if (t && openAround(t)) t.scrollIntoView(); }
        }
      });
    }
  });
})();
