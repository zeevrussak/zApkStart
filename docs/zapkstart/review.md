# EGM review ledger — zApkStart fork

* **Author:** Ze'ev Russak (@zeevrussak)
* **Date:** 2026-11-23
* **Covers:** the goldfish reviews behind `concepts_brief.md` → `design.md`, and
  resolutions taken during implementation. This file is the durable record of what
  was challenged, what was accepted, and what remains gated.

## Review process

### Phase 1 — brainstorm (six goldfish lenses, all completed)

Dispatched as fresh-context subagents over the upstream clone; each returned
severity-tagged, file:line-grounded findings. Highlights by lens:

| Lens | Load-bearing findings (all verified against code) |
| --- | --- |
| comprehension | "fully EN/HE" spans ~71 files, not the four the concept named; the x64-under-emulation story cannot use WHPX on ARM64; MSIX/Store channel unaddressed; identity collisions and data-migration question raised. |
| structural | Attribution = untouched LICENSE + single NOTICE.md; `ui.locale` as a NEW top-level settings group (guest locale is `engine.locale` — collision hazard); manual anchor decoupling via topic-ids; no mirrored RTL stylesheets; docs/zapkstart/ namespace. |
| zoom-out | Cut qemu-aarch64 experimental path from shipped code; cut "slow-but-works" default; "usable RTL" acceptance bar; hard-fork declaration; freeze-vs-rename data paths (overruled — see below); guest zh-CN forcing + DNS defaults flagged. |
| design-critic | Gitee dual-source updater will pull upstream builds (P0); asset prefix lives at three code sites (P0); `process.arch` cannot detect WoA (P1); recovery ladder is wrong on ARM64 (P0); qemu-aarch64 path needs ranchu-in-mainline gate (P0); `-dns-server 223.5.5.5` China default (P1). |
| codebase-details | Full identity inventory (~30 code sites incl. About QRs, `dist.lnk`, leftover regexes, test tripwires); per-module Han-string counts; complete x86_64 assumption map with seams (`hw.cpu.arch` mapping, generic sysimg discovery, system-QEMU seam). |
| implementation-readiness | Renderer regex-matches translated core text → error-code contract is the gating decision; the `/windows_x64/` emulator filter must STAY on ARM64; strip rules are backend-scoped already; release shape (fork must publish runtime bundle; arm64 artifacts runtime-less); dual locale-list trap (`electronLanguages` vs `KEEP_LOCALES`); test tripwire list. |

### Phase 2 — design review (dispatched, lost to session restart)

Two fresh-context reviewers (implementation-readiness executability + codebase
inventory fit) were dispatched against `design.md`; the session restarted before
they returned and the tasks are unrecoverable. **Decision:** not re-spent. The
design's inventory is a distillation of the six completed brainstorm lenses —
including both of the lost reviews' own lenses — and implementation phase adds a
stronger gate: the four new test suites (`identity-gate`, `i18n`, `rtl-css`,
`arch`) mechanically enforce the design's acceptance criteria, and the final
verification pass runs them. Residual risk is accepted and noted here for honesty.

## Resolutions taken (design vs. reviewer positions)

1. **ARM64 posture** — zoom-out/design-critic recommended shipping x64-only with
   ARM64 declared unsupported. Overruled by the maintainer requirement (explicit
   ARM64 support): the fork ships native arm64 shell builds + arch-aware runtime
   with a tiered honesty matrix, and adopts the reviewers' engine-layer truth:
   the ARM64 engine is gated behind an explicit opt-in with the retry ladder
   disabled and corrected remediation copy. The qemu-aarch64 native path stays
   out-of-tree (`arm64-research.md`, three go/no-go gates) — nobody wanted it in
   the UI.
2. **Data paths** — zoom-out said freeze upstream path names to avoid migration;
   design-critic/codebase-details flagged co-install contamination. Resolved:
   clean-break rename (`zapkstart` / `zApkStartShared` / `zapkstart.avd`), no
   migration, incompatibility documented in NOTICE/README. Rationale: the fork has
   zero existing users; freezing paths buys nothing and shares state with upstream.
3. **zh-CN locale** — kept as an extraction byproduct, outside the QA matrix
   (zoom-out's position adopted, per the brief).
4. **RTL** — "usable RTL" bar adopted: `dir` plumbing + targeted logical-property
   conversion with an allowlist-enforcing test; the caption-button reservation
   (`style.css` padding-right) stays physical deliberately.
5. **Error-code contract** — implementation-readiness's blocker adopted wholesale:
   core errors become `{code, params, raw}` (+ `message` for existing readers) via
   `src/core/error-codes.js`; the renderer stops regex-matching prose.
6. **Guest locale & DNS** — comprehension/zoom-out blind spots adopted: guest
   Android follows the UI language (`follow` default; `he→he-IL`), Pinyin IME only
   for zh guests, Ali/Tencent DNS default flipped to off.

## Implementation-phase findings & resolutions (running log)

| # | Finding | Resolution |
| --- | --- | --- |
| 1 | msix.js identity guard still keyed on upstream's Partner Center GUID substring (`58CA1DED`) and the GUID constant survived the first sweep | Neutralized: `CONFIRMED_PUBLISHER='CN=zApkStart'`, guard now fails on the fork placeholder unless `--allow-placeholder`; real Store identity only via env. |
| 2 | `engine-test.js` asserted the deleted Douyin QR asset + About link | Tripwire rewritten: assets must be ABSENT, upstream attribution link must be present. |
| 3 | `sources.js` edit briefly duplicated `mirrorList()` over `getJson`'s doc comment (elephant error, caught immediately) | Reverted; `node --check` gate after every batch. |
| 4 | `priority.ps1`/`agent.ps1` defaults + `assoc.js` PowerShell namespace carried upstream names | Rebranded. |
| 5 | Window-title fallbacks (`agent.js`, `appwin.js` ×3), AVD display name, `qemu -name`, engine `-name` carried 'ApkStart' | Routed through `brand.PRODUCT`. |
| 6 | `scripts/check-pe-arch.js` read the MZ signature big-endian (`0x5a4d`) — every valid PE would have been rejected at the CI gate (caught by the ARM64 agent's smoke test) | Fixed to byte comparison `4d 5a`; verified against node.exe (x64 pass) + package.json (reject). |
| 7 | Fork version `0.6.4zk.1` broke `msixVersion`'s numeric extraction → 0.6.1.0 | Version policy moved to semver prerelease `0.6.4-zk.1` (strips cleanly to 0.6.4.0); pack.js file-version now routes through `msixVersion`. |
| 8 | Renderer agent crashed mid-pass when the host runtime died | On restart its work was found ~95% complete (catalogs 825 ui + 146 main keys ×3 locales, rename, RTL all landed); coordinator finished the tail: zh manual product-name sweep (also `ApkStartShared` → `zApkStartShared`, topics.json zh values), `index.html` brand span, two source-grep assertions re-pointed at the zh-CN catalogs, three renderer scratch codemod scripts removed, `tools/` checker rebrand, Hebrew no-impersonation phrase allowlisted. |
| 9 | manual.js TOPICS anchors were pre-sweep Chinese slugs; manual-test anchor assertion failed after rebuild | Completed the deferred §Phase 5 rewiring: `topic()` anchors are now the topics.json ids the builder emits (`overview`, `troubleshoot-accel`, …); mic-cross-wire test updated to topic-id (section numbers deliberately out of ids). |
| 10 | Second-batch brief undercounted leaks (7 lines stated, 348 real) | Agent extracted all; final leak scan = zero across the whole repo. |
| 11 | electron-builder rejects per-target `artifactName` and a root `zip` section | `nsis.artifactName` carries `${arch}`; zip artifact name set per-invocation via `-c.artifactName` in the CI arm64 job. |
| 12 | Upstream China defaults found beyond DNS: captive-portal endpoints (adb.js + emulator.js) and the wifi probe hardcoded to miui | All three now profile-aware: gstatic default, miui only under `fastDns` (China-network opt-in). |

## Final verification (2026-11-24)

- `npm test`: **441 passed, 0 failed** across all 20 suites (17 upstream-derived with rewritten tripwires + identity-gate, i18n, rtl-css, arch).
- All four new gates green: identity (repo-wide upstream-identity scan), i18n (key/placeholder parity en·he·zh-CN + repo-wide Han leak scan = zero), rtl-css (physical-property allowlist), arch (runtimePlan contract).
- **arm64 cross-build on the x64 dev box**: `electron-builder --win --dir --arm64` → `dist/release/win-arm64-unpacked/zApkStart.exe`, PE gate `Machine=arm64` ✅, packaged payload verified (`zapkstart 0.6.4-zk.1`, he locale pak present, runtime-less layout with placeholder note).
- Remaining unverifiable here (documented in README capability matrix): real ARM64 hardware engine boot/performance, WHPX-on-ARM64, he-RTL system chrome on ARM64 hardware, NSIS arm64 installer UI (CI builds it; manual smoke on an ARM64 machine wanted), guest he-IL cold-boot switch (one-time snapshot invalidation path exercised by unit tests only).

## Open items (gated, not open questions)

* Real ARM64 hardware engine boot/performance — unverifiable on the x64 dev box;
  documented in README capability matrix. See `arm64-research.md` for the native
  engine path's go/no-go gates.
* Hebrew copy review by a native speaker before wide distribution.
* Upstream cherry-picks remain possible (`upstream` remote) but line-level merges
  are not (hard fork, declared).
