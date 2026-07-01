# Markdown Viewer

[![GitHub](https://img.shields.io/badge/GitHub-velocityeu%2Fmarkdown--viewer-blue)](https://github.com/velocityeu/markdown-viewer)

A clean, lightweight, native-feeling Windows application for viewing Markdown files with rich content support, including embedded images.

Built with **Tauri 2**, **React**, **TypeScript**, `react-markdown`, `remark-gfm`, and `rehype-raw`.

## Features

- Open `.md` files by double-clicking in Explorer
- Right-click → **Open with** → Markdown Viewer
- Optional default-app setup via **Set as default**
- Embedded local images resolved relative to the opened file
- Dark mode UI
- Zoom with `Ctrl + mouse wheel`, `Ctrl + Plus`, `Ctrl + Minus`, and `Ctrl + 0`
- Drag and drop `.md` files into the window
- Command-line opening: `Markdown Viewer.exe myfile.md`
- Recent files menu
- In-document search (`Ctrl+F`)
- Print support
- NSIS installer with `.md` file association
- Portable executable build target

## Development

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/tools/install)
- Windows build tools / WebView2 runtime

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

### Portable executable

```bash
npm run build:portable
```

Output:

```text
src-tauri/target/release/markdown-viewer.exe
```

### NSIS installer

```bash
npm run build:installer
```

Output:

```text
src-tauri/target/release/bundle/nsis/Markdown Viewer_0.1.0_x64-setup.exe
```

## Windows integration

The NSIS installer registers a `.md` file association for Markdown Viewer. After installation:

1. Right-click any `.md` file
2. Choose **Open with** → **Markdown Viewer**
3. Optionally choose **Always**

You can also use the in-app **Set as default** button to open Windows default app settings.

## GitHub release checklist

1. Update version in `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`
2. Build both artifacts:
   - `npm run build:portable`
   - `npm run build:installer`
3. Add screenshots to `screenshots/`
4. Create a GitHub release and upload:
   - `markdown-viewer.exe`
   - `Markdown Viewer_0.1.0_x64-setup.exe`
5. Include sample usage and install instructions in release notes

## Project structure

```text
src/                 React frontend
src-tauri/           Rust backend and Tauri config
examples/            Sample markdown and assets
screenshots/         Release screenshots
```

## License

MIT