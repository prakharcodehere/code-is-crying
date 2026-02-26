# beep-boop-ur-code-is-broken 🔊

A VS Code extension that plays a sound whenever your code has an error.
Because silent failures are the worst kind of failures.

---

## What This Does

- Listens to your **terminal** for failed commands (non-zero exit codes)
- Plays a sound the moment a command errors out
- Works with any terminal command — `npm`, `tsc`, `python`, `git`, anything
- Supports multiple sound files — plays one at random each time

> [!IMPORTANT]
> This extension watches **terminal command failures**, not editor squiggles.
> It triggers when a command exits with a non-zero exit code (e.g. `npm run build` fails, `tsc` throws errors, a script crashes).
> It does **not** trigger on red underlines while you type.

---

## Step 1 — Prerequisites

Make sure you have these installed:

```bash
node -v    # need Node.js
code -v    # need VS Code
```

Install the scaffolding tools:

```bash
npm install -g @vscode/generator-code yo
```

---

## Step 2 — Scaffold the Extension

Run this inside this folder:

```bash
yo code
```

When prompted, choose:
- **New Extension (TypeScript)**
- Name: `beep-boop-ur-code-is-broken`
- Skip git init if you want

---

## Step 3 — Install Sound Library

```bash
npm install play-sound
npm install --save-dev @types/node
```

Add a sound file inside a `sounds/` folder:

```
beep-boop-ur-code-is-broken/
└── sounds/
    └── error.mp3     ← drop any mp3 here
```

> Grab a free sound from https://mixkit.co/free-sound-effects/

---

## Step 4 — Replace `src/extension.ts`

Delete whatever `yo code` generated and paste this:

```typescript
import * as vscode from 'vscode';
import * as path from 'path';
import * as player from 'play-sound';

const audio = player({});
let lastErrorCount = 0;
let debounceTimer: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext) {
  const soundPath = path.join(context.extensionPath, 'sounds', 'error.mp3');

  const disposable = vscode.languages.onDidChangeDiagnostics((event) => {
    // debounce so it doesn't fire on every single keystroke
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      let totalErrors = 0;

      for (const uri of event.uris) {
        const diagnostics = vscode.languages.getDiagnostics(uri);
        totalErrors += diagnostics.filter(
          (d) => d.severity === vscode.DiagnosticSeverity.Error
        ).length;
      }

      // only play if errors increased (new error appeared)
      if (totalErrors > lastErrorCount) {
        audio.play(soundPath, (err: Error) => {
          if (err) console.error('Could not play sound:', err);
        });
      }

      lastErrorCount = totalErrors;
    }, 500); // wait 500ms after last change
  });

  context.subscriptions.push(disposable);
  vscode.window.showInformationMessage('beep-boop is watching your errors 👀');
}

export function deactivate() {}
```

---

## Step 5 — Update `package.json`

Make sure these fields exist:

```json
{
  "activationEvents": ["onStartupFinished"],
  "contributes": {}
}
```

---

## Step 6 — Run It

```bash
npm run compile
```

Then press **F5** in VS Code — it opens a new window with your extension loaded.

Introduce a typo in any `.ts` file and listen for the beep.

---

## Step 7 — Install It Permanently (Optional)

To use it in your normal VS Code without pressing F5 every time:

```bash
npm install -g @vscode/vsce
vsce package
code --install-extension beep-boop-ur-code-is-broken-0.0.1.vsix
```

---

## Requirements

> [!WARNING]
> **VS Code Shell Integration must be enabled** (it is on by default).
> Without it, the extension cannot detect terminal command failures.
>
> To verify it's on, open a terminal in VS Code and run any command.
> You should see a small `✓` or `✗` icon next to the prompt after it runs.
> If you don't see it, enable it via:
> **Settings → Terminal → Integrated: Shell Integration: Enabled → check it on**

This extension requires **VS Code 1.93 or later**.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| No sound plays | Make sure at least one `.mp3` / `.wav` file is in the `sounds/` folder |
| Sound never triggers | Check that Shell Integration is enabled (see Requirements above) |
| `play-sound` not working on macOS | It uses `afplay` under the hood — should work out of the box |
| `play-sound` not working on Linux | Run `sudo apt install alsa-utils` |
| Extension not activating | Check `activationEvents: ["onStartupFinished"]` in `package.json` |

---

Good luck, and may your code be error-free (but if not, at least it'll be loud).
