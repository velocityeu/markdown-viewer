# Markdown Viewer

[![GitHub](https://img.shields.io/badge/GitHub-velocityeu%2Fmarkdown--viewer-blue)](https://github.com/velocityeu/markdown-viewer)
[![Release](https://img.shields.io/github/v/release/velocityeu/markdown-viewer)](https://github.com/velocityeu/markdown-viewer/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A clean, lightweight, native-feeling Windows application for viewing Markdown files with rich content support, including embedded images.

Built with **Tauri 2**, **React**, **TypeScript**, `react-markdown`, `remark-gfm`, and `rehype-raw`.

## Download (Windows x64)

| Installer | Description | Link |
| --- | --- | --- |
| **MSI installer** (recommended) | Installs to Program Files, Start Menu / Desktop shortcuts, `.md` file association | [Markdown.Viewer_0.1.0_x64_en-US.msi](https://github.com/velocityeu/markdown-viewer/releases/download/v0.1.0/Markdown.Viewer_0.1.0_x64_en-US.msi) |
| **Portable EXE** | No installer - download and run | [markdown-viewer.exe](https://github.com/velocityeu/markdown-viewer/releases/download/v0.1.0/markdown-viewer.exe) |
| **Checksums** | SHA-256 for both assets | [SHA256SUMS.txt](https://github.com/velocityeu/markdown-viewer/releases/download/v0.1.0/SHA256SUMS.txt) |

- **Latest release page:** [github.com/velocityeu/markdown-viewer/releases/latest](https://github.com/velocityeu/markdown-viewer/releases/latest)
- **All releases:** [releases](https://github.com/velocityeu/markdown-viewer/releases)

> **Note:** GitHub Releases renames the MSI space to a dot in the asset name (`Markdown.Viewer_...msi`). The local Tauri build output still uses a space in the filename under `src-tauri/target/...`.

### Quick install (MSI)

1. Download the MSI and open it.
2. Default install path: `C:\Program Files\Markdown Viewer\`
3. Launch from Start Menu or the Desktop shortcut.
4. Optional: right-click a `.md` file -> **Open with** -> **Markdown Viewer** (or use **Set as default** in app Settings).

### Portable

1. Download `markdown-viewer.exe`.
2. Run it, or open a file from the command line:

```text
markdown-viewer.exe path\to\file.md
```

### Prerequisites (runtime)

- Windows 10/11 **x64**
- [Microsoft Edge WebView2 Evergreen Runtime](https://developer.microsoft.com/microsoft-edge/webview2/) (usually preinstalled)
- Builds are **unsigned** - Windows SmartScreen may warn on first run; verify downloads with `SHA256SUMS.txt` if needed

See [docs/install.md](docs/install.md) for a fuller install and verification guide.

## Features

- Open `.md` files by double-clicking in Explorer (after MSI install / association)
- Right-click -> **Open with** -> Markdown Viewer
- Optional default-app setup via **Set as default**
- Embedded local images resolved relative to the opened file
- Dark / light / system themes
- Zoom with `Ctrl + mouse wheel`, `Ctrl + Plus`, `Ctrl + Minus`, and `Ctrl + 0`
- Open folder with Explorer-style tree sidebar for quick file switching
- Drag and drop `.md` files into the window
- Command-line opening: `markdown-viewer.exe myfile.md`
- Recent files menu
- In-document search (`Ctrl+F`)
- Print support
- **MSI installer** with `.md` file association (recommended)
- Portable executable build target
- Optional NSIS installer script (secondary; MSI is the default)

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Rust](https://www.rust-lang.org/tools/install) (`rustup`, stable)
- Visual Studio C++ Build Tools / MSVC (`link.exe`)
- WebView2 runtime (for running the app)

### Install

```bash
npm install
```

### Run in dev mode

```bash
npm run tauri dev
```

### Test with the sample file

```bash
npm run tauri dev -- examples/sample.md
```

## Build

### MSI installer (recommended - also produces the portable EXE)

```bash
npm run build:installer
```

Outputs:

```text
src-tauri/target/release/markdown-viewer.exe
src-tauri/target/release/bundle/msi/Markdown Viewer_0.1.0_x64_en-US.msi
```

One `tauri build --bundles msi` produces **both** the EXE and the MSI.

### Portable executable only (no installer)

```bash
npm run build:portable
```

Output:

```text
src-tauri/target/release/markdown-viewer.exe
```

### NSIS installer (optional)

```bash
npm run build:installer:nsis
```

If NSIS extraction fails with `Access is denied`, use the MSI installer above or run the NSIS build from an elevated terminal with antivirus exclusions for `%LOCALAPPDATA%\tauri`.

More detail: [docs/build.md](docs/build.md) · [docs/release.md](docs/release.md)

## Windows integration

The **MSI installer** registers a `.md` file association for Markdown Viewer. After installation:

1. Right-click any `.md` file
2. Choose **Open with** -> **Markdown Viewer**
3. Optionally choose **Always**

You can also use the in-app **Set as default** button to open Windows default app settings.

Portable builds do not register associations automatically; use **Open with** or pass a path on the command line.

## Publishing a GitHub release

See [docs/release.md](docs/release.md). Short checklist:

1. Bump version in `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`
2. Build: `npm run build:installer` (EXE + MSI from one compile)
3. Create a GitHub release (tag `vX.Y.Z`) and upload:
   - `markdown-viewer.exe`
   - MSI (GitHub may store it as `Markdown.Viewer_X.Y.Z_x64_en-US.msi`)
   - `SHA256SUMS.txt` (recommended; use the **published** asset filename)
4. Update download links in this README if the version changed

## Project structure

```text
src/                 React frontend
src-tauri/           Rust backend and Tauri config
examples/            Sample markdown and assets
docs/                Install, build, and release docs
screenshots/         Release screenshots
dist-installer/      Local convenience copies of built installers (not committed)
```

## Docs

| Doc | Description |
| --- | --- |
| [docs/install.md](docs/install.md) | End-user install, portable use, verification |
| [docs/build.md](docs/build.md) | Developer build prerequisites and commands |
| [docs/release.md](docs/release.md) | How to cut a GitHub release with installers |
| [docs/resume-prompt.md](docs/resume-prompt.md) | Session resume notes for maintainers |

## License

MIT
