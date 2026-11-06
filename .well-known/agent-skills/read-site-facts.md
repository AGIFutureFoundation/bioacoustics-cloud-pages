# Read WAVE site facts (read-site-facts)

Use this skill when an agent needs grounded facts about WAVE / bioacoustics.cloud.

## Where facts live

- `/llms.txt` — the site guide: what WAVE is, the honest boundary, model status, resources, blog list, membership, roadmap, and what is NOT true yet.
- `/agent.json` — machine-readable protocol, model status, and the Virtuals agent links.
- `/sitemap.xml` — all 29 pages.

## Rules

- Quote the site's own claims as site copy (e.g. "12,000+ species", "5–7s decode") and label them as such; they are not independently verified.
- Never state the Perch / NatureLM GPU model as connected. The live predictor is BirdNET (birds-first). The GPU model activates once a GPU inference endpoint is connected — it is not connected as of 2026-11-06.
- Never state the engine is open source and available. The public repo is a 1 KB stub; the open-source community is a roadmap "Next" item.
- Never assume email to wave@bioacoustics.cloud is delivered: no MX record and no email plan exist as of 2026-11-06.
- The 8 resource archives (Xeno-canto, Macaulay, Watkins, iNaturalist, Earth Species, Project CETI, Animal Sound Archive, GBIF) are public sources WAVE links to; WAVE owns none of them.
