# SITEMAP

Add-only registry of documentation. Fork-managed entries are maintained in this repository;
inherited entries came from upstream ApkStart (RoutineMiku) and are **unmanaged** here — they may
be stale, reference upstream identity, and are kept only as historical reference. Upstream docs are
never edited by this fork (add-only policy minimizes merge noise if cherry-picking resumes).

## Fork-managed

| Document | Date | Description |
| --- | --- | --- |
| [README.md](README.md) | 2026-11-23 | Fork readme (English; Hebrew parallel: [README.he.md](README.he.md)) |
| [NOTICE.md](NOTICE.md) | 2026-11-23 | Attribution, upstream citation, fork/upstream separation |
| [docs/zapkstart/concepts_brief.md](docs/zapkstart/concepts_brief.md) | 2026-11-23 | EGM six-lens goldfish brainstorm synthesis |
| [docs/zapkstart/design.md](docs/zapkstart/design.md) | 2026-11-23 | Fork design: identity, EN/HE + RTL, ARM64 |
| [docs/zapkstart/review.md](docs/zapkstart/review.md) | 2026-11-23 | Goldfish review findings on the design + resolutions |
| [docs/zapkstart/arm64-research.md](docs/zapkstart/arm64-research.md) | 2026-11-23 | Native ARM64 engine research: gates, spike plan, sources |
| [docs/manual/topics.json](docs/manual/topics.json) | — | Canonical manual topic anchors (per-locale headings) |
| [docs/manual/en.md](docs/manual/en.md) | — | User manual, English |
| [docs/manual/he.md](docs/manual/he.md) | — | User manual, Hebrew (RTL) |

## Inherited from upstream (unmanaged)

Upstream's Chinese-language documentation (architecture notes, code walkthroughs, store-listing
material, the original 用户手册 HTML) was **removed from this public tree** — visitors get English or
Hebrew only. It remains browsable in the upstream repository:
[github.com/RoutineMiku/apkstart/tree/main/docs](https://github.com/RoutineMiku/apkstart/tree/main/docs).

`docs/build-manual-html.py` is upstream in origin but maintained by the fork (multi-locale manual
build, see design §Phase 5). `engine/README.md` and `tools/platform-tools/README.md` remain as
inherited operational notes. The zh user-manual source lives at `docs/manual/zh.md` (product content
for the bundled zh-CN locale).
