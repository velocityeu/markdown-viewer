# Publishing a GitHub Release

How to ship Markdown Viewer installers to  
https://github.com/velocityeu/markdown-viewer/releases

## Current published release

| Field | Value |
| --- | --- |
| Tag | **v0.1.0** |
| Page | https://github.com/velocityeu/markdown-viewer/releases/tag/v0.1.0 |
| MSI | [Markdown.Viewer_0.1.0_x64_en-US.msi](https://github.com/velocityeu/markdown-viewer/releases/download/v0.1.0/Markdown.Viewer_0.1.0_x64_en-US.msi) |
| Portable | [markdown-viewer.exe](https://github.com/velocityeu/markdown-viewer/releases/download/v0.1.0/markdown-viewer.exe) |
| Checksums | [SHA256SUMS.txt](https://github.com/velocityeu/markdown-viewer/releases/download/v0.1.0/SHA256SUMS.txt) |

After cutting a new version, update the download tables in:

- `README.md`
- `docs/install.md`
- this file

## Checklist

1. **Bump version** in all three manifests (same `X.Y.Z`):
   - `package.json`
   - `src-tauri/Cargo.toml`
   - `src-tauri/tauri.conf.json`
2. **Build once** (EXE + MSI):

   ```powershell
   $env:Path = "$env:USERPROFILE\.cargo\bin;" + $env:Path
   taskkill /IM markdown-viewer.exe /F 2>$null
   npm ci
   npm run build:installer
   ```

3. **Collect artifacts**

   | Upload name (local) | Source path |
   | --- | --- |
   | `markdown-viewer.exe` | `src-tauri/target/release/markdown-viewer.exe` |
   | `Markdown Viewer_X.Y.Z_x64_en-US.msi` | `src-tauri/target/release/bundle/msi/Markdown Viewer_X.Y.Z_x64_en-US.msi` |
   | `SHA256SUMS.txt` | Generate with `Get-FileHash` (see below) |

   **GitHub may rewrite** spaces in the MSI filename to dots when storing the asset  
   (`Markdown.Viewer_X.Y.Z_x64_en-US.msi`). Always confirm with:

   ```powershell
   gh api repos/velocityeu/markdown-viewer/releases/tags/vX.Y.Z --jq ".assets[].name"
   ```

4. **Checksums** (use published names in the file after upload, or rename before upload)

   ```powershell
   $exe = "src-tauri\target\release\markdown-viewer.exe"
   $msi = Get-ChildItem "src-tauri\target\release\bundle\msi\*.msi" | Select-Object -First 1
   # Prefer uploading a copy renamed without spaces to avoid GitHub rewrite surprises:
   $msiPub = "Markdown.Viewer_$($msi.BaseName -replace '^Markdown Viewer_','')".Replace('Markdown Viewer','Markdown.Viewer')
   # Simpler: copy with dotted name
   Copy-Item $msi.FullName ".\Markdown.Viewer_X.Y.Z_x64_en-US.msi"
   @(
     "$((Get-FileHash $exe -Algorithm SHA256).Hash.ToLower())  markdown-viewer.exe"
     "$((Get-FileHash $msi.FullName -Algorithm SHA256).Hash.ToLower())  Markdown.Viewer_X.Y.Z_x64_en-US.msi"
   ) | Set-Content -Encoding ascii SHA256SUMS.txt
   ```

5. **Create the release** (GitHub CLI example)

   ```powershell
   gh release create "vX.Y.Z" `
     --repo velocityeu/markdown-viewer `
     --title "Markdown Viewer vX.Y.Z" `
     --notes-file RELEASE_NOTES.md `
     --target master `
     src-tauri\target\release\markdown-viewer.exe `
     .\Markdown.Viewer_X.Y.Z_x64_en-US.msi `
     SHA256SUMS.txt
   ```

   Or use the GitHub web UI: **Releases -> Draft a new release**, tag `vX.Y.Z`, upload the three files.

6. **Docs**
   - Point README / `docs/install.md` download links at the new tag and **actual** asset names
   - Mention WebView2 prerequisite and unsigned SmartScreen warning

7. **Optional**
   - Screenshots under `screenshots/`
   - Optional NSIS asset if you successfully build `npm run build:installer:nsis`

## Release notes template

```markdown
## Markdown Viewer vX.Y.Z

### Downloads
- MSI (recommended): `Markdown.Viewer_X.Y.Z_x64_en-US.msi`
- Portable: `markdown-viewer.exe`
- Checksums: `SHA256SUMS.txt`

### Notes
- Windows 10/11 x64
- Requires WebView2 Evergreen Runtime
- Unsigned build - SmartScreen may warn

### Changes
- ...
```

## Asset naming

v0.1.x published MSI name on GitHub:

```text
https://github.com/velocityeu/markdown-viewer/releases/download/v0.1.0/Markdown.Viewer_0.1.0_x64_en-US.msi
```

Local Tauri output keeps a space: `Markdown Viewer_0.1.0_x64_en-US.msi`.

## Signing (future)

When a code-signing certificate is available, sign EXE and MSI in CI before upload and document secret names in this file. Until then, always ship `SHA256SUMS.txt`.
