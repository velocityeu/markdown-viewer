# Building Markdown Viewer

Developer guide for producing the portable EXE and MSI installer locally.

## Prerequisites (Windows)

| Dependency | Purpose |
| --- | --- |
| [Node.js](https://nodejs.org/) LTS + npm | Frontend install, Vite, Tauri CLI |
| [Rust](https://www.rust-lang.org/tools/install) via `rustup` (stable) | Compile `src-tauri` |
| Visual Studio 2022 **Build Tools** with MSVC C++ | Provides `link.exe` |
| [WebView2 Evergreen Runtime](https://developer.microsoft.com/microsoft-edge/webview2/) | Required to **run** the app (not required only to produce the MSI) |

Ensure Cargo is on your PATH:

```powershell
$env:Path = "$env:USERPROFILE\.cargo\bin;" + $env:Path
rustc --version
cargo --version
```

## Install dependencies

```powershell
cd path\to\markdown-viewer
npm ci
# or: npm install
```

## Development

```powershell
npm run tauri dev
# with sample file:
npm run tauri dev -- examples/sample.md
```

Frontend only (typecheck + Vite):

```powershell
npm run build
```

## Release packaging

### Recommended: MSI (also emits portable EXE)

```powershell
# Close a running app first to avoid file locks
taskkill /IM markdown-viewer.exe /F 2>$null

npm run build:installer
```

This runs `tauri build --bundles msi` once and produces:

| Artifact | Path |
| --- | --- |
| Portable EXE | `src-tauri/target/release/markdown-viewer.exe` |
| MSI | `src-tauri/target/release/bundle/msi/Markdown Viewer_0.1.0_x64_en-US.msi` |

**Do not** run `build:portable` and then `build:installer` for a full release set - that compiles twice. One MSI build already includes the release EXE.

### Portable only (no installer)

```powershell
npm run build:portable
```

### Optional NSIS

```powershell
npm run build:installer:nsis
```

NSIS extraction can fail on locked-down machines (`Access is denied`). Prefer MSI for distribution.

## Convenience local copy

After a successful installer build you may copy artifacts somewhere easy to open:

```powershell
New-Item -ItemType Directory -Force -Path dist-installer | Out-Null
Copy-Item src-tauri\target\release\markdown-viewer.exe dist-installer\
Copy-Item "src-tauri\target\release\bundle\msi\Markdown Viewer_0.1.0_x64_en-US.msi" dist-installer\
```

`dist-installer/` is for local convenience and should not be committed (see `.gitignore`).

## Version bump

Keep these three files in sync:

1. `package.json` -> `"version"`
2. `src-tauri/Cargo.toml` -> `version`
3. `src-tauri/tauri.conf.json` -> `"version"`

Then tag `vX.Y.Z` when publishing (see [release.md](release.md)).

## Checksums

```powershell
Get-FileHash src-tauri\target\release\markdown-viewer.exe -Algorithm SHA256
Get-FileHash "src-tauri\target\release\bundle\msi\Markdown Viewer_0.1.0_x64_en-US.msi" -Algorithm SHA256
```

When uploading to GitHub Releases, name checksum entries after the **published** asset filenames (GitHub may change spaces to dots, e.g. `Markdown.Viewer_0.1.0_x64_en-US.msi`).
