# Security Policy

## Supported versions

Only the latest commit on `main` (and the live site built from it) receives fixes.

## Reporting a vulnerability

Please do not open a public issue for security problems.

Report privately through GitHub:
[Security → Report a vulnerability](https://github.com/batuhanmeral/pokedex/security/advisories/new).

Include the affected URL or commit, the steps to reproduce, and what you expected to
happen. Remove real credentials and personal data from the report.

You can expect an acknowledgement within 7 days. Confirmed issues are fixed on `main`
and credited in the advisory unless you prefer otherwise.

## Scope

The app is statically generated from public PokeAPI data: it has no backend, accounts or
stored user data.

In scope: XSS (for example through search input or the team query string in shared
links), weaknesses in the HTTP security headers or Content Security Policy, secrets in the
repository or build artefacts, and vulnerable dependencies that affect the live site.

Out of scope: denial of service by traffic volume, findings that require a modified
deployment, issues in PokeAPI or other third-party domains, and missing headers on
third-party domains.
