# Markdown Viewer - resume prompt (2026-07-22)

**Repo:** https://github.com/velocityeu/markdown-viewer  
**Branch:** `master`  
**Status:** v0.1.0 **published** on GitHub Releases (MSI + portable EXE + checksums).

---

## First: bring the project back up

```powershell
cd C:\grok\markdown-viewer

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

### Published installers (v0.1.0)

| Asset | URL |
| --- | --- |
| Release page | https://github.com/velocityeu/markdown-viewer/releases/tag/v0.1.0 |
| MSI | https://github.com/velocityeu/markdown-viewer/releases/download/v0.1.0/Markdown.Viewer_0.1.0_x64_en-US.msi |
| Portable EXE | https://github.com/velocityeu/markdown-viewer/releases/download/v0.1.0/markdown-viewer.exe |
| Checksums | https://github.com/velocityeu/markdown-viewer/releases/download/v0.1.0/SHA256SUMS.txt |

Local build outputs (if rebuilt):

| Artifact | Path |
| --- | --- |
| Portable | `src-tauri\target\release\markdown-viewer.exe` (~10 MB) |
| MSI | `src-tauri\target\release\bundle\msi\Markdown Viewer_0.1.0_x64_en-US.msi` (~3.3 MB) |
| Easy copy | `dist-installer\` (optional, gitignored) |

### Docs

- [install.md](install.md) - end-user download and install
- [build.md](build.md) - local builds
- [release.md](release.md) - cut a new GitHub release

### Current features

- Open `.md` files (double-click after MSI, CLI, drag-drop, Open file dialog)
- **Open folder** with lazy-loaded file tree in left Explorer panel
- Collapsible side panel
- Recent files, in-document search (Ctrl+F), print, zoom
- Dark / Light / System themes (Settings -> Appearance)
- Windows `.md` file association via **MSI** install
- Portable exe + MSI installer builds

### Known issues / environment notes

- **NSIS installer** may fail (`Access is denied` during NSIS zip extraction). Use MSI (`npm run build:installer`).
- Close `markdown-viewer.exe` before rebuilding or you get file-lock errors.
- `cargo` must be on PATH: `%USERPROFILE%\.cargo\bin`
- Builds are **unsigned** (SmartScreen warnings possible)
- GitHub Releases stores MSI as `Markdown.Viewer_...` (dot instead of space)

---

## What's next on resume

1. Screenshots for README/release gallery (`screenshots/`)
2. Optional: GitHub Actions CI for automated builds
3. Optional: code signing when a certificate is available
4. Optional: auto-updater (deferred)
5. Optional: retry NSIS on a machine without extraction restrictions

---

## Build commands

```powershell
# MSI installer (recommended) - also produces portable EXE
taskkill /IM markdown-viewer.exe /F 2>$null
npm run build:installer

# Portable only
npm run build:portable

# NSIS (optional)
npm run build:installer:nsis
```

---

## Smoke tests on resume

```powershell
npm run build
npm run tauri dev -- examples/sample.md
# Verify: Explorer panel, Open folder, theme toggle in Settings, collapse panel
```
