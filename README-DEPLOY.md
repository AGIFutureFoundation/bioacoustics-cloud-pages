# bioacoustics.cloud — Cloudflare regeneration (LOCAL STAGING, not deployed)

Built 2026-11-06 from a full read-only crawl of the live Vercel site.
Staging folder: `~/workspace/your_files/hostinger-email/sites/bioacoustics.cloud-regen/`
Nothing here has been deployed, pushed, or published. The live site, Vercel, and DNS were not touched.

## What was crawled

- Sitemap: 29 URLs, all fetched 200 (home 94,324 B; blog hub 62,933 B; 25 articles 23–35 KB each; /translate 24,104 B; /soundmap 20,763 B).
- Assets downloaded byte-verified against live sizes: 16 Next.js chunks (1.2 MB total), 25 blog images (/blog-images/*.jpg, up to 364 KB), 4 library videos + 4 posters, /wave-explainer.mp4 (10,591,409 B) + /wave-poster.jpg (150,859 B), /icon.svg (198 B).
- robots.txt live: plain (Allow /, Host, Sitemap) — 105 B. favicon.ico and manifest.json are 404 on the live site; icon.svg is the real favicon.
- No URL failed. No other linked paths exist beyond the 29 sitemap URLs + assets.

## Video sizes (Cloudflare Pages limit: 25 MB per file — all pass)

| file | size |
|---|---|
| videos/sound-as-shape.mp4 | 17,288,750 B (~16.5 MB) |
| videos/decoding-the-umwelt.mp4 | 16,847,795 B (~16.1 MB) |
| videos/unlocking-the-oceans-secrets.mp4 | 15,693,502 B (~15.0 MB) |
| videos/translating-ocean-voices.mp4 | 15,482,362 B (~14.8 MB) |
| wave-explainer.mp4 | 10,591,409 B (~10.1 MB) |
| 4 posters (videos/*.jpg) | 69,990–115,666 B each |

Total staging size: ~81 MB, 96 files. Pages has no published total-size cap (20,000-file cap; this is 96 files). All individual files are under the 25 MB per-file limit. The videos are the bulk (~72 MB) — if deploy speed becomes an issue, move them to Cloudflare R2 or Stream later; they work as plain Pages files as-is.

## What the live site actually is (evidence)

- Next.js (Turbopack build) on Vercel, Kylon-built: loads `https://app.kylon.io/custom-app/v1/bridge.js`, Kylon app id `54a993962a33`. Outside Kylon's app shell the workspace features return empty (verified: `GET /api/kylon/workspace-members` → 401 `{"members":[]}`).
- The 29 pages are pre-rendered HTML + 16 JS/CSS chunks. The chunks were copied verbatim; the pages were copied verbatim, then discovery links were injected (see below).
- The public GitHub repos are NOT the source: WAVETranslator/Wild-Animal-Voice-Engine is a 1 KB stub (README only); AGIFutureFoundation/bioacoustics-cloud is a static BioDao variant (CNAME biodao.agifuturefoundation.org, single page, no blog/translate/soundmap) — used only as a structural reference, none of its BioDao branding was copied; AGIFutureFoundation/wave-site is empty. The live Next.js source repo was not found (likely private / Vercel-connected / Kylon-built).

## API endpoints the apps call (from the JS chunks + live probes)

| endpoint | method | what it does | live probe |
|---|---|---|---|
| /api/search?q= | GET | iNaturalist sounds + GBIF species + Watkins (see below) | WORKS: `?q=whale` returned 8 sounds, 6 GBIF species, watkins null |
| /api/upload | POST FormData audio | stores the clip, returns {url} | route exists (POST with browser UA → 400 on empty body; curl default UA → connection reset, Vercel bot filter) |
| /api/classify | POST {audio_url} | queues a job, returns {job_id}; poll /api/classify/status?job_id= every 3 s (max 80) → {predictions, watkins, gpu_model} | status endpoint live: unknown job → 404 {"error":"Job not found."} |
| /api/analyze | POST FormData audio + species_hint | synchronous acoustic profile | route exists (same probe as above) |
| /api/soundmap | POST {clips:[{id,species,url}]} | queues a fingerprint job; poll /api/soundmap/status?job_id= | status endpoint live: unknown job → 404 |
| /api/contact | POST JSON form | contact form | live: `{}` → 400 {"error":"Name is required."} |
| /api/waitlist | POST {email,name,role} | membership waitlist | route exists (in chunks; not probed with a submission — no fake signups) |
| /api/kylon/workspace-members | GET | Kylon workspace members | live: 401 {"members":[]} |

Model truth (from the site's own FAQ data in the JS chunks, verified 2026-11-06):
- Live predictor is **BirdNET** (Cornell + Chemnitz), birds-first, 6,500+ species.
- The broader GPU model (Perch 2.0 / NatureLM) "is wired into the pipeline and activates once a GPU inference endpoint is connected" — **NOT connected**. Marine-mammal classification is therefore cross-reference only (Watkins), not direct classification.
- The Sound Map's deeper foundation-model fingerprint is likewise NOT switched on.

## What works statically vs what needs a backend

**Works as pure static files on Cloudflare Pages (verified by local smoke test, all 200):**
- All 29 pages, all chunks, all images, all videos, icon, sitemap, robots, and the full discovery pack.
- Client-side (SPA) navigation degrades to full page loads — links still work; the RSC payload fetch will 404 on static hosting and Next.js falls back to document navigation.
- The Kylon bridge.js still loads from app.kylon.io (external); outside Kylon it no-ops (guarded in the app code).

**Works via the included Pages Function:**
- `/api/search` — `functions/api/search.js` re-implements the verified contract ({q, sounds, species, watkins, marineHint}) against the public iNaturalist + GBIF APIs, no key needed. Gap: `watkins` always returns null — the live Watkins lookup data is a static dataset inside the Vercel app and is not available from outside. Wire the Watkins dataset in when it is recovered.

**Does NOT work statically — needs a backend (honest hybrid, do not fake):**
- Translator upload/classify/analyze (`/api/upload`, `/api/classify`, `/api/analyze`): need an audio store + the BirdNET model server + an async job queue. The model server's location is unknown (Vercel function or an external GPU service); without the source repo it cannot be replicated.
- Sound Map (`/api/soundmap`): same — needs the fingerprint job backend.
- Contact + waitlist (`/api/contact`, `/api/waitlist`): the Vercel backend's destination is unknown (email? database?). No fake destination was invented.
- Kylon workspace (`/api/kylon/workspace-members`): Kylon-platform only; returns empty outside Kylon.

**Honest hybrid (recommended):** deploy the static content + search Function to Cloudflare Pages now (this folder). For the Translator/Sound Map, either (a) re-connect a BirdNET model backend as Cloudflare Workers + a GPU inference endpoint (needs the model server — find the Vercel project/source first), or (b) keep the apps' UI with a clear, honest notice that analysis runs on the Vercel backend and link back to it — but note the Vercel API sends NO CORS headers (verified: preflight 204 with no Access-Control-Allow-Origin), so the Pages site cannot call the Vercel API cross-origin unless CORS is added to the Vercel backend (needs the source repo). Option (a) is the real fix; option (b) is not viable without a Vercel change.

## What could NOT be regenerated

- The live Next.js source (see above) — this regen is a faithful static mirror of the pre-rendered output, not a rebuild from source. Any future content edit must be re-crawled or made from the source once found.
- The Watkins lookup dataset (see above).
- The model backend + job queue (see above).
- The contact/waitlist destinations (unknown).
- Nothing else: every page, image, video, and chunk on the live site is in this folder.

## Discovery pack (included from the start)

- `.well-known/api-catalog` — linkset of real resources (llms.txt, agent.json, sitemap.xml, /translate, /soundmap, /blog, /api/search).
- `.well-known/ai-catalog.json` — 7 entries (home, translate, soundmap, blog hub, llms.txt, agent.json, sitemap).
- `.well-known/agent-skills/index.json` + 4 skills (sha256-verified): read-site-facts, identify-species, acoustic-fingerprint, search-archives. All grounded in the live site; no invented capabilities.
- `agent.json`, `llms.txt`, `auth.md` (registration by email to wave@bioacoustics.cloud, WITH the explicit warning that the address has no MX record and no email plan as of 2026-11-06, so delivery is unverified).
- `robots.txt` — Content-Signal `ai-train=no, search=yes, ai-input=yes` + `Agentmap:` line + Sitemap + Host.
- `sitemap.xml` — same 29 URLs as live.
- Discovery `<link>` block on all 29 pages (verified 1× each); `assets/js/webmcp.js` on the homepage only (tools: contact_wave mailto + get_wave_guide fetch /llms.txt).
- Honesty lines kept throughout: GPU model not connected, MIT-license engine not published (stub repo), wave@ delivery unverified, archives are public sources WAVE does not own.

## Deployment plan (to be done by the parent / browser — NOT done here)

1. Create a Cloudflare Pages project (account x@agifuturefoundation.org) from this folder — direct upload or a new GitHub repo (do NOT reuse AGIFutureFoundation/bioacoustics-cloud: that is the BioDao static copy; use a new repo such as `bioacoustics-cloud-pages` if going the GitHub route). Build command: none (static). Output directory: the folder root. Functions directory: `functions/` (enables /api/search).
2. Verify the Pages preview URL: home, /translate, /soundmap, /blog, one article, one video, /.well-known/ai-catalog.json, /llms.txt, /agent.json, and GET /api/search?q=whale (expect iNaturalist sounds + GBIF species).
3. Attach the custom domain bioacoustics.cloud in the Pages dashboard (www as well, or redirect www → apex — decide at deploy time; the Cloudflare DNS zone for bioacoustics.cloud is being built separately — the apex currently points at Vercel 216.150.1.193/216.150.16.193 and www CNAMEs to cname.vercel-dns.com; those records must be re-pointed to Pages at cutover, and the Vercel project should then be detached or left as the API backend if option (a)/(b) above is pursued).
4. After DNS cutover: re-crawl the live site and confirm all 29 URLs + discovery files return 200 on the new host, and confirm the Translator/Sound Map show their honest backend status.
5. Separate follow-ups (not this regen): fix mail (wave@ needs an email plan + MX/SPF/DMARC), find the Vercel project/source repo for the model backend, and decide the contact/waitlist destination.

## File list (96 files, ~81 MB)

- 29 HTML pages: index.html, translate/index.html, soundmap/index.html, blog/index.html, blog/<25 slugs>/index.html
- 16 files in _next/static/chunks/ (14 JS + 2 CSS)
- 25 files in blog-images/
- 9 files in videos/ (4 mp4 + 4 jpg posters) + wave-explainer.mp4 + wave-poster.jpg at root
- icon.svg, robots.txt, sitemap.xml, llms.txt, agent.json, auth.md
- .well-known/api-catalog, .well-known/ai-catalog.json, .well-known/agent-skills/index.json + 4 skill files
- assets/js/webmcp.js
- functions/api/search.js
- README-DEPLOY.md (this file)
