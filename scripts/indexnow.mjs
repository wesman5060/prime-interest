/**
 * IndexNow push — tells Bing/Yandex/Seznam to re-crawl the site immediately
 * instead of waiting in their crawl queue.
 *
 * Run after any content change that's already deployed:
 *   node scripts/indexnow.mjs
 *
 * Reads the LIVE sitemap (so it always matches what's actually deployed) and
 * submits every URL in one batch. The key file must stay reachable at
 * https://primeinterestinc.com/<KEY>.txt — it's committed in public/.
 *
 * Google ignores IndexNow (use Search Console for that); this is the Bing lever.
 */

const HOST = "primeinterestinc.com";
const KEY = "73a015dc663ae8b1f5d86da8d046d752";
const SITEMAP = `https://${HOST}/sitemap.xml`;

const sitemapXml = await fetch(SITEMAP).then((r) => {
  if (!r.ok) throw new Error(`sitemap fetch failed: ${r.status}`);
  return r.text();
});

const urlList = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) throw new Error("no URLs found in sitemap");

// Sanity: the key file has to be live or IndexNow rejects the whole batch.
const keyCheck = await fetch(`https://${HOST}/${KEY}.txt`);
const keyBody = (await keyCheck.text()).trim();
if (!keyCheck.ok || keyBody !== KEY) {
  throw new Error(`key file not serving correctly (${keyCheck.status}: "${keyBody}")`);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  }),
});

console.log(`submitted ${urlList.length} URLs -> HTTP ${res.status} ${res.statusText}`);
if (res.status !== 200 && res.status !== 202) {
  console.log(await res.text());
  process.exit(1);
}
