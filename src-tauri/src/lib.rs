use std::fs;
use std::path::{Path, PathBuf};

use tauri::{Emitter, Manager};
use tauri_plugin_cli::CliExt;

#[derive(serde::Serialize)]
struct MarkdownFile {
    content: String,
    path: String,
    directory: String,
}

#[derive(serde::Serialize)]
struct DirEntry {
    name: String,
    path: String,
    is_dir: bool,
}

const SKIP_DIR_NAMES: &[&str] = &[".git", "node_modules", "target", "dist", ".tauri-tools"];

fn normalize_markdown_path(path: &str) -> Result<PathBuf, String> {
    let candidate = PathBuf::from(path);
    if !candidate.exists() {
        return Err(format!("File not found: {path}"));
    }

    if candidate
        .extension()
        .and_then(|ext| ext.to_str())
        .map(|ext| ext.eq_ignore_ascii_case("md"))
        != Some(true)
    {
        return Err("Only .md files are supported".into());
    }

    candidate
        .canonicalize()
        .map_err(|error| format!("Failed to resolve path: {error}"))
}

fn resolve_relative_path(base_dir: &str, src: &str) -> Result<PathBuf, String> {
    if src.starts_with("http://") || src.starts_with("https://") || src.starts_with("data:") {
        return Err("Remote or inline image paths are handled on the frontend".into());
    }

    let joined = if Path::new(src).is_absolute() {
        PathBuf::from(src)
    } else {
        PathBuf::from(base_dir).join(src)
    };

    if !joined.exists() {
        return Err(format!("Image not found: {}", joined.display()));
    }

    joined
        .canonicalize()
        .map_err(|error| format!("Failed to resolve image path: {error}"))
}

#[tauri::command]
fn read_markdown_file(path: String) -> Result<MarkdownFile, String> {
    let resolved = normalize_markdown_path(&path)?;
    let content = fs::read_to_string(&resolved).map_err(|error| error.to_string())?;
    let directory = resolved
        .parent()
        .map(|parent| parent.to_string_lossy().to_string())
        .unwrap_or_default();

    Ok(MarkdownFile {
        content,
        path: resolved.to_string_lossy().to_string(),
        directory,
    })
}

fn should_skip_dir(name: &str) -> bool {
    SKIP_DIR_NAMES.contains(&name)
}

#[tauri::command]
fn list_directory(path: String) -> Result<Vec<DirEntry>, String> {
    let directory = PathBuf::from(&path);
    if !directory.is_dir() {
        return Err(format!("Not a directory: {path}"));
    }

    let resolved = directory
        .canonicalize()
        .map_err(|error| format!("Failed to resolve directory: {error}"))?;

    let mut entries = Vec::new();
    let read_dir = fs::read_dir(&resolved).map_err(|error| error.to_string())?;

    for entry in read_dir {
        let entry = entry.map_err(|error| error.to_string())?;
        let file_type = entry.file_type().map_err(|error| error.to_string())?;
        let name = entry.file_name().to_string_lossy().to_string();

        if file_type.is_dir() {
            if should_skip_dir(&name) {
                continue;
            }

            entries.push(DirEntry {
                name,
                path: entry.path().to_string_lossy().to_string(),
                is_dir: true,
            });
            continue;
        }

        if file_type.is_file()
            && entry
                .path()
                .extension()
                .and_then(|ext| ext.to_str())
                .map(|ext| ext.eq_ignore_ascii_case("md"))
                == Some(true)
        {
            entries.push(DirEntry {
                name,
                path: entry.path().to_string_lossy().to_string(),
                is_dir: false,
            });
        }
    }

    entries.sort_by(|left, right| {
        right
            .is_dir
            .cmp(&left.is_dir)
            .then_with(|| left.name.to_lowercase().cmp(&right.name.to_lowercase()))
    });

    Ok(entries)
}

#[tauri::command]
fn resolve_image_path(base_dir: String, src: String) -> Result<String, String> {
    let resolved = resolve_relative_path(&base_dir, &src)?;
    Ok(resolved.to_string_lossy().to_string())
}

fn emit_open_file(app: &tauri::AppHandle, path: &str) {
    if let Ok(resolved) = normalize_markdown_path(path) {
        let _ = app.emit(
            "open-file",
            resolved.to_string_lossy().to_string(),
        );
    }
}

fn extract_cli_file(matches: &tauri_plugin_cli::Matches) -> Option<String> {
    matches.args.get("file").and_then(|arg| match &arg.value {
        serde_json::Value::String(path) if !path.is_empty() => Some(path.clone()),
        _ => None,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            if let Some(path) = args.iter().find(|arg| arg.ends_with(".md")) {
                emit_open_file(app, path);
            }

            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
            }
        }))
        .invoke_handler(tauri::generate_handler![
            read_markdown_file,
            resolve_image_path,
            list_directory
        ])
        .setup(|app| {
            if let Ok(matches) = app.cli().matches() {
                if let Some(path) = extract_cli_file(&matches) {
                    let handle = app.handle().clone();
                    let path = path.clone();
                    std::thread::spawn(move || {
                        std::thread::sleep(std::time::Duration::from_millis(300));
                        emit_open_file(&handle, &path);
                    });
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}