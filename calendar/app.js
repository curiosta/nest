// nest: /calendar/ Month/List, month nav, chip filters with counts
(function () {
  "use strict";
  const root = document.getElementById("cal"); if (!root) return;
  const D = JSON.parse(document.getElementById("caldata").textContent);
  const NAMES = D.mon;
  const pad = n => String(n).padStart(2, "0");
  const t = new Date(), TODAY = t.getFullYear() + "-" + pad(t.getMonth() + 1) + "-" + pad(t.getDate());
  // Month range: Oct 2021 -> Dec 2026 (from D.range), so Month view can page back to 2021
  const RANGE = D.range || ["2021-10", "2026-12"];
  const MONTHS = [];
  {
    let [y, m] = RANGE[0].split("-").map(Number);
    const [y1, m1] = RANGE[1].split("-").map(Number);
    while (y < y1 || (y === y1 && m <= m1)) { MONTHS.push(y + "-" + pad(m)); m++; if (m > 12) { m = 1; y++; } }
  }
  const YEARS = (D.years || []).map(String);
  const CUR_YM = TODAY.slice(0, 7);
  const q = new URLSearchParams(location.search);
  let view = q.get("view") === "list" ? "list" : "month";
  const defaultM = MONTHS.includes(CUR_YM) ? CUR_YM : MONTHS[MONTHS.length - 1];
  let cur = MONTHS.includes(q.get("m")) ? q.get("m") : defaultM;
  const WHENS = ["all", "upcoming", "past"].concat(YEARS.map(y => "y" + y));
  const F = {
    when: WHENS.includes(q.get("when")) ? q.get("when") : "all",
    domain: q.get("domain") || "all",
    org: q.get("org") || "all",
    modality: q.get("modality") || "all",
    state: q.get("state") || "all",
  };
  const els = {
    month: document.getElementById("cal-month"),
    list: document.getElementById("cal-list"),
    sel: document.getElementById("cal-sel"),
    prev: document.getElementById("cal-prev"),
    next: document.getElementById("cal-next"),
    mnav: document.getElementById("cal-mnav"),
    count: document.getElementById("cal-count"),
    controls: document.getElementById("cal-controls"),
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // dated: past if start < today; hubs/series: past once their evidenced span has ended
  const isPast = f => f.start ? f.start < TODAY : !!(f.span && f.span[1] < CUR_YM);
  const isHub = f => !f.start; // usual/pending hubs + recurring series
  function inYear(f, y) {
    if (f.start) return f.start.slice(0, 4) === y;
    return !!(f.span && f.span[0].slice(0, 4) <= y && f.span[1].slice(0, 4) >= y);
  }
  function whenOk(f, w) {
    if (w === "all") return true;
    if (w === "upcoming") return !isPast(f);
    if (w === "past") return isPast(f);
    if (w.charAt(0) === "y") return inYear(f, w.slice(1));
    return true;
  }
  function match(f) {
    if (F.domain !== "all" && f.domains.indexOf(F.domain) < 0) return false;
    if (F.org !== "all" && f.org !== F.org) return false;
    if (F.modality !== "all" && f.modality !== F.modality) return false;
    if (F.state !== "all" && f.state !== F.state) return false;
    if (!whenOk(f, F.when)) return false;
    return true;
  }
  function filtering() {
    return F.when !== "all" || F.domain !== "all" || F.org !== "all" || F.modality !== "all" || F.state !== "all";
  }
  function shortName(f) {
    return f.name.length > 28 ? f.name.slice(0, 26) + "…" : f.name;
  }
  function orgLabel(o) { return (D.orgLabels && D.orgLabels[o]) || o; }
  function modLabel(o) { return (D.modLabels && D.modLabels[o]) || o; }
  function badge(cls, text) { return '<span class="badge ' + cls + '">' + esc(text) + "</span>"; }
  function item(f) {
    const past = isPast(f);
    const kinds = (f.tags || []).map(g => badge("kind k-" + g, (D.tagLabels && D.tagLabels[g]) || g)).join("");
    const tags = (past ? '<span class="past-tag">Past</span>' : "") +
      badge(f.org, orgLabel(f.org)) + badge("mod", modLabel(f.modality)) + kinds;
    const doms = f.domains.slice(0, 3).map(s => {
      const row = D.domains.find(x => x[0] === s);
      return badge("dom", row ? row[1].split("&")[0].trim() : s);
    }).join("");
    return '<li class="' + (past ? "isp " : "") + (isHub(f) ? "hub " : "") + '" data-start="' + esc(f.start || "") + '" data-end="' + esc(f.start || "") + '">' +
      '<span class="d">' + esc(f.when) + "</span>" +
      '<span class="t"><b>' + esc(f.name) + "</b></span>" +
      '<span class="s">' + esc(f.where) + " · " + esc(f.state) +
      (f.note ? " · " + esc(f.note) : "") +
      ' · <a href="' + esc(f.url) + '" target="_blank" rel="noopener">Official page ↗</a>' +
      '<span class="tags">' + tags + doms + "</span></span></li>";
  }
  function inMonthDated(f, y, m, a, b) {
    if (!f.start) return false;
    return f.start >= a && f.start <= b;
  }
  function hubsForMonth(f, ym) {
    // year-round hubs appear every month; month-specific usual by m[0]
    if (!isHub(f)) return false;
    if (f.span && (ym < f.span[0] || ym > f.span[1])) return false;
    if (f.m && f.m.length >= 12) return true;
    const mi = +ym.split("-")[1] - 1;
    return f.m && f.m[0] === mi;
  }
  function renderMonth() {
    const [y, m] = cur.split("-").map(Number);
    const first = new Date(y, m - 1, 1), nd = new Date(y, m, 0).getDate();
    const lead = (first.getDay() + 6) % 7, a = cur + "-01", b = cur + "-" + pad(nd);
    const ev = D.fairs.filter(match);
    const dated = ev.filter(f => inMonthDated(f, y, m, a, b));
    const hubs = ev.filter(f => hubsForMonth(f, cur));
    let h = '<div class="cal-month"><h2>' + NAMES[m - 1] + " " + y +
      "<small>" + dated.length + " dated · " + hubs.length + " hubs / usual</small></h2>" +
      '<div class="cal-grid" role="grid" aria-label="' + NAMES[m - 1] + " " + y + '">';
    for (const d of ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]) h += '<div class="cal-dow" role="columnheader">' + d + "</div>";
    for (let i = 0; i < lead; i++) h += '<div class="cal-day pad" aria-hidden="true"></div>';
    for (let d = 1; d <= nd; d++) {
      const iso = cur + "-" + pad(d);
      const on = dated.filter(f => f.start === iso);
      const chips = on.map(f => {
        const past = isPast(f);
        return '<span class="chip-ev ' + (past ? "past" : f.org) + '" title="' + esc(f.name) + " (" + esc(f.when) + ')">' + esc(shortName(f)) + "</span>";
      }).join("");
      const dots = on.map(f => '<span class="dot ' + (isPast(f) ? "past" : f.org) + '"></span>').join("");
      const lab = d + " " + NAMES[m - 1] + (on.length ? ": " + on.map(f => f.name).join(", ") : "");
      const todayCls = iso === TODAY ? " today" : "";
      if (on.length) {
        h += '<button type="button" class="cal-day' + todayCls + '" data-d="' + iso + '" aria-label="' + esc(lab) + '"><span class="n">' + d + "</span>" + chips + '<span class="cal-dots">' + dots + "</span></button>";
      } else {
        h += '<div class="cal-day' + todayCls + '"><span class="n">' + d + "</span></div>";
      }
    }
    const tail = (7 - (lead + nd) % 7) % 7;
    for (let i = 0; i < tail; i++) h += '<div class="cal-day pad" aria-hidden="true"></div>';
    h += "</div>";
    if (hubs.length) {
      h += '<div class="cal-tbc"><h3>Hubs &amp; usual programmes</h3><div class="pills">' +
        hubs.map(f => '<a class="pill" href="' + esc(f.url) + '" target="_blank" rel="noopener" title="' + esc(f.name) + '"><span class="dot ' + f.org + '"></span><span class="tx">' + esc(shortName(f)) + "</span></a>").join("") +
        "</div></div>";
    }
    h += "</div>";
    const all = dated.concat(hubs);
    h += '<div class="cal-agenda"><h3>Everything in ' + NAMES[m - 1] + " " + y + "</h3>" +
      (all.length ? '<ul class="dated">' + all.map(item).join("") + "</ul>"
        : '<p class="muted">' + (filtering() ? "Nothing this month matches the filters." : "Nothing scheduled.") + "</p>") +
      "</div>";
    els.month.innerHTML = h;
    els.sel.value = cur;
    els.prev.disabled = MONTHS.indexOf(cur) === 0;
    els.next.disabled = MONTHS.indexOf(cur) === MONTHS.length - 1;
    els.month.querySelectorAll("button.cal-day").forEach(btn => btn.addEventListener("click", () => {
      const lis = [...els.month.querySelectorAll(".cal-agenda li")].filter(li => li.dataset.start === btn.dataset.d);
      els.month.querySelectorAll(".cal-agenda li.hl").forEach(li => li.classList.remove("hl"));
      lis.forEach(li => li.classList.add("hl"));
      if (lis[0]) lis[0].scrollIntoView({ behavior: "smooth", block: "center" });
    }));
  }
  function renderList() {
    const ev = D.fairs.filter(match);
    let html = "";
    let n = 0;
    // hubs + recurring series once, at the top (not repeated per month)
    const hubs = ev.filter(f => isHub(f)).sort((a, b) => (isPast(a) - isPast(b)) || a.name.localeCompare(b.name));
    if (hubs.length) {
      html += '<div class="month-group" data-m="hubs"><h3>Hubs &amp; recurring series <small data-count="">' + hubs.length + "</small></h3>" +
        '<ul class="dated">' + hubs.map(item).join("") + "</ul></div>";
      n += hubs.length;
    }
    // dated fairs, newest month first (upcoming at the top, then back to Oct 2021)
    MONTHS.slice().reverse().forEach(ym => {
      const [y, m] = ym.split("-").map(Number);
      const a = ym + "-01", b = ym + "-" + pad(new Date(y, m, 0).getDate());
      const dated = ev.filter(f => inMonthDated(f, y, m, a, b)).sort((a, b) => (a.start || "").localeCompare(b.start || ""));
      if (!dated.length) return;
      const pastN = dated.filter(isPast).length;
      html += '<div class="month-group" data-m="' + ym + '"><h3>' + NAMES[m - 1] + " " + y +
        ' <small data-count="">' + dated.length + " dated · " + pastN + " past</small></h3>" +
        '<ul class="dated">' + dated.map(item).join("") + "</ul></div>";
      n += dated.length;
    });
    els.list.innerHTML = html || '<p class="muted">' + (filtering() ? "Nothing matches the filters." : "No fairs to show.") + "</p>";
    return n;
  }
  function setChip(sel, key, val) {
    document.querySelectorAll(sel).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.v === val || (b.dataset.v === "" && val === "all"))));
  }
  function countFor(pred) {
    return D.fairs.filter(f => {
      return pred(f);
    }).length;
  }
  function renderFilters() {
    // When chips
    document.querySelectorAll(".chip[data-gf=when]").forEach(b => {
      const v = b.dataset.v || "all";
      b.setAttribute("aria-pressed", String(v === F.when));
      const c = D.fairs.filter(f => {
        if (F.domain !== "all" && f.domains.indexOf(F.domain) < 0) return false;
        if (F.org !== "all" && f.org !== F.org) return false;
        if (F.modality !== "all" && f.modality !== F.modality) return false;
        if (F.state !== "all" && f.state !== F.state) return false;
        if (!whenOk(f, v)) return false;
        return true;
      }).length;
      const cnt = b.querySelector(".cnt"); if (cnt) cnt.textContent = c;
    });
    document.querySelectorAll(".chip[data-gf=domain]").forEach(b => {
      const v = b.dataset.v || "all";
      b.setAttribute("aria-pressed", String(v === F.domain));
      const c = D.fairs.filter(f => {
        if (v !== "all" && f.domains.indexOf(v) < 0) return false;
        if (!whenOk(f, F.when)) return false;
        if (F.org !== "all" && f.org !== F.org) return false;
        if (F.modality !== "all" && f.modality !== F.modality) return false;
        if (F.state !== "all" && f.state !== F.state) return false;
        return true;
      }).length;
      const cnt = b.querySelector(".cnt"); if (cnt) cnt.textContent = c;
    });
    document.querySelectorAll(".chip[data-gf=org]").forEach(b => {
      const v = b.dataset.v || "all";
      b.setAttribute("aria-pressed", String(v === F.org));
      const c = D.fairs.filter(f => {
        if (v !== "all" && f.org !== v) return false;
        if (!whenOk(f, F.when)) return false;
        if (F.domain !== "all" && f.domains.indexOf(F.domain) < 0) return false;
        if (F.modality !== "all" && f.modality !== F.modality) return false;
        if (F.state !== "all" && f.state !== F.state) return false;
        return true;
      }).length;
      const cnt = b.querySelector(".cnt"); if (cnt) cnt.textContent = c;
    });
    document.querySelectorAll(".chip[data-gf=modality]").forEach(b => {
      const v = b.dataset.v || "all";
      b.setAttribute("aria-pressed", String(v === F.modality));
      const c = D.fairs.filter(f => {
        if (v !== "all" && f.modality !== v) return false;
        if (!whenOk(f, F.when)) return false;
        if (F.domain !== "all" && f.domains.indexOf(F.domain) < 0) return false;
        if (F.org !== "all" && f.org !== F.org) return false;
        if (F.state !== "all" && f.state !== F.state) return false;
        return true;
      }).length;
      const cnt = b.querySelector(".cnt"); if (cnt) cnt.textContent = c;
    });
    // state select
    const st = document.getElementById("cal-state");
    if (st) {
      const states = Array.from(new Set(D.fairs.map(f => f.state))).sort();
      st.innerHTML = '<option value="all">Any state / scope</option>' +
        states.map(s => {
          const c = D.fairs.filter(f => {
            if (f.state !== s) return false;
            if (!whenOk(f, F.when)) return false;
            if (F.domain !== "all" && f.domains.indexOf(F.domain) < 0) return false;
            if (F.org !== "all" && f.org !== F.org) return false;
            if (F.modality !== "all" && f.modality !== F.modality) return false;
            return true;
          }).length;
          return '<option value="' + esc(s) + '">' + esc(s) + " (" + c + ")</option>";
        }).join("");
      st.value = F.state;
    }
    const shown = D.fairs.filter(match);
    const pastN = shown.filter(isPast).length;
    const datedN = shown.filter(f => f.start).length;
    els.count.textContent = "Showing " + shown.length + " of " + D.fairs.length + " fairs (" + datedN + " dated, " + (shown.length - datedN) + " hubs · " + pastN + " past)";
    const reset = document.getElementById("cal-reset");
    if (reset) reset.hidden = !filtering();
  }
  function sync() {
    const p = new URLSearchParams();
    if (view === "list") p.set("view", "list"); else p.set("m", cur);
    if (F.when !== "all") p.set("when", F.when);
    if (F.domain !== "all") p.set("domain", F.domain);
    if (F.org !== "all") p.set("org", F.org);
    if (F.modality !== "all") p.set("modality", F.modality);
    if (F.state !== "all") p.set("state", F.state);
    const qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
  }
  function render() {
    renderFilters();
    document.querySelectorAll("[data-view]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.view === view)));
    els.month.hidden = view !== "month";
    els.mnav.hidden = view !== "month";
    els.list.hidden = view !== "list";
    if (view === "month") renderMonth();
    else renderList();
    sync();
  }
  // wire controls
  document.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", () => { view = b.dataset.view; render(); }));
  if (els.sel) els.sel.addEventListener("change", () => { cur = els.sel.value; render(); });
  if (els.prev) els.prev.addEventListener("click", () => { cur = MONTHS[Math.max(0, MONTHS.indexOf(cur) - 1)]; render(); });
  if (els.next) els.next.addEventListener("click", () => { cur = MONTHS[Math.min(MONTHS.length - 1, MONTHS.indexOf(cur) + 1)]; render(); });
  document.querySelectorAll(".chip[data-gf]").forEach(b => b.addEventListener("click", () => {
    const g = b.dataset.gf, v = b.dataset.v || "all";
    if (g === "when") {
      F.when = v;
      if (v.charAt(0) === "y" && cur.slice(0, 4) !== v.slice(1)) {
        const y = v.slice(1);
        cur = CUR_YM.slice(0, 4) === y && MONTHS.includes(CUR_YM) ? CUR_YM : (MONTHS.find(x => x.slice(0, 4) === y) || cur);
      }
    }
    if (g === "domain") F.domain = v;
    if (g === "org") F.org = v;
    if (g === "modality") F.modality = v;
    render();
  }));
  const st = document.getElementById("cal-state");
  if (st) st.addEventListener("change", () => { F.state = st.value || "all"; render(); });
  const reset = document.getElementById("cal-reset");
  if (reset) reset.addEventListener("click", () => {
    F.when = "all"; F.domain = "all"; F.org = "all"; F.modality = "all"; F.state = "all"; render();
  });
  // populate month select
  if (els.sel) {
    els.sel.innerHTML = YEARS.length ? YEARS.map(y => '<optgroup label="' + y + '">' +
      MONTHS.filter(ym => ym.slice(0, 4) === y).map(ym => {
        const m = +ym.slice(5);
        return '<option value="' + ym + '">' + NAMES[m - 1] + " " + y + "</option>";
      }).join("") + "</optgroup>").join("") :
      MONTHS.map(ym => '<option value="' + ym + '">' + NAMES[+ym.slice(5) - 1] + " " + ym.slice(0, 4) + "</option>").join("");
  }
  if (els.controls) els.controls.hidden = false;
  try {
    render();
    const boot = document.getElementById("cal-booting");
    if (boot) boot.remove();
  } catch (err) {
    const m = document.getElementById("cal-month");
    if (m) m.innerHTML = '<p class="muted">Calendar failed to load. <a href="/calendar/sources.md">See sources.md</a> for the fair list.</p>';
    console.error("NEST calendar:", err);
  }
})();
