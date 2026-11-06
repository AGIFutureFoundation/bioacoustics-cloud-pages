# auth.md — Agent registration — WAVE (bioacoustics.cloud)

How an AI agent registers to interact with WAVE, the Wild Animal Voice Engine.

This is a human-gated, email-based process. There is no self-service
portal, no API key, and no automatic admission.

## Status — read this first

**Mail warning: wave@bioacoustics.cloud is the steward address published
on this site, but as of 2026-11-06 it has NO MX record and NO email plan,
so delivery is unverified.** Registration emails sent to it may not arrive
until mail is fixed. If you get no reply, that is the likely reason — do
not assume you are registered.

WAVE is an AI bioacoustics platform (Animal Sound Translator, Sound Map,
25-article blog, public-archive resources). The live species predictor is
BirdNET (birds-first); the Perch / NatureLM GPU model is NOT connected.
The site's roadmap item "open-source community — MIT-licensed engine on
GitHub" is a next step, not a live fact: the public repo
(WAVETranslator/Wild-Animal-Voice-Engine) is a 1 KB stub. Nothing on this
site is an offering of securities.

## How to register

1. Email **wave@bioacoustics.cloud** with a subject line starting
   **`[Agent]`**.
2. In the email, name:
   - the agent (name, model, and instance/operator), and
   - the **human principal** the agent acts for (name and contact).
   An agent that does not name a human principal is not registered.
3. State what you want to do (for example: summarize site content for a
   human, cite pages, route an inquiry to a steward, use the search API).
4. A human steward replies. Registration is complete only when a human
   steward confirms it in writing. There is no automatic admission and
   no confirmation page.

## What registered agents may do

- Summarize and cite content published on this site, with sources.
- Use the public search API (`/api/search?q=<term>`) to find reference
  recordings and species facts, citing the source archive.
- Route inquiries to a human steward (via the contact above).
- Draft material for a human to review, correct, and decide on.

## What agents may NOT do

- Sign any legal document, contract, or filing.
- Move funds, open or operate bank accounts, or spend money.
- Hire or fire anyone.
- Offer securities, solicit investment, or represent WAVE (or any
  related entity) to regulators, banks, or the public as a decision-maker.
- Present an agent draft or proposal as a human decision.
- Claim the GPU model, the open-source engine, or wave@ delivery as live.

Agents prepare; humans decide, sign, and move funds.

## Authentication — what does NOT exist

- **No token is issued.** Registration confers no credential, API key,
  or session.
- **No OAuth or OIDC exists for this site.** There is no
  authorization server and no OpenID Connect provider. There is no
  `/.well-known/openid-configuration` and no
  `/.well-known/oauth-authorization-server` for this domain, and no
  `register_uri` exists. Do not look for one.
- **No MCP server and no protected resource exist for this site**, so
  there is no `/.well-known/oauth-protected-resource` and no MCP server
  card.
- **No submission form or intake portal exists on this website.**
  Proposals are not submitted through the site; contact a steward
  by email as above. (The contact and waitlist forms on the site post
  to /api/contact and /api/waitlist; their backend destination is
  unverified — see README-DEPLOY.md.)

## Discovery files for agents

- `/llms.txt` — site guide for language models.
- `/agent.json` — machine-readable agent protocol.
- `/.well-known/api-catalog` — resource/discovery linkset (the site's
  only API is /api/search, a Cloudflare Pages Function).
- `/.well-known/agent-skills/index.json` — agent skill index.
- `/.well-known/ai-catalog.json` — agent resource discovery manifest.
- `/sitemap.xml` — all pages on this site.

## Contact

Questions: wave@bioacoustics.cloud (subject starting `[Agent]`; see the
mail warning above). Nothing here is legal, tax, or financial advice.
