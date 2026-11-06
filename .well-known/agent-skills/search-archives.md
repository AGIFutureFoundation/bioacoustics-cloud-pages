# Search the animal-sound archives (search-archives)

Use this skill to find reference recordings and species facts through WAVE's search API.

## Endpoint

GET /api/search?q=<term> — returns JSON {q, sounds, species, watkins, marineHint}.

- `sounds`: iNaturalist observations with audio — each has source, species, place, soundUrl, pageUrl, license. The recordings are public citizen-science data; cite iNaturalist and the license.
- `species`: GBIF species matches — scientificName, commonName, rank, kingdom, pageUrl.
- `watkins`: Watkins Marine Mammal Sound Database cross-reference when the term matches a marine species, else null.
- `marineHint`: whether the term looks marine.

## Rules

- The archives are public sources. WAVE's value is bringing them together — do not present the recordings as WAVE-owned data.
- Always cite the source archive and the license for any recording you use.
- In this regeneration the endpoint is a Cloudflare Pages Function (functions/api/search.js) calling the public iNaturalist and GBIF APIs — no key needed. The Watkins lookup data is a gap: the live Watkins dataset is not available from outside, so the Function returns watkins: null (see README-DEPLOY.md).
