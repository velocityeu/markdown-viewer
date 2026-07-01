Project: Simple Markdown Viewer for Windows (Full Spec)
Project Name: Markdown Viewer
Description:
A clean, lightweight, native-feeling Windows application for viewing Markdown files with rich content support (including embedded images). The app should feel like a proper Windows native tool.
Core Features

Open .md files by double-clicking
Right-click → "Open with" → Markdown Viewer
Option to set as default Markdown viewer in Windows
Full support for embedded images in Markdown
Clean, minimal interface with dark mode
Mouse wheel zoom (Ctrl + scroll) + keyboard shortcuts (Ctrl + Plus, Ctrl + Minus, Ctrl + 0)
Drag & drop support
Command line file opening support (MarkdownViewer.exe myfile.md)

Tech Stack:

Tauri 2 (Rust backend + Web frontend)
React + TypeScript
react-markdown, remark-gfm, rehype-raw

Windows Shell Integration

Proper file association for .md files
NSIS installer that registers the app correctly
Provide both installer (Setup.exe) and portable version

Distribution Goals

Build a single portable .exe (or small installer)
Prepare for GitHub release with:
Clear README
Screenshots
Releases page with assets

Auto-updater support (nice to have)

Instructions for Grok Coding Agent / Grok Build:

Create a new Tauri project using the React + TypeScript template.
Install all necessary dependencies.
Implement a clean, modern Markdown viewer with zoom functionality.
Add full Windows shell integration (file associations via Tauri config + NSIS).
Support drag & drop and command-line arguments.
Configure the app for both portable and installer builds.
Add dark mode and nice UI polish.
Set up basic GitHub-friendly structure (README, screenshots folder, etc.).
Provide clear build commands for both portable and installer versions.

After building:

Test thoroughly with a rich Markdown file containing headings, lists, tables, code blocks, and embedded images.
Generate both the portable .exe and the NSIS installer.
Output the final build commands and next steps for GitHub release.

Please start now by creating the project.