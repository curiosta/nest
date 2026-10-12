// NEST fair calendar (/calendar/). Mirrors kinetic.curiosta.com/calendar/: no pop-ups; a month's note opens inline under its row.
// Data: #caldata (build2/phase13_calendar_kinetic.py). Everything date-based is worked out here from the visitor's date.
(function () {
  "use strict";
  const D = JSON.parse(document.getElementById("caldata").textContent);
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const ST = { P: "Peak", Y: "Possible" };
  const NOW = new Date(), CUR = NOW.getMonth(), Y0 = NOW.getFullYear();
  const pad = n => String(n).padStart(2, "0");
  const TODAY = Y0 + "-" + pad(CUR + 1) + "-" + pad(NOW.getDate());
  const H = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const ext = (url, text) => '<a href="' + H(url) + '" target="_blank" rel="noopener">' + text + "</a>";
  const DL = {}; D.domains.forEach(d => { DL[d[0]] = d[1]; });
  const state = { g: "all", month: CUR, y: Y0 };
  const cal = $("#cal");

  // ---------- current month column ----------
  $$('#cal [data-m="' + CUR + '"]').forEach(el => el.classList.add("now"));

  // ---------- inline month note (one at a time, under its row) ----------
  let sel = null, det = null;
  const srcLinks = keys => keys.map(k => ext(D.src[k][1], H(D.src[k][0]))).join("; ");
  function closeDet(focusBack) {
    if (det) { det.remove(); det = null; }
    if (sel) { sel.classList.remove("sel"); if (focusBack) sel.focus(); sel = null; }
  }
  function openDet(td) {
    if (sel === td) { closeDet(false); return; }
    closeDet(false);
    const tr = td.parentElement, r = D.rows[+tr.dataset.r], m = +td.dataset.m, s = r.m[m];
    let h = '<div class="det-top"><h4>' + D.mon[m] + ' · <span class="stw">' + ST[s] + "</span> · " + H(DL[r.s]) + ", " + H(r.rg) + "</h4>" +
      '<button type="button" class="det-hide">Hide</button></div>';
    h += "<p>" + H(r.n[m]) + "</p>";
    h += '<p><span class="dl">How we mark it:</span> ' + H(r.why) + "</p>";
    if (r.f[m].length) h += '<p><span class="dl">Fairs in ' + D.mon[m] + ":</span> " + r.f[m].map(i => H(D.fairs[i].name) + " (" + H(D.fairs[i].when) + ")").join("; ") + "</p>";
    h += '<p class="src">Source: ' + (r.src.length ? srcLinks(r.src) : r.f[m].map(i => ext(D.fairs[i].url, H(D.fairs[i].name) + " ↗")).join("; ")) + "</p>";
    det = document.createElement("tr"); det.className = "det";
    det.innerHTML = '<td colspan="13"><div class="detin" id="det" role="region" aria-live="polite" aria-label="' + D.mon[m] + ' note">' + h + "</div></td>";
    tr.after(det);
    sel = td; td.classList.add("sel");
    $(".det-hide", det).addEventListener("click", () => closeDet(true));
  }
  const cells = () => $$("#cal td.st").filter(td => td.offsetParent !== null);
  function roving(td) { $$("#cal td[tabindex='0']").forEach(x => x.setAttribute("tabindex", "-1")); td.setAttribute("tabindex", "0"); }
  function firstCell() { const c = cells().find(td => +td.dataset.m === CUR) || cells()[0]; if (c) roving(c); }
  // nearest marked cell in a row (blank months carry no marker and are skipped)
  function nearest(tr, m, dir) {
    const st = $$("td.st", tr); if (!st.length) return null;
    if (dir) { const c = dir > 0 ? st.find(x => +x.dataset.m > m) : st.reverse().find(x => +x.dataset.m < m); return c || null; }
    return st.reduce((a, b) => Math.abs(+b.dataset.m - m) < Math.abs(+a.dataset.m - m) ? b : a);
  }
  cal.addEventListener("click", e => { const td = e.target.closest("td.st"); if (!td) return; roving(td); openDet(td); });
  cal.addEventListener("keydown", e => {
    const td = e.target.closest("td.st"); if (!td) return;
    const k = e.key;
    if (k === "Enter" || k === " ") { e.preventDefault(); openDet(td); return; }
    if (k === "Escape" && det) { e.preventDefault(); closeDet(true); return; }
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].indexOf(k) < 0) return;
    e.preventDefault();
    const m = +td.dataset.m, rows = $$("#cal tr.rw").filter(tr => tr.offsetParent !== null && $("td.st", tr));
    const ri = rows.indexOf(td.parentElement); let t = null;
    if (k === "ArrowLeft") t = nearest(td.parentElement, m, -1);
    else if (k === "ArrowRight") t = nearest(td.parentElement, m, 1);
    else if (k === "Home") t = $$("td.st", td.parentElement)[0];
    else if (k === "End") t = $$("td.st", td.parentElement).pop();
    else if (k === "ArrowUp" && ri > 0) t = nearest(rows[ri - 1], m, 0);
    else if (k === "ArrowDown" && ri < rows.length - 1) t = nearest(rows[ri + 1], m, 0);
    if (t) { roving(t); t.focus(); }
  });

  // ---------- domain filter (both chip rows stay in sync; ?domain=<slug> in the URL) ----------
  const SIDE = D.side || {};
  const sideOk = ds => !state.side || state.side === "all" || ds.some(d => SIDE[d] === state.side);
  const inDom = li => sideOk((li.dataset.dom || "").split(" ")) && (state.g === "all" || (" " + li.dataset.dom + " ").indexOf(" " + state.g + " ") >= 0);
  function keepChipInView() {
    $$(".chips").forEach(row => {
      const b = $('.chip[aria-pressed="true"]', row); if (!b || row.scrollWidth <= row.clientWidth + 2) return;
      const r = b.getBoundingClientRect(), n = row.getBoundingClientRect();
      if (r.left < n.left || r.right > n.right) row.scrollLeft += r.left - n.left - (n.width - r.width) / 2;
    });
  }
  function applyDom(g, push) {
    if (g !== "all" && !DL[g]) g = "all";
    state.g = g;
    $$(".chip").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.g === g)));
    $$("#cal tbody").forEach(tb => { const gp = tb.dataset.group || "";
      tb.hidden = gp.indexOf("side-") === 0 ? !(g === "all" && (!state.side || state.side === "all" || gp === "side-" + state.side)) : !((g === "all" && sideOk([gp])) || tb.dataset.group === g); });
    $$("#evlist .evi").forEach(li => { li.hidden = !inDom(li); });
    $$("#evlist .evmon").forEach(m => { m.hidden = !$$(".evi", m).some(li => !li.hidden); });
    $("#evnone").hidden = $$("#evup .evi").some(li => !li.hidden);
    const pv = $$("#evpastlist .evi").filter(li => !li.hidden).length;
    $("#pcount").textContent = pv;
    if (sel && sel.offsetParent === null) closeDet(false);
    firstCell(); renderMonth(); keepChipInView();
    if (push && history.replaceState) {
      const u = new URL(location.href);
      if (g === "all") u.searchParams.delete("domain"); else u.searchParams.set("domain", g);
      history.replaceState(null, "", u.pathname + u.search + u.hash);
    }
  }
  $$(".chip").forEach(b => b.addEventListener("click", () => applyDom(b.dataset.g, true)));
  // phase 16: Work with AI / Work for AI filter (both rows in sync); hides the other side's rows, chips and fairs
  function applySide(v) {
    state.side = v;
    $$(".schip").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.side === v)));
    $$(".chip[data-side]").forEach(b => { b.hidden = v !== "all" && b.dataset.side !== v; });
    applyDom(state.g !== "all" && SIDE[state.g] !== v && v !== "all" ? "all" : state.g, true);
  }
  $$(".schip").forEach(b => b.addEventListener("click", () => applySide(b.dataset.side)));

  // ---------- month view: 12 rolling months from the current one ----------
  const ROLL = Array.from({ length: 12 }, (_, i) => ({ m: (CUR + i) % 12, y: Y0 + Math.floor((CUR + i) / 12) }));
  const ymOf = (y, m) => y + "-" + pad(m + 1);
  const mbox = $(".mchips");
  mbox.innerHTML = ROLL.map((r, i) => '<button type="button" class="mchip' + (i === 0 ? " now" : "") + '" data-m="' + r.m + '" data-y="' + r.y + '" aria-pressed="false">' + D.mon[r.m].slice(0, 3) + " " + r.y + "</button>").join("");
  const inG = ds => sideOk(ds) && (state.g === "all" || ds.indexOf(state.g) >= 0);
  function byDom(rows) {
    const o = [];
    rows.forEach(r => { let x = o.find(y => y.s === r.s); if (!x) o.push(x = { s: r.s, rg: [] }); x.rg.push(r.rg); });
    return o;
  }
  function renderMonth() {
    const m = state.month, y = state.y, ym = ymOf(y, m), grp = state.g === "all" ? "" : " in this domain";
    $("#mname").textContent = D.mon[m] + " " + y;
    $$(".mchip").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.m === m && +b.dataset.y === y)));
    const rows = D.rows.filter(r => inG([r.s]));
    const item = x => '<li><a class="sn" href="/domains/' + x.s + '/">' + H(DL[x.s]) + '</a><span class="nt">' + x.rg.map(H).join(" · ") + "</span></li>";
    const peak = byDom(rows.filter(r => r.m[m] === "P")), poss = byDom(rows.filter(r => r.m[m] === "Y"));
    const evs = [];
    D.fairs.forEach(f => {
      if (!f.start || f.end < TODAY || !inG(f.domains)) return;
      if (f.start.slice(0, 7) <= ym && f.end.slice(0, 7) >= ym) evs.push({ k: f.start, name: f.name, t: (f.start <= TODAY ? "On now · " : "") + f.when, where: f.where, url: f.url });
    });
    D.series.forEach(s => {
      if (!s.usual || s.usual.indexOf(m) < 0 || !inG(s.domains)) return;
      evs.push({ k: "9", name: s.name, t: s.pending, where: s.where, url: s.url });
    });
    evs.sort((a, b) => a.k < b.k ? -1 : a.k > b.k ? 1 : a.name.localeCompare(b.name));
    const yr = D.hubs.filter(i => inG(D.fairs[i].domains)).length + D.series.filter(s => s.monthly && inG(s.domains)).length;
    let h = '<div class="mcol"><h3><span class="key P" aria-hidden="true"></span>Peak</h3>' + (peak.length ? "<ul>" + peak.map(item).join("") + "</ul>" : '<p class="empty">No domain at its peak' + grp + ".</p>") + "</div>";
    h += '<div class="mcol"><h3><span class="key Y" aria-hidden="true"></span>Possible</h3>' + (poss.length ? "<ul>" + poss.map(item).join("") + "</ul>" : '<p class="empty">Nothing marked possible' + grp + ".</p>") + "</div>";
    h += '<div class="mcol"><h3><span class="key E" aria-hidden="true"></span>Fairs</h3>' + (evs.length ? "<ul>" + evs.map(e =>
      "<li><b>" + H(e.name) + '</b><span class="nt">' + H(e.t) + " · " + H(e.where) + " · " + ext(e.url, "Official page ↗") + "</span></li>").join("") + "</ul>" :
      '<p class="empty">No dated fairs yet this month' + grp + ". Dates are often announced only a few weeks ahead.</p>") +
      (yr ? '<p class="off">Plus ' + yr + ' year-round hub' + (yr > 1 ? "s and monthly melas" : "") + ': <a href="#events">see Fairs</a>.</p>' : "") + "</div>";
    $("#monthout").innerHTML = h;
  }
  $$(".mchip").forEach(b => b.addEventListener("click", () => { state.month = +b.dataset.m; state.y = +b.dataset.y; renderMonth(); }));

  // ---------- fairs list: status from today's date; Coming up regrouped by month + year; ended fairs fold into Already held ----------
  const up = $("#evup"), pastList = $("#evpastlist");
  const GH = { "9999-01": "Next dates not announced yet", "9999-02": "Year-round and monthly" };
  const usualKey = li => {
    const ms = li.dataset.m.split(",").filter(Boolean).map(Number);
    if (!ms.length) return "9999-01-99";
    return ms.map(m => ymOf(m < CUR ? Y0 + 1 : Y0, m) + "-99").sort()[0];
  };
  const keyOf = li => {
    if (li.dataset.start) return li.dataset.start < TODAY ? TODAY : li.dataset.start;
    if (li.dataset.yr) return li.dataset.yr === "monthly" ? "9999-02-00" : "9999-02-99";
    return usualKey(li);
  };
  const setStatus = (li, st) => { const s = $(".status", li); s.className = "status stw-" + st; s.textContent = { up: "Upcoming", now: "On now", ended: "Ended" }[st]; };
  function refreshEvents() {
    $$(".evi[data-end]", up).forEach(li => {
      if (li.dataset.end < TODAY) { setStatus(li, "ended"); li.classList.add("isp"); pastList.appendChild(li); }
      else setStatus(li, li.dataset.start <= TODAY ? "now" : "up");
    });
    $$(".evi[data-end]", pastList).forEach(li => {   // a visitor whose clock is earlier than the build date
      if (li.dataset.end >= TODAY) { setStatus(li, li.dataset.start <= TODAY ? "now" : "up"); li.classList.remove("isp"); up.appendChild(li); }
    });
    const items = $$(".evi", up).sort((x, y) => { const a = keyOf(x), b = keyOf(y); return a < b ? -1 : a > b ? 1 : $(".evn", x).textContent.localeCompare($(".evn", y).textContent); });
    up.textContent = "";
    let cur = null, ul = null;
    items.forEach(li => {
      const ym = keyOf(li).slice(0, 7);
      if (ym !== cur) {
        cur = ym; const g = document.createElement("li"); g.className = "evmon" + (ym === TODAY.slice(0, 7) ? " now" : ""); g.dataset.ym = ym;
        g.innerHTML = "<h4>" + (GH[ym] || D.mon[+ym.slice(5) - 1] + " " + ym.slice(0, 4)) + "</h4><ul></ul>"; up.appendChild(g); ul = $("ul", g);
      }
      ul.appendChild(li);
    });
    const past = $$(".evi", pastList).sort((x, y) => (y.dataset.end || "").localeCompare(x.dataset.end || "") || $(".evn", x).textContent.localeCompare($(".evn", y).textContent));
    past.forEach(li => pastList.appendChild(li));
    const ys = [...new Set(past.map(li => li.dataset.end.slice(0, 4)))].sort();
    $("#pcount").textContent = past.length;
    $("#pyrs").textContent = ys.length > 1 ? ys[0] + " to " + ys[ys.length - 1] : (ys[0] || "");
    $("#evpast").hidden = !past.length;
  }
  refreshEvents();
  // grid: no fair dots (phase 14); upcoming fairs live in By month and Fairs

  // ---------- deep links: ?domain=<slug> (domain pages) and #s-<slug> ----------
  function hashHl() {
    $$("#cal tr.hl").forEach(tr => tr.classList.remove("hl"));
    const id = location.hash.slice(1);
    if (!/^s-[a-z-]+$/.test(id)) return;
    const s = id.slice(2); if (!DL[s]) return;
    if (state.g !== "all" && state.g !== s) applyDom("all", true);
    $$('#cal tr[data-dom="' + s + '"]').forEach(tr => tr.classList.add("hl"));
    const c = $('#cal tr.rw[data-dom="' + s + '"] td.st'); if (c) roving(c);
  }
  window.addEventListener("hashchange", hashHl);
  const q = new URLSearchParams(location.search).get("domain");
  applyDom(q && DL[q] ? q : "all", false);
  hashHl();
  // sticky month header sits right under the site header (taller on phones, where the nav wraps)
  const hdr = $(".topbar"), setTop = () => { if (hdr) document.documentElement.style.setProperty("--kc-top", Math.round(hdr.getBoundingClientRect().height) + "px"); };
  setTop(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(setTop);
  window.addEventListener("resize", () => { setTop(); keepChipInView(); });
})();
