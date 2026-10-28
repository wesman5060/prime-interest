/* Deal Finder — one page over everything the scouts found. */
(function () {
  "use strict";

  const BOT = {
    rezone: { name: "Rezonings", one: "Rezoning", color: "#2f62c9",
      explain: "Land a county has been asked to rezone toward housing, with room for 50 or more homes or units (the count the case states, or the zoning it asks for times its acres; each card says which) — spotted at the hearing, usually before it is ever listed for sale. The counties' agendas and minutes are re-read every week for the vote; a denied or withdrawn case moves to No longer available." },
    listing: { name: "For sale", one: "For sale", color: "#1b8a5e",
      explain: "Land listed for sale with room for 50+ homes or units — by its zoning, a denser neighbor's zoning or the county's own plan, times its acres (each card says which) — each checked against county records for sewer, floodplain, zoning and the owner. New listings every two weeks; every listing's own page is re-checked every three days, and one that sells or goes under contract moves to No longer available." },
    assemblage: { name: "Assemblages", one: "Assemblage", color: "#c26a12",
      explain: "Neighbouring lots that together hold 50+ homes or units by the zoning on or beside them (each card says how) — land nobody is selling as one piece. Each county is re-run every month on its current tax roll, so new groups show up here as they appear." },
    lots: { name: "Pre-built developments", one: "Pre-built development", color: "#7b3fa8",
      explain: "Every development of 50 or more lots or units in these counties where the roads are built and the lots are graded but not one house has gone up, still held by the developer and not by a national builder. Each was checked on current aerial photos and in county, court and state records. Numbered by how likely the owner is to deal. Every site's lots are re-checked on the county records each month; one that sells or starts building moves to No longer available." },
  };
  const SIZES = [[0, "Any size"], [10, "10+ ac"], [25, "25+ ac"], [50, "50+ ac"], [100, "100+ ac"]];
  const PAGE = 50;
  const WES = "wesorr96@gmail.com";
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let DATA, BYID = {}, prevSeen = null, marks = {}, viewed = {};
  const st = { tab: "start", q: "", sort: "found", open: new Set(), autoOpen: true, minAcres: 0, sewer: false,
    mapOnly: false, showgone: false, showpassed: false, shown: PAGE };
  let order = [];            // the list currently on screen, for Previous / Next

  // ---- per-device memory (works without it) --------------------------------
  function load(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private window */ } }

  // ---- decryption: data, cards and maps are published encrypted ------------
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
  function imgUrl(name) {
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
  const WHO = (hashParams().get("who") || "marty").toLowerCase();
  function linkFor(id) { return location.origin + location.pathname + "#k=" + KEY_TXT + (WHO !== "marty" ? "&who=" + encodeURIComponent(WHO) : "") + (id ? "&f=" + encodeURIComponent(id) : ""); }

  // ---- feedback: every Interested / Pass is recorded where Wes can see it ------------
  // Written to the Prime Interest database (the contact-form table, tagged
  // DEAL_FINDER_MARK); the public key can add a row but can never read one back.
  // A click that cannot be sent waits in this browser and goes on the next visit.
  function deviceId() {
    let d = load("df_device");
    if (!d) { d = Math.random().toString(36).slice(2, 10); save("df_device", d); }
    return d;
  }
  async function sendMark(item) {
    const fb = DATA && DATA.feedback;
    if (!fb) return false;
    try {
      const res = await fetch(fb.url + "/rest/v1/pi_contact_submissions", {
        method: "POST",
        headers: { apikey: fb.key, Authorization: "Bearer " + fb.key, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ name: "Deal Finder (" + item.who + ")", email: "deal-finder@primeinterestinc.com",
          company: "DEAL_FINDER_MARK", heard_from: "deal-finder", message: JSON.stringify(item) }),
      });
      return res.ok;
    } catch (e) { return false; }
  }
  async function flushOutbox() {
    const box = load("df_outbox") || [];
    const left = [];
    for (const item of box) if (!(await sendMark(item))) left.push(item);
    save("df_outbox", left);
    return left.length === 0;
  }
  function recordMark(id, value) {
    const r = BYID[id] || {};
    const item = { id, mark: value || "clear", title: r.title, bot: r.bot, county: r.county_group || r.county,
      who: WHO, device: deviceId(), at: new Date().toISOString() };
    const box = load("df_outbox") || [];
    box.push(item);
    save("df_outbox", box);
    flushOutbox().then((ok) => toast(ok
      ? (value === "yes" ? "Saved — Wes will see you're interested." : value === "no" ? "Passed — saved." : "Mark removed.")
      : "Saved on this computer — it will reach Wes as soon as you're back online."));
  }
  // "Email Wes about this": typed on the page and sent the same way as a mark
  // (a mailto link does nothing on a computer whose email is a website, like Marty's).
  function sendMessage(id) {
    const text = $("msgtext").value.trim();
    if (!text) { toast("Type your message first, then click Send."); $("msgtext").focus(); return; }
    const r = BYID[id] || {};
    const box = load("df_outbox") || [];
    box.push({ type: "message", id, text, title: r.title, bot: r.bot, county: r.county_group || r.county,
      who: WHO, device: deviceId(), at: new Date().toISOString() });
    save("df_outbox", box);
    $("msgtext").value = ""; $("msgbox").hidden = true;
    flushOutbox().then((ok) => toast(ok ? "Sent — Wes will get your message by email."
      : "Saved on this computer — it will reach Wes as soon as you're back online."));
  }
  let toastTimer;
  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
  }
  function martyTag(r) {
    // On anyone else's copy, show what Marty decided.
    if (WHO === "marty" || !DATA.marty_marks) return "";
    const m = DATA.marty_marks[r.id];
    return m === "yes" ? '<span class="tag marty">Marty: ★ Interested</span>' : m === "no" ? '<span class="tag marty-no">Marty passed</span>' : "";
  }
  function setHash(id, push) {
    history[push ? "pushState" : "replaceState"]({ id }, "", linkFor(id).slice(location.origin.length));
  }

  // ---- what a find is ---------------------------------------------------------
  function isGone(r) {
    return (r.bot === "listing" && r.state !== "current") || (r.bot === "assemblage" && r.state === "ruled_out") || r.state === "closed";
  }
  // Sold, under contract, off the market, taken down, denied, withdrawn, or dropped by its scout:
  // the "No longer available" tab (Wes, 2026-10-27: things need to update and stay relevant).
  function isClosed(r) { return r.state === "closed" || (r.bot === "listing" && r.state === "gone"); }
  function closedOn(r) { return r.closed_on || r.last_seen || r.found || ""; }
  function isNew(r) { return prevSeen ? !prevSeen.has(r.id) : false; }
  function ppa(r) { return r.ppa || (r.price && r.acres ? r.price / r.acres : null); }
  function money(v) { return v == null ? "" : "$" + Math.round(v).toLocaleString(); }
  function acres(v) { return v == null ? "" : (v < 100 ? v.toFixed(1) : Math.round(v).toLocaleString()) + " acres"; }

  function facts(r) {
    const f = [];
    if (r.acres != null) f.push(`<b>${esc(acres(r.acres))}</b>`);
    if (r.bot === "listing" && r.price) f.push(`${esc(money(r.price))}` + (ppa(r) ? ` <span class="dim">(${esc(money(ppa(r)))}/ac)</span>` : ""));
    if (r.bot === "rezone" && r.change_short) f.push(esc(r.change_short));
    if (r.homes) f.push(`${r.homes.toLocaleString()} ${r.unit || "homes"}`);
    return f.join('<span class="sep"> · </span>');
  }
  function badge(r) { return `<span class="badge ${r.badge_kind || ""}">${esc(r.badge)}</span>`; }

  // ---- filtering ----------------------------------------------------------------
  function passes(r, opts) {
    const o = Object.assign({ gone: st.showgone, passed: st.showpassed }, opts || {});
    if (!o.gone && isGone(r)) return false;
    if (!o.passed && marks[r.id] === "no") return false;
    if (st.minAcres && !(r.acres >= st.minAcres)) return false;
    if (st.sewer && !r.sewer_ok) return false;
    if (st.q) {
      const words = st.q.toLowerCase().split(/\s+/).filter(Boolean);
      if (!words.every((w) => r._text.includes(w))) return false;
    }
    if (st.mapOnly && map && (r.lat == null || !map.getBounds().contains([r.lat, r.lon]))) return false;
    return true;
  }
  function inTab(r, tab) {
    if (tab === "all") return true;
    if (tab === "mine") return marks[r.id] === "yes";
    if (tab === "closed") return isClosed(r);
    return r.bot === tab;
  }
  const SORTS = {
    found: (a, b) => (b.found || "").localeCompare(a.found || "") || (b.acres || 0) - (a.acres || 0),
    acres: (a, b) => (b.acres || 0) - (a.acres || 0),
    homes: (a, b) => (b.homes || 0) - (a.homes || 0) || (b.acres || 0) - (a.acres || 0),
    price: (a, b) => (ppa(a) || Infinity) - (ppa(b) || Infinity),
  };
  function listRows() {
    const opts = st.tab === "mine" ? { gone: true, passed: true } : st.tab === "closed" ? { gone: true } : {};
    const rows = DATA.records.filter((r) => inTab(r, st.tab) && passes(r, opts));
    if (st.tab === "closed") return rows.sort((a, b) => closedOn(b).localeCompare(closedOn(a)));
    // the Finished lots shortlist reads best in its own order, strongest seller signals first
    return st.tab === "lots" && st.sort === "found" ? rows.sort((a, b) => a.rank - b.rank) : rows.sort(SORTS[st.sort]);
  }

  // ---- "Start here": a short, explained first look ---------------------------
  function startSections() {
    const live = (r) => !isGone(r) && marks[r.id] !== "no";
    const recs = DATA.records;
    const sec = [];
    const fresh = recs.filter((r) => isNew(r) && live(r)).sort(SORTS.acres);
    if (fresh.length) sec.push({ title: "New since your last visit", why: "Found by a scout since you last opened this page.", rows: fresh.slice(0, 12), more: fresh.length, go: { tab: "all", sort: "found" } });
    const pairs = [];
    const seen = new Set();
    for (const r of recs) for (const [oid, why] of r.related) {
      const k = [r.id, oid].sort().join("|");
      if (seen.has(k) || !BYID[oid]) continue;
      seen.add(k);
      pairs.push({ a: r, b: BYID[oid], why });
    }
    if (pairs.length) sec.push({ title: "Same land, found by two scouts", why: "The strongest signal on this page: one piece of ground turned up for two different reasons.", pairs });
    const num = (r) => parseInt(r.badge.replace(/\D/g, "") || "99", 10);
    const picks = recs.filter((r) => r.bot === "assemblage" && (r.state === "pick" || r.state === "runner_up"))
      .sort((a, b) => (a.state === "pick" ? 0 : 1) - (b.state === "pick" ? 0 : 1) || num(a) - num(b));
    const lots = recs.filter((r) => r.bot === "lots" && r.rank < 100 && !isGone(r)).sort((a, b) => a.rank - b.rank);
    if (lots.length) sec.push({ title: "Pre-built developments, no houses yet", why: "Roads in, lots graded, nothing built, still with the developer. Numbered by how likely the owner is to deal.", rows: lots, keepOrder: true });
    const uw = recs.filter((r) => r.bot === "lots" && r.rank >= 100 && !isGone(r)).sort((a, b) => a.rank - b.rank);
    if (uw.length) sec.push({ title: "Site work under way, nothing built yet", why: "Grading, streets or sewer going in now and no building started: homes first, then apartments and townhomes. The rest are on the Pre-built developments tab.", rows: uw.slice(0, 10), more: uw.length, keepOrder: true, go: { tab: "lots", sort: "found" } });
    if (picks.length) {
      const np = picks.filter((r) => r.state === "pick").length, nr = picks.length - np;
      const nc = new Set(picks.map((r) => r.county_group)).size;
      const word = (n) => ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][n] || String(n);
      sec.push({ title: "Assemblage shortlist", why: `The ${word(np)} best groups of lots in ${word(nc)} ${nc === 1 ? "county" : "counties"}, each checked by eye and in the news` + (nr ? `, plus ${word(nr)} runner${nr === 1 ? "" : "s"}-up.` : "."), rows: picks });
    }
    const rez = recs.filter((r) => r.bot === "rezone" && r.badge_kind === "good" && live(r)).sort(SORTS.acres);
    if (rez.length) sec.push({ title: "Rezonings approved or recommended", why: "The county has said yes, or its staff or planning board recommended yes.", rows: rez.slice(0, 10), more: rez.length, go: { tab: "rezone", sort: "acres" } });
    const big = recs.filter((r) => r.bot === "listing" && r.state === "current" && r.sewer_ok && r.acres >= 25 && live(r)).sort(SORTS.acres);
    if (big.length) sec.push({ title: "For sale: 25+ acres with gravity sewer within 200 ft", why: "Big enough for a real project, with sewer measured at or near the land.", rows: big.slice(0, 10), more: big.length, go: { tab: "listing", minAcres: 25, sewer: true, sort: "acres" } });
    const cutoff = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
    const closed = recs.filter((r) => isClosed(r) && closedOn(r) >= cutoff).sort((x, y) => closedOn(y).localeCompare(closedOn(x)));
    if (closed.length) sec.push({ title: "Gone in the last 30 days", why: "Sold, under contract, off the market, or a rezoning denied or withdrawn. Everything that closed is on the No longer available tab.", rows: closed.slice(0, 8), more: closed.length, keepOrder: true, go: { tab: "closed" } });
    return sec;
  }

  // ---- rendering ------------------------------------------------------------------
  function rowHtml(r) {
    const also = [...new Set(r.related.map(([id]) => BYID[id] && BYID[id].bot))].filter(Boolean)
      .map((b) => `<span class="tag also">Also ${esc(BOT[b].one.toLowerCase())}</span>`).join("");
    const mk = (marks[r.id] === "yes" ? '<span class="tag yes">★ Interested</span>' : marks[r.id] === "no" ? '<span class="tag">Passed</span>' : "") + martyTag(r);
    return `<button type="button" class="row ${r.bot}${isGone(r) ? " gone" : ""}${viewed[r.id] ? " seen" : ""}" data-id="${esc(r.id)}">
      <span class="kind">${esc(BOT[r.bot].one)}${viewed[r.id] ? ' <span class="seenmark">· viewed</span>' : ""}</span>
      <span class="title">${esc(r.title)}</span>
      <span class="sub">${esc(r.sub)}</span>
      <span class="facts">${facts(r)}</span>
      <span class="tags">${isNew(r) ? '<span class="tag new">NEW</span>' : ""}${badge(r)}${r.sewer_ok ? '<span class="tag sewer">Gravity sewer ≤200 ft</span>' : ""}${also}${mk}</span>
    </button>`;
  }

  function renderTabs() {
    const n = (t) => DATA.records.filter((r) => inTab(r, t) && passes(r, t === "mine" ? { gone: true, passed: true } : t === "closed" ? { gone: true } : {})).length;
    const mine = Object.values(marks).filter((v) => v === "yes").length;
    const tabs = [["start", "Start here", ""], ["all", "Everything", n("all")], ["rezone", BOT.rezone.name, n("rezone")],
      ["listing", BOT.listing.name, n("listing")], ["assemblage", BOT.assemblage.name, n("assemblage")], ["lots", BOT.lots.name, n("lots")], ["mine", "★ My picks", mine], ["closed", "No longer available", n("closed")]];
    $("tabs").innerHTML = tabs.map(([t, label, c]) =>
      `<button class="tab${t === "start" ? " start" : ""}" role="tab" data-tab="${t}" aria-selected="${st.tab === t}">` +
      (BOT[t] ? `<i class="dot ${t}"></i>` : "") + `${esc(label)}${c !== "" ? ` <span class="n">${c}</span>` : ""}</button>`).join("");
    const ex = {
      start: `A first look: the finds most worth your time, out of <b>${DATA.records.filter((r) => !isGone(r)).length}</b> live ones. Use the tabs above to go through everything.`,
      all: "Every find from all four scouts, grouped by county and then by town. Use the size and sewer buttons to narrow it down.",
      mine: "Finds you marked ★ Interested.",
      closed: "Land that was on this page and is not available any more: sold, under contract, taken off the market, a rezoning denied or withdrawn, or a development that started building. Each one says what happened and when.",
    }[st.tab] || esc(BOT[st.tab].explain);
    $("explain").innerHTML = ex;
    $("controls").hidden = st.tab === "start";
  }

  function renderControls() {
    $("sizechips").innerHTML = SIZES.map(([v, l]) =>
      `<button type="button" class="chip" data-size="${v}" aria-pressed="${st.minAcres === v}">${l}</button>`).join("");
    $("sewerchip").setAttribute("aria-pressed", String(st.sewer));
  }

  function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
  function plainWhy(w) {
    if (/^same parcel/.test(w)) return "Same parcel on the county record " + (w.match(/\(.*\)/) || [""])[0];
    if (/touch/.test(w)) return "Right next door to each other";
    if (/inside/.test(w)) return "One sits inside the other's boundary";
    return cap(w);
  }

  // ---- county -> town grouping ------------------------------------------------
  function townKey(t) { return (/^Unincorporated/.test(t) ? "~" : "") + t; }   // unincorporated last
  function groupRows(rows) {
    const byC = new Map();
    for (const r of rows) {
      const c = r.county_group || r.county;
      if (!byC.has(c)) byC.set(c, new Map());
      const towns = byC.get(c);
      const t = r.town || "Town not given";
      if (!towns.has(t)) towns.set(t, []);
      towns.get(t).push(r);
    }
    return [...byC.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([county, towns]) => ({
      county,
      towns: [...towns.entries()].sort((a, b) => townKey(a[0]).localeCompare(townKey(b[0]))).map(([town, rs]) => ({ town, rows: rs })),
      n: [...towns.values()].reduce((x, rs) => x + rs.length, 0),
    }));
  }
  function short(c) { return c.replace(/ County$/, ""); }
  function fitTo(rows) {
    const pts = rows.filter((r) => r.lat != null).map((r) => [r.lat, r.lon]);
    if (pts.length && map) map.fitBounds(pts, { padding: [30, 30], maxZoom: pts.length > 1 ? 13 : 15 });
  }

  function renderStart() {
    const secs = startSections();
    order = [];
    const html = secs.map((s) => {
      let body;
      if (s.pairs) {
        body = s.pairs.map((p) => { order.push(p.a, p.b); return `<div class="pair"><p class="pairwhy">${esc(plainWhy(p.why))}</p>${rowHtml(p.a)}${rowHtml(p.b)}</div>`; }).join("");
      } else {
        body = s.keepOrder ? (order.push(...s.rows), s.rows.map(rowHtml).join("")) : groupRows(s.rows).map((g) => {
          const rs = g.towns.flatMap((t) => t.rows);
          order.push(...rs);
          return `<h4 class="minicounty">${esc(g.county)} <span>${g.n}</span></h4>` + rs.map(rowHtml).join("");
        }).join("");
      }
      const more = s.go && s.more > s.rows.length
        ? `<button type="button" class="seeall" data-go='${esc(JSON.stringify(s.go))}'>See all ${s.more} →</button>` : "";
      return `<section class="sec"><h2>${esc(s.title)}</h2><p class="why">${esc(s.why)}</p><div class="rows">${body}</div>${more}</section>`;
    }).join("");
    $("list").innerHTML = html || '<p class="none">Nothing to show yet.</p>';
    $("count").textContent = "";
    $("more").hidden = true;
    renderMarkers(order);
  }

  function renderList() {
    if (st.tab === "start") { renderStart(); return; }
    const rows = listRows();
    const groups = groupRows(rows);
    order = groups.flatMap((g) => g.towns.flatMap((t) => t.rows));
    if (st.autoOpen) {                       // small lists open fully; big ones start as a county index
      st.open = new Set(rows.length <= 60 || groups.length === 1 ? groups.map((g) => g.county) : []);
      st.autoOpen = false;
    }
    const hidden = [];
    if (!st.showgone && st.tab !== "mine" && st.tab !== "closed") hidden.push("sold and ruled-out finds");
    if (!st.showpassed && st.tab !== "mine") hidden.push("ones you passed on");
    $("count").textContent = `${rows.length.toLocaleString()} ${rows.length === 1 ? "find" : "finds"} in ${groups.length} ${groups.length === 1 ? "county" : "counties"}` +
      (hidden.length ? ` · hiding ${hidden.join(" and ")}` : "");
    const jump = groups.length > 1 ? `<div class="jump"><span class="jl">Jump to a county:</span>${groups.map((g) =>
      `<button type="button" class="chip" data-jump="${esc(g.county)}">${esc(short(g.county))} <span class="n">${g.n}</span></button>`).join("")}
      <span class="oc"><button type="button" class="lnkbtn" data-all="open">Open all</button> · <button type="button" class="lnkbtn" data-all="close">Close all</button></span></div>` : "";
    const body = groups.map((g) => {
      const open = st.open.has(g.county);
      const towns = g.towns.length;
      return `<section class="cgroup${open ? " open" : ""}" data-county="${esc(g.county)}">
        <button type="button" class="chead" data-toggle="${esc(g.county)}" aria-expanded="${open}">
          <span class="cname">${esc(g.county)}</span>
          <span class="ccount">${g.n} ${g.n === 1 ? "find" : "finds"} · ${towns} ${towns === 1 ? "town" : "towns"}</span>
          <span class="chev" aria-hidden="true">${open ? "▾ Close" : "▸ Open"}</span>
        </button>
        ${open ? `<div class="cbody">${g.towns.map((t) => `<h3 class="town">${esc(t.town)} <span>${t.rows.length}</span></h3><div class="rows">${t.rows.map(rowHtml).join("")}</div>`).join("")}</div>`
          : `<p class="ctowns">${g.towns.map((t) => `${esc(t.town)} (${t.rows.length})`).join(" · ")}</p>`}
      </section>`;
    }).join("");
    $("list").innerHTML = jump + body +
      (rows.length ? "" : `<p class="none">${st.tab === "mine" ? "Nothing marked yet. Open a find and tap ★ Interested." : "Nothing matches. Try a smaller size or turn off the sewer button."}</p>`);
    $("more").hidden = true;
    if (!st.mapOnly) renderMarkers(rows);
  }

  function renderAll(fit) { renderTabs(); renderControls(); renderList(); if (fit) fitMap(); }

  function fmtDate(d) {
    if (!d) return "—";
    const [y, m, day] = d.split("-").map(Number);
    return new Date(y, m - 1, day || 1).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  function foundTxt(r) {
    if (r.bot === "rezone") {
      const [y, m] = r.found.split("-").map(Number);
      return "In the " + new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }) + " meetings report";
    }
    return "Found " + fmtDate(r.found);
  }

  // ---- map --------------------------------------------------------------------
  let map, markerLayer, shapeLayer, sat, streets, onStreets = false, lastRows = [], markerById = {};
  const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/";
  function initMap() {
    map = L.map("map", { preferCanvas: true }).setView([33.95, -84.2], 9);
    sat = L.layerGroup([
      L.tileLayer(ESRI + "World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, attribution: "Imagery © Esri, Maxar, Earthstar Geographics" }),
      L.tileLayer(ESRI + "Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, opacity: 0.85 }),
    ]).addTo(map);
    streets = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      { maxZoom: 19, attribution: "© OpenStreetMap contributors © CARTO" });
    markerLayer = L.layerGroup().addTo(map);
    shapeLayer = L.layerGroup().addTo(map);
    map.on("zoomend moveend", () => { drawShapes(); if (st.mapOnly && st.tab !== "start") { st.shown = PAGE; renderTabs(); renderList(); } });
    $("basemap").onclick = () => {
      onStreets = !onStreets;
      if (onStreets) { map.removeLayer(sat); streets.addTo(map); } else { map.removeLayer(streets); sat.addTo(map); }
      $("basemap").textContent = onStreets ? "Satellite" : "Street map";
    };
    $("legend").innerHTML = Object.entries(BOT).map(([k, b]) => `<span><i class="dot ${k}"></i>${esc(b.name)}</span>`).join("");
  }
  function renderMarkers(rows) {
    lastRows = rows;
    markerLayer.clearLayers();
    markerById = {};
    for (const r of rows) {
      if (r.lat == null || r.lon == null) continue;
      const m = L.circleMarker([r.lat, r.lon], {
        radius: r.related.length ? 9 : 7, color: "#fff", weight: r.related.length ? 3 : 2,
        fillColor: BOT[r.bot].color, fillOpacity: isGone(r) ? 0.5 : 0.95,
      });
      m.bindTooltip(`<b>${esc(r.title)}</b><br>${esc(BOT[r.bot].one)} · ${esc(acres(r.acres))}`, { direction: "top" });
      m.on("click", () => openDetail(r.id));
      markerLayer.addLayer(m);
      markerById[r.id] = m;
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
    if (st.mapOnly) return;
    map.invalidateSize();
    const pts = lastRows.filter((r) => r.lat != null).map((r) => [r.lat, r.lon]);
    if (pts.length) map.fitBounds(pts, { padding: [30, 30], maxZoom: pts.length > 1 ? 13 : 15 });
  }
  function highlight(id, on) {
    const m = markerById[id];
    if (!m) return;
    const r = BYID[id];
    m.setStyle(on ? { radius: 13, weight: 4, color: "#ffd84a" } : { radius: r.related.length ? 9 : 7, weight: r.related.length ? 3 : 2, color: "#fff" });
    if (on) m.bringToFront();
  }

  // ---- detail ----------------------------------------------------------------------
  let dmap = null, current = null;
  function openDetail(id, push) {
    const r = BYID[id];
    if (!r) return;
    current = id;
    viewed[id] = 1; save("df_viewed", viewed);
    if (push !== false) setHash(id, true);
    const i = order.findIndex((x) => x.id === id);
    $("pos").textContent = i >= 0 ? `${i + 1} of ${order.length}` : "";
    $("prev").disabled = !(i > 0);
    $("next").disabled = !(i >= 0 && i < order.length - 1);
    const rel = r.related.map(([oid, why]) => {
      const o = BYID[oid];
      return o ? `<li><button type="button" class="lnk" data-open="${esc(oid)}">${esc(BOT[o.bot].one)}: ${esc(o.title)}</button> — ${esc(plainWhy(why).toLowerCase())}</li>` : "";
    }).join("");
    const allFacts = `<dl class="fields">${r.fields.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>`;
    $("dcontent").innerHTML = `
      <div class="d-kind"><i class="dot ${r.bot}"></i>${esc(BOT[r.bot].one)} · ${esc(r.county)}${isNew(r) ? ' <span class="tag new">NEW</span>' : ""}</div>
      <h2 id="dtitle">${esc(r.title)}</h2>
      <p class="d-sub">${esc(r.sub)}</p>
      <p class="d-head">${facts(r)}</p>
      ${r.fifty && r.fifty.how ? `<p class="d-fifty"><b>50+ lots:</b> ${esc(r.fifty.how)}${r.fifty.flags && r.fifty.flags.length ? `<br><b class="flag">Red flag:</b> ${esc(r.fifty.flags.join("; "))}` : ""}</p>` : ""}
      <div class="d-tags">${martyTag(r)}${badge(r)}${r.sewer_ok ? '<span class="tag sewer">Gravity sewer ≤200 ft</span>' : ""}<span class="tag">${esc(foundTxt(r))}</span></div>
      <div class="actions">
        <button type="button" class="act yes${marks[id] === "yes" ? " on" : ""}" data-mark="yes">★ Interested</button>
        <button type="button" class="act no${marks[id] === "no" ? " on" : ""}" data-mark="no">Pass</button>
        <button type="button" class="act mail" data-write>✉ Email Wes about this</button>
        ${r.links.map(([t, u]) => `<a class="act" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(t)} ↗</a>`).join("")}
      </div>
      <div class="msgbox" id="msgbox" hidden>
        <label for="msgtext">Your message to Wes about <b>${esc(r.title)}</b></label>
        <textarea id="msgtext" rows="4" placeholder="Type your message here, then click Send."></textarea>
        <div class="msgbtns"><button type="button" class="act yes" data-send>Send to Wes</button>
          <button type="button" class="act" data-cancel>Cancel</button></div>
        <p class="msgnote">It goes straight to Wes's email with a link to this property. Wes replies to your email.</p>
      </div>
      ${rel ? `<div class="related"><h4>Also found by another scout</h4><ul>${rel}</ul></div>` : ""}
      ${r.card ? `<h3 class="sech">The scout's report card</h3>
        <iframe class="cardframe" id="cardframe" title="Report card"></iframe><p class="none" id="cardwait">Opening the report card…</p>` : ""}
      ${r.lat != null ? '<h3 class="sech">Where it is</h3><div class="d-map" id="dmap"></div>' : '<p class="none">No map location — the county gave no address for this case.</p>'}
      ${r.card ? `<details class="more-facts"><summary>All the details</summary>${allFacts}</details>` : `<h3 class="sech">The details</h3>${allFacts}`}`;
    $("detail").hidden = false;
    document.body.classList.add("noscroll");
    $("detailinner").scrollTop = 0;
    if (r.lat != null) {
      if (dmap) { dmap.remove(); dmap = null; }
      dmap = L.map("dmap", { attributionControl: false }).setView([r.lat, r.lon], 15);
      L.tileLayer(ESRI + "World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19 }).addTo(dmap);
      L.tileLayer(ESRI + "Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, opacity: 0.85 }).addTo(dmap);
      if (r.rings) {
        const poly = L.polygon(r.rings.map((ring) => ring.map(([x, y]) => [y, x])), { color: "#ffd84a", weight: 3, fillOpacity: 0.08 }).addTo(dmap);
        dmap.fitBounds(poly.getBounds(), { padding: [20, 20], maxZoom: 17 });
      } else {
        L.circleMarker([r.lat, r.lon], { radius: 9, color: "#fff", weight: 3, fillColor: BOT[r.bot].color, fillOpacity: 1 }).addTo(dmap);
      }
      setTimeout(() => dmap && dmap.invalidateSize(), 60);
    }
    const f = $("cardframe");
    if (f) {
      const fit = () => { try { f.style.height = (f.contentDocument.documentElement.scrollHeight + 4) + "px"; } catch (e) { /* ignore */ } };
      f.addEventListener("load", () => {
        fit();
        try { f.contentDocument.querySelectorAll("img").forEach((im) => im.addEventListener("load", fit)); } catch (e) { /* ignore */ }
        setTimeout(fit, 800); setTimeout(fit, 2500);
      });
      cardHtml(r.card).then((html) => {
        if (current !== id) return;
        f.srcdoc = html;
        const w = $("cardwait"); if (w) w.remove();
      }).catch(() => { const w = $("cardwait"); if (w) w.textContent = "The report card could not be opened. Please reload the page."; });
    }
  }
  function step(d) {
    const i = order.findIndex((x) => x.id === current);
    const nx = order[i + d];
    if (nx) { openDetail(nx.id, false); setHash(nx.id, false); }
  }
  function closeDetail(push) {
    $("detail").hidden = true;
    document.body.classList.remove("noscroll");
    if (dmap) { dmap.remove(); dmap = null; }
    const was = current;
    current = null;
    if (push !== false && hashParams().get("f")) setHash(null, true);
    renderTabs(); renderList();
    const el = was && document.querySelector(`.row[data-id="${CSS.escape(was)}"]`);
    if (el) { el.classList.add("active"); el.scrollIntoView({ block: "center" }); }
  }
  function fromHash() {
    const f = hashParams().get("f");
    if (f) openDetail(f, false); else if (!$("detail").hidden) closeDetail(false);
  }
  function setMark(id, v) {
    if (marks[id] === v) delete marks[id]; else marks[id] = v;
    save("df_marks", marks);
    recordMark(id, marks[id] || null);
    document.querySelectorAll(".act[data-mark]").forEach((b) => b.classList.toggle("on", marks[id] === b.dataset.mark));
    if (v === "no" && marks[id] === "no") setTimeout(() => step(1), 250);   // passed: move on
  }

  // ---- header -------------------------------------------------------------------
  function renderUpdated() {
    // The same live counts as the tabs (the full totals counted listings no longer for sale).
    const c = {};
    for (const r of DATA.records) if (!isGone(r)) c[r.bot] = (c[r.bot] || 0) + 1;
    $("updated").innerHTML = `${c.rezone || 0} rezonings · ${c.listing || 0} for sale · ${c.assemblage || 0} assemblages` + (c.lots ? ` · ${c.lots} pre-built developments` : "") + `<br><span>Updated ${esc(fmtDate(DATA.built.slice(0, 10)))}</span>`;
  }

  // ---- wiring ---------------------------------------------------------------------
  function wire() {
    $("tabs").addEventListener("click", (e) => {
      const t = e.target.closest(".tab"); if (!t) return;
      st.tab = t.dataset.tab; st.shown = PAGE; st.autoOpen = true; renderAll(true);
    });
    let tq;
    $("q").addEventListener("input", (e) => {
      clearTimeout(tq); tq = setTimeout(() => { st.q = e.target.value.trim(); st.shown = PAGE; renderAll(false); }, 150);
    });
    $("sizechips").addEventListener("click", (e) => {
      const b = e.target.closest("[data-size]"); if (!b) return;
      st.minAcres = Number(b.dataset.size); st.shown = PAGE; st.autoOpen = true; renderAll(true);
    });
    $("sewerchip").addEventListener("click", () => { st.sewer = !st.sewer; st.shown = PAGE; st.autoOpen = true; renderAll(true); });
    $("sort").addEventListener("change", (e) => { st.sort = e.target.value; renderList(); });
    $("mapfilter").addEventListener("change", (e) => { st.mapOnly = e.target.checked; st.shown = PAGE; renderAll(false); });
    $("showgone").addEventListener("change", (e) => { st.showgone = e.target.checked; st.shown = PAGE; renderAll(false); });
    $("showpassed").addEventListener("change", (e) => { st.showpassed = e.target.checked; st.shown = PAGE; renderAll(false); });
    $("more").addEventListener("click", () => { st.shown += PAGE; renderList(); });
    $("list").addEventListener("click", (e) => {
      const go = e.target.closest("[data-go]");
      if (go) {
        Object.assign(st, { minAcres: 0, sewer: false, sort: "found", shown: PAGE, autoOpen: true }, JSON.parse(go.dataset.go));
        $("sort").value = st.sort;
        renderAll(true); window.scrollTo({ top: 0 }); return;
      }
      const tg = e.target.closest("[data-toggle]");
      if (tg) {
        const c = tg.dataset.toggle;
        if (st.open.has(c)) st.open.delete(c); else { st.open.add(c); fitTo(order.filter((r) => (r.county_group || r.county) === c)); }
        renderList(); return;
      }
      const j = e.target.closest("[data-jump]");
      if (j) {
        const c = j.dataset.jump;
        st.open.add(c); renderList();
        fitTo(order.filter((r) => (r.county_group || r.county) === c));
        const el = document.querySelector(`.cgroup[data-county="${CSS.escape(c)}"]`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      const all = e.target.closest("[data-all]");
      if (all) {
        st.open = new Set(all.dataset.all === "open" ? groupRows(listRows()).map((g) => g.county) : []);
        renderList(); if (all.dataset.all === "close") fitMap(); return;
      }
      const row = e.target.closest(".row"); if (row) openDetail(row.dataset.id);
    });
    $("list").addEventListener("mouseover", (e) => { const r = e.target.closest(".row"); if (r) highlight(r.dataset.id, true); });
    $("list").addEventListener("mouseout", (e) => { const r = e.target.closest(".row"); if (r) highlight(r.dataset.id, false); });
    $("dcontent").addEventListener("click", (e) => {
      const m = e.target.closest("[data-mark]"); if (m) { setMark(current, m.dataset.mark); return; }
      if (e.target.closest("[data-write]")) { $("msgbox").hidden = false; $("msgtext").focus(); $("msgbox").scrollIntoView({ block: "nearest" }); return; }
      if (e.target.closest("[data-cancel]")) { $("msgbox").hidden = true; return; }
      if (e.target.closest("[data-send]")) { sendMessage(current); return; }
      const o = e.target.closest("[data-open]"); if (o) openDetail(o.dataset.open);
    });
    $("prev").addEventListener("click", () => step(-1));
    $("next").addEventListener("click", () => step(1));
    $("close").addEventListener("click", () => closeDetail());
    $("detail").addEventListener("click", (e) => { if (e.target === $("detail")) closeDetail(); });
    document.addEventListener("keydown", (e) => {
      if ($("detail").hidden) return;
      if (e.target.closest && e.target.closest("textarea, input")) return;   // typing a message: arrows move the cursor, not the page
      if (e.key === "Escape") closeDetail();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    });
    $("maptoggle").addEventListener("click", () => {
      const on = document.body.classList.toggle("showmap");
      $("maptoggle").textContent = on ? "Hide map" : "Show map";
      if (on) setTimeout(() => { map.invalidateSize(); fitMap(); }, 50);
    });
    window.addEventListener("popstate", fromHash);
    window.addEventListener("hashchange", () => { if (!DATA && hashParams().get("k")) location.reload(); });
  }

  async function start() {
    const fail = (msg) => { $("explain").innerHTML = `<b>${msg}</b>`; $("controls").hidden = true; };
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
      r._text = [r.title, r.sub, r.county, r.county_group, r.town, r.badge, ...r.headline, ...r.fields.map((f) => f[1])].join(" ").toLowerCase();
    }
    marks = load("df_marks") || {};
    // Marty's marks follow him: what he marked on another computer arrives with
    // the day's data. A mark made here since then stays as he left it.
    // Clicks made before marks were recorded (21-26 Oct) lived only in this
    // browser: send each of them once, and keep them (queued marks are never
    // dropped by the sync below).
    if (WHO === "marty" && !load("df_marks_backfilled")) {
      const box = load("df_outbox") || [];
      for (const [id, m] of Object.entries(marks)) {
        const r = BYID[id] || {};
        box.push({ id, mark: m, title: r.title, bot: r.bot, county: r.county_group || r.county, who: WHO,
          device: deviceId(), at: new Date().toISOString(), earlier: true });
      }
      save("df_outbox", box); save("df_marks_backfilled", 1);
    }
    if (WHO === "marty" && DATA.marty_marks) {
      const since = load("df_marks_synced") || "";
      for (const [id, m] of Object.entries(DATA.marty_marks)) if (!(id in marks) || since < (DATA.marty_marks_at || "")) marks[id] = m;
      for (const id of Object.keys(marks)) if (!(id in DATA.marty_marks) && since < (DATA.marty_marks_at || "") && !(load("df_outbox") || []).some((x) => x.id === id)) delete marks[id];
      save("df_marks", marks); save("df_marks_synced", DATA.marty_marks_at || "");
    }
    flushOutbox();
    viewed = load("df_viewed") || {};
    const prev = load("df_seen_ids");
    prevSeen = Array.isArray(prev) ? new Set(prev) : null;
    initMap();
    wire();
    renderUpdated();
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
