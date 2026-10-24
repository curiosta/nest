/*
 * NEST chat loader: adds the "Ask NEST" OpenRouter chat widget to the page.
 * Included on every page with ONE tag (no inline script, no per-page config):
 *   <script src="/assets/chat/chat-loader.js" defer></script>
 * It works out its own folder from its src, so it does not depend on page depth.
 * Everything runs in the visitor's browser: no NEST backend and no keys in this repo. The visitor connects
 * their OWN OpenRouter account (PKCE) and the key stays in their tab. Default model: free models only.
 */
(function () {
  "use strict";
  if (window.__nestChat) return;              // never load twice
  window.__nestChat = true;

  var me = document.currentScript;
  var base = "/assets/chat/";
  try { var u = new URL(me.src, location.href); base = u.href.slice(0, u.href.lastIndexOf("/") + 1); } catch (e) {}
  var indexUrl = "/site-index.json";
  try { indexUrl = new URL("../../site-index.json", base).pathname; } catch (e) {}

  function txt(el) { return el ? (el.textContent || "").replace(/\s+/g, " ").trim() : ""; }
  function clip(s, n) { return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s; }
  // Domain pages: "Agri / food processing / cold chain · NEST" -> "agri, food processing and cold chain"
  function domainName() {
    var t = txt(document.querySelector("main h1")) || (document.title || "").split(" · ")[0];
    var parts = t.split(/\s*\/\s*/).filter(Boolean);
    if (parts.length > 1) t = parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1];
    return clip(t.replace(/\s+/g, " ").trim(), 60);
  }

  var path = location.pathname.replace(/index\.html$/, "");
  var S = {
    home: [
      "What jobs stay human as AI spreads?",
      "Explain Work with AI vs Work for AI simply",
      "Which verified job fairs are coming up next?",
      "How do I start training for an L1 role?"
    ],
    calendar: [
      "Which job fairs are coming up next month?",
      "Which fairs hire for healthcare or care roles?",
      "How does NEST verify a job fair?",
      "How do I suggest a fair that NEST has missed?"
    ],
    domains: [
      "Which domain suits someone who likes hands-on work?",
      "What's the difference between Work with AI and Work for AI?",
      "Which domains have verified job fairs?",
      "Which domains can I start with an ITI or apprenticeship?"
    ],
    levels: [
      "Explain the four rungs L1 to L4 in simple terms",
      "What does an Intelligent Proxy actually do?",
      "What are Human in the Loop jobs?",
      "What are my first steps to reach L1?"
    ],
    hitl: [
      "What is data labelling and annotation work like?",
      "How do content moderation roles work?",
      "What does an AI output reviewer do?",
      "How can a student get started in desk review roles?"
    ],
    organise: [
      "What are the first steps to organise a job fair?",
      "How do I verify employers and avoid job-fair fraud?",
      "Which government channels can partner on a fair?",
      "How does the online mela option work?"
    ],
    ngo: [
      "How do I start a rural tech lab in my village?",
      "What's the difference between the DBRT and IBT routes?",
      "Which safety and legal rules come first?",
      "What are the honest economics of running a lab?"
    ],
    kit: [
      "What's inside this skill kit?",
      "How do I use this kit with an AI assistant?",
      "When should the kit stop and ask a human?",
      "Who is this kit meant for?"
    ],
    about: [
      "How does NEST verify what it lists?",
      "How do I join the NEST WhatsApp community?",
      "What does NEST publish, and what does it leave out?",
      "What changed recently on NEST?"
    ]
  };
  var suggestions;
  if (path === "/" || path === "") suggestions = S.home;
  else if (/^\/calendar\/?$/.test(path)) suggestions = S.calendar;
  else if (/^\/domains\/?$/.test(path)) suggestions = S.domains;
  else if (/^\/domains\/[^/]+\/?$/.test(path)) {
    var d = domainName(), dl = d.toLowerCase();
    suggestions = [
      "Which jobs in " + dl + " stay human?",
      "Which training routes lead into " + dl + "?",
      "Which Human in the Loop roles exist in " + dl + "?",
      "Are there verified job fairs for " + dl + "?"
    ];
  }
  else if (/^\/levels\/?$/.test(path)) suggestions = S.levels;
  else if (/^\/hitl\/?$/.test(path)) suggestions = S.hitl;
  else if (/\/skill-kit\/?$/.test(path)) suggestions = S.kit;
  else if (/^\/organise\/?$/.test(path)) suggestions = S.organise;
  else if (/^\/ngo\/?$/.test(path)) suggestions = S.ngo;
  else if (/^\/about\/?$/.test(path)) suggestions = S.about;
  else suggestions = S.home;
  suggestions = suggestions.map(function (s) { return clip(s, 140); }).slice(0, 4);

  var persona = [
    "You are NEST's friendly learning guide on nest.curiosta.com, the site of NEST Collective (Network for Education, Science & Technology; motto Learn · Explore · Build), a Curiosta community on WhatsApp for students and learners in India.",
    "The site maps jobs that stay human as AI spreads (Work with AI: hands-on trades where AI is a tool; Work for AI: physical work that builds and runs AI), Human in the Loop roles, the AI role ladder (L1 to L4), training routes (ITI, apprenticeships, NCS, skill councils, NQR qualifications), verified Indian job fairs, a guide to organising a job fair, and an NGO rural tech lab guide.",
    "Explain clearly and encouragingly for students and first-time job seekers: plain words, short steps, and concrete next actions.",
    "Ground every answer in NEST's pages and cite the pages you used as Markdown links. If NEST does not cover something, say so briefly and give only general, well-established guidance, clearly labelled as such. Never invent fairs, dates, qualifications, schemes, employers or links.",
    "Stay on topic: careers and skills, training routes, competitive exams and scholarships, science and technology learning, job fairs, organising events, volunteering and the NEST community. Politely decline unrelated requests.",
    "Exam, scholarship, admission and job dates, fees, eligibility and rules change often: always tell visitors to confirm with the official source (the exam body, ministry, portal or employer) before acting. For job fairs and events, tell them to confirm with the organiser.",
    "Safety: never ask for or encourage sharing personal documents, Aadhaar or bank details, and warn that genuine job fairs and employers do not charge fees for a job; point to NEST's anti-fraud advice where relevant. For workshop or lab safety, say it does not replace a trained instructor."
  ].join(" ");

  function load() {
    var sc = document.createElement("script");
    sc.src = base + "widget.js";
    sc.async = true;
    sc.setAttribute("data-site-name", "NEST");
    sc.setAttribute("data-default-model", "openrouter/free");
    sc.setAttribute("data-context-selector", "main, body");
    sc.setAttribute("data-exclude", ".topbar, .sectionnav, #comments, .footer, .suggest, .lastcheck");
    sc.setAttribute("data-index", indexUrl);
    sc.setAttribute("data-page-cap", "8000");
    sc.setAttribute("data-fab-label", "💬 Ask NEST");
    sc.setAttribute("data-persona", persona);
    sc.setAttribute("data-suggestions", JSON.stringify(suggestions));
    sc.setAttribute("data-greeting", "Hi! I'm NEST's learning guide. Ask about jobs that stay human, training routes, job fairs or anything on this page, and I'll link the pages I use. To chat you connect your own OpenRouter account; NEST does not provide one. Always confirm dates and rules with the official source.");
    document.body.appendChild(sc);
    // P27: say up front, on the button itself, that the chat needs the visitor's own OpenRouter account.
    sc.addEventListener("load", function () {
      var tries = 0;
      (function wait() {
        var f = document.querySelector(".btw-fab");
        if (f) {
          f.title = "Ask NEST: the chat needs your own OpenRouter account";
          var d = document.createElement("span"); d.id = "btw-fab-note"; d.className = "btw-sr";
          d.textContent = "The chat needs your own OpenRouter account.";
          f.insertAdjacentElement("afterend", d); f.setAttribute("aria-describedby", "btw-fab-note");
          var sh = document.querySelector(".btw-sheet");
          // P27: when the sheet closes (Esc, close button, backdrop), give focus back to the button that opened it.
          if (sh && window.MutationObserver) new MutationObserver(function () {
            if (sh.hidden) { var a = document.activeElement; if (!a || a === document.body || sh.contains(a)) { try { f.focus(); } catch (e) {} } }
          }).observe(sh, { attributes: true, attributeFilter: ["hidden"] });
        } else if (tries++ < 50) setTimeout(wait, 100);
      })();
    });
  }

  // An OpenRouter sign-in return (?code=…&state=…) must be handled straight away; otherwise wait for idle
  // so the chat never competes with the page itself.
  if (/[?&](code|error|state|btw_debug)=/.test(location.search)) load();
  else if ("requestIdleCallback" in window) window.requestIdleCallback(load, { timeout: 2500 });
  else setTimeout(load, 800);
})();
