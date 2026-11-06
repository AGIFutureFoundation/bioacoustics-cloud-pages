# Build an acoustic similarity map (acoustic-fingerprint)

Use this skill to compare animal sounds by acoustic similarity with WAVE's Sound Map.

## How it works on the site

1. Open https://www.bioacoustics.cloud/soundmap/.
2. Add clips from different animals (upload, record, or load the demo set).
3. Build the map: WAVE computes an acoustic fingerprint for each clip and arranges them so distance means similarity — clips that share spectral structure sit close together.
4. Hover any point to see its spectrogram.

## Honest limits

- This maps acoustic *structure*, not fabricated meaning. Feature-based similarity groups sounds by timbre and rhythm.
- The deeper fingerprint from a foundation model (Perch / NatureLM) is NOT switched on yet; the interface stays identical when it is.
- The Sound Map's /api/soundmap job endpoint needs the server-side backend; on the static Cloudflare regeneration it works only if that backend is re-connected (see README-DEPLOY.md).
