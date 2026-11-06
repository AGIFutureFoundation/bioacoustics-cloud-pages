# Identify a species from an animal sound (identify-species)

Use this skill to identify an animal sound with WAVE.

## How it works on the site

1. Open https://www.bioacoustics.cloud/translate/ — the Animal Sound Translator.
2. Upload a clip, record from the microphone, or paste a public audio URL.
3. Optionally add a species hint (e.g. humpback whale, gray wolf).
4. The Translator returns ranked species predictions with confidence bars, an acoustic profile, and cross-references to validated research data.

## What powers it (verified 2026-11-06)

- Live predictor: BirdNET (Cornell Lab of Ornithology + Chemnitz University), birds-first, 6,500+ species.
- The broader GPU model (Perch 2.0 / NatureLM) for marine mammals and other taxa is NOT connected.
- Marine mammals: WAVE cross-references the Watkins Marine Mammal Sound Database (WHOI); BirdNET alone is not trained on whale song.
- Search API: GET /api/search?q=<term> returns {q, sounds, species, watkins, marineHint} — sounds from iNaturalist, species facts from GBIF.

## Honest limits

- Predictions are ranked with confidence scores — treat them as evidence, not verdicts.
- WAVE identifies *which species* is calling; it does not produce sentence-level translation of meaning.
- The Translator's upload/classify/analyze calls need the server-side model backend; on the static Cloudflare regeneration they work only if that backend is re-connected (see README-DEPLOY.md). The search API works via the included Pages Function.
