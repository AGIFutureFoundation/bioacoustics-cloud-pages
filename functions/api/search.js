// Cloudflare Pages Function: GET /api/search?q=<term>
//
// Re-implements the live Vercel /api/search contract (verified 2026-11-06):
//   { q, sounds, species, watkins, marineHint }
// - sounds: iNaturalist observations with audio (public API, no key).
// - species: GBIF species search (public API, no key).
// - watkins: null — GAP: the live Watkins Marine Mammal Sound Database
//   lookup data is a static dataset inside the Vercel app and is not
//   available from outside, so it cannot be replicated here. When the
//   Watkins dataset is recovered, wire it in and return the match.
// - marineHint: true when the query looks marine (small keyword list).
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const q = (url.searchParams.get("q") || "").trim();
  if (q.length < 2) {
    return Response.json({ error: "Query is required (at least 2 characters)." }, { status: 400 });
  }

  const marineWords = ["whale", "dolphin", "orca", "beluga", "narwhal", "porpoise", "seal", "sea lion", "manatee", "dugong", "shark", "octopus", "squid", "penguin", "marine", "ocean", "hydrophone", "sperm", "humpback", "blue whale", "gray whale", "right whale", "fin whale", "minke"];
  const marineHint = marineWords.some((w) => q.toLowerCase().includes(w));

  // iNaturalist: observations with sounds matching the query.
  let sounds = [];
  try {
    const res = await fetch(
      `https://api.inaturalist.org/v1/observations?q=${encodeURIComponent(q)}&sounds=true&per_page=8&order_by=created_at&order=desc`,
      { headers: { accept: "application/json" } }
    );
    if (res.ok) {
      const data = await res.json();
      for (const obs of data.results || []) {
        const snds = obs.sounds || [];
        if (!snds.length) continue;
        const s = snds[0];
        const fileUrl = s.file_url || (s.sound_files && s.sound_files[0] && s.sound_files[0].file_url) || null;
        if (!fileUrl) continue;
        sounds.push({
          source: "iNaturalist",
          species: obs.species_guess || (obs.taxon && obs.taxon.name) || null,
          place: obs.place_guess || null,
          soundUrl: fileUrl,
          pageUrl: obs.uri || `https://www.inaturalist.org/observations/${obs.id}`,
          license: obs.license_code || null,
        });
      }
    }
  } catch (e) {
    // Leave sounds empty on upstream failure; still return species below.
  }

  // GBIF: species search.
  let species = [];
  try {
    const res = await fetch(
      `https://api.gbif.org/v1/species/search?q=${encodeURIComponent(q)}&limit=6`,
      { headers: { accept: "application/json" } }
    );
    if (res.ok) {
      const data = await res.json();
      species = (data.results || []).map((sp) => ({
        source: "GBIF",
        scientificName: sp.scientificName || null,
        commonName: sp.vernacularName || null,
        rank: sp.rank || null,
        kingdom: sp.kingdom || null,
        pageUrl: sp.key ? `https://www.gbif.org/species/${sp.key}` : null,
      }));
    }
  } catch (e) {
    // Leave species empty on upstream failure.
  }

  return Response.json({ q, sounds, species, watkins: null, marineHint });
}
