(function(){
  "use strict";
  const D = JSON.parse(document.getElementById("caldata").textContent);
  const $ = (s,r)=> (r||document).querySelector(s);
  const $$ = (s,r)=> Array.from((r||document).querySelectorAll(s));
  const params = new URLSearchParams(location.search);
  const state = {
    domain: params.get("domain") || "all",
    org: params.get("org") || "all",
    modality: params.get("modality") || "all",
    state: params.get("state") || "all",
  };
  const TODAY = (()=>{ const n=new Date(); const p=x=>String(x).padStart(2,"0"); return n.getFullYear()+"-"+p(n.getMonth()+1)+"-"+p(n.getDate()); })();
  const CUR = new Date().getMonth();

  function syncChips(){
    $$(".chip[data-domain]").forEach(b=> b.setAttribute("aria-pressed", b.dataset.domain===state.domain ? "true":"false"));
    $$(".chip[data-org]").forEach(b=> b.setAttribute("aria-pressed", b.dataset.org===state.org ? "true":"false"));
    $$(".chip[data-modality]").forEach(b=> b.setAttribute("aria-pressed", b.dataset.modality===state.modality ? "true":"false"));
    $$(".chip[data-state]").forEach(b=> b.setAttribute("aria-pressed", b.dataset.state===state.state ? "true":"false"));
  }
  function pushUrl(){
    const p = new URLSearchParams();
    if(state.domain!=="all") p.set("domain", state.domain);
    if(state.org!=="all") p.set("org", state.org);
    if(state.modality!=="all") p.set("modality", state.modality);
    if(state.state!=="all") p.set("state", state.state);
    const q = p.toString();
    history.replaceState(null, "", location.pathname + (q?("?"+q):""));
  }
  function match(f){
    if(state.domain!=="all" && f.domains.indexOf(state.domain)<0) return false;
    if(state.org!=="all" && f.org!==state.org) return false;
    if(state.modality!=="all" && f.modality!==state.modality) return false;
    if(state.state!=="all" && f.state!==state.state) return false;
    return true;
  }
  function badge(cls, text){ return '<span class="badge '+cls+'">'+text+'</span>'; }
  function card(f){
    const past = f.start && f.start < TODAY;
    const doms = f.domains.map(s=>{
      const row = D.domains.find(x=>x[0]===s);
      return badge("dom", row? row[1].split("&")[0].trim() : s);
    }).join("");
    const srcs = (f.src||[]).map(k=>{
      const s=D.src[k]; if(!s) return "";
      return '<a href="'+s[1]+'" target="_blank" rel="noopener">'+s[0]+'</a>';
    }).filter(Boolean).join(" · ");
    return '<article class="faircard'+(past?" is-past":"")+'">'+
      '<h4>'+f.name+'</h4>'+
      '<p class="meta"><b class="when '+f.whenClass+'">'+f.when+'</b> · '+f.where+' · '+f.state+'</p>'+
      '<div class="badges">'+badge(f.org, D.orgLabels[f.org]||f.org)+badge("mod", D.modLabels[f.modality]||f.modality)+doms+'</div>'+
      (f.note? '<p class="meta">'+f.note+'</p>':'')+
      '<p class="links"><a href="'+f.url+'" target="_blank" rel="noopener">Official page ↗</a>'+(past?'<span class="meta">This edition may be over — check the official page.</span>':'')+'</p>'+
      (srcs? '<p class="meta"><b>Source:</b> '+srcs+'</p>':'')+
      '</article>';
  }
  function render(){
    const list = D.fairs.filter(match);
    const root = $("#fairlist");
    if(!list.length){ root.innerHTML = '<p class="empty">No fairs match these filters. Clear a chip or check back after the next research pass.</p>'; $("#count").textContent="0 fairs"; return; }
    // group by primary month (first in m[]), rotate so current month first
    const order = [];
    for(let i=0;i<12;i++) order.push((CUR+i)%12);
    let html = "";
    let n=0;
    order.forEach(m=>{
      const here = list.filter(f=> f.m.indexOf(m)>=0);
      // for year-round, only show under first month of their m when listing? show under each tagged month once — for usual year-round show once under current month only
      const show = here.filter(f=>{
        if(f.m.length>=12) return m===CUR; // year-round once
        return f.m[0]===m; // dated/usual by primary month
      });
      if(!show.length) return;
      html += '<li class="fairmon" data-m="'+m+'"><h3>'+D.mon[m]+'</h3><div>'+show.map(card).join("")+'</div></li>';
      n += show.length;
    });
    root.innerHTML = html || '<p class="empty">No fairs to show.</p>';
    $("#count").textContent = n + " fair" + (n===1?"":"s");
  }
  document.addEventListener("click", e=>{
    const b = e.target.closest(".chip");
    if(!b) return;
    if(b.dataset.domain!=null) state.domain = b.dataset.domain;
    if(b.dataset.org!=null) state.org = b.dataset.org;
    if(b.dataset.modality!=null) state.modality = b.dataset.modality;
    if(b.dataset.state!=null) state.state = b.dataset.state;
    syncChips(); pushUrl(); render();
  });
  // unique states
  const states = Array.from(new Set(D.fairs.map(f=>f.state))).sort();
  const stateRow = $("#state-chips");
  if(stateRow){
    stateRow.innerHTML = '<button type="button" class="chip" data-state="all" aria-pressed="true">All</button>' +
      states.map(s=> '<button type="button" class="chip" data-state="'+s+'" aria-pressed="false">'+s+'</button>').join("");
  }
  syncChips(); render();
})();
