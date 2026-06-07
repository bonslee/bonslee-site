/* BONSLEE // COCKPIT PORTFOLIO — runtime
   Loads content.json, applies theme + fonts, renders, animates. */

const $ = (s, r = document) => r.querySelector(s);
const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));

/* ---- dynamic Google Font loading so the CMS font picker works ---- */
function loadFont(family) {
  if (!family) return;
  const id = "gf-" + family.replace(/\s+/g, "-");
  if (document.getElementById(id)) return;
  const l = document.createElement("link");
  l.id = id; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=" +
    encodeURIComponent(family) + ":wght@400;500;600;700&display=swap";
  document.head.appendChild(l);
}

function applyTheme(t = {}) {
  const r = document.documentElement.style;
  if (t.accent) r.setProperty("--accent", t.accent);
  if (t.fontFamily) { loadFont(t.fontFamily); r.setProperty("--font", `"${t.fontFamily}",system-ui,sans-serif`); }
  if (t.monoFamily) { loadFont(t.monoFamily); r.setProperty("--mono", `"${t.monoFamily}",monospace`); }
  if (t.sizeH1) r.setProperty("--s-h1", t.sizeH1 + "px");
  if (t.sizeH2) r.setProperty("--s-h2", t.sizeH2 + "px");
  if (t.sizeBody) r.setProperty("--s-body", t.sizeBody + "px");
  if (t.sizeMono) r.setProperty("--s-mono", t.sizeMono + "px");
}

/* ---- render ---- */
function render(d) {
  applyTheme(d.theme);
  const p = d.profile || {};

  $("#brandName").textContent = (p.name || "").split(" ")[0] + " // PORTFOLIO";

  // HERO
  const hero = $("#hero");
  hero.innerHTML = `
    <div class="mono callsign reveal">${esc(p.callsign || "")} &nbsp;·&nbsp; <span class="status-dot"></span>SYSTEM ONLINE</div>
    <h1 class="reveal">${esc(p.name || "")}</h1>
    <div class="title reveal">${esc(p.title || "")}</div>
    <div class="tagline reveal mono" style="text-transform:none;letter-spacing:.02em">${esc(p.tagline || "")}</div>
    <div class="cta reveal">
      <a class="btn solid" href="#work"><span>VIEW WORK ▸</span></a>
      <a class="btn" href="#contact"><span>CONTACT</span></a>
      <a class="btn" href="${esc(p.behance)}" target="_blank" rel="noopener"><span>BEHANCE ↗</span></a>
    </div>
    <div class="readouts reveal"></div>`;
  const ro = $(".readouts", hero);
  (d.hud || []).forEach(h => {
    const c = el("div", "panel bk readout");
    c.innerHTML = `<div class="v" data-count="${esc(h.value)}">${esc(h.value)}</div>
      <div class="l mono">${esc(h.label)}</div><div class="u">${esc(h.unit)}</div>`;
    ro.appendChild(c);
  });

  // ABOUT
  const ab = d.about || {};
  $("#about-head").innerHTML = `<span class="idx">01</span><h2>${esc(ab.heading || "ABOUT")}</h2><span class="rule"></span>`;
  $("#about-body").innerHTML = `<p style="font-size:${ab.fontSize || 18}px">${esc(ab.body || "")}</p>`;

  // EXPERIENCE
  const tl = $("#timeline");
  (d.experience || []).forEach(x => {
    const c = el("div", "panel bk xp reveal");
    c.innerHTML = `
      <div class="when">${esc(x.period)}<span class="place">${esc(x.place)}</span></div>
      <div><h3>${esc(x.role)} <span class="co">// ${esc(x.company)}</span></h3>
      <p>${esc(x.summary)}</p></div>`;
    tl.appendChild(c);
  });

  // SKILLS
  const sk = d.skills || {};
  const coreWrap = $("#skills-core"), toolWrap = $("#skills-tools");
  (sk.core || []).forEach(s => coreWrap.appendChild(el("span", "chip", esc(s))));
  (sk.tools || []).forEach(s => toolWrap.appendChild(el("span", "chip tool", esc(s))));

  // WORK
  const grid = $("#grid");
  (d.projects || []).forEach((pr, i) => {
    const a = el("a", "card reveal");
    a.href = pr.link || "#"; a.target = "_blank"; a.rel = "noopener";
    a.style.transitionDelay = (i % 3) * 60 + "ms";
    const media = pr.video
      ? `<video src="${esc(pr.video)}" autoplay muted loop playsinline preload="none"></video>`
      : `<img loading="lazy" decoding="async" fetchpriority="low" src="${esc(pr.image)}" alt="${esc(pr.title)}">`;
    a.innerHTML = `${media}
      <div class="corner mono">[ OPEN ↗ ]</div>
      <div class="meta"><div class="tag">${esc(pr.tag || "PROJECT")}</div><h3>${esc(pr.title)}</h3></div>`;
    grid.appendChild(a);
  });

  // CONTACT + footer
  $("#contact-links").innerHTML = `
    <a class="btn solid" href="mailto:${esc(p.email)}"><span>EMAIL</span></a>
    <a class="btn" href="tel:${esc((p.phone||"").replace(/\s/g,''))}"><span>${esc(p.phone)}</span></a>
    <a class="btn" href="${esc(p.behance)}" target="_blank" rel="noopener"><span>BEHANCE ↗</span></a>
    <a class="btn" href="${esc(p.linkedin)}" target="_blank" rel="noopener"><span>LINKEDIN ↗</span></a>`;
  $("#foot").innerHTML = `<span class="status-dot"></span>${esc(p.name)} · ${esc(p.location)} · © ${new Date().getFullYear()} · ALL SYSTEMS NOMINAL`;

  initAnimations();
}

/* ---- scroll reveal + count-up ---- */
function initAnimations() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      if (e.target.classList.contains("readouts")) countUp(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: .15 });
  document.querySelectorAll(".reveal").forEach(n => io.observe(n));

  // hero reveals fire immediately after boot
  requestAnimationFrame(() => document.querySelectorAll(".hero .reveal").forEach(n => n.classList.add("in")));
}

function countUp(scope) {
  scope.querySelectorAll("[data-count]").forEach(node => {
    const raw = node.dataset.count;
    // Ranges or multi-number values (e.g. "30-50") can't be animated — show as-is
    const groups = raw.match(/\d+(?:\.\d+)?/g) || [];
    if (groups.length !== 1) { node.textContent = raw; return; }
    const num = parseFloat(raw.replace(/[^\d.]/g, ""));
    if (isNaN(num)) { node.textContent = raw; return; }
    const suffix = raw.replace(/[\d.,]/g, "");
    const prefix = (raw.match(/^[^\d]*/) || [""])[0];
    let cur = 0; const steps = 38, inc = num / steps;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= num) { cur = num; clearInterval(t); }
      node.textContent = prefix + (num % 1 ? cur.toFixed(0) : Math.round(cur)) + suffix.replace(prefix, "");
    }, 22);
  });
}

/* ---- reticle cursor ---- */
function initReticle() {
  if (matchMedia("(pointer:coarse)").matches) return;
  const r = el("div", "reticle", "<i></i>"); document.body.appendChild(r);
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
  addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; });
  (function loop() { x += (tx - x) * .25; y += (ty - y) * .25;
    r.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
  addEventListener("mouseover", e => {
    if (e.target.closest("a,button,.chip,.card")) r.classList.add("lock"); });
  addEventListener("mouseout", e => {
    if (e.target.closest("a,button,.chip,.card")) r.classList.remove("lock"); });
}

/* ---- boot sequence ---- */
function boot() {
  const log = $("#bootLog"), bar = $(".boot-bar i"), overlay = $("#boot");
  const lines = ["INITIALISING COCKPIT...", "LOADING PILOT PROFILE...", "SYNCING PORTFOLIO ARRAY...",
    "CALIBRATING HUD...", "ALL SYSTEMS NOMINAL"];
  let i = 0;
  const tick = setInterval(() => {
    if (log) log.textContent = lines[i];
    if (bar) bar.style.width = ((i + 1) / lines.length * 100) + "%";
    if (++i >= lines.length) {
      clearInterval(tick);
      setTimeout(() => { if (overlay) overlay.classList.add("done"); }, 120);
    }
  }, 110);  // fast boot: ~0.7s total
}

/* ---- start ---- */
(async function () {
  document.body.classList.add("js-ready");
  initReticle();
  boot();
  try {
    const res = await fetch("content.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    render(await res.json());
  } catch (err) {
    // file:// or offline → use the embedded fallback from content-data.js
    if (window.__CONTENT__) { render(window.__CONTENT__); return; }
    $("#hero").innerHTML = `<h1>BONSLEE S CHAKKALA</h1>
      <p class="mute">content.json failed to load (${esc(err.message)}).</p>`;
  }
})();
