# Markdown Viewer — resume prompt (2026-07-01)

**Repo:** https://github.com/velocityeu/markdown-viewer  
**Branch:** `master` (up to date with `origin/master`)  
**Status:** v0.1.0 feature-complete for initial release; portable + MSI built successfully.

---

## First: bring the project back up

```powershell
cd C:\apps\grok\markdown-viewer

# Ensure Rust is on PATH (if needed)
$env:Path = "$env:USERPROFILE\.cargo\bin;" + $env:Path

# Dev mode
npm run tauri dev

# Or open sample file in dev
npm run tauri dev -- examples/sample.md
```

**Prerequisites on a fresh machine:** Node.js, Rust (`rustup`), Visual Studio C++ Build Tools (for `link.exe`), WebView2 runtime.

---

## Where the project stands

### Shipped this session

| Commit | Summary |
|--------|---------|
| `292479f` | Initial Tauri 2 + React Markdown Viewer, Windows file assoc, README |
| `ad709f2` | GitHub badge |
| `011247e` | Default installer switched to MSI (NSIS extraction blocked on this machine) |
| `99eddee` | Folder browser with Explorer-style file tree |
| `dcfcfa4` | Obsidian-style UI redesign, prominent Open folder |
| `3a6fbcc` | Collapsible Explorer panel (slides left) |
| `6199851` | Dark / Light / System themes; Windows blue accent (purple removed) |

### Current features

- Open `.md` files (double-click, CLI, drag-drop, Open file dialog)
- **Open folder** with lazy-loaded file tree in left Explorer panel
- Collapsible side panel (<< button or Files icon toggle)
- Recent files, in-document search (Ctrl+F), print, zoom
- Dark / Light / System themes (Settings → Appearance)
- Windows `.md` file association via MSI install
- Portable exe + MSI installer builds

### Built artifacts (last rebuild: 2026-07-01 ~13:42)

| Artifact | Path |
|----------|------|
| Portable | `src-tauri\target\release\markdown-viewer.exe` (~10 MB) |
| MSI installer | `src-tauri\target\release\bundle\msi\Markdown Viewer_0.1.0_x64_en-US.msi` (~3.5 MB) |

### Known issues / environment notes

- **NSIS installer** fails on this machine (`Access is denied` during NSIS zip extraction). Use MSI instead (`npm run build:installer`).
- Close `markdown-viewer.exe` before rebuilding or you get file-lock errors.
- `cargo` must be on PATH: `%USERPROFILE%\.cargo\bin`

---

## What's next on resume

1. **GitHub Release v0.1.0** — upload `markdown-viewer.exe` + MSI; add screenshots to `screenshots/`
2. **Screenshots** — capture Explorer panel, themes, sample.md rendering for README/release
3. **Optional:** GitHub Actions CI workflow for automated builds
4. **Optional:** Auto-updater (deferred by user choice)
5. **Optional:** Retry NSIS build on a machine without extraction restrictions (`npm run build:installer:nsis`)

---

## Build commands

```powershell
# Portable exe only
npm run build:portable

# MSI installer (recommended)
taskkill /IM markdown-viewer.exe /F 2>$null
npm run build:installer

# NSIS (optional, may fail on locked-down machines)
npm run build:installer:nsis
```

---

## Smoke tests on resume

```powershell
npm run build
npm run tauri dev -- examples/sample.md
# Verify: Explorer panel, Open folder, theme toggle in Settings, collapse panel
```

---

## Don't

- Don't use purple accent colors — user explicitly rejected; use Windows blue `#0078d4`
- Don't rebuild installer while `markdown-viewer.exe` is running
- Don't rely on NSIS on this dev machine — MSI works
- Spec file lives at `markdown-viewer-full-spec.md` for reference

---

## Project structure

```
src/                 React frontend (App, Explorer, FileTree, themes)
src-tauri/           Rust backend (read_markdown_file, list_directory, CLI)
examples/            sample.md + assets for testing
screenshots/         (empty — needs release screenshots)
docs/resume-prompt.md  ← this file
```