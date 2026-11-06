// WebMCP tools for the WAVE bioacoustics.cloud site — guarded, best-effort.
//
// This site is a content site with one public search API (/api/search) and
// no sign-in, no MCP server, and no interactive tools beyond the
// Translator and Sound Map apps. These two tools are the only ones
// registered, and only if the browser exposes the draft WebMCP API
// (document.modelContext). If the API is absent, this script does
// nothing.
//
// Tools:
//   contact_wave — opens the real mailto: link to WAVE's steward.
//     NOTE: wave@bioacoustics.cloud has no MX record and no email plan
//     as of 2026-11-06, so delivery is unverified.
//   get_wave_guide — fetches /llms.txt and returns its text.
(function () {
  if (
    typeof document === "undefined" ||
    !("modelContext" in document) ||
    !document.modelContext ||
    typeof document.modelContext.registerTool !== "function"
  ) {
    return;
  }

  document.modelContext.registerTool({
    name: "contact_wave",
    description:
      "Open an email to WAVE (wave@bioacoustics.cloud). Use for agent registration and inquiries; subject lines start with [Agent] and must name the operator and the human principal. Note: as of 2026-11-06 this address has no MX record and no email plan, so delivery is unverified.",
    execute: function () {
      window.location.href =
        "mailto:wave@bioacoustics.cloud?subject=%5BAgent%5D%20";
      return "Opening an email to wave@bioacoustics.cloud (delivery unverified — no MX record as of 2026-11-06).";
    },
  });

  document.modelContext.registerTool({
    name: "get_wave_guide",
    description:
      "Fetch the site's agent guide (/llms.txt) and return its text. It describes WAVE, the Translator and Sound Map, the honest limits, and what agents may and may not do.",
    execute: async function () {
      var response = await fetch("/llms.txt");
      if (!response.ok) {
        throw new Error("Could not fetch /llms.txt: " + response.status);
      }
      return await response.text();
    },
  });
})();
