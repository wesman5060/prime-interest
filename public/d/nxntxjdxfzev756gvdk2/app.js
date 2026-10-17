/* Deal Finder — one page over everything the three scouts found. */
(function () {
  "use strict";

  const BOT = {
    rezone: { name: "Rezonings", one: "Rezoning", color: "#2f62c9" },
    listing: { name: "For sale", one: "For sale", color: "#1b8a5e" },
    assemblage: { name: "Assemblages", one: "Assemblage", color: "#c26a12" },
  };
  const PAGE = 60;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let DATA, BYID = {}, prevSeen = null;
  const st = { tab: "all", q: "", county: "", sort: "found", newonly: false, showgone: false, shown: PAGE };

  // ---- storage (a per-browser convenience; the page works without it) ----
  function load(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private window */ } }

  // ---- decryption: data, cards and maps are published encrypted ------------
  // The key is in the link after "#k=" and never leaves this browser.
  function hashParams() { return new URLSearchParams(location.hash.replace(/^#/, "")); }
  const KEY_TXT = hashParams().get("k") || "";
  let CRYPTO_KEY = null;
  function b64u(s) {
    const b = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
    return Uint8Array.from(b, (c) => c.charCodeAt(0));
  }
  async function getBin(path) {
    const res = await fetch(path + ".bin", { cache: "no-cache" });
    if (!res.ok) throw new Error(path + " " + res.status);
    const buf = new Uint8Array(await res.arrayBuffer());
    return crypto.subtle.decrypt({ name: "AES-GCM", iv: buf.slice(0, 12) }, CRYPTO_KEY, buf.slice(12));
  }
  const imgCache = {};
  async function imgUrl(name) {
    if (!imgCache[name]) {
      imgCache[name] = getBin("img/" + name).then((ab) => {
        const ext = name.split(".").pop();
        const type = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" }[ext] || "application/octet-stream";
        return URL.createObjectURL(new Blob([ab], { type }));
      });
    }
    return imgCache[name];
  }
  async function cardHtml(path) {
    let html = new TextDecoder().decode(await getBin(path));
    const names = [...new Set([...html.matchAll(/src="\.\.\/\.\.\/img\/([^"]+)"/g)].map((m) => m[1]))];
    const urls = await Promise.all(names.map(imgUrl));
    names.forEach((n, i) => { html = html.split('src="../../img/' + n + '"').join('src="' + urls[i] + '"'); });
    return html;
  }
  function setHash(id, push) {
    const h = "#k=" + KEY_TXT + (id ? "&f=" + encodeURIComponent(id) : "");
    history[push ? "pushState" : "replaceState"]({ id }, "", location.pathname + location.search + h);
  }

  // ---- what counts as "no longer live" -----------------------------------
  function isGone(r) {
    return (r.bot === "listing" && r.state !== "current") || (r.bot === "assemblage" && r.state === "ruled_out");
  }
  function isNew(r) { return prevSeen ? !prevSeen.has(r.id) : false; }

  function statusTag(r) {
    const s = r.status || "";
    let cls = "";
    if (r.bot === "rezone") cls = /approv/i.test(s) ? "good" : /den|withdr/i.test(s) ? "bad" : "";
    if (r.bot === "listing") cls = r.state === "current" ? "good" : r.state === "gone" ? "bad" : "";
    if (r.bot === "assemblage") cls = r.state === "pick" || r.state === "runner_up" ? "pick" : r.state === "ruled_out" ? "bad" : "";
    return `<span class="tag ${cls}">${esc(s)}</span>`;
  }

  // ---- filtering ----------------------------------------------------------
  function base(r) {
    if (!st.showgone && isGone(r)) return false;
    if (st.county && r.county !== st.county) return false;
    if (st.newonly && !isNew(r)) return false;
    if (st.q) {
      const words = st.q.toLowerCase().split(/\s+/).filter(Boolean);
      if (!words.every((w) => r._text.includes(w))) return false;
    }
    return true;
  }
  function inTab(r, tab) {
    if (tab === "all") return true;
    if (tab === "overlap") return r.related.length > 0;
    return r.bot === tab;
  }
  function visible() {
    const rows = DATA.records.filter((r) => base(r) && inTab(r, st.tab));
    const key = {
      found: (a, b) => (b.found || "").localeCompare(a.found || "") || (b.acres || 0) - (a.acres || 0),
      acres: (a, b) => (b.acres || 0) - (a.acres || 0),
      price: (a, b) => ppa(a) - ppa(b),
      county: (a, b) => a.county.localeCompare(b.county) || (b.acres || 0) - (a.acres || 0),
    }[st.sort];
    return rows.sort(key);
  }
  function ppa(r) { return r.price && r.acres ? r.price / r.acres : Infinity; }

  // ---- rendering ----------------------------------------------------------
  function renderTabs() {
    const base_ = DATA.records.filter(base);
    const n = (t) => base_.filter((r) => inTab(r, t)).length;
    const tabs = [["all", "Everything", ""], ["rezone", BOT.rezone.name, "rezone"],
      ["listing", BOT.listing.name, "listing"], ["assemblage", BOT.assemblage.name, "assemblage"],
      ["overlap", "In more than one", "overlap"]];
    $("tabs").innerHTML = tabs.map(([t, label, dot]) =>
      `<button class="tab" role="tab" data-tab="${t}" aria-selected="${st.tab === t}">` +
      (dot ? `<i class="dot ${dot}"></i>` : "") + `${esc(label)} <span class="n">${n(t)}</span></button>`).join("");
  }

  function rowHtml(r) {
    const also = [...new Set(r.related.map(([id]) => BYID[id] && BYID[id].bot))].filter(Boolean)
      .map((b) => `<span class="tag also">Also: ${esc(BOT[b].one)}</span>`).join("");
    return `<li class="row${isGone(r) ? " dim" : ""}" tabindex="0" data-id="${esc(r.id)}">
      <i class="dot ${r.bot}" title="${esc(BOT[r.bot].one)}"></i>
      <div><h3>${esc(r.title)}</h3><div class="sub">${esc(r.sub)}</div></div>
      <div class="facts">${r.headline.map((h) => `<span>${esc(h)}</span>`).join("")}</div>
      <div class="tags">${isNew(r) ? '<span class="tag new">NEW</span>' : ""}${statusTag(r)}${also}
        <span class="tag">${esc(BOT[r.bot].one)} · ${esc(foundTxt(r))}</span></div>
    </li>`;
  }

  function renderList() {
    const rows = visible();
    $("count").textContent = rows.length === 1 ? "1 find" : `${rows.length.toLocaleString()} finds` +
      (st.showgone ? "" : " (sold, off-market and ruled-out finds hidden)");
    $("list").innerHTML = rows.slice(0, st.shown).map(rowHtml).join("") ||
      `<li class="nocard">Nothing matches. Try clearing the search or picking “All counties”.</li>`;
    $("more").hidden = rows.length <= st.shown;
    $("more").textContent = `Show more (${(rows.length - st.shown).toLocaleString()} left)`;
    renderMarkers(rows);
  }

  function fmtDate(d) {
    if (!d) return "—";
    const [y, m, day] = d.split("-").map(Number);
    return new Date(y, m - 1, day || 1).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function foundTxt(r) {
    if (r.bot === "rezone") {
      const [y, m] = r.found.split("-").map(Number);
      return "in the " + new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }) + " meetings report";
    }
    return "found " + fmtDate(r.found);
  }

  function renderAll(fit) { renderTabs(); renderList(); if (fit) fitMap(); }

  // ---- map ------------------------------------------------------------------
  let map, markerLayer, shapeLayer, sat, streets, onStreets = false, lastRows = [];
  function initMap() {
    map = L.map("map", { preferCanvas: true, zoomControl: true }).setView([33.95, -84.2], 9);
    sat = L.layerGroup([
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19, attribution: "Imagery © Esri, Maxar, Earthstar Geographics" }),
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19, opacity: 0.85 }),
    ]).addTo(map);
    streets = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      { maxZoom: 19, attribution: "© OpenStreetMap contributors © CARTO" });
    markerLayer = L.layerGroup().addTo(map);
    shapeLayer = L.layerGroup().addTo(map);
    map.on("zoomend moveend", drawShapes);
    $("basemap").onclick = () => {
      onStreets = !onStreets;
      if (onStreets) { map.removeLayer(sat); streets.addTo(map); } else { map.removeLayer(streets); sat.addTo(map); }
      $("basemap").textContent = onStreets ? "Satellite" : "Street map";
    };
    $("legend").innerHTML = Object.entries(BOT).map(([k, b]) =>
      `<span><i class="dot ${k}"></i>${esc(b.name)}</span>`).join("");
  }
  function renderMarkers(rows) {
    lastRows = rows;
    markerLayer.clearLayers();
    for (const r of rows) {
      if (r.lat == null || r.lon == null) continue;
      const m = L.circleMarker([r.lat, r.lon], {
        radius: r.related.length ? 9 : 7, color: "#fff", weight: r.related.length ? 3 : 2,
        fillColor: BOT[r.bot].color, fillOpacity: isGone(r) ? 0.5 : 0.95,
      });
      m.bindPopup(() => `<div class="pop"><b>${esc(r.title)}</b>${esc(r.headline.join(" · "))}<br>` +
        `<button type="button" data-open="${esc(r.id)}">Open</button></div>`);
      markerLayer.addLayer(m);
    }
    drawShapes();
  }
  function drawShapes() {
    shapeLayer.clearLayers();
    if (!map || map.getZoom() < 14) return;
    const b = map.getBounds().pad(0.2);
    for (const r of lastRows) {
      if (!r.rings || r.lat == null || !b.contains([r.lat, r.lon])) continue;
      L.polygon(r.rings.map((ring) => ring.map(([x, y]) => [y, x])), {
        color: BOT[r.bot].color, weight: 2.5, fillOpacity: 0.12, interactive: false,
      }).addTo(shapeLayer);
    }
  }
  function fitMap() {
    map.invalidateSize();
    const pts = lastRows.filter((r) => r.lat != null).map((r) => [r.lat, r.lon]);
    if (pts.length) map.fitBounds(pts, { padding: [30, 30], maxZoom: pts.length > 1 ? 13 : 15 });
  }

  // ---- detail ---------------------------------------------------------------
  let dmap = null, current = null;
  function openDetail(id, push) {
    const r = BYID[id];
    if (!r) return;
    current = id;
    if (push !== false) setHash(id, true);
    const rel = r.related.map(([oid, why]) => {
      const o = BYID[oid];
      return o ? `<li><button type="button" data-open="${esc(oid)}">${esc(BOT[o.bot].one)}: ${esc(o.title)}</button>
        — ${esc(why)}</li>` : "";
    }).join("");
    $("dcontent").innerHTML = `
      <div class="d-kind"><i class="dot ${r.bot}"></i>${esc(BOT[r.bot].one)} · ${esc(r.county)}${isNew(r) ? ' · <span class="tag new">NEW</span>' : ""}</div>
      <h2>${esc(r.title)}</h2>
      <p class="d-sub">${esc(r.sub)}</p>
      <p class="d-head">${r.headline.map((h) => `<span>${esc(h)}</span>`).join("")}</p>
      <div class="d-status">${statusTag(r)} <span class="tag">${esc(foundTxt(r))}</span></div>
      ${rel ? `<div class="related"><h4>Also found by another scout</h4><ul>${rel}</ul></div>` : ""}
      ${r.lat != null ? '<div class="d-map" id="dmap"></div>' : '<p class="nocard">No map location — the county gave no address for this case.</p>'}
      <dl class="fields">${r.fields.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
      ${r.links.length ? `<div class="links">${r.links.map(([t, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join("")}</div>` : ""}
      ${r.card ? `<h4 class="card-h">The scout's own report card <small>(from ${esc(r.card_from)})</small></h4>
        <iframe class="cardframe" id="cardframe" title="Report card"></iframe><p class="nocard" id="cardwait">Opening the report card…</p>`
        : '<p class="nocard">This find never appeared on a report card with maps, so only the facts above are shown.</p>'}`;
    $("detail").hidden = false;
    document.body.style.overflow = "hidden";
    $("detail").querySelector(".detail-inner").scrollTop = 0;
    if (r.lat != null) {
      if (dmap) { dmap.remove(); dmap = null; }
      dmap = L.map("dmap", { zoomControl: true, attributionControl: false }).setView([r.lat, r.lon], 15);
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19 }).addTo(dmap);
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, opacity: 0.85 }).addTo(dmap);
      if (r.rings) {
        const poly = L.polygon(r.rings.map((ring) => ring.map(([x, y]) => [y, x])),
          { color: "#ffd84a", weight: 3, fillOpacity: 0.08 }).addTo(dmap);
        dmap.fitBounds(poly.getBounds(), { padding: [20, 20], maxZoom: 17 });
      } else {
        L.circleMarker([r.lat, r.lon], { radius: 9, color: "#fff", weight: 3, fillColor: BOT[r.bot].color, fillOpacity: 1 }).addTo(dmap);
      }
      setTimeout(() => dmap && dmap.invalidateSize(), 60);
    }
    const f = $("cardframe");
    if (f) {
      const want = r.id;
      cardHtml(r.card).then((html) => {
        if (current !== want) return;           // another find was opened meanwhile
        f.srcdoc = html;
        const w = $("cardwait"); if (w) w.remove();
      }).catch(() => { const w = $("cardwait"); if (w) w.textContent = "The report card could not be opened. Please reload the page."; });
      const fit = () => { try { f.style.height = (f.contentDocument.documentElement.scrollHeight + 4) + "px"; } catch (e) { /* cross-origin */ } };
      f.addEventListener("load", () => {
        fit();
        try { f.contentDocument.querySelectorAll("img").forEach((i) => i.addEventListener("load", fit)); } catch (e) { /* ignore */ }
        setTimeout(fit, 800); setTimeout(fit, 2500);
      });
    }
  }
  function closeDetail(push) {
    $("detail").hidden = true;
    document.body.style.overflow = "";
    if (dmap) { dmap.remove(); dmap = null; }
    current = null;
    if (push !== false && hashParams().get("f")) setHash(null, true);
  }
  function fromHash() {
    const f = hashParams().get("f");
    if (f) openDetail(f, false); else closeDetail(false);
  }

  // ---- intro ----------------------------------------------------------------
  function renderIntro() {
    const c = DATA.counts, recs = DATA.records;
    const newN = recs.filter(isNew).length;
    const cur = recs.filter((r) => !isGone(r));
    const months = [...new Set(recs.filter((r) => r.bot === "rezone").map((r) => r.found.slice(0, 7)))].sort();
    $("intro").innerHTML = `
      <p class="big">Everything the three scouts have found since they started:
        <b>${c.rezone}</b> rezonings, <b>${c.listing}</b> properties listed for sale, and <b>${c.assemblage}</b> assemblage sites
        — <b>${cur.length}</b> still live.</p>
      <p><b>${DATA.links}</b> pieces of land turn up in more than one scout — see <i>In more than one</i>.
        Tap any find for its full details and the scout's own report card.</p>
      <p>${prevSeen ? (newN ? `<b>${newN}</b> new since your last visit (marked NEW).` : "Nothing new since your last visit.")
        : "Next time you open this page, anything added since today will be marked NEW."}</p>`;
    const overlapFinds = recs.filter((r) => r.related.length).length;
    $("intro").querySelector("p:nth-child(2)").innerHTML = `<b>${DATA.links}</b> pieces of land show up in more than one scout
      (${overlapFinds} finds, under <i>In more than one</i>). Tap any find for its full details and the scout's own report card.`;
    $("updated").textContent = "Updated " + DATA.built;
  }

  // ---- wiring ---------------------------------------------------------------
  function wire() {
    $("tabs").addEventListener("click", (e) => {
      const t = e.target.closest(".tab"); if (!t) return;
      st.tab = t.dataset.tab; st.shown = PAGE; renderAll(true);
    });
    let tq;
    $("q").addEventListener("input", (e) => {
      clearTimeout(tq); tq = setTimeout(() => { st.q = e.target.value.trim(); st.shown = PAGE; renderAll(false); }, 150);
    });
    $("county").addEventListener("change", (e) => { st.county = e.target.value; st.shown = PAGE; renderAll(true); });
    $("sort").addEventListener("change", (e) => { st.sort = e.target.value; renderList(); });
    $("newonly").addEventListener("change", (e) => { st.newonly = e.target.checked; st.shown = PAGE; renderAll(true); });
    $("showgone").addEventListener("change", (e) => { st.showgone = e.target.checked; st.shown = PAGE; renderAll(false); });
    $("more").addEventListener("click", () => { st.shown += PAGE; renderList(); });
    const openFrom = (e) => {
      const b = e.target.closest("[data-open]"); if (b) { openDetail(b.dataset.open); return true; }
      const row = e.target.closest(".row"); if (row) { openDetail(row.dataset.id); return true; }
      return false;
    };
    $("list").addEventListener("click", openFrom);
    $("list").addEventListener("keydown", (e) => { if (e.key === "Enter") openFrom(e); });
    document.addEventListener("click", (e) => {
      if (e.target.closest(".leaflet-popup") || e.target.closest(".related")) openFrom(e);
    });
    $("close").addEventListener("click", () => closeDetail());
    $("detail").addEventListener("click", (e) => { if (e.target === $("detail")) closeDetail(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("detail").hidden) closeDetail(); });
    window.addEventListener("popstate", fromHash);
  }

  // A full link pasted into a tab that opened without its key: start over.
  window.addEventListener("hashchange", () => { if (!DATA && hashParams().get("k")) location.reload(); });

  async function start() {
    const fail = (msg) => { $("intro").innerHTML = `<p class="big">${msg}</p>`; };
    if (!KEY_TXT) { fail("This link is incomplete — please open the full link Wes sent you."); return; }
    try {
      CRYPTO_KEY = await crypto.subtle.importKey("raw", b64u(KEY_TXT), "AES-GCM", false, ["decrypt"]);
      DATA = JSON.parse(new TextDecoder().decode(await getBin("data.json")));
    } catch (e) {
      fail("This page could not be opened. Please use the full link Wes sent you, or reload.");
      return;
    }
    for (const r of DATA.records) {
      BYID[r.id] = r;
      r._text = [r.title, r.sub, r.county, r.status, ...r.headline, ...r.fields.map((f) => f[1])].join(" ").toLowerCase();
    }
    const prev = load("df_seen_ids");
    prevSeen = Array.isArray(prev) ? new Set(prev) : null;
    const counties = [...new Set(DATA.records.map((r) => r.county))].sort();
    $("county").insertAdjacentHTML("beforeend", counties.map((c) => `<option>${esc(c)}</option>`).join(""));
    initMap();
    wire();
    renderIntro();
    renderAll(true);
    fromHash();
    // Remember what this visit showed, so the next one can mark what is new.
    if (load("df_seen_built") !== DATA.built) {
      const keep = prevSeen ? [...prevSeen] : [];
      save("df_seen_ids", [...new Set([...keep, ...DATA.records.map((r) => r.id)])]);
      save("df_seen_built", DATA.built);
    }
  }
  start();
})();
