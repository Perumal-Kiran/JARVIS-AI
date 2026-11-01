# J.A.R.V.I.S. — Windows desktop assistant

This branch contains the Windows desktop rebuild of JARVIS. The original Java/Android starter is not part of this branch's current project tree.

## Current implementation
- Electron desktop shell with a React + Vite interface.
- Red reactor-inspired interface and command-centre chat panel.
- Main-process bridge to a local Ollama server at `http://127.0.0.1:11434`.
- Model selection through the `JARVIS_MODEL` environment variable (default currently set in `electron/main.cjs`).
- Windows NSIS installer configuration using Electron Builder.
- GitHub Actions workflow to build a Windows installer artifact.

## Requirements for local development
- Windows 10/11
- Node.js 22 LTS recommended
- npm
- Ollama installed locally, plus a compatible model, for AI replies

## Run the desktop app
In PowerShell, from this project directory:

```powershell
npm.cmd install
npm.cmd run desktop
```

The Vite development server and Electron window start together.

## Build a Windows installer locally
```powershell
npm.cmd install
npm.cmd run dist:win
```

The installer is written to the `release` directory.

## Local AI connection
JARVIS expects Ollama to be running locally at `http://127.0.0.1:11434`. The interface can open without Ollama, but AI replies will not work until Ollama and the configured model are available.

To use another installed model, set `JARVIS_MODEL` before launching Electron. Do not expose a local model server to the public internet.

## GitHub Actions
Open **Actions → Build JARVIS for Windows** and run the workflow on `desktop-rebuild`. A successful run uploads the installer as the `JARVIS-Windows-Installer` artifact.

## Not finished yet
This is an active development build, not a completed assistant. Voice wake-word detection, speech input/output, persistent memory, Windows automation, permission prompts, installer testing, and startup-on-login still require implementation and testing.

JARVIS must request confirmation before sensitive actions such as deleting files, sending communications, purchases, or running destructive commands.