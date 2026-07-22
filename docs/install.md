# Install Markdown Viewer (Windows)

**Product:** Markdown Viewer v0.1.0  
**Repo:** https://github.com/velocityeu/markdown-viewer  
**Release:** https://github.com/velocityeu/markdown-viewer/releases/tag/v0.1.0

## Download links

| Asset | Size (approx.) | URL |
| --- | --- | --- |
| MSI installer (recommended) | ~3.3 MB | [Markdown.Viewer_0.1.0_x64_en-US.msi](https://github.com/velocityeu/markdown-viewer/releases/download/v0.1.0/Markdown.Viewer_0.1.0_x64_en-US.msi) |
| Portable executable | ~9.9 MB | [markdown-viewer.exe](https://github.com/velocityeu/markdown-viewer/releases/download/v0.1.0/markdown-viewer.exe) |
| SHA-256 checksums | - | [SHA256SUMS.txt](https://github.com/velocityeu/markdown-viewer/releases/download/v0.1.0/SHA256SUMS.txt) |

Latest release page (always points at the newest tag):  
https://github.com/velocityeu/markdown-viewer/releases/latest

## Prerequisites

- Windows 10 or 11, **64-bit (x64)**
- [WebView2 Evergreen Runtime](https://developer.microsoft.com/microsoft-edge/webview2/)  
  Modern Windows usually has this already. If the app fails to start, install WebView2 and retry.
- Administrative rights only if your policy requires them for MSI install under Program Files

Builds are currently **unsigned**. SmartScreen may show "Windows protected your PC". You can choose **More info** -> **Run anyway** after verifying the checksum, or prefer the MSI path your organization allows.

## Install with MSI (recommended)

1. Download `Markdown.Viewer_0.1.0_x64_en-US.msi` from the links above.
2. Double-click the MSI and complete the installer.
3. Default install directory:

   ```text
   C:\Program Files\Markdown Viewer\
   ```

4. Launch **Markdown Viewer** from the Start Menu or Desktop shortcut.
5. Optional file association:
   - Right-click a `.md` file -> **Open with** -> **Markdown Viewer**
   - Or use **Set as default** in the app Settings (opens Windows default apps)

### What the MSI installs

| Location | Contents |
| --- | --- |
| `C:\Program Files\Markdown Viewer\` | `markdown-viewer.exe`, uninstall shortcut |
| Start Menu -> Markdown Viewer | Application shortcut |
| Desktop | Application shortcut (if created by the installer) |
| Registry / ProgId | `.md` -> Open with Markdown Viewer |

Uninstall via **Settings -> Apps** or the uninstall shortcut next to the installed EXE.

## Portable EXE

1. Download `markdown-viewer.exe`.
2. Place it anywhere (e.g. Desktop or a tools folder).
3. Run the EXE.
4. Open a file via drag-and-drop, **Open file**, or CLI:

   ```text
   markdown-viewer.exe C:\path\to\notes.md
   ```

Portable mode does **not** register a system `.md` association by itself. Use **Open with** or CLI as needed.

## Verify downloads (SHA-256)

PowerShell (run in the folder containing the downloads):

```powershell
Get-FileHash .\markdown-viewer.exe -Algorithm SHA256
Get-FileHash '.\Markdown.Viewer_0.1.0_x64_en-US.msi' -Algorithm SHA256
Get-Content .\SHA256SUMS.txt
```

Compare the hashes to the values in `SHA256SUMS.txt` from the same release.

### v0.1.0 published hashes

```text
e8450b29b0ec701a823e616b6c002858ce9edd5440cfdec2b898b6aec8379b6c  markdown-viewer.exe
31ab873677deaea1f9e77b179fc2f3c423e9c0e34879776b5d0b2e3f0588907c  Markdown.Viewer_0.1.0_x64_en-US.msi
```

## Troubleshooting

| Symptom | What to try |
| --- | --- |
| App does not start / blank window | Install/repair [WebView2 Evergreen](https://developer.microsoft.com/microsoft-edge/webview2/) |
| SmartScreen blocks the download | Expected while unsigned; verify checksums, then run with "More info" |
| `.md` does not open in the app | Use MSI install + **Open with**, or Settings -> default apps |
| Need to reinstall over previous version | Install the newer MSI; same product upgrade code is used by Tauri's WiX template |

## Next steps for developers

- Build from source: [build.md](build.md)
- Publish a new release: [release.md](release.md)
